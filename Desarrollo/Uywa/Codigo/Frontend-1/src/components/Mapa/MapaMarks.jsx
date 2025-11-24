import { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { GoogleMap, Marker, InfoWindow } from '@react-google-maps/api';
import { useGoogleMaps } from './GoogleMapsLoader';

const center = {
  lat: -8.7241781,
  lng: -75.8227259
};

function MapaMarcadores({ markerData, onMarkerClick, userRole }) {
  const { isLoaded } = useGoogleMaps();
  const [selectedMarker, setSelectedMarker] = useState(null);

  const onLoad = useCallback((map) => {
    map.setZoom(6);
    map.setCenter(center);
  }, []);

  const handleMarkerClick = useCallback((marker) => {
    setSelectedMarker(marker);
    if (onMarkerClick) {
      onMarkerClick(marker);
    }
  }, [onMarkerClick]);

  const handleMapClick = useCallback(() => {
    setSelectedMarker(null);
  }, []);

  const handleInfoWindowClose = useCallback(() => {
    setSelectedMarker(null);
  }, []);

  const createCustomIcon = (color = "peru") => {
    const svgString = `
      <svg fill="${color}" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 100 100" enable-background="new 0 0 100 100" xml:space="preserve" stroke="${color}" stroke-width="0.001"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" stroke="#030303" stroke-width="10"> <g> <path d="M50,10.417c-15.581,0-28.201,12.627-28.201,28.201c0,6.327,2.083,12.168,5.602,16.873L45.49,86.823 c0.105,0.202,0.21,0.403,0.339,0.588l0.04,0.069l0.011-0.006c0.924,1.278,2.411,2.111,4.135,2.111c1.556,0,2.912-0.708,3.845-1.799 l0.047,0.027l0.179-0.31c0.264-0.356,0.498-0.736,0.667-1.155L72.475,55.65c3.592-4.733,5.726-10.632,5.726-17.032 C78.201,23.044,65.581,10.417,50,10.417z M49.721,52.915c-7.677,0-13.895-6.221-13.895-13.895c0-7.673,6.218-13.895,13.895-13.895 s13.895,6.222,13.895,13.895C63.616,46.693,57.398,52.915,49.721,52.915z"></path> </g> </g><g id="SVGRepo_iconCarrier"> <g> <path d="M50,10.417c-15.581,0-28.201,12.627-28.201,28.201c0,6.327,2.083,12.168,5.602,16.873L45.49,86.823 c0.105,0.202,0.21,0.403,0.339,0.588l0.04,0.069l0.011-0.006c0.924,1.278,2.411,2.111,4.135,2.111c1.556,0,2.912-0.708,3.845-1.799 l0.047,0.027l0.179-0.31c0.264-0.356,0.498-0.736,0.667-1.155L72.475,55.65c3.592-4.733,5.726-10.632,5.726-17.032 C78.201,23.044,65.581,10.417,50,10.417z M49.721,52.915c-7.677,0-13.895-6.221-13.895-13.895c0-7.673,6.218-13.895,13.895-13.895 s13.895,6.222,13.895,13.895C63.616,46.693,57.398,52.915,49.721,52.915z"></path> </g> </g></svg>
    `;

    return {
      url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svgString)}`,
      scaledSize: new window.google.maps.Size(40, 40),
      anchor: new window.google.maps.Point(20, 40)
    };
  };

  // Filter out markers without valid coordinates
  const validMarkers = markerData.filter(marker => 
    marker && 
    typeof marker.latitud === 'number' && 
    typeof marker.longitud === 'number' &&
    !isNaN(marker.latitud) && 
    !isNaN(marker.longitud)
  );

  return isLoaded ? (
    <GoogleMap
      mapContainerStyle={{ width: '100%', height: '100%' }}
      onLoad={onLoad}
      onClick={handleMapClick}
    >
      {validMarkers.map(marker => (
        <Marker
          icon={createCustomIcon()}
          key={marker.id}
          position={{ lat: marker.latitud, lng: marker.longitud }}
          onClick={() => handleMarkerClick(marker)}
        />
      ))}
      
      {selectedMarker && (
        <InfoWindow 
          position={{ lat: selectedMarker.latitud, lng: selectedMarker.longitud }}
          onCloseClick={handleInfoWindowClose}
        >
          <div style={{ maxWidth: "200px", margin: "0", padding: "0" }}>
            {selectedMarker.evidencia_imagen && (
              <img 
                src={selectedMarker.evidencia_imagen} 
                alt={selectedMarker.animal_nombre || 'Reporte'} 
                style={{ 
                  width: "100%", 
                  height: "120px", 
                  objectFit: "cover",
                  borderRadius: "4px",
                  marginBottom: "8px"
                }} 
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            )}
            <h3 style={{ margin: "8px 0", fontSize: "16px" }}>
              {selectedMarker.animal_nombre || 'Animal no especificado'}
            </h3>
            <p style={{ margin: "4px 0", fontSize: "14px", color: "#666" }}>
              {selectedMarker.descripcion || 'Sin descripción'}
            </p>
            {selectedMarker.fecha_creacion && (
              <p style={{ margin: "4px 0", fontSize: "12px", color: "#999" }}>
                {new Date(selectedMarker.fecha_creacion).toLocaleDateString()}
              </p>
            )}
          </div>
        </InfoWindow>
      )}
    </GoogleMap>
  ) : <div>Cargando mapa...</div>;
}

MapaMarcadores.propTypes = {
  markerData: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      latitud: PropTypes.number.isRequired,
      longitud: PropTypes.number.isRequired,
      evidencia_imagen: PropTypes.string,
      animal_nombre: PropTypes.string,
      descripcion: PropTypes.string,
      fecha_creacion: PropTypes.string,
    })
  ).isRequired,
  onMarkerClick: PropTypes.func,
  userRole: PropTypes.string,
};

export default MapaMarcadores;