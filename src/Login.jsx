import React, { useState } from "react";

export default function Login({ onLogin }) {
    //def state vars
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
    //no page refresh when form submits
        e.preventDefault();
        setError(null);

        try {
            const res = await fetch(`https://places-backend-s3l5.onrender.com/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
            });
            //wait for backend response, parse as JSON
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || data.message || "Login failed");
            // save token in localStorage
            localStorage.setItem("token", data.token);
            //update token state (sets token in App.js)
            onLogin(data.token);
        }
        catch (err) {
        setError(err.message);
        }
    };

    return (
    <form onSubmit={handleSubmit}>
        <h3>Login</h3>
        {error && <div style={{ color: "red" }}>{error}</div>}
        <input name="email" value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="Email" required />
        <input name="password" type="password" value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Password" required />
        <button type="submit">Login</button>
    </form>
    );
}
