import React from "react";
import "./App.css";

//places is an array of place objects
export default function PlacesTable({ places }) {

    //places is empty
    if (!places.length) {
    return <p>No saved places yet! Click on the map to start.</p>;
    }

    //display table
    return (
    <div className="table-container">
    <table className = "places-table" border="1" cellPadding="6" >
        <thead>
        <tr>
            <th>Name</th>
            <th>Type</th>
            <th>Notes</th>
        </tr>
        </thead>
        <tbody>
        {places.map(place => (
            <tr key={place._id}>
            <td>{place.name}</td>
            <td>{place.type}</td>
            <td>{place.notes || "---"}</td>
            </tr>
        ))}
        </tbody>
    </table>
    </div>
    );
}
