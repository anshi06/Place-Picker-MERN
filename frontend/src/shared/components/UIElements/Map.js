import React, { useState } from "react";
import ReactMapGL, { Marker, NavigationControl } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";

const Map = (props) => {
  const { center, zoom } = props;

  // State to store the viewport
  const [viewport, setViewport] = useState({
    latitude: center.lng,
    longitude: center.lat,
    zoom: zoom,
    pitch: 40,
  });

  // Function to update the viewport
  const updateViewport = (newViewport) => {
    console.log(newViewport);
    setViewport(newViewport);
  };

  return (
    <ReactMapGL
      width="100%"
      height="100%"
      mapStyle="mapbox://styles/mapbox/streets-v11"
      scrollZoom={true}
      doubleClickZoom={true}
      viewState={viewport}
      onMove={(event) => updateViewport(event.viewState)}
      mapboxAccessToken="pk.eyJ1IjoiYW5zaGlpaTA2IiwiYSI6ImNsdjY5emJnZzBiMTkybW9mdjh6cmh1N2kifQ.5FZM_Bx1J3vIHt0VLvAaaA">
      {/* Add navigation control */}
      <NavigationControl style={{ right: 10, top: 10 }} />
      {/* Add marker */}
      <Marker
        latitude={center.lng}
        longitude={center.lat}
        offsetLeft={-20}
        offsetTop={-10}>
        <div
          style={{
            backgroundColor: "red",
            width: "20px",
            height: "20px",
            borderRadius: "50%",
          }}
        />
      </Marker>
    </ReactMapGL>
  );
};

export default Map;
