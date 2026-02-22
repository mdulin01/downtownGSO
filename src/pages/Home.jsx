import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { collection, query, limit, onSnapshot, orderBy } from 'firebase/firestore';
import { db } from '../firebase-config';
import { useAuth } from '../hooks/useAuth';
import PostCard from '../components/posts/PostCard';
import SuggestionCard from '../components/suggestions/SuggestionCard';
import BusinessCard from '../components/businesses/BusinessCard';
import EventCard from '../components/events/EventCard';

export default function Home() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [recentPosts, setRecentPosts] = useState([]);
  const [trendingSuggestions, setTrendingSuggestions] = useState([]);
  const [featuredBusinesses, setFeaturedBusinesses] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [stats, setStats] = useState({ posts: 0, businesses: 0, suggestions: 0 });

  // Fetch recent posts
  useEffect(() => {
    const q = query(
      collection(db, 'posts'),
      orderBy('createdAt', 'desc'),
      limit(6)
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const posts = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }));
      setRecentPosts(posts);
      setStats((prev) => ({ ...prev, posts: snapshot.size }));
    });
    return unsubscribe;
  }, []);

  // Fetch trending suggestions
  useEffect(() => {
    const q = query(
      collection(db, 'suggestions'),
      orderBy('upvoteCount', 'desc'),
      limit(3)
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const suggestions = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }));
      setTrendingSuggestions(suggestions);
      setStats((prev) => ({ ...prev, suggestions: snapshot.size }));
    });
    return unsubscribe;
  }, []);

  // Fetch featured businesses
  useEffect(() => {
    const q = query(
      collection(db, 'businesses'),
      limit(4)
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const businesses = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }));
      setFeaturedBusinesses(businesses);
      setStats((prev) => ({ ...prev, businesses: snapshot.size }));
    });
    return unsubscribe;
  }, []);

  // Fetch upcoming events
  useEffect(() => {
    const q = query(
      collection(db, 'events'),
      orderBy('date', 'asc'),
      limit(6)
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const events = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }));
      setUpcomingEvents(events);
    });
    return unsubscribe;
  }, []);

  return (
    <div className="w-full space-y-12 pb-24 md:pb-8">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-slate-900 via-blue-900/20 to-slate-900 px-4 py-16 md:py-24 border-b border-slate-700">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <div className="space-y-2">
            <h1 className="text-4xl md:text-5xl font-bold text-white">
              Love Downtown Greensboro?
            </h1>
            <p className="text-xl md:text-2xl text-slate-400">
              Help Shape Its Future
            </p>
          </div>

          <p className="text-lg text-slate-300 max-w-2xl mx-auto">
            Share what you love, suggest improvements, discover local businesses, and connect with your community.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => navigate('/map')}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-bold transition"
            >
              Explore the Map
              <ArrowRight size={20} />
            </button>
            <button
              onClick={() => user ? navigate('/post/new') : navigate('/')}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold transition"
            >
              Share Something
              <ArrowRight size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-slate-800/50 rounded-lg p-4 text-center border border-slate-700">
            <div className="text-3xl font-bold text-blue-400">{stats.posts}</div>
            <div className="text-sm text-slate-400 mt-1">Posts</div>
          </div>
          <div className="bg-slate-800/50 rounded-lg p-4 text-center border border-slate-700">
            <div className="text-3xl font-bold text-emerald-400">{stats.suggestions}</div>
            <div className="text-sm text-slate-400 mt-1">Suggestions</div>
          </div>
          <div className="bg-slate-800/50 rounded-lg p-4 text-center border border-slate-700">
            <div className="text-3xl font-bold text-amber-400">{stats.businesses}</div>
            <div className="text-sm text-slate-400 mt-1">Businesses</div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      {recentPosts.length > 0 && (
        <div className="max-w-6xl mx-auto px-4 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-white">Recent Activity</h2>
            <button
              onClick={() => navigate('/feed')}
              className="text-blue-400 hover:text-blue-300 font-medium transition flex items-center gap-2"
            >
              View All <ArrowRight size={18} />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recentPosts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        </div>
      )}

      {/* Trending Suggestions */}
      {trendingSuggestions.length > 0 && (
        <div className="max-w-6xl mx-auto px-4 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-white">Trending Suggestions</h2>
            <button
              onClick={() => navigate('/suggestions')}
              className="text-blue-400 hover:text-blue-300 font-medium transition flex items-center gap-2"
            >
              View All <ArrowRight size={18} />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {trendingSuggestions.map((suggestion) => (
              <SuggestionCard key={suggestion.id} suggestion={suggestion} />
            ))}
          </div>
        </div>
      )}

      {/* Discover Local Businesses */}
      {featuredBusinesses.length > 0 && (
        <div className="max-w-6xl mx-auto px-4 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-white">Discover Local</h2>
            <button
              onClick={() => navigate('/businesses')}
              className="text-blue-400 hover:text-blue-300 font-medium transition flex items-center gap-2"
            >
              View All <ArrowRight size={18} />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {featuredBusinesses.map((business) => (
              <BusinessCard key={business.id} business={business} />
            ))}
          </div>
        </div>
      )}

      {/* Upcoming Events */}
      {upcomingEvents.length > 0 && (
        <div className="max-w-6xl mx-auto px-4 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-white">Upcoming Events</h2>
            <button
              onClick={() => navigate('/events')}
              className="text-blue-400 hover:text-blue-300 font-medium transition flex items-center gap-2"
            >
              View All <ArrowRight size={18} />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {upcomingEvents.slice(0, 3).map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
