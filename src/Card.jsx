import React, { useState } from "react";
import "./Card.css";

const Card = ({ image, rotation }) => {
  return <img src={image} style={{"--card-transform": rotation}} />;
};

export default Card;