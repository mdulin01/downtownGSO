import { useState, useMemo } from 'react';
import { Map, List, Store, Search } from 'lucide-react';
import { BUSINESS_CATEGORIES } from '../../constants';
import BusinessCard from './BusinessCard';
import BusinessDetail from './BusinessDetail';
import MapView from '../map/MapView';
import { collection, query, onSnapshot } from 'firebase/firestore';
import { db } from '../../firebase-config';
import { useEffect } from 'react';

export default function BusinessDirectory() {
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [viewMode, setViewMode] = useState('grid');
  const [selectedBusiness, setSelectedBusiness] = useState(null);

  useEffect(() => {
    const q = query(collection(db, 'businesses'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setBusinesses(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const filteredBusinesses = useMemo(() => {
    return businesses.filter((business) => {
      const matchesSearch =
        business.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        business.description?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = !selectedCategory || business.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [businesses, searchTerm, selectedCategory]);

  const markers = filteredBusinesses
    .filter((b) => b.lat || b.location?.lat)
    .map((business) => ({
      id: business.id,
      lat: business.lat || business.location?.lat,
      lng: business.lng || business.location?.lng,
      type: 'business',
      title: business.name,
      preview: business.name
    }));

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center text-slate-400">Loading businesses...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-24 md:pb-8">
      {/* Header */}
      <div className="bg-gradient-to-br from-purple-900/30 via-slate-900 to-slate-900 px-4 py-10 border-b border-white/5">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center">
              <Store size={24} className="text-purple-400" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-white">Discover Local</h1>
              <p className="text-slate-400 text-sm">Downtown Greensboro businesses</p>
            </div>
          </div>

          {/* Search */}
          <div className="relative">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search businesses..."
              className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/25 transition"
            />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 space-y-6">
        {/* Category Filters */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Filter by Category</h3>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                selectedCategory === null
                  ? 'bg-purple-500 text-white'
                  : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white'
              }`}
            >
              All
            </button>
            {BUSINESS_CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                  selectedCategory === cat
                    ? 'bg-purple-500 text-white'
                    : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* View Toggle */}
        <div className="flex items-center gap-1 bg-white/5 rounded-lg p-1 w-fit">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-md transition ${
              viewMode === 'grid'
                ? 'bg-purple-500 text-white'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <List size={18} />
          </button>
          <button
            onClick={() => setViewMode('map')}
            className={`p-2 rounded-md transition ${
              viewMode === 'map'
                ? 'bg-purple-500 text-white'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Map size={18} />
          </button>
        </div>

        {/* Content */}
        {viewMode === 'map' ? (
          <div className="h-96 rounded-xl overflow-hidden border border-white/10">
            <MapView markers={markers} />
          </div>
        ) : filteredBusinesses.length === 0 ? (
          <div className="text-center py-16">
            <Store size={48} className="mx-auto text-slate-700 mb-4" />
            <p className="text-slate-400">No businesses found. Try adjusting your filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredBusinesses.map((business) => (
              <BusinessCard key={business.id} business={business} onOpenDetail={setSelectedBusiness} />
            ))}
          </div>
        )}
      </div>
      <BusinessDetail business={selectedBusiness} isOpen={!!selectedBusiness} onClose={() => setSelectedBusiness(null)} />
    </div>
  );
}
