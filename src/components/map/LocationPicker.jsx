import { useEffect, useRef, useState, useCallback } from 'react';
import mapboxgl from 'mapbox-gl';
import { MapPin, Crosshair, Search, Loader2, X } from 'lucide-react';
import { MAPBOX_TOKEN, DOWNTOWN_CENTER, DOWNTOWN_BOUNDS } from '../../constants';
import 'mapbox-gl/dist/mapbox-gl.css';

mapboxgl.accessToken = MAPBOX_TOKEN;

export default function LocationPicker({ onChange }) {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const markerRef = useRef(null);
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchTimeout = useRef(null);

  const placeMarker = useCallback((lng, lat) => {
    if (markerRef.current) markerRef.current.remove();

    const el = document.createElement('div');
    el.style.backgroundImage = 'url("data:image/svg+xml;charset=utf-8,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 30 30%22><circle cx=%2215%22 cy=%2215%22 r=%2214%22 fill=%22%2310b981%22 stroke=%22white%22 stroke-width=%222%22/><circle cx=%2215%22 cy=%2215%22 r=%225%22 fill=%22white%22/></svg>")';
    el.style.backgroundSize = '100%';
    el.style.width = '30px';
    el.style.height = '30px';
    el.style.cursor = 'pointer';

    markerRef.current = new mapboxgl.Marker(el)
      .setLngLat([lng, lat])
      .addTo(map.current);
  }, []);

  const reverseGeocode = useCallback(async (lng, lat) => {
    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${MAPBOX_TOKEN}&types=address,poi`
      );
      const data = await response.json();
      return data.features[0]?.place_name || 'Selected Location';
    } catch {
      return '';
    }
  }, []);

  const selectLocation = useCallback(async (lng, lat, providedAddress) => {
    placeMarker(lng, lat);
    setLoading(true);

    const addr = providedAddress || await reverseGeocode(lng, lat);
    setAddress(addr);
    setSearchQuery(addr);
    setSuggestions([]);
    setShowSuggestions(false);
    onChange({ lat, lng, address: addr });

    setLoading(false);
  }, [placeMarker, reverseGeocode, onChange]);

  useEffect(() => {
    if (map.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/dark-v11',
      center: DOWNTOWN_CENTER,
      zoom: 14,
      maxBounds: DOWNTOWN_BOUNDS
    });

    // Add zoom controls to bottom-right so they don't overlap search
    map.current.addControl(new mapboxgl.NavigationControl({ showCompass: false }), 'bottom-right');

    map.current.on('click', (e) => {
      const { lng, lat } = e.lngLat;
      selectLocation(lng, lat);
    });
  }, [selectLocation]);

  // Search with Mapbox Geocoding API
  const handleSearch = useCallback(async (query) => {
    setSearchQuery(query);

    if (searchTimeout.current) clearTimeout(searchTimeout.current);

    if (query.length < 3) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    searchTimeout.current = setTimeout(async () => {
      try {
        const bbox = '-79.83,36.04,-79.75,36.10'; // downtown GSO area
        const response = await fetch(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?access_token=${MAPBOX_TOKEN}&bbox=${bbox}&limit=5&types=address,poi,place`
        );
        const data = await response.json();
        setSuggestions(data.features || []);
        setShowSuggestions(true);
      } catch {
        setSuggestions([]);
      }
    }, 300);
  }, []);

  const handleSuggestionClick = (feature) => {
    const [lng, lat] = feature.center;
    map.current.flyTo({ center: [lng, lat], zoom: 16 });
    selectLocation(lng, lat, feature.place_name);
  };

  const handleUseLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
      return;
    }

    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        map.current.flyTo({ center: [longitude, latitude], zoom: 16 });
        selectLocation(longitude, latitude);
      },
      () => {
        setLoading(false);
        alert('Unable to access your location. Please allow location access or search instead.');
      }
    );
  };

  return (
    <div className="space-y-3">
      {/* Search input */}
      <div className="relative">
        <div className="flex items-center gap-2 bg-slate-800 border border-white/10 rounded-lg px-3 py-2.5 focus-within:border-emerald-500 transition">
          <Search size={16} className="text-slate-500 shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
            placeholder="Search for an address or place..."
            className="flex-1 bg-transparent text-sm text-white placeholder-slate-500 focus:outline-none"
          />
          {searchQuery && (
            <button
              onClick={() => { setSearchQuery(''); setSuggestions([]); setShowSuggestions(false); }}
              className="text-slate-500 hover:text-white transition"
            >
              <X size={14} />
            </button>
          )}
          {loading && <Loader2 size={14} className="text-emerald-400 animate-spin" />}
        </div>

        {/* Autocomplete dropdown */}
        {showSuggestions && suggestions.length > 0 && (
          <div className="absolute z-20 top-full mt-1 w-full bg-slate-800 border border-white/10 rounded-lg shadow-xl overflow-hidden">
            {suggestions.map((feature) => (
              <button
                key={feature.id}
                onClick={() => handleSuggestionClick(feature)}
                className="w-full flex items-start gap-2 px-3 py-2.5 hover:bg-slate-700 transition text-left"
              >
                <MapPin size={14} className="text-emerald-400 shrink-0 mt-0.5" />
                <span className="text-sm text-slate-200 line-clamp-1">{feature.place_name}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Quick actions row */}
      <div className="flex gap-2">
        <button
          onClick={handleUseLocation}
          disabled={loading}
          className="flex items-center gap-2 px-3 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-700 text-white text-sm rounded-lg transition font-medium"
        >
          <Crosshair size={15} />
          Use my location
        </button>
        <span className="flex items-center text-xs text-slate-500">or tap the map</span>
      </div>

      {/* Map */}
      <div className="relative h-56 rounded-lg overflow-hidden border border-white/10">
        <div ref={mapContainer} className="w-full h-full" />
      </div>

      {/* Selected location display */}
      {address && (
        <div className="flex items-start gap-2 p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
          <MapPin size={16} className="text-emerald-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-xs text-emerald-300 font-medium">Selected Location</p>
            <p className="text-sm text-slate-200">{address}</p>
          </div>
        </div>
      )}
    </div>
  );
}
