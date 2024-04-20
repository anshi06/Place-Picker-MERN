const axios = require("axios");

const HttpError = require("../models/http-error");

const API_KEY = "AIzaSyDgLmMpKCzveJf1_yuA0fUzzhy0WRChvZA";

async function getCoordsForAddress(address) {
  // return {
  //   lat: 40.7484474,
  //   lng: -73.9871516,
  // };
  const accessToken =
    "pk.eyJ1IjoiYW5zaGlpaTA2IiwiYSI6ImNsdjY5emJnZzBiMTkybW9mdjh6cmh1N2kifQ.5FZM_Bx1J3vIHt0VLvAaaA";
  const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
    address
  )}.json?access_token=${accessToken}`;
  const response = await axios.get(url);

  const data = response.data;

  if (!data || data.status === "ZERO_RESULTS") {
    const error = new HttpError(
      "Could not find location for the specified address.",
      422
    );
    throw error;
  }

  const coordinates = data.features[0].geometry.coordinates;

  return { lat: coordinates[0], lng: coordinates[1] };
}

module.exports = getCoordsForAddress;
