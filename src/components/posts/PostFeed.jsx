import { useState, useMemo } from 'react';
import { usePosts } from '../../hooks/usePosts';
import { POST_CATEGORIES } from '../../constants';
import PostCard from './PostCard';

export default function PostFeed() {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [sortBy, setSortBy] = useState('recent'); // 'recent' or 'trending'

  const { posts, loading } = usePosts(
    selectedCategory ? { category: selectedCategory } : {}
  );

  const sortedPosts = useMemo(() => {
    const sorted = [...posts];
    if (sortBy === 'trending') {
      sorted.sort((a, b) => (b.upvoteCount || 0) - (a.upvoteCount || 0));
    }
    return sorted;
  }, [posts, sortBy]);

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="text-center text-slate-400">Loading posts...</div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 pb-24 md:pb-8 space-y-8">
      {/* Filters */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-white">Filter by Category</h2>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              selectedCategory === null
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
          >
            All
          </button>
          {POST_CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                selectedCategory === cat
                  ? 'bg-emerald-600 text-white'
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
          className="px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-emerald-500"
        >
          <option value="recent">Recent</option>
          <option value="trending">Trending (Most Upvotes)</option>
        </select>
      </div>

      {/* Posts Grid */}
      {sortedPosts.length === 0 ? (
        <div className="text-center py-12 text-slate-400">
          <p>No posts yet. Be the first to share something!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sortedPosts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}
