import './App.css';
import React from "react";
import MapComponent from "./MapComponent";

function App() {
  return (
    <div className="App">
      <h1 className="centered-text">
        Oh, The Places You'll Go!
      </h1>
      <div style={{ height: '24px' }}></div>
      <h3 className="left-text">
        <ol>
          <li>Click to set a marker and save a spot!</li>
          <li>Click on any of your saved places to read your notes!</li>
        </ol>
      </h3>
      <header className="App-header">
        <MapComponent />
      </header>
    </div>
  );
}

export default App;
