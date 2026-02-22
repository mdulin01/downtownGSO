import { Heart } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useUpvote } from '../../hooks/useUpvote';

export default function Upvote({ postId, showCount = true }) {
  const { user } = useAuth();
  const { upvoted, toggleUpvote, count } = useUpvote(postId, user?.uid || null);

  const handleToggle = async () => {
    if (!user) {
      alert('Please sign in to upvote');
      return;
    }
    try {
      await toggleUpvote();
    } catch (error) {
      console.error('Error toggling upvote:', error);
    }
  };

  return (
    <button
      onClick={handleToggle}
      className={`flex items-center gap-2 px-3 py-2 rounded-lg transition ${
        upvoted
          ? 'bg-red-900/30 text-red-400 hover:bg-red-900/50'
          : 'bg-slate-800 text-slate-400 hover:text-red-400 hover:bg-slate-700'
      }`}
    >
      <Heart size={18} fill={upvoted ? 'currentColor' : 'none'} />
      {showCount && <span className="text-sm font-medium">{count}</span>}
    </button>
  );
}
