import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, Plus } from 'lucide-react';
import { collection, query, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase-config';
import { useAuth } from '../hooks/useAuth';
import { POST_CATEGORIES, SUGGESTION_CATEGORIES, BUSINESS_CATEGORIES } from '../constants';
import MapView from '../components/map/MapView';

export default function MapExplore() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [layers, setLayers] = useState({
    posts: true,
    suggestions: true,
    businesses: true,
    events: true
  });

  const [posts, setPosts] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [businesses, setBusinesses] = useState([]);
  const [events, setEvents] = useState([]);

  // Fetch all data
  useEffect(() => {
    const postsUnsub = onSnapshot(query(collection(db, 'posts')), (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        type: 'post',
        ...doc.data()
      }));
      setPosts(data);
    });

    const suggestionsUnsub = onSnapshot(query(collection(db, 'suggestions')), (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        type: 'suggestion',
        ...doc.data()
      }));
      setSuggestions(data);
    });

    const businessesUnsub = onSnapshot(query(collection(db, 'businesses')), (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        type: 'business',
        ...doc.data()
      }));
      setBusinesses(data);
    });

    const eventsUnsub = onSnapshot(query(collection(db, 'events')), (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        type: 'event',
        ...doc.data()
      }));
      setEvents(data);
    });

    return () => {
      postsUnsub();
      suggestionsUnsub();
      businessesUnsub();
      eventsUnsub();
    };
  }, []);

  // Build markers array
  const markers = [];
  // Helper to extract lat/lng from either flat fields or nested location object
  const getLat = (item) => item.lat || item.location?.lat;
  const getLng = (item) => item.lng || item.location?.lng;

  if (layers.posts) {
    markers.push(...posts.filter((p) => getLat(p) && getLng(p)).map((p) => ({
      id: p.id,
      lat: getLat(p),
      lng: getLng(p),
      type: p.type === 'suggestion' ? 'suggestion' : 'post',
      title: p.title,
      preview: p.title
    })));
  }
  if (layers.suggestions) {
    markers.push(...suggestions.filter((s) => getLat(s) && getLng(s)).map((s) => ({
      id: s.id,
      lat: getLat(s),
      lng: getLng(s),
      type: 'suggestion',
      title: s.title,
      preview: s.title
    })));
  }
  if (layers.businesses) {
    markers.push(...businesses.filter((b) => getLat(b) && getLng(b)).map((b) => ({
      id: b.id,
      lat: getLat(b),
      lng: getLng(b),
      type: 'business',
      title: b.name,
      preview: b.name
    })));
  }
  if (layers.events) {
    markers.push(...events.filter((e) => getLat(e) && getLng(e)).map((e) => ({
      id: e.id,
      lat: getLat(e),
      lng: getLng(e),
      type: 'event',
      title: e.title,
      preview: e.title
    })));
  }

  const handleMarkerClick = (marker) => {
    if (marker.type === 'post') {
      navigate(`/post/${marker.id}`);
    } else if (marker.type === 'suggestion') {
      navigate(`/suggestion/${marker.id}`);
    } else if (marker.type === 'business') {
      navigate(`/business/${marker.id}`);
    } else if (marker.type === 'event') {
      navigate(`/event/${marker.id}`);
    }
  };

  return (
    <div className="relative w-full h-screen pt-16">
      {/* Map */}
      <MapView markers={markers} onMarkerClick={handleMarkerClick} />

      {/* Floating Sidebar */}
      <div className="absolute top-4 left-4 z-10 max-w-xs">
        {sidebarOpen && (
          <div className="bg-slate-900/95 backdrop-blur rounded-lg border border-slate-700 shadow-lg overflow-hidden">
            <div className="p-4 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-white">Filter Layers</h3>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="text-slate-400 hover:text-white"
                >
                  <ChevronDown size={20} />
                </button>
              </div>

              {/* Layer Toggles */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={layers.posts}
                    onChange={(e) => setLayers((prev) => ({ ...prev, posts: e.target.checked }))}
                    className="w-4 h-4"
                  />
                  <span className="text-slate-300 text-sm">Posts</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={layers.suggestions}
                    onChange={(e) => setLayers((prev) => ({ ...prev, suggestions: e.target.checked }))}
                    className="w-4 h-4"
                  />
                  <span className="text-slate-300 text-sm">Suggestions</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={layers.businesses}
                    onChange={(e) => setLayers((prev) => ({ ...prev, businesses: e.target.checked }))}
                    className="w-4 h-4"
                  />
                  <span className="text-slate-300 text-sm">Businesses</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={layers.events}
                    onChange={(e) => setLayers((prev) => ({ ...prev, events: e.target.checked }))}
                    className="w-4 h-4"
                  />
                  <span className="text-slate-300 text-sm">Events</span>
                </label>
              </div>
            </div>
          </div>
        )}

        {!sidebarOpen && (
          <button
            onClick={() => setSidebarOpen(true)}
            className="bg-slate-900/95 backdrop-blur p-2 rounded-lg border border-slate-700 text-white hover:bg-slate-800 transition"
          >
            <ChevronDown size={20} />
          </button>
        )}
      </div>

      {/* Floating Add Button */}
      {user && (
        <button
          onClick={() => navigate('/post/new')}
          className="absolute bottom-20 md:bottom-8 right-4 bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg transition transform hover:scale-110"
        >
          <Plus size={28} />
        </button>
      )}
    </div>
  );
}
