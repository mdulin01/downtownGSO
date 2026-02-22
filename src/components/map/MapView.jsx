import { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import { MAPBOX_TOKEN, DOWNTOWN_CENTER, DOWNTOWN_BOUNDS, DOWNTOWN_BOUNDARY, GREENWAY_PATH } from '../../constants';
import 'mapbox-gl/dist/mapbox-gl.css';

mapboxgl.accessToken = MAPBOX_TOKEN;

// SVG icons for each marker type - pin shape with inner icon
const markerIcons = {
  post: {
    color: '#22c55e',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="40" viewBox="0 0 32 40"><path d="M16 0C7.2 0 0 7.2 0 16c0 12 16 24 16 24s16-12 16-24C32 7.2 24.8 0 16 0z" fill="COLOR"/><circle cx="16" cy="15" r="8" fill="white" opacity="0.9"/><path d="M12 13h8M12 17h8M12 15h5" stroke="COLOR" stroke-width="1.5" stroke-linecap="round"/></svg>`
  },
  suggestion: {
    color: '#f59e0b',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="40" viewBox="0 0 32 40"><path d="M16 0C7.2 0 0 7.2 0 16c0 12 16 24 16 24s16-12 16-24C32 7.2 24.8 0 16 0z" fill="COLOR"/><circle cx="16" cy="15" r="8" fill="white" opacity="0.9"/><circle cx="16" cy="12" r="3" stroke="COLOR" stroke-width="1.5" fill="none"/><path d="M14 16h4v2h-4z" fill="COLOR"/></svg>`
  },
  business: {
    color: '#a855f7',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="40" viewBox="0 0 32 40"><path d="M16 0C7.2 0 0 7.2 0 16c0 12 16 24 16 24s16-12 16-24C32 7.2 24.8 0 16 0z" fill="COLOR"/><circle cx="16" cy="15" r="8" fill="white" opacity="0.9"/><path d="M11 19h10M11 12h10l-1 4H12l-1-4zM13 16v3M19 16v3" stroke="COLOR" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/></svg>`
  },
  event: {
    color: '#ec4899',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="40" viewBox="0 0 32 40"><path d="M16 0C7.2 0 0 7.2 0 16c0 12 16 24 16 24s16-12 16-24C32 7.2 24.8 0 16 0z" fill="COLOR"/><circle cx="16" cy="15" r="8" fill="white" opacity="0.9"/><rect x="11" y="11" width="10" height="8" rx="1" stroke="COLOR" stroke-width="1.3" fill="none"/><path d="M11 14h10M14 9v3M18 9v3" stroke="COLOR" stroke-width="1.3" stroke-linecap="round"/></svg>`
  }
};

function createMarkerElement(type) {
  const config = markerIcons[type] || markerIcons.post;
  const svgStr = config.svg.replace(/COLOR/g, encodeURIComponent(config.color));
  const el = document.createElement('div');
  el.innerHTML = `<img src="data:image/svg+xml;charset=utf-8,${svgStr}" width="32" height="40" style="cursor:pointer;filter:drop-shadow(0 2px 4px rgba(0,0,0,0.4));" />`;
  el.style.width = '32px';
  el.style.height = '40px';
  el.style.cursor = 'pointer';
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
