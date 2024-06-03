import './CargadorMark.css';
import React, { useState, useCallback } from 'react';
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from '@react-google-maps/api';

const center = {
  lat: -12.057744,
  lng: -77.083284
};

function MapaMarcadores({ markerData }) {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: "AIzaSyBDaeWicvigtP9xPv919E-RNoxfvC-Hqik"
  });

  // eslint-disable-next-line no-unused-vars
  const [map, setMap] = useState(null);
  const [selectedMarker, setSelectedMarker] = useState(null);

  const onLoad = useCallback((map) => {
    map.setZoom(10);
    map.setCenter(center);
    setMap(map);
  }, []);

  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);

  const handleMarkerClick = useCallback((marker) => {
    setSelectedMarker(marker);
  }, []);

  const handleMapClick = useCallback(() => {
    setSelectedMarker(null); // Close InfoWindow when clicking on the map
  }, []);

  return isLoaded ? (
    <GoogleMap
      mapContainerStyle={{ width: '100%', height: '100%' }}
      onLoad={onLoad}
      onUnmount={onUnmount}
      onClick={handleMapClick}
    >
      {markerData.map(marker => (
        <Marker
          key={marker.id}
          position={marker.position}
          onClick={() => handleMarkerClick(marker)}
        />
      ))}
      {selectedMarker && (
        <InfoWindow position={selectedMarker.position} >
          <div style={{ maxWidth: "200px", margin: "0", padding: "0" }}>
            <img src={selectedMarker.imageUrl} alt={selectedMarker.title} style={{ width: "100%" }} />
            <h3 >{selectedMarker.title}</h3>
            <p>{selectedMarker.description}</p>
          </div>
        </InfoWindow>
      )}
    </GoogleMap>
  ) : <></>;
}

export default MapaMarcadores;