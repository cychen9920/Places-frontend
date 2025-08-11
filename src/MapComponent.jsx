import React, { useState, useEffect } from "react";
import { GoogleMap, LoadScript, Marker, InfoWindow } from "@react-google-maps/api";
import './App.css';

//user auth token
const token = localStorage.getItem("token");

const containerStyle = {
  width: "100%",
  height: "500px",
};

//TODO: currently Boston; allow for users to change
const center = {
  lat: 42.3601,
  lng: -71.0589,
};

//custom icons!
const getIconForType = (type) => {
  switch (type) {
    case "Food":
      return "/icons/Food.png";
    case "Shopping":
      return "/icons/Shopping.png";
    case "Attractions":
      return "/icons/Attractions.png";
    case "Entertainment":
      return "/icons/Entertainment.png";
    default:
      return "https://maps.google.com/mapfiles/ms/icons/yellow-dot.png"; // fallback icon
  }
};

const MapComponent = ( {token, triggerRefresh}) => {
  //define state vars
  const [markers, setMarkers] = useState([]);
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [newMarkerPosition, setNewMarkerPosition] = useState(null);  // added state
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    notes: ""
  });

  //user click on map
  const handleMapClick = (event) => {
    setNewMarkerPosition({
      lat: event.latLng.lat(),
      lng: event.latLng.lng()
    }); //store marker position
    setFormData({ name: "", type: "", notes: "" }); //reset form data
    setSelectedMarker(null); // close any selected marker info window
  };

  //update formData
  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  //handle submit of new place marker
  const handleSubmit = (e) => {
    e.preventDefault();

    const newPlace = {
      name: formData.name,
      type: formData.type,
      notes: formData.notes,
      lat: newMarkerPosition.lat,
      lng: newMarkerPosition.lng
    };

    //save new place in backend, passing user auth info
    fetch("https://places-backend-s3l5.onrender.com/places", {
      method: "POST",
      headers: { "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`},
      body: JSON.stringify(newPlace),
    })
      .then((res) => res.json())
      //get savedPlace (made during POST req) from backend
      .then((savedPlace) => {
        //prev = previous state of markers array
        setMarkers((prev) => {
          if (prev.find(marker => marker._id === savedPlace._id)) {
            return prev; // already exists, no duplicate
          }
          return [...prev, savedPlace]; //add new place to markers array
        });
        triggerRefresh();
        setNewMarkerPosition(null); //close window
      })
      .catch((err) => {
        console.error("Error saving place:", err);
      });
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`https://places-backend-s3l5.onrender.com/places/${id}`, {
        method: 'DELETE',
        headers: { "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`}
      });
      // Remove from markers state
      setMarkers((prevMarkers) => prevMarkers.filter(marker => marker._id !== id));
      triggerRefresh();
      setSelectedMarker(null); // close InfoWindow
    }
    catch (error) {
      console.error('Failed to delete marker:', error);
    }
  };

  //fetch existing places
  useEffect(() => {
    fetch("https://places-backend-s3l5.onrender.com/places", {
      headers: { "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`},
    })
      .then((res) => res.json())
      .then((data) => {
        console.log('Fetched places:', data);
        //store data in markers state
        setMarkers(data);
      })
      .catch((error) => console.error("Error fetching places:", error));
  }, []);

  return (
    <LoadScript googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}>
      {/*Render Google Map*/}
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={12}
        onClick={handleMapClick}
      >
        console.log("rendering markers");
        {/*Iterate over markers, create Marker for each*/}
        {Array.isArray(markers) && markers.map(marker => (
          <Marker
            key={marker._id}
            position={marker.position}
            icon={getIconForType(marker.type)}
            onClick={() => setSelectedMarker(marker)}
          />
        ))}

        {/* Show form when click on map, before saving */}
        {newMarkerPosition && (
          <InfoWindow
            position={newMarkerPosition}
            onCloseClick={() => setNewMarkerPosition(null)}
          >
            <div>
              <form onSubmit={handleSubmit}>
                <div>
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
                    <option value="Shopping">Shopping</option>
                    <option value="Attractions">Attraction</option>
                    <option value="Entertainment">Entertainment</option>
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
                <div className="flex_container">
                <button className="form-button" type="submit">Save Place</button>
                <button className="form-button" type="button" onClick={() => setNewMarkerPosition(null)}>Cancel</button>
                </div>
              </div>
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
            <div>
              <h3>Name: {selectedMarker.name}</h3>
              <p>Type: {selectedMarker.type}</p>
              <p>Notes: {selectedMarker.notes}</p>
              <button className="form-button" onClick={() => handleDelete(selectedMarker._id)}>Delete</button>
            </div>
          </InfoWindow>
        )}

      </GoogleMap>
    </LoadScript>
  );
};

export default MapComponent;
