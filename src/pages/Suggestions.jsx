import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { collection, query, onSnapshot, orderBy } from 'firebase/firestore';
import { db } from '../firebase-config';
import { useAuth } from '../hooks/useAuth';
import { SUGGESTION_CATEGORIES, SUGGESTION_STATUS } from '../constants';
import SuggestionCard from '../components/suggestions/SuggestionCard';

export default function Suggestions() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [sortBy, setSortBy] = useState('trending'); // 'trending' or 'newest'

  useEffect(() => {
    const q = query(collection(db, 'suggestions'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }));
      setSuggestions(data);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const filteredSuggestions = useMemo(() => {
    let filtered = [...suggestions];

    if (selectedCategory) {
      filtered = filtered.filter((s) => s.category === selectedCategory);
    }

    if (sortBy === 'trending') {
      filtered.sort((a, b) => (b.upvoteCount || 0) - (a.upvoteCount || 0));
    } else {
      filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    return filtered;
  }, [suggestions, selectedCategory, sortBy]);

  // Count stats
  const stats = {
    total: suggestions.length,
    inProgress: suggestions.filter((s) => s.status === 'In Progress').length,
    completed: suggestions.filter((s) => s.status === 'Completed').length
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="text-center text-slate-400">Loading suggestions...</div>
      </div>
    );
  }

  return (
    <div className="pt-16 pb-24 md:pb-8 space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 px-4 py-8 border-b border-slate-700">
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold text-white">How Can We Improve Downtown?</h1>
              <p className="text-slate-400">Share your ideas for making downtown Greensboro better</p>
            </div>
            {user && (
              <button
                onClick={() => navigate('/suggestion/new')}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold transition flex-shrink-0"
              >
                <Plus size={20} />
                Add Suggestion
              </button>
            )}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-700">
              <div className="text-2xl font-bold text-emerald-400">{stats.total}</div>
              <div className="text-sm text-slate-400">Suggestions</div>
            </div>
            <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-700">
              <div className="text-2xl font-bold text-purple-400">{stats.inProgress}</div>
              <div className="text-sm text-slate-400">In Progress</div>
            </div>
            <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-700">
              <div className="text-2xl font-bold text-green-400">{stats.completed}</div>
              <div className="text-sm text-slate-400">Completed</div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 space-y-6">
        {/* Filters */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-white">Filter by Category</h3>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                selectedCategory === null
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
            >
              All
            </button>
            {SUGGESTION_CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  selectedCategory === cat
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Sort */}
        <div className="flex items-center gap-4">
          <label className="text-slate-300">Sort by:</label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
          >
            <option value="trending">Most Popular</option>
            <option value="newest">Newest</option>
          </select>
        </div>

        {/* Grid */}
        {filteredSuggestions.length === 0 ? (
          <div className="text-center py-12 text-slate-400">
            <p>No suggestions yet. Be the first to share your ideas!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredSuggestions.map((suggestion) => (
              <SuggestionCard key={suggestion.id} suggestion={suggestion} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
