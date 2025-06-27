import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { GoogleMap, Marker } from '@react-google-maps/api';
import { useGoogleMaps } from './GoogleMapsLoader';

const center = {
  lat: -12.057744,
  lng: -77.083284
};

function MyComponent({ lat, long }) {
  const { isLoaded } = useGoogleMaps();
  const [clickedLocation, setClickedLocation] = useState(null);

  const onLoad = useCallback((map) => {
    map.setZoom(10);
    map.setCenter(center);
  }, []);

  const handleMapClick = useCallback((event) => {
    const clickedLat = event.latLng.lat();
    const clickedLng = event.latLng.lng();
    
    console.log('Latitud: ', clickedLat);
    console.log('Longitud: ', clickedLng);
    lat(clickedLat);
    long(clickedLng);
    
    setClickedLocation({ lat: clickedLat, lng: clickedLng });
  }, [lat, long]);

  return isLoaded ? (
    <GoogleMap
      mapContainerStyle={{ width: '100%', height: '100%' }}
      onLoad={onLoad}
      onClick={handleMapClick}
    >
      {clickedLocation && (
        <Marker position={clickedLocation} />
      )}
    </GoogleMap>
  ) : <></>;
}

MyComponent.propTypes = {
  lat: PropTypes.func.isRequired,
  long: PropTypes.func.isRequired,
};

export default MyComponent;