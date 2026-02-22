import { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import { MAPBOX_TOKEN, DOWNTOWN_CENTER, DOWNTOWN_BOUNDS, DOWNTOWN_BOUNDARY, GREENWAY_PATH } from '../../constants';
import 'mapbox-gl/dist/mapbox-gl.css';

mapboxgl.accessToken = MAPBOX_TOKEN;

// Marker colors per type
const markerColors = {
  post: '#22c55e',
  suggestion: '#f59e0b',
  business: '#a855f7',
  event: '#ec4899'
};

function createMarkerElement(type) {
  const color = markerColors[type] || markerColors.post;
  const el = document.createElement('div');
  el.style.width = '28px';
  el.style.height = '28px';
  el.style.borderRadius = '50% 50% 50% 0';
  el.style.backgroundColor = color;
  el.style.transform = 'rotate(-45deg)';
  el.style.border = '3px solid white';
  el.style.cursor = 'pointer';
  el.style.boxShadow = '0 2px 8px rgba(0,0,0,0.4)';
  return el;
}

export default function MapView({ markers = [], onMarkerClick, onMapClick, showOverlays = true }) {
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

    map.current.on('load', () => {
      if (!showOverlays) return;

      // Downtown boundary - subtle green fill
      map.current.addSource('downtown-boundary', {
        type: 'geojson',
        data: {
          type: 'Feature',
          geometry: {
            type: 'Polygon',
            coordinates: [DOWNTOWN_BOUNDARY]
          }
        }
      });

      map.current.addLayer({
        id: 'downtown-fill',
        type: 'fill',
        source: 'downtown-boundary',
        paint: {
          'fill-color': '#22c55e',
          'fill-opacity': 0.06
        }
      });

      map.current.addLayer({
        id: 'downtown-outline',
        type: 'line',
        source: 'downtown-boundary',
        paint: {
          'line-color': '#22c55e',
          'line-width': 2,
          'line-opacity': 0.4,
          'line-dasharray': [4, 3]
        }
      });

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
    });

    if (onMapClick) {
      map.current.on('click', (e) => {
        onMapClick([e.lngLat.lng, e.lngLat.lat]);
      });
    }

    return () => {};
  }, [onMapClick, showOverlays]);

  useEffect(() => {
    if (!map.current) return;

    Object.values(markerRefs.current).forEach((marker) => marker.remove());
    markerRefs.current = {};

    markers.forEach((marker) => {
      if (!marker.lat || !marker.lng) return;

      const el = createMarkerElement(marker.type);

      const mapMarker = new mapboxgl.Marker({ element: el, anchor: 'bottom' })
        .setLngLat([marker.lng, marker.lat])
        .addTo(map.current);

      el.addEventListener('click', (e) => {
        e.stopPropagation();
        if (onMarkerClick) onMarkerClick(marker);
      });

      markerRefs.current[marker.id] = mapMarker;
    });
  }, [markers, onMarkerClick]);

  return <div ref={mapContainer} className="w-full h-full" />;
}
