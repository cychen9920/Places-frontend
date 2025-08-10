import React, { useState } from "react";

export default function Register({ onRegister }) {
    //init state vars
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        //no reload
        e.preventDefault();
        console.log("Hit Register Submit Button");
        setError(null);

        try {
            const res = await fetch(`https://places-backend-s3l5.onrender.com/auth/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
            });
            console.log("Fetched for register")

            //wait for response, parse as JSON
            const data = await res.json();
            console.log("Response from register:", data)

            if (!res.ok) throw new Error(data.error || data.message || "Register failed");

            //save token in localStorage, call onRegister (App.js)
            localStorage.setItem("token", data.token);
            onRegister(data.token);
        }
        catch (err) {
            setError(err.message);
        }
    };

    return (
    <form onSubmit={handleSubmit}>
        <h3>Register</h3>
        {error && <div style={{ color: "red" }}>{error}</div>}
        <input name="email" value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="Email" required />
        <input name="password" type="password" value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Password" required />
        <button type="submit">Register</button>
    </form>
    );
}
