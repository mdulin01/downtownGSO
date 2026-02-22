import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import { MAPBOX_TOKEN, DOWNTOWN_CENTER, DOWNTOWN_BOUNDS } from '../../constants';
import 'mapbox-gl/dist/mapbox-gl.css';

mapboxgl.accessToken = MAPBOX_TOKEN;

const markerColors = {
  post: '#3b82f6', // blue
  business: '#fbbf24', // amber/gold
  suggestion: '#10b981', // emerald/green
  event: '#a855f7' // purple
};

export default function MapView({ markers = [], onMarkerClick, onMapClick }) {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const markerRefs = useRef({});

  useEffect(() => {
    if (map.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/dark-v11',
      center: DOWNTOWN_CENTER,
      zoom: 14,
      maxBounds: DOWNTOWN_BOUNDS
    });

    map.current.addControl(new mapboxgl.NavigationControl());

    if (onMapClick) {
      map.current.on('click', (e) => {
        onMapClick([e.lngLat.lng, e.lngLat.lat]);
      });
    }

    return () => {
      // Keep map mounted
    };
  }, [onMapClick]);

  useEffect(() => {
    if (!map.current) return;

    // Remove old markers
    Object.values(markerRefs.current).forEach((marker) => {
      marker.remove();
    });
    markerRefs.current = {};

    // Add new markers
    markers.forEach((marker) => {
      const color = markerColors[marker.type] || '#gray';
      const el = document.createElement('div');
      el.className = 'marker';
      el.style.backgroundImage = `url('data:image/svg+xml;charset=utf-8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 30"><circle cx="15" cy="15" r="14" fill="${encodeURIComponent(color)}" stroke="white" stroke-width="2"/></svg>')`;
      el.style.backgroundSize = '100%';
      el.style.width = '30px';
      el.style.height = '30px';
      el.style.cursor = 'pointer';

      const mapMarker = new mapboxgl.Marker(el)
        .setLngLat([marker.lng, marker.lat])
        .addTo(map.current);

      el.addEventListener('click', () => {
        if (onMarkerClick) {
          onMarkerClick(marker);
        }
      });

      markerRefs.current[marker.id] = mapMarker;
    });
  }, [markers, onMarkerClick]);

  return <div ref={mapContainer} className="w-full h-full" />;
}
