import React, { useState, useEffect } from "react";
import Map, { Marker, FullscreenControl, Popup } from "react-map-gl";
import { useAtomValue } from "jotai";
import { cityAtom } from '../atom/userAtom.jsx';
import mapboxSdk from '@mapbox/mapbox-sdk/services/geocoding';
import 'mapbox-gl/dist/mapbox-gl.css';
import mapMarkerImage from '../assets/mapmarker.png'; 

const TOKEN = import.meta.env.VITE_MAP_API_TOKEN;
const geocodingClient = mapboxSdk({ accessToken: TOKEN });

export default function DisplayMap() {
  const cityObject = useAtomValue(cityAtom);
  const cityArray = Array.isArray(cityObject) ? cityObject : [cityObject]; // Convertit en tableau si ce n'est pas déjà le cas

  const [markers, setMarkers] = useState([]);
  const [popupInfo, setPopupInfo] = useState('')

  const [viewport, setViewport] = useState({
    longitude: 2.39,
    latitude: 48.88,
    zoom: 1,
  });

  console.log(viewport)

  useEffect(() => {
    const geocodeCity = async (city) => {
      if (city) {
        try {
          const response = await geocodingClient.forwardGeocode({
            query: city,
            limit: 1,
          }).send();
          if (response && response.body && response.body.features && response.body.features.length > 0) {
            const feature = response.body.features[0];
            // Ajouter un marqueur sur la carte pour chaque ville
            setMarkers(markers => [...markers, { latitude: feature.center[1], longitude: feature.center[0] }]);
            setViewport('');
          }
        } catch (error) {
          console.error("Erreur lors de la géocodage pour", city, ":", error);
        }
      }
    };

    cityArray.forEach(geocodeCity);
  }, [cityArray]);

  //console.log(cityArray)

  

  const [showPopup, setShowPopup] = useState('');

  const handleScroll = (event) => {
    let newZoom = viewport.zoom;
    if (event.deltaY < 0) {
      newZoom = Math.min(viewport.zoom + 1, 15);
    } else {
      newZoom = Math.max(viewport.zoom - 1, 1);
    }
    setViewport({
      ...viewport,
      zoom: newZoom
    });
  };

  const handleMarkerClick = (marker) => {
    setPopupInfo(marker);
  };

  const handlePopupClose = () => {
    setPopupInfo('');
  };

  return (
    <div style={{ width: "40vw", height: "40vh" }}>
      <Map
        mapboxAccessToken={TOKEN}
        {...viewport}
        mapStyle="mapbox://styles/mathieuamacher/cltpxnrt0002401r18q92d8a3"
        onViewportChange={viewport => { setViewport(feature.center[1], feature.center[0], 2); }}
      >
        {markers.map((marker, index) => (
          <Marker key={index} longitude={marker.longitude} latitude={marker.latitude} onClick={() => handleMarkerClick(marker)}>
            <img src={mapMarkerImage} alt="Map Marker" />
          </Marker>
        ))}
        {showPopup && (
          <Popup longitude={viewport.longitude} latitude={viewport.latitude} anchor="bottom-left" onClose={handlePopupClose}>
            You are here
          </Popup>
        )}
        <FullscreenControl />
      </Map>
    </div>
  );
}