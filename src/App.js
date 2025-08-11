//useState for JWT token, useEffect for token changes
import React, {useState, useEffect} from "react";
import MapComponent from "./MapComponent";
import Login from "./Login";
import Register from "./Register";
import PlacesTable from "./PlacesTable";
import './App.css';


function App() {
  // if localStorage has token (eg refresh), user stays logged in
  const [token, setToken] = useState(() => localStorage.getItem("token"));

  const [places, setPlaces] = useState([]);

  // Boolean state, trigger refresh of places (for table)
  const [refresh, setRefresh] = useState(false);

  //Logout: remove token from localStorage, token state to null
  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
  };

  //called by Login, Register components
  const onLogin = (tok) => {
    setToken(tok); // MapComponent can read from localStorage or receive token prop
  };

  //when token or refresh changes, fetch places again
  useEffect(() => {
    if (token) {
      fetch("https://places-backend-s3l5.onrender.com/places", {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        }, })
        .then(res => res.json()) //parse response
        .then(data => {setPlaces(data);}) //update places
        .catch(err => {console.error("Failed to fetch places:", err);});
    }
    else {
      setPlaces([]);  // clear places on logout (no token)
    }}, [token, refresh]); //runs if token, refresh changes

  //toggle refresh state
  function triggerRefresh () {setRefresh(prev => !prev);}

  //UI when user is logged out
  //no token --> return to login/register page
  if (!token) {
    return (
      <div className = "Login_page">
        <div className="login_h1_container">
          <h1 className = "login_page_h1">Login or register to get started!</h1>
        </div>
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
      <div className="map_page_h1">
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
      <div className="Map-header">
        <MapComponent token={token} triggerRefresh={triggerRefresh}/>
      </div>
      <div>
          <PlacesTable places={places} />
      </div>

    </div>
  );
}

export default App;
