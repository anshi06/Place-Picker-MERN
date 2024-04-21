import React from "react";
import defaultImg from "../imgs/defaultImg.jpg"

import "./Avatar.css";

const Avatar = (props) => {
  const handleError = (event) => {
    event.target.src = defaultImg
  };

  return (
    <div className={`avatar ${props.className}`} style={props.style}>
      <img
        src={props.image}
        alt={props.alt}
        style={{ width: props.width, height: props.width }}
        onError={handleError}
      />
    </div>
  );
};

export default Avatar;
