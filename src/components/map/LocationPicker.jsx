import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import { MapPin, Crosshair } from 'lucide-react';
import { MAPBOX_TOKEN, DOWNTOWN_CENTER, DOWNTOWN_BOUNDS } from '../../constants';
import 'mapbox-gl/dist/mapbox-gl.css';

mapboxgl.accessToken = MAPBOX_TOKEN;

export default function LocationPicker({ onChange }) {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const markerRef = useRef(null);
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);

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

    const handleMapClick = async (e) => {
      const { lng, lat } = e.lngLat;

      // Update marker
      if (markerRef.current) {
        markerRef.current.remove();
      }

      const el = document.createElement('div');
      el.style.backgroundImage = 'url("data:image/svg+xml;charset=utf-8,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 30 30%22><circle cx=%2215%22 cy=%2215%22 r=%2214%22 fill=%22%23f87171%22 stroke=%22white%22 stroke-width=%222%22/></svg>")';
      el.style.backgroundSize = '100%';
      el.style.width = '30px';
      el.style.height = '30px';

      markerRef.current = new mapboxgl.Marker(el)
        .setLngLat([lng, lat])
        .addTo(map.current);

      // Reverse geocode
      setLoading(true);
      try {
        const response = await fetch(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${MAPBOX_TOKEN}`
        );
        const data = await response.json();
        const placeName = data.features[0]?.place_name || 'Selected Location';
        setAddress(placeName);
        onChange({ lat, lng, address: placeName });
      } catch (error) {
        console.error('Geocoding error:', error);
        onChange({ lat, lng, address: '' });
      }
      setLoading(false);
    };

    map.current.on('click', handleMapClick);

    return () => {
      if (map.current) {
        map.current.off('click', handleMapClick);
      }
    };
  }, [onChange]);

  const handleUseLocation = () => {
    if (navigator.geolocation) {
      setLoading(true);
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;

          // Pan map to location
          map.current.flyTo({
            center: [longitude, latitude],
            zoom: 15
          });

          // Set marker
          if (markerRef.current) {
            markerRef.current.remove();
          }

          const el = document.createElement('div');
          el.style.backgroundImage = 'url("data:image/svg+xml;charset=utf-8,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 30 30%22><circle cx=%2215%22 cy=%2215%22 r=%2214%22 fill=%22%23f87171%22 stroke=%22white%22 stroke-width=%222%22/></svg>")';
          el.style.backgroundSize = '100%';
          el.style.width = '30px';
          el.style.height = '30px';

          markerRef.current = new mapboxgl.Marker(el)
            .setLngLat([longitude, latitude])
            .addTo(map.current);

          // Reverse geocode
          try {
            const response = await fetch(
              `https://api.mapbox.com/geocoding/v5/mapbox.places/${longitude},${latitude}.json?access_token=${MAPBOX_TOKEN}`
            );
            const data = await response.json();
            const placeName = data.features[0]?.place_name || 'Your Location';
            setAddress(placeName);
            onChange({ lat: latitude, lng: longitude, address: placeName });
          } catch (error) {
            console.error('Geocoding error:', error);
            onChange({ lat: latitude, lng: longitude, address: '' });
          }

          setLoading(false);
        },
        () => {
          setLoading(false);
          alert('Unable to access your location');
        }
      );
    }
  };

  return (
    <div className="space-y-4">
      <div className="relative h-64 rounded-lg overflow-hidden">
        <div ref={mapContainer} className="w-full h-full" />
        <button
          onClick={handleUseLocation}
          disabled={loading}
          className="absolute top-4 right-4 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 text-white p-2 rounded-lg transition"
        >
          <Crosshair size={20} />
        </button>
      </div>
      {address && (
        <div className="flex items-start gap-2 p-3 bg-slate-800 rounded-lg">
          <MapPin size={18} className="text-blue-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm text-slate-400">Selected Location</p>
            <p className="text-slate-200 font-medium">{address}</p>
          </div>
        </div>
      )}
      <p className="text-sm text-slate-400">Click on the map to select a location, or use your current location</p>
    </div>
  );
}
