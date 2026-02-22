import { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import { MAPBOX_TOKEN, DOWNTOWN_CENTER, DOWNTOWN_BOUNDS, GREENWAY_PATH } from '../../constants';
import 'mapbox-gl/dist/mapbox-gl.css';

mapboxgl.accessToken = MAPBOX_TOKEN;

export default function MapView({ onMapClick, showOverlays = true }) {
  const mapContainer = useRef(null);
  const map = useRef(null);

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
    });

    if (onMapClick) {
      map.current.on('click', (e) => {
        onMapClick([e.lngLat.lng, e.lngLat.lat]);
      });
    }

    return () => {};
  }, [onMapClick, showOverlays]);

  return <div ref={mapContainer} className="w-full h-full" />;
}
