import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Newspaper, Calendar, Store, Users, TrendingUp, Sparkles, Rocket, ChevronLeft, ChevronRight } from 'lucide-react';
import { collection, query, limit, onSnapshot, orderBy } from 'firebase/firestore';
import { db } from '../firebase-config';
import { useAuth } from '../hooks/useAuth';
import PostCard from '../components/posts/PostCard';
import PostDetail from '../components/posts/PostDetail';
import SuggestionCard from '../components/suggestions/SuggestionCard';
import SuggestionDetail from '../components/suggestions/SuggestionDetail';
import BusinessCard from '../components/businesses/BusinessCard';
import BusinessDetail from '../components/businesses/BusinessDetail';
import EventCard from '../components/events/EventCard';
import EventDetail from '../components/events/EventDetail';
import ActivityTicker from '../components/common/ActivityTicker';

export default function Home() {
  const navigate = useNavigate();
  const { user, signIn } = useAuth();
  const [recentPosts, setRecentPosts] = useState([]);
  const [trendingSuggestions, setTrendingSuggestions] = useState([]);
  const [featuredBusinesses, setFeaturedBusinesses] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [stats, setStats] = useState({ posts: 0, businesses: 0, suggestions: 0 });
  const [selectedPost, setSelectedPost] = useState(null);
  const [selectedSuggestion, setSelectedSuggestion] = useState(null);
  const [selectedBusiness, setSelectedBusiness] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  const heroImages = [
    {
      url: 'https://images.unsplash.com/photo-1644937891142-7afa519986b1?w=1920&q=80&fit=crop',
      alt: 'Downtown Greensboro skyline at sunset',
    },
    {
      url: 'https://images.unsplash.com/photo-1604936434224-feb31c249ef7?w=1920&q=80&fit=crop',
      alt: 'Downtown Greensboro building under blue sky',
    },
    {
      url: 'https://images.unsplash.com/photo-1644013974938-12bdf141bd11?w=1920&q=80&fit=crop',
      alt: 'Historic statue in downtown Greensboro',
    },
    {
      url: 'https://images.unsplash.com/photo-1657771413626-85eab12703ba?w=1920&q=80&fit=crop',
      alt: 'Aerial view of downtown Greensboro',
    },
    {
      url: 'https://images.unsplash.com/photo-1579036689316-298a7daaf907?w=1920&q=80&fit=crop',
      alt: 'Greensboro cityscape',
    },
  ];

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % heroImages.length);
  }, [heroImages.length]);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + heroImages.length) % heroImages.length);
  }, [heroImages.length]);

  // Auto-advance carousel
  useEffect(() => {
    const timer = setInterval(nextSlide, 5000);
    return () => clearInterval(timer);
  }, [nextSlide]);

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
      {/* Hero Section with Downtown Photo Carousel */}
      <div className="relative overflow-hidden">
        {/* Photo carousel background */}
        <div className="absolute inset-0">
          {heroImages.map((img, index) => (
            <img
              key={img.url}
              src={img.url}
              alt={img.alt}
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
                index === currentSlide ? 'opacity-100' : 'opacity-0'
              }`}
            />
          ))}
        </div>
        {/* Lighter gradient overlay - keeps text readable but lets photos shine */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/30 via-slate-950/50 to-slate-950" />

        {/* Carousel navigation arrows */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-black/30 hover:bg-black/50 text-white/70 hover:text-white transition backdrop-blur-sm"
          aria-label="Previous photo"
        >
          <ChevronLeft size={24} />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-black/30 hover:bg-black/50 text-white/70 hover:text-white transition backdrop-blur-sm"
          aria-label="Next photo"
        >
          <ChevronRight size={24} />
        </button>

        {/* Slide indicator dots */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
          {heroImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`rounded-full transition-all ${
                index === currentSlide
                  ? 'w-8 h-2 bg-emerald-400'
                  : 'w-2 h-2 bg-white/40 hover:bg-white/60'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

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
                onClick={() => navigate('/news')}
                className="group flex items-center justify-center gap-2 px-8 py-4 bg-white/10 hover:bg-white/15 backdrop-blur-sm text-white rounded-xl font-bold transition border border-white/10"
              >
                <Newspaper size={20} />
                Latest News
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
              {user ? (
                <button
                  onClick={() => navigate('/post/new')}
                  className="group flex items-center justify-center gap-2 px-8 py-4 bg-emerald-500 hover:bg-emerald-400 text-white rounded-xl font-bold transition shadow-lg shadow-emerald-500/25"
                >
                  Share Something
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </button>
              ) : (
                <button
                  onClick={() => signIn()}
                  className="group flex items-center justify-center gap-2 px-8 py-4 bg-emerald-500 hover:bg-emerald-400 text-white rounded-xl font-bold transition shadow-lg shadow-emerald-500/25"
                >
                  <Rocket size={20} />
                  Get Started
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </button>
              )}
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
          <button onClick={() => navigate('/news')} className="group p-4 rounded-xl bg-gradient-to-br from-blue-500/20 to-blue-600/10 border border-blue-500/20 hover:border-blue-500/40 transition backdrop-blur-sm text-left">
            <Newspaper size={24} className="text-blue-400 mb-2" />
            <div className="text-white font-bold text-sm">News</div>
            <div className="text-slate-400 text-xs mt-1">Community updates</div>
          </button>
          <button onClick={() => navigate('/events')} className="group p-4 rounded-xl bg-gradient-to-br from-pink-500/20 to-pink-600/10 border border-pink-500/20 hover:border-pink-500/40 transition backdrop-blur-sm text-left">
            <Calendar size={24} className="text-pink-400 mb-2" />
            <div className="text-white font-bold text-sm">Events</div>
            <div className="text-slate-400 text-xs mt-1">What's happening</div>
          </button>
          <button onClick={() => navigate('/businesses')} className="group p-4 rounded-xl bg-gradient-to-br from-purple-500/20 to-purple-600/10 border border-purple-500/20 hover:border-purple-500/40 transition backdrop-blur-sm text-left">
            <Store size={24} className="text-purple-400 mb-2" />
            <div className="text-white font-bold text-sm">Places</div>
            <div className="text-slate-400 text-xs mt-1">Local directory</div>
          </button>
          <button onClick={() => navigate('/groups')} className="group p-4 rounded-xl bg-gradient-to-br from-violet-500/20 to-violet-600/10 border border-violet-500/20 hover:border-violet-500/40 transition backdrop-blur-sm text-left">
            <Users size={24} className="text-violet-400 mb-2" />
            <div className="text-white font-bold text-sm">Groups</div>
            <div className="text-slate-400 text-xs mt-1">Your community</div>
          </button>
        </div>
      </div>

      {/* Live Activity Ticker */}
      <div className="max-w-6xl mx-auto px-4 mt-8">
        <ActivityTicker />
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
                <EventCard key={event.id} event={event} onOpenDetail={setSelectedEvent} />
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
                <BusinessCard key={business.id} business={business} onOpenDetail={setSelectedBusiness} />
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
                <SuggestionCard key={suggestion.id} suggestion={suggestion} onOpenDetail={setSelectedSuggestion} />
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
                <PostCard key={post.id} post={post} onOpenDetail={setSelectedPost} />
              ))}
            </div>
          </section>
        )}
      </div>
      <EventDetail event={selectedEvent} isOpen={!!selectedEvent} onClose={() => setSelectedEvent(null)} />
      <BusinessDetail business={selectedBusiness} isOpen={!!selectedBusiness} onClose={() => setSelectedBusiness(null)} />
      <SuggestionDetail suggestion={selectedSuggestion} isOpen={!!selectedSuggestion} onClose={() => setSelectedSuggestion(null)} />
      <PostDetail post={selectedPost} isOpen={!!selectedPost} onClose={() => setSelectedPost(null)} />
    </div>
  );
}
