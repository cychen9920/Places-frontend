import './App.css';
import React from "react";
import MapComponent from "./MapComponent";

function App() {
  return (
    <div className="App">
      <h1>
        Oh, The Places You'll Go!
      </h1>
      <h2>
        Click to set a marker and save a spot!
      </h2>
      <header className="App-header">
        <MapComponent />
      </header>
    </div>
  );
}

export default App;
