import React, { useState, useEffect } from "react";
import { GoogleMap, LoadScript, Marker, InfoWindow } from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "500px",
};

const center = {
  lat: 42.3601,
  lng: -71.0589,
};

const MapComponent = () => {
  const [markers, setMarkers] = useState([]);
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [newMarkerPosition, setNewMarkerPosition] = useState(null);  // added state
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    notes: ""
  });

  const handleMapClick = (event) => {
    setNewMarkerPosition({
      lat: event.latLng.lat(),
      lng: event.latLng.lng()
    });
    setFormData({ name: "", type: "", notes: "" });
    setSelectedMarker(null); // close any selected marker info window
  };

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newPlace = {
      name: formData.name,
      type: formData.type,
      notes: formData.notes,
      lat: newMarkerPosition.lat,
      lng: newMarkerPosition.lng
    };


    fetch("https://places-backend-s3l5.onrender.com/places", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newPlace),
    })
      .then((res) => res.json())
      .then((savedPlace) => {
        setMarkers((prev) => {
          if (prev.find(marker => marker.id === savedPlace.id)) {
            return prev; // already exists, no duplicate
          }
          return [...prev, savedPlace];
        });
        setNewMarkerPosition(null);
      })
      .catch((err) => {
        console.error("Error saving place:", err);
      });
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`https://places-backend-s3l5.onrender.com/places/${id}`, {
        method: 'DELETE',
      });
      // Remove from frontend state
      setMarkers((prevMarkers) => prevMarkers.filter(marker => marker.id !== id));
      setSelectedMarker(null); // Close InfoWindow
    } catch (error) {
      console.error('Failed to delete marker:', error);
    }
  };


  useEffect(() => {
    fetch("https://places-backend-s3l5.onrender.com/places")
      .then((res) => res.json())
      .then((data) => {
        setMarkers(data);
      })
      .catch((error) => console.error("Error fetching places:", error));
  }, []);

  return (
    <LoadScript googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={12}
        onClick={handleMapClick}
      >
        {markers.map(marker => (
          <Marker
            key={marker.id}
            position={marker.position}
            onClick={() => setSelectedMarker(marker)}
          />
        ))}

        {/* Show form when user clicks on map, before saving */}
        {newMarkerPosition && (
          <InfoWindow
            position={newMarkerPosition}
            onCloseClick={() => setNewMarkerPosition(null)}
          >
            <div style={{ color: 'black' }}>
              <form onSubmit={handleSubmit}>
                <label>
                  Place Name:<br />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </label>
                <br />
                <label>
                  Type:<br />
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select type</option>
                    <option value="Food">Food</option>
                    <option value="Store">Store</option>
                    <option value="Attraction">Attraction</option>
                  </select>
                </label>
                <br />
                <label>
                  Notes:<br />
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                  />
                </label>
                <br />
                <button type="submit">Save Place</button>
                <button type="button" onClick={() => setNewMarkerPosition(null)}>Cancel</button>
              </form>
            </div>
          </InfoWindow>
        )}

        {/* Show info window with details when clicking existing marker */}
        {console.log("Selected marker:", selectedMarker)}
        {console.log("Selected marker position:", selectedMarker?.position)};
        {selectedMarker && (
          <InfoWindow
            position={selectedMarker.position}
            onCloseClick={() => setSelectedMarker(null)}
          >
            <div style = {{color: 'black'}}>
              <h3>Name: {selectedMarker.name}</h3>
              <p>Type: {selectedMarker.type}</p>
              <p>Notes: {selectedMarker.notes}</p>
              <button onClick={() => handleDelete(selectedMarker.id)}>Delete</button>
            </div>
          </InfoWindow>
        )}

      </GoogleMap>
    </LoadScript>
  );
};

export default MapComponent;
