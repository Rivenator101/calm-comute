// frontend/src/App.js
import React, { useState, useRef, useEffect } from 'react';
import MapComponent from './MapComponent';
import './App.css';

const GOOGLE_API_KEY = 'AIzaSyDuZlEoTXq-nTgysq05MzTgTjrIvPq1l0g';

function App() {
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [originSuggestions, setOriginSuggestions] = useState([]);
  const [destSuggestions, setDestSuggestions] = useState([]);
  const [preferences, setPreferences] = useState([]);
  const [route, setRoute] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showBreathing, setShowBreathing] = useState(false);
  const [checkInVisible, setCheckInVisible] = useState(false);

  const originTimer = useRef(null);
  const destTimer = useRef(null);
  const mapRef = useRef(null);

  // Helper: fetch Google Places autocomplete suggestions
  async function fetchPlaceSuggestions(input, setter) {
    if (!input || input.length < 2) { setter([]); return; }
    try {
      const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(input)}&key=${GOOGLE_API_KEY}&types=geocode&language=en`;
      const response = await fetch(url);
      const data = await response.json();
      if (data.status === 'OK') {
        setter(data.predictions.map(p => ({ id: p.place_id, text: p.description })));
      } else {
        setter([]);
      }
    } catch (err) {
      console.error('Autocomplete error:', err);
      setter([]);
    }
  }

  // Debounced origin input
  useEffect(() => {
    clearTimeout(originTimer.current);
    originTimer.current = setTimeout(() => fetchPlaceSuggestions(origin, setOriginSuggestions), 300);
    return () => clearTimeout(originTimer.current);
  }, [origin]);

  // Debounced destination input
  useEffect(() => {
    clearTimeout(destTimer.current);
    destTimer.current = setTimeout(() => fetchPlaceSuggestions(destination, setDestSuggestions), 300);
    return () => clearTimeout(destTimer.current);
  }, [destination]);

  const handlePrefChange = (e) => {
    const { value, checked } = e.target;
    setPreferences(prev => checked ? [...prev, value] : prev.filter(p => p !== value));
  };

  const pickOriginSuggestion = (text) => { setOrigin(text); setOriginSuggestions([]); };
  const pickDestSuggestion = (text) => { setDestination(text); setDestSuggestions([]); };

  const getRoute = async (o = origin, d = destination) => {
    if (!o || !d) { alert('Please enter both origin and destination'); return; }
    setLoading(true);
    try {
      // First check if backend is running
      const healthCheck = await fetch('http://localhost:5001/api/health').catch(() => null);
      if (!healthCheck || !healthCheck.ok) {
        throw new Error('Backend server is not running. Please start the backend server.');
      }

      const resp = await fetch('http://localhost:5001/api/getOptimalRoute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ origin: o, destination: d, preferences })
      });
      
      if (!resp.ok) {
        const errorData = await resp.json().catch(() => ({ error: 'Unknown error' }));
        const errorMsg = errorData.error || 'Route fetch failed';
        // Show more detailed error message
        alert(`Error: ${errorMsg}`);
        throw new Error(errorMsg);
      }
      
      const data = await resp.json();
      setRoute(data);
      setCheckInVisible(true);
    } catch (err) {
      console.error('getRoute error:', err);
      alert(`Could not fetch route: ${err.message}. Make sure the backend server is running on port 5001.`);
    }
    setLoading(false);
  };

  const startBreathing = () => {
    setShowBreathing(true);
    setTimeout(() => setShowBreathing(false), 16000);
  };

  const handleCheckIn = async (status) => {
    if (status === 'need_break' && route?.coordinates?.length) {
      const { lat, lng } = route.coordinates[0]; // approx current location
      try {
        const resp = await fetch('http://localhost:5001/api/findRestStop', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ lat, lng })
        });
        if (!resp.ok) throw new Error('No rest stop found');
        const place = await resp.json();

        // Automatically reroute without confirmation
        setDestination(`${place.name} ${place.vicinity || ''}`);
        await getRoute(`${lat},${lng}`, `${place.location.lat},${place.location.lng}`);
        setCheckInVisible(false);
        startBreathing();
      } catch (err) {
        console.error('findRestStop error:', err);
        const errorMsg = err.message || 'Could not find rest stop nearby.';
        alert(`Error: ${errorMsg}\n\nMake sure Places API is enabled in Google Cloud Console.`);
        setCheckInVisible(false);
        startBreathing();
      }
    } else {
      setCheckInVisible(false);
      if (status === 'need_break') startBreathing();
    }
  };

  const onMapLoaded = (mapInstance) => { mapRef.current = mapInstance; };
  const flyTo = (lat, lng) => {
    if (!mapRef.current) return;
    mapRef.current.panTo({ lat, lng });
    mapRef.current.setZoom(16);
  };

  return (
    <div className="container">
      <h1>CalmCommute</h1>
      {loading && <div style={{ textAlign: 'center', padding: '20px', color: '#3498db' }}>Loading route...</div>}

      <div className="inputs">
        <div style={{ position: 'relative', display: 'inline-block', width: '48%' }}>
          <input value={origin} onChange={e => setOrigin(e.target.value)} placeholder="Current location..." />
          {originSuggestions.length > 0 && (
            <div className="suggestions">
              {originSuggestions.map(s => (
                <div key={s.id} onClick={() => pickOriginSuggestion(s.text)} className="suggItem">
                  {s.text}
                </div>
              ))}
            </div>
          )}
        </div>

        <div style={{ position: 'relative', display: 'inline-block', width: '48%' }}>
          <input value={destination} onChange={e => setDestination(e.target.value)} placeholder="Destination..." />
          {destSuggestions.length > 0 && (
            <div className="suggestions">
              {destSuggestions.map(s => (
                <div key={s.id} onClick={() => pickDestSuggestion(s.text)} className="suggItem">
                  {s.text}
                </div>
              ))}
            </div>
          )}
        </div>

        <div style={{ clear: 'both', marginTop: 10 }}>
          <button onClick={() => getRoute()}>{loading ? 'Loading...' : 'Get Route'}</button>
        </div>
      </div>

      <div className="preferences">
        <label><input type="checkbox" value="less_noisy" onChange={handlePrefChange} /> Less noisy</label>
        <label><input type="checkbox" value="less_busy" onChange={handlePrefChange} /> Less busy</label>
        <label><input type="checkbox" value="less_people" onChange={handlePrefChange} /> Less people</label>
        <label><input type="checkbox" value="calming_scenery" onChange={handlePrefChange} /> Calming scenery</label>
        <label><input type="checkbox" value="less_traffic" onChange={handlePrefChange} /> Less traffic</label>
      </div>

      {route && (
        <div className="route-info">
          <p><strong>Route:</strong> {route.start} → {route.end}</p>
          <p>
            <strong>Predicted Stress:</strong>
            <span style={{ color: route.predictedStress <= 3 ? 'green' : route.predictedStress <= 6 ? 'orange' : 'red' }}>
              {route.predictedStress}/10
            </span>
          </p>
          <p><strong>Waypoints (click to zoom):</strong></p>
          <ul>
            {route.waypoints?.map((w, i) => {
              const waypoint = typeof w === 'object' ? w : { text: w, lat: null, lng: null };
              const coord = waypoint.lat && waypoint.lng ? { lat: waypoint.lat, lng: waypoint.lng } : (route.coordinates && route.coordinates[i]);
              return (
                <li key={i} style={{ cursor: coord ? 'pointer' : 'default' }} onClick={() => coord && flyTo(coord.lat, coord.lng)}>
                  {waypoint.text || w}
                </li>
              );
            }) || <li>None</li>}
          </ul>
        </div>
      )}

      {checkInVisible && (
        <div className="check-in">
          <p>How are you feeling?</p>
          <button onClick={() => handleCheckIn('ok')}>I'm OK</button>
          <button onClick={() => handleCheckIn('need_break')}>I need a break</button>
        </div>
      )}

      {showBreathing && (
        <div className="breathing-circle">
          <div className="circle"></div>
          <p style={{ textAlign: 'center', marginTop: 10 }}>Follow the 4-7-8 breathing pattern</p>
        </div>
      )}

      <div className="map-container">
        <MapComponent route={route} onMapLoaded={onMapLoaded} onWaypointClick={flyTo} />
      </div>
    </div>
  );
}

export default App;
