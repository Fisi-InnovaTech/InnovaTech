import { useJsApiLoader } from '@react-google-maps/api';

export function useGoogleMaps() {
  return useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: "AIzaSyBZWT4UW-431B4nv7eJRhjBY9ecJcoYb0M"
  });
}