'use client'
import { GoogleMap, useJsApiLoader, StandaloneSearchBox, Marker, InfoWindow } from '@react-google-maps/api';
import { useCallback, useState, useRef, SetStateAction } from 'react';
import Header from '../components/Header';
import { useSearchParams } from 'next/navigation';

const containerStyle = {
  width: '100%',
  height: '800px'
};

export default function Map() {
  const [center] = useState({ lat: parseFloat(useSearchParams().get('lat')), lng: parseFloat(useSearchParams().get('lng')) });
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: "AIzaSyCslhg5UV7zI1jAgkOzf9WDc6zO0t5pYCQ",
    libraries: ['places']
  });

  const [map, setMap] = useState(null);
  const [markerPosition, setMarkerPosition] = useState(center);
  const [infoWindowVisible, setInfoWindowVisible] = useState(false);
  const searchBoxRef = useRef(null);

  const onLoad = useCallback(function callback(map: SetStateAction<null>) {
    const bounds = new window.google.maps.LatLngBounds(center);
    map.fitBounds(bounds);
    setMap(map);
  }, []);

  const onUnmount = useCallback(function callback(map) {
    setMap(null);
  }, []);

  const onPlacesChanged = () => {
    const places = searchBoxRef.current.getPlaces();
    if (places.length === 0) return;

    const place = places[0];
    const location = place.geometry.location;

    map.panTo(location);
    map.setZoom(13);
    setMarkerPosition({ lat: location.lat(), lng: location.lng() });
    setInfoWindowVisible(false); // Hide InfoWindow when a new place is selected
  };

  const onMarkerClick = () => {
    setInfoWindowVisible(true);
  };

  const onInfoWindowCloseClick = () => {
    setInfoWindowVisible(false);
  };

  return isLoaded ? (
    <>
      <Header />
      
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={13}
        onLoad={onLoad}
        onUnmount={onUnmount}
      >
        <div style={{ marginBottom: '10px' }}>
          <StandaloneSearchBox
            onLoad={ref => (searchBoxRef.current = ref)}
            onPlacesChanged={onPlacesChanged}
          >
            <input
              type="text"
              placeholder="Buscar ciudad"
              className="box-border border border-transparent w-60 h-9 px-3 rounded-md shadow-md text-sm outline-none overflow-ellipsis absolute left-1/2 -ml-30 mt-3"
            />
          </StandaloneSearchBox>
        </div>
        <Marker position={markerPosition} onClick={onMarkerClick} />
        {infoWindowVisible && (
          <InfoWindow position={markerPosition} onCloseClick={onInfoWindowCloseClick}>
            <div>
              <h2>Información del lugar</h2>
              <p>Latitud: {markerPosition.lat}</p>
              <p>Longitud: {markerPosition.lng}</p>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </>
  ) : <div className="flex items-center justify-center min-h-screen">
        <h1 className="text-2xl font-bold text-gray-700">Cargando...</h1>
      </div>
}