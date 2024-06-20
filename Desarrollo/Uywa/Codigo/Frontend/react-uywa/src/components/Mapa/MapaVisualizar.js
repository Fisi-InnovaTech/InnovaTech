import React, { useState, useCallback } from 'react';
import { GoogleMap, Marker } from '@react-google-maps/api';
import { useGoogleMaps } from './GoogleMapsLoader';

const center = {
  lat: -12.057744,
  lng: -77.083284
};

function MyComponent({lat, long}) {

  const { isLoaded } = useGoogleMaps();

  // eslint-disable-next-line no-unused-vars  
  const [map, setMap] = useState(null)
  const [clickedLocation, setClickedLocation] = useState(null);

  const onLoad = useCallback(function callback(map) {
    map.setZoom(10);
    map.setCenter(center);
    setMap(map)
  }, [])

  const onUnmount = useCallback(function callback(map) {
    setMap(null)
  }, [])

  const handleMapClick = useCallback((event) => {
    // Obtener las coordenadas (latitud y longitud) del lugar donde se hizo clic
    const clickedLat = event.latLng.lat();
    const clickedLng = event.latLng.lng();
    
    // Mostrar las coordenadas en la consola
    console.log('Latitud: ', clickedLat);
    console.log('Longitud: ', clickedLng);
    lat (clickedLat);
    long(clickedLng);
    // Actualizar el estado con las coordenadas del lugar donde se hizo clic
    setClickedLocation({ lat: clickedLat, lng: clickedLng });
  }, []);




  return isLoaded ? (
        <GoogleMap
            mapContainerStyle={{ width: '100%', height: '100%' }}
            onLoad={onLoad}
            onUnmount={onUnmount}
            onClick={handleMapClick}
        >
            {clickedLocation && (
                <Marker position={clickedLocation} />
            )}
        </GoogleMap>
  ) : <></>





}

export default MyComponent