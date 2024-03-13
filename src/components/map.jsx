import React, { useState, useEffect } from "react";
import Map from "react-map-gl";
import { useAtomValue } from "jotai";
import { cityAtom } from '../atom/userAtom.jsx';
import mapboxSdk from '@mapbox/mapbox-sdk/services/geocoding';

import 'mapbox-gl/dist/mapbox-gl.css';

const TOKEN = 'pk.eyJ1IjoibWF0aGlldWFtYWNoZXIiLCJhIjoiY2x0cG44eW5tMHMwaTJqbXA0aXczYXBsYiJ9.QgMMcu07S_F3aLEmwSC6WQ';
const geocodingClient = mapboxSdk({ accessToken: TOKEN });

export default function DisplayMap () {
  const cityObject = useAtomValue(cityAtom);
  const city = cityObject && cityObject.city ? cityObject.city : null;


  const [viewport, setViewport] = useState({
    longitude: 2.39,
    latitude: 48.88,
    zoom: 1,
  });

  // console.log("la city est", city)

  useEffect(() => {
    if (city) {
        geocodingClient.forwardGeocode({
        query: city,
        limit: 1
      })
      .send()
      .then((response) => {
        // console.log('Geocoding Response:', response);
        if (response && response.body && response.body.features && response.body.features.length > 0) {
          const feature = response.body.features[0];
          setViewport({
            longitude: feature.center[0],
            latitude: feature.center[1],
            zoom: 10,
          });
        }
      })
      .catch((error) => {
        console.error("Error during geocoding:", error);
      });
    }
  }, [city]);

  const handleScroll = (event) => {
    let newZoom = viewport.zoom;

    if (event.deltaY < 0) {
      newZoom = Math.min(viewport.zoom + 1, 15);
    }
    else {
      newZoom = Math.max(viewport.zoom - 1, 1);
    }
    setViewport({
      ...viewport,
      zoom: newZoom
    });
  };

  console.log('le city Atom dans map', city)

  return (
    <div style={{ width: "100%", height: "40vh" }} onWheel={handleScroll}>
      <Map
        mapboxAccessToken={TOKEN}
        {...viewport}
        mapStyle="mapbox://styles/mathieuamacher/cltpxnrt0002401r18q92d8a3"
        onViewportChange={viewport => { setViewport(viewport); }}
      >
      </Map>
    </div>
  );
}