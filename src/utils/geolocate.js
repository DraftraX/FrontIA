// src/utils/geolocate.js
import axios from "axios";

export async function geoLookup(ip) {
  try {
    const res = await axios.get(`http://ip-api.com/json/${ip}`);
    if (res.data.status === "success") {
      return {
        country: res.data.country,
        lat: res.data.lat,
        lon: res.data.lon,
      };
    }
  } catch (e) {
    console.error("GeoLookup error:", e);
  }
  return null;
}
