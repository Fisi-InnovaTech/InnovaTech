import React, { useState, useCallback } from 'react';
import { GoogleMap, Marker, InfoWindow } from '@react-google-maps/api';
import { useGoogleMaps } from './GoogleMapsLoader';

const center = {
  lat: -8.7241781,
  lng: -75.8227259
};

function MapaMarcadores({ markerData }) {
  
  const { isLoaded } = useGoogleMaps();
  const [selectedMarker, setSelectedMarker] = useState(null);

  const onLoad = useCallback((map) => {
    map.setZoom(6);
    map.setCenter(center);
  }, []);

  const handleMarkerClick = useCallback((marker) => {
    setSelectedMarker(marker);
    console.log(marker);
  }, []);

  const handleMapClick = useCallback(() => {
    setSelectedMarker(null); // Close InfoWindow when clicking on the map
  }, []);

  return isLoaded ? (
    <GoogleMap
      mapContainerStyle={{ width: '100%', height: '100%' }}
      onLoad={onLoad}
      onClick={handleMapClick}
    >
      {markerData.map(marker => (
        <Marker
          key={marker.id}
          position={{ lat: marker.latitud, lng: marker.longitud }}
          onClick={() => handleMarkerClick(marker)}
        />
      ))}
      {selectedMarker && (
        <InfoWindow position={{ lat: selectedMarker.latitud, lng: selectedMarker.longitud }} >
          <div style={{ maxWidth: "200px", margin: "0", padding: "0" }}>
            <img src={selectedMarker.evidencia_imagen} alt={selectedMarker.animal_nombre} style={{ width: "100%" }} />
            <h3 >{selectedMarker.animal_nombre}</h3>
            <p>{selectedMarker.descripcion}</p>
          </div>
        </InfoWindow>
      )}
    </GoogleMap>
  ) : <></>;
}

export default MapaMarcadores;
