import React, { useState } from "react";
import Map from "react-map-gl";



import 'mapbox-gl/dist/mapbox-gl.css'


const TOKEN='pk.eyJ1IjoibWF0aGlldWFtYWNoZXIiLCJhIjoiY2x0cG44eW5tMHMwaTJqbXA0aXczYXBsYiJ9.QgMMcu07S_F3aLEmwSC6WQ';

export default function DisplayMap ()  {
  const [viewport, setViewport] = useState({
    longitude: 2.39,
    latitude: 48.88,
    zoom: 10,
    
  });

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