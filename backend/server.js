// backend/server.js
const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(cors({ origin: '*' }));
app.use(express.json());

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

const PORT = 5001;
const API_KEY = 'AIzaSyDuZlEoTXq-nTgysq05MzTgTjrIvPq1l0g'; // your key

// decode polyline (Google encoded polyline -> array of {lat,lng})
// source: standard polyline decode
function decodePolyline(encoded) {
  if (!encoded) return [];
  const points = [];
  let index = 0, len = encoded.length;
  let lat = 0, lng = 0;

  while (index < len) {
    let b, shift = 0, result = 0;
    do {
      b = encoded.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);
    const dlat = ((result & 1) ? ~(result >> 1) : (result >> 1));
    lat += dlat;

    shift = 0;
    result = 0;
    do {
      b = encoded.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);
    const dlng = ((result & 1) ? ~(result >> 1) : (result >> 1));
    lng += dlng;

    points.push({ lat: lat / 1e5, lng: lng / 1e5 });
  }
  return points;
}

// Helper: simple stress scoring per coordinate (dummy, adjustable)
function computeStressForPath(path, preferences=[]) {
  // base stress 3-7
  return path.map(p => {
    let base = Math.floor(Math.random() * 5) + 3; // 3..7
    if (preferences.includes('less_busy')) base -= 1;
    if (preferences.includes('less_noisy')) base -= 1;
    if (preferences.includes('calming_scenery')) base -= 1;
    base = Math.max(1, Math.min(9, base));
    return { lat: p.lat, lng: p.lng, stress: base };
  });
}

// POST /api/getOptimalRoute
// body: { origin, destination, preferences: [] }
app.post('/api/getOptimalRoute', async (req, res) => {
  try {
    const { origin, destination, preferences = [] } = req.body;
    if (!origin || !destination) return res.status(400).json({ error: 'origin/destination required' });

    // request directions
    const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}&key=${API_KEY}`;
    const dr = await axios.get(url);

    // Check Google Maps API response status
    if (dr.data.status === 'ZERO_RESULTS') {
      return res.status(404).json({ error: 'No routes found between these locations. Please try different origin and destination.' });
    }
    if (dr.data.status === 'NOT_FOUND') {
      return res.status(404).json({ error: 'One or both locations could not be found. Please check your addresses.' });
    }
    if (dr.data.status === 'REQUEST_DENIED') {
      console.error('Google Maps API error:', dr.data.error_message);
      const errorMsg = dr.data.error_message || 'API key issue or API not enabled';
      return res.status(500).json({ 
        error: `Google Maps API Error: ${errorMsg}. Please enable the Directions API in your Google Cloud Console.` 
      });
    }
    if (dr.data.status !== 'OK') {
      return res.status(500).json({ error: `Google Maps API returned: ${dr.data.status}. ${dr.data.error_message || ''}` });
    }

    if (!dr.data.routes || dr.data.routes.length === 0) {
      return res.status(404).json({ error: 'No routes found' });
    }

    const route = dr.data.routes[0];
    const leg = route.legs[0];

    // decode overview polyline to coordinates for smooth path
    const decoded = decodePolyline(route.overview_polyline?.points);
    const pathWithStress = computeStressForPath(decoded, preferences);

    // waypoints: use step html_instructions cleaned with coordinates
    const waypoints = [];
    if (leg && leg.steps) {
      leg.steps.forEach((step, idx) => {
        const stepLocation = step.start_location;
        waypoints.push({
          text: step.html_instructions.replace(/<[^>]+>/g, ''),
          lat: stepLocation.lat,
          lng: stepLocation.lng,
          index: idx
        });
      });
    }

    // return route
    res.json({
      start: leg.start_address,
      end: leg.end_address,
      waypoints,
      coordinates: pathWithStress, // array of {lat,lng,stress}
      predictedStress: Math.max(1, Math.round(pathWithStress.reduce((s,p) => s + p.stress,0)/pathWithStress.length))
    });
  } catch (err) {
    console.error('getOptimalRoute error', err?.response?.data || err.message || err);
    if (err.response && err.response.data) {
      // Google Maps API error
      const errorMsg = err.response.data.error_message || err.response.data.status || 'Unknown error';
      return res.status(500).json({ error: `Google Maps API error: ${errorMsg}` });
    }
    res.status(500).json({ error: `Failed to fetch route: ${err.message || 'Unknown error'}` });
  }
});

// POST /api/findRestStop
// body: { lat, lng }
// returns nearest park or cafe (tries park then cafe)
app.post('/api/findRestStop', async (req, res) => {
  try {
    const { lat, lng } = req.body;
    if (lat == null || lng == null) return res.status(400).json({ error: 'lat/lng required' });

    const typesToTry = ['park', 'cafe', 'restaurant', 'gas_station', 'rest_area'];
    for (const type of typesToTry) {
      const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=2000&type=${type}&key=${API_KEY}`;
      const r = await axios.get(url);
      
      // Check for API errors
      if (r.data.status === 'REQUEST_DENIED') {
        const errorMsg = r.data.error_message || 'Places API not enabled';
        console.error('Places API error:', errorMsg);
        return res.status(500).json({ 
          error: `Places API Error: ${errorMsg}. Please enable Places API in Google Cloud Console.` 
        });
      }
      
      if (r.data.status === 'ZERO_RESULTS') {
        continue; // Try next type
      }
      
      if (r.data.status !== 'OK' && r.data.status !== 'ZERO_RESULTS') {
        console.error('Places API status:', r.data.status, r.data.error_message);
        continue; // Try next type
      }
      
      if (r.data.results && r.data.results.length > 0) {
        const place = r.data.results[0];
        const loc = place.geometry.location;
        return res.json({
          name: place.name,
          types: place.types,
          location: { lat: loc.lat, lng: loc.lng },
          vicinity: place.vicinity || place.formatted_address || ''
        });
      }
    }
    return res.status(404).json({ error: 'No rest stop found nearby. Try increasing search radius or check if Places API is enabled.' });
  } catch (err) {
    console.error('findRestStop err', err?.response?.data || err.message);
    if (err.response && err.response.data) {
      const errorMsg = err.response.data.error_message || err.response.data.status || 'Unknown error';
      return res.status(500).json({ error: `Places API Error: ${errorMsg}` });
    }
    res.status(500).json({ error: `Failed to find rest stop: ${err.message || 'Unknown error'}` });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
