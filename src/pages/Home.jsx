import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, MapPin, Calendar, Store, Lightbulb, TrendingUp, Sparkles } from 'lucide-react';
import { collection, query, limit, onSnapshot, orderBy } from 'firebase/firestore';
import { db } from '../firebase-config';
import { useAuth } from '../hooks/useAuth';
import PostCard from '../components/posts/PostCard';
import SuggestionCard from '../components/suggestions/SuggestionCard';
import BusinessCard from '../components/businesses/BusinessCard';
import EventCard from '../components/events/EventCard';
import MapView from '../components/map/MapView';

export default function Home() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [recentPosts, setRecentPosts] = useState([]);
  const [trendingSuggestions, setTrendingSuggestions] = useState([]);
  const [featuredBusinesses, setFeaturedBusinesses] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [stats, setStats] = useState({ posts: 0, businesses: 0, suggestions: 0 });

  useEffect(() => {
    const q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'), limit(6));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setRecentPosts(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      setStats((prev) => ({ ...prev, posts: snapshot.size }));
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    const q = query(collection(db, 'suggestions'), orderBy('upvoteCount', 'desc'), limit(3));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setTrendingSuggestions(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      setStats((prev) => ({ ...prev, suggestions: snapshot.size }));
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    const q = query(collection(db, 'businesses'), limit(4));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setFeaturedBusinesses(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      setStats((prev) => ({ ...prev, businesses: snapshot.size }));
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    const q = query(collection(db, 'events'), orderBy('date', 'asc'), limit(6));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setUpcomingEvents(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });
    return unsubscribe;
  }, []);

  return (
    <div className="w-full pb-24 md:pb-8">
      {/* Hero Section with Map Background */}
      <div className="relative overflow-hidden">
        {/* Map background */}
        <div className="absolute inset-0 opacity-30">
          <MapView markers={[]} showOverlays={true} />
        </div>
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/70 via-slate-950/80 to-slate-950" />

        <div className="relative z-10 px-4 py-20 md:py-32">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium">
              <Sparkles size={16} />
              Community-Powered Platform
            </div>

            <div className="space-y-4">
              <h1 className="text-5xl md:text-7xl font-black text-white tracking-tight">
                Downtown
                <span className="bg-gradient-to-r from-emerald-400 to-green-300 bg-clip-text text-transparent"> GSO</span>
              </h1>
              <p className="text-xl md:text-2xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
                Discover, share, and shape the future of downtown Greensboro
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => navigate('/map')}
                className="group flex items-center justify-center gap-2 px-8 py-4 bg-white/10 hover:bg-white/15 backdrop-blur-sm text-white rounded-xl font-bold transition border border-white/10"
              >
                <MapPin size={20} />
                Explore the Map
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                onClick={() => user ? navigate('/post/new') : navigate('/')}
                className="group flex items-center justify-center gap-2 px-8 py-4 bg-emerald-500 hover:bg-emerald-400 text-white rounded-xl font-bold transition shadow-lg shadow-emerald-500/25"
              >
                Share Something
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            {/* Stats Row */}
            <div className="flex items-center justify-center gap-8 pt-4">
              <div className="text-center">
                <div className="text-3xl font-black text-white">{stats.posts}</div>
                <div className="text-sm text-slate-400">Posts</div>
              </div>
              <div className="w-px h-10 bg-slate-700" />
              <div className="text-center">
                <div className="text-3xl font-black text-white">{stats.suggestions}</div>
                <div className="text-sm text-slate-400">Suggestions</div>
              </div>
              <div className="w-px h-10 bg-slate-700" />
              <div className="text-center">
                <div className="text-3xl font-black text-white">{stats.businesses}</div>
                <div className="text-sm text-slate-400">Businesses</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Navigation Cards */}
      <div className="max-w-6xl mx-auto px-4 -mt-8 relative z-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <button onClick={() => navigate('/map')} className="group p-4 rounded-xl bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 border border-emerald-500/20 hover:border-emerald-500/40 transition backdrop-blur-sm text-left">
            <MapPin size={24} className="text-emerald-400 mb-2" />
            <div className="text-white font-bold text-sm">Explore Map</div>
            <div className="text-slate-400 text-xs mt-1">Interactive downtown map</div>
          </button>
          <button onClick={() => navigate('/events')} className="group p-4 rounded-xl bg-gradient-to-br from-pink-500/20 to-pink-600/10 border border-pink-500/20 hover:border-pink-500/40 transition backdrop-blur-sm text-left">
            <Calendar size={24} className="text-pink-400 mb-2" />
            <div className="text-white font-bold text-sm">Events</div>
            <div className="text-slate-400 text-xs mt-1">What's happening</div>
          </button>
          <button onClick={() => navigate('/businesses')} className="group p-4 rounded-xl bg-gradient-to-br from-purple-500/20 to-purple-600/10 border border-purple-500/20 hover:border-purple-500/40 transition backdrop-blur-sm text-left">
            <Store size={24} className="text-purple-400 mb-2" />
            <div className="text-white font-bold text-sm">Businesses</div>
            <div className="text-slate-400 text-xs mt-1">Local directory</div>
          </button>
          <button onClick={() => navigate('/ideas')} className="group p-4 rounded-xl bg-gradient-to-br from-amber-500/20 to-amber-600/10 border border-amber-500/20 hover:border-amber-500/40 transition backdrop-blur-sm text-left">
            <Lightbulb size={24} className="text-amber-400 mb-2" />
            <div className="text-white font-bold text-sm">Ideas</div>
            <div className="text-slate-400 text-xs mt-1">Shape downtown</div>
          </button>
        </div>
      </div>

      <div className="space-y-16 mt-16">
        {/* Upcoming Events */}
        {upcomingEvents.length > 0 && (
          <section className="max-w-6xl mx-auto px-4">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-pink-500/20 flex items-center justify-center">
                  <Calendar size={20} className="text-pink-400" />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-white">Upcoming Events</h2>
                  <p className="text-sm text-slate-400">What's happening downtown</p>
                </div>
              </div>
              <button
                onClick={() => navigate('/events')}
                className="group text-emerald-400 hover:text-emerald-300 font-medium transition flex items-center gap-2 text-sm"
              >
                View All <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {upcomingEvents.slice(0, 3).map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          </section>
        )}

        {/* Discover Local Businesses */}
        {featuredBusinesses.length > 0 && (
          <section className="max-w-6xl mx-auto px-4">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                  <Store size={20} className="text-purple-400" />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-white">Discover Local</h2>
                  <p className="text-sm text-slate-400">Businesses in downtown Greensboro</p>
                </div>
              </div>
              <button
                onClick={() => navigate('/businesses')}
                className="group text-emerald-400 hover:text-emerald-300 font-medium transition flex items-center gap-2 text-sm"
              >
                View All <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {featuredBusinesses.map((business) => (
                <BusinessCard key={business.id} business={business} />
              ))}
            </div>
          </section>
        )}

        {/* Trending Suggestions */}
        {trendingSuggestions.length > 0 && (
          <section className="max-w-6xl mx-auto px-4">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center">
                  <TrendingUp size={20} className="text-amber-400" />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-white">Trending Ideas</h2>
                  <p className="text-sm text-slate-400">Ideas for improving downtown</p>
                </div>
              </div>
              <button
                onClick={() => navigate('/ideas')}
                className="group text-emerald-400 hover:text-emerald-300 font-medium transition flex items-center gap-2 text-sm"
              >
                View All <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {trendingSuggestions.map((suggestion) => (
                <SuggestionCard key={suggestion.id} suggestion={suggestion} />
              ))}
            </div>
          </section>
        )}

        {/* Recent Activity */}
        {recentPosts.length > 0 && (
          <section className="max-w-6xl mx-auto px-4">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                  <Sparkles size={20} className="text-emerald-400" />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-white">Recent Activity</h2>
                  <p className="text-sm text-slate-400">Latest from the community</p>
                </div>
              </div>
              <button
                onClick={() => navigate('/forum')}
                className="group text-emerald-400 hover:text-emerald-300 font-medium transition flex items-center gap-2 text-sm"
              >
                View All <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {recentPosts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
