import React from "react";
import MapComponent from "./MapComponent";
import './App.css';

function App() {
  return (
    <div className="App">
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
        <MapComponent />
      </div>
    </div>
  );
}

export default App;
