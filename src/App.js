//useState for JWT token, useEffect for token changes
import React, {useState} from "react";
import MapComponent from "./MapComponent";
import Login from "./Login";
import Register from "./Register";
import './App.css';


function App() {
  // if localStorage has token (eg refresh), user stays logged in
  const [token, setToken] = useState(() => localStorage.getItem("token"));

  //remove token from localStorage, token state to null
  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
  };

  //called by Login, Register components
  const onLogin = (tok) => {
    setToken(tok); // MapComponent can read from localStorage or receive token prop
  };

  //no token --> return to login/register page
  if (!token) {
    return (
      <div>
        <h1>Please login or register</h1>
        <Login onLogin={onLogin} />
        <hr />
        <Register onRegister={onLogin} />
      </div>
    );
  }

  //UI when user is logged in
  return (
    <div className="App">
      <button onClick={handleLogout}>Logout</button>
      <div className="header1_container">
        <h1>Oh, The Places You'll Go!</h1>
      </div>
      <div style={{ height: '24px' }}></div>
      <h2>To get started:</h2>
      <h3 className="left-text">
        <ol>
          <li>Click to set a marker and save a spot!</li>
          <li>Click on any of your saved places to read your notes!</li>
          <li>You can edit or delete saved places at any time.</li>
          <li>Scroll and zoom around the map to explore.</li>
        </ol>
      </h3>
      <div className="App-header">
        <MapComponent token={token} />
      </div>
    </div>
  );
}

export default App;
