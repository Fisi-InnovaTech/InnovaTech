import React from 'react';
import MapaMarcadores from './MapaMarks';
import './CargadorMark.css';

const markerData = [
  {
    id: 1,
    position: { lat: -5.057744, lng: -77.083284 },
    title: "Lugar 1",
    imageUrl: "https://picsum.photos/536/354",
    description: "orem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation"
  },
  {
    id: 2,
    position: { lat: -18.057844, lng: -40.083384 },
    title: "Lugar 2",
    imageUrl: "https://picsum.photos/536/354",
    description: "orem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation"
  },
  {
    id: 3,
    position: { lat: -25.057844, lng: -60.083384 },
    title: "Lugar 3",
    imageUrl: "https://picsum.photos/536/354",
    description: "orem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation"
  },
  {
    id: 4,
    position: { lat: -10.057844, lng: -50.083384 },
    title: "Lugar 4",
    imageUrl: "https://picsum.photos/536/354",
    description: "orem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation"
  },
  {
    id: 5,
    position: { lat: -50.057844, lng: -77.083384 },
    title: "Lugar 5",
    imageUrl: "https://picsum.photos/536/354",
    description: "orem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation"
  }
];

function Marks() {
    return (
      <div className="map-box-container">
        <MapaMarcadores markerData={markerData} />
      </div>
    );
  }
  
  export default Marks;