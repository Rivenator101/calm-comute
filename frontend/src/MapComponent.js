// frontend/src/MapComponent.js
import React, { useRef, useState, useCallback, useEffect } from 'react';
import { GoogleMap, LoadScript, Polyline, Marker, InfoWindow } from '@react-google-maps/api';

const API_KEY = 'AIzaSyDuZlEoTXq-nTgysq05MzTgTjrIvPq1l0g';
const containerStyle = { width: '100%', height: '420px' };
const defaultCenter = { lat: 43.4675, lng: -79.6893 };

function stressColor(num) {
  if (num <= 3) return '#2ecc71'; // green
  if (num <= 6) return '#f1c40f'; // yellow
  return '#e74c3c'; // red
}

export default function MapComponent({ route, onMapLoaded, onWaypointClick }) {
  const mapRef = useRef(null);
  const [selectedSegment, setSelectedSegment] = useState(null);
  const [selectedWaypoint, setSelectedWaypoint] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);

  const handleLoad = (map) => {
    mapRef.current = map;
    setIsLoaded(true);
    if (onMapLoaded) onMapLoaded(map);
    
    // Auto-fit bounds when route is loaded
    if (route && route.coordinates && route.coordinates.length > 0) {
      setTimeout(() => {
        if (map && window.google && window.google.maps) {
          const bounds = new window.google.maps.LatLngBounds();
          route.coordinates.forEach(coord => {
            bounds.extend(new window.google.maps.LatLng(coord.lat, coord.lng));
          });
          map.fitBounds(bounds);
        }
      }, 100);
    }
  };

  // create small segments each with color based on average stress of that segment
  const segments = [];
  if (route && route.coordinates && route.coordinates.length > 1) {
    for (let i=0;i<route.coordinates.length-1;i++) {
      const a = route.coordinates[i];
      const b = route.coordinates[i+1];
      const avg = Math.round(((a.stress || 3) + (b.stress || 3)) / 2);
      segments.push({ 
        path: [{lat:a.lat, lng:a.lng},{lat:b.lat,lng:b.lng}], 
        color: stressColor(avg),
        stress: avg,
        index: i
      });
    }
  }

  // Waypoint markers from route.waypoints
  const waypointMarkers = [];
  if (route && route.waypoints && route.waypoints.length > 0) {
    route.waypoints.forEach((wp, idx) => {
      let position = null;
      let text = '';
      
      if (typeof wp === 'object' && wp.lat && wp.lng) {
        position = { lat: wp.lat, lng: wp.lng };
        text = wp.text || '';
      } else if (typeof wp === 'string' && route.coordinates && route.coordinates[idx]) {
        // Fallback: use coordinates array if waypoint doesn't have lat/lng
        position = { lat: route.coordinates[idx].lat, lng: route.coordinates[idx].lng };
        text = wp;
      }
      
      if (position) {
        waypointMarkers.push({
          position,
          text,
          index: idx,
          id: `waypoint-${idx}`
        });
      }
    });
  }

  const handleSegmentClick = useCallback((segment) => {
    setSelectedSegment(segment);
    if (mapRef.current && segment.path && segment.path.length > 0) {
      const midPoint = {
        lat: (segment.path[0].lat + segment.path[1].lat) / 2,
        lng: (segment.path[0].lng + segment.path[1].lng) / 2
      };
      mapRef.current.panTo(midPoint);
      mapRef.current.setZoom(15);
    }
  }, []);

  const handleWaypointMarkerClick = useCallback((waypoint) => {
    setSelectedWaypoint(waypoint);
    if (onWaypointClick && waypoint.position) {
      onWaypointClick(waypoint.position.lat, waypoint.position.lng);
    }
    if (mapRef.current && waypoint.position) {
      mapRef.current.panTo(waypoint.position);
      mapRef.current.setZoom(16);
    }
  }, [onWaypointClick]);

  // Auto-fit bounds when route changes
  useEffect(() => {
    if (isLoaded && mapRef.current && route && route.coordinates && route.coordinates.length > 0 && window.google && window.google.maps) {
      const bounds = new window.google.maps.LatLngBounds();
      route.coordinates.forEach(coord => {
        bounds.extend(new window.google.maps.LatLng(coord.lat, coord.lng));
      });
      mapRef.current.fitBounds(bounds);
    }
  }, [route, isLoaded]);

  return (
    <LoadScript googleMapsApiKey={API_KEY}>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={ route && route.coordinates && route.coordinates.length ? { lat: route.coordinates[0].lat, lng: route.coordinates[0].lng } : defaultCenter }
        zoom={13}
        onLoad={handleLoad}
        options={{
          mapTypeControl: true,
          streetViewControl: true,
          fullscreenControl: true,
          zoomControl: true
        }}
      >
        {segments.map((seg, idx) => (
          <Polyline 
            key={idx} 
            path={seg.path} 
            options={{ 
              strokeColor: seg.color, 
              strokeWeight: 7, 
              strokeOpacity: 0.8,
              geodesic: true,
              clickable: true,
              zIndex: 1
            }}
            onClick={() => handleSegmentClick(seg)}
            onMouseOver={() => {
              if (mapRef.current) {
                mapRef.current.getDiv().style.cursor = 'pointer';
              }
            }}
            onMouseOut={() => {
              if (mapRef.current) {
                mapRef.current.getDiv().style.cursor = '';
              }
            }}
          />
        ))}

        {waypointMarkers.map(wp => {
          let iconConfig = null;
          if (isLoaded && window.google && window.google.maps) {
            iconConfig = {
              url: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png',
              scaledSize: new window.google.maps.Size(32, 32)
            };
          }
          return (
            <Marker
              key={wp.id}
              position={wp.position}
              onClick={() => handleWaypointMarkerClick(wp)}
              icon={iconConfig}
              title={wp.text}
              animation={window.google && window.google.maps ? window.google.maps.Animation.DROP : undefined}
            />
          );
        })}

        {selectedSegment && (
          <InfoWindow
            position={{
              lat: (selectedSegment.path[0].lat + selectedSegment.path[1].lat) / 2,
              lng: (selectedSegment.path[0].lng + selectedSegment.path[1].lng) / 2
            }}
            onCloseClick={() => setSelectedSegment(null)}
          >
            <div>
              <strong>Route Segment</strong>
              <p>Stress Level: {selectedSegment.stress}/10</p>
            </div>
          </InfoWindow>
        )}

        {selectedWaypoint && (
          <InfoWindow
            position={selectedWaypoint.position}
            onCloseClick={() => setSelectedWaypoint(null)}
          >
            <div>
              <strong>Waypoint</strong>
              <p>{selectedWaypoint.text}</p>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </LoadScript>
  );
}
