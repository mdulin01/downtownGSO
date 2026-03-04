import { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import { MAPBOX_TOKEN, DOWNTOWN_CENTER, DOWNTOWN_BOUNDS, GREENWAY_PATH, MAP_MARKERS } from '../../constants';
import 'mapbox-gl/dist/mapbox-gl.css';

mapboxgl.accessToken = MAPBOX_TOKEN;

export default function MapView({ onMapClick, showOverlays = true, showMarkers = true }) {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const markersRef = useRef([]);

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

    map.current.on('load', () => {
      if (!showOverlays) return;

      // Greenway path
      map.current.addSource('greenway', {
        type: 'geojson',
        data: {
          type: 'Feature',
          geometry: {
            type: 'LineString',
            coordinates: GREENWAY_PATH
          }
        }
      });

      // Glow
      map.current.addLayer({
        id: 'greenway-glow',
        type: 'line',
        source: 'greenway',
        paint: {
          'line-color': '#4ade80',
          'line-width': 8,
          'line-opacity': 0.15,
          'line-blur': 4
        }
      });

      // Main trail
      map.current.addLayer({
        id: 'greenway-line',
        type: 'line',
        source: 'greenway',
        paint: {
          'line-color': '#4ade80',
          'line-width': 3,
          'line-opacity': 0.7
        },
        layout: {
          'line-cap': 'round',
          'line-join': 'round'
        }
      });

      // Greenway label
      map.current.addLayer({
        id: 'greenway-label',
        type: 'symbol',
        source: 'greenway',
        layout: {
          'symbol-placement': 'line',
          'text-field': 'Downtown Greenway',
          'text-size': 11,
          'text-font': ['DIN Pro Medium', 'Arial Unicode MS Regular'],
          'text-offset': [0, -0.8],
          'text-max-angle': 30
        },
        paint: {
          'text-color': '#86efac',
          'text-halo-color': '#0f172a',
          'text-halo-width': 1.5
        }
      });

      // Add map markers for businesses and events
      if (showMarkers) {
        MAP_MARKERS.forEach((marker) => {
          const color = marker.type === 'business' ? '#a855f7' : '#ec4899';
          const emoji = marker.type === 'business' ? '🏪' : '🎉';

          const el = document.createElement('div');
          el.className = 'map-marker';
          el.style.cssText = `
            width: 32px; height: 32px; border-radius: 50%;
            background: ${color}; border: 2px solid white;
            display: flex; align-items: center; justify-content: center;
            font-size: 16px; cursor: pointer; box-shadow: 0 2px 8px rgba(0,0,0,0.4);
          `;
          el.textContent = emoji;

          const popup = new mapboxgl.Popup({ offset: 20, closeButton: false })
            .setHTML(`
              <div style="padding: 4px 8px; font-family: system-ui; font-size: 13px;">
                <strong>${marker.name}</strong>
                ${marker.category ? `<br/><span style="color: #94a3b8; font-size: 11px;">${marker.category}</span>` : ''}
              </div>
            `);

          const m = new mapboxgl.Marker(el)
            .setLngLat([marker.lng, marker.lat])
            .setPopup(popup)
            .addTo(map.current);

          markersRef.current.push(m);
        });
      }
    });

    if (onMapClick) {
      map.current.on('click', (e) => {
        onMapClick([e.lngLat.lng, e.lngLat.lat]);
      });
    }

    return () => {};
  }, [onMapClick, showOverlays, showMarkers]);

  return <div ref={mapContainer} className="w-full h-full" />;
}
