import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Lightbulb, TrendingUp, Clock } from 'lucide-react';
import { collection, query, onSnapshot, orderBy } from 'firebase/firestore';
import { db } from '../firebase-config';
import { useAuth } from '../hooks/useAuth';
import { SUGGESTION_CATEGORIES } from '../constants';
import SuggestionCard from '../components/suggestions/SuggestionCard';
import SuggestionDetail from '../components/suggestions/SuggestionDetail';

export default function Suggestions() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [sortBy, setSortBy] = useState('trending');
  const [selectedSuggestion, setSelectedSuggestion] = useState(null);

  useEffect(() => {
    const q = query(collection(db, 'suggestions'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setSuggestions(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
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
    <div className="pt-16 pb-24 md:pb-8">
      {/* Header */}
      <div className="bg-gradient-to-br from-amber-900/30 via-slate-900 to-slate-900 px-4 py-10 border-b border-white/5">
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center">
                <Lightbulb size={24} className="text-amber-400" />
              </div>
              <div>
                <h1 className="text-3xl font-black text-white">Ideas for Downtown</h1>
                <p className="text-slate-400 text-sm">Share and upvote ideas for making downtown Greensboro better</p>
              </div>
            </div>
            {user && (
              <button
                onClick={() => navigate('/suggestion/new')}
                className="flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-white rounded-lg font-bold transition text-sm shadow-lg shadow-amber-500/20 flex-shrink-0"
              >
                <Plus size={16} />
                Add Suggestion
              </button>
            )}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-white/5 rounded-xl p-4 border border-white/5">
              <div className="text-2xl font-black text-amber-400">{stats.total}</div>
              <div className="text-xs text-slate-400 mt-1">Suggestions</div>
            </div>
            <div className="bg-white/5 rounded-xl p-4 border border-white/5">
              <div className="text-2xl font-black text-purple-400">{stats.inProgress}</div>
              <div className="text-xs text-slate-400 mt-1">In Progress</div>
            </div>
            <div className="bg-white/5 rounded-xl p-4 border border-white/5">
              <div className="text-2xl font-black text-emerald-400">{stats.completed}</div>
              <div className="text-xs text-slate-400 mt-1">Completed</div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
        {/* Filters */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Filter by Category</h3>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                selectedCategory === null
                  ? 'bg-amber-500 text-white'
                  : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white'
              }`}
            >
              All
            </button>
            {SUGGESTION_CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                  selectedCategory === cat
                    ? 'bg-amber-500 text-white'
                    : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Sort */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSortBy('trending')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition ${
              sortBy === 'trending'
                ? 'bg-white/10 text-white'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <TrendingUp size={14} />
            Most Popular
          </button>
          <button
            onClick={() => setSortBy('newest')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition ${
              sortBy === 'newest'
                ? 'bg-white/10 text-white'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Clock size={14} />
            Newest
          </button>
        </div>

        {/* Grid */}
        {filteredSuggestions.length === 0 ? (
          <div className="text-center py-16">
            <Lightbulb size={48} className="mx-auto text-slate-700 mb-4" />
            <p className="text-slate-400">No suggestions yet. Be the first to share your ideas!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredSuggestions.map((suggestion) => (
              <SuggestionCard key={suggestion.id} suggestion={suggestion} onOpenDetail={setSelectedSuggestion} />
            ))}
          </div>
        )}
      </div>
      <SuggestionDetail suggestion={selectedSuggestion} isOpen={!!selectedSuggestion} onClose={() => setSelectedSuggestion(null)} />
    </div>
  );
}
