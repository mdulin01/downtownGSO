import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useComments } from '../../hooks/useComments';
import { canEdit } from '../../utils/authUtils';
import { MessageCircle, Send, Trash2, Loader2 } from 'lucide-react';

function timeAgo(date) {
  if (!date) return '';
  const d = date.toDate ? date.toDate() : date.seconds ? new Date(date.seconds * 1000) : new Date(date);
  const seconds = Math.floor((new Date() - d) / 1000);
  if (seconds < 60) return 'just now';
  const intervals = { year: 31536000, month: 2592000, week: 604800, day: 86400, hour: 3600, minute: 60 };
  for (const [key, value] of Object.entries(intervals)) {
    const interval = Math.floor(seconds / value);
    if (interval >= 1) return `${interval}${key.charAt(0)} ago`;
  }
  return 'just now';
}

export default function CommentsSection({ postId }) {
  const { user } = useAuth();
  const { comments, loading, addComment, deleteComment } = useComments(postId);
  const [text, setText] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim() || submitting) return;

    setSubmitting(true);
    try {
      await addComment(user, text);
      setText('');
    } catch (err) {
      console.error('Failed to add comment:', err);
    }
    setSubmitting(false);
  };

  const handleDelete = async (commentId) => {
    if (!confirm('Delete this comment?')) return;
    try {
      await deleteComment(commentId);
    } catch (err) {
      console.error('Failed to delete comment:', err);
    }
  };

  return (
    <div className="border-t border-slate-700 pt-4 mt-4">
      <div className="flex items-center gap-2 mb-3">
        <MessageCircle size={16} className="text-slate-400" />
        <span className="text-sm font-medium text-slate-300">
          {comments.length === 0 ? 'No comments yet' : `${comments.length} comment${comments.length !== 1 ? 's' : ''}`}
        </span>
      </div>

      {/* Comments list */}
      {loading ? (
        <div className="flex items-center justify-center py-4">
          <Loader2 size={18} className="animate-spin text-slate-500" />
        </div>
      ) : (
        <div className="space-y-3 max-h-64 overflow-y-auto">
          {comments.map((comment) => (
            <div key={comment.id} className="flex gap-2.5 group">
              {comment.authorAvatar ? (
                <img src={comment.authorAvatar} alt="" className="w-6 h-6 rounded-full flex-shrink-0 mt-0.5" />
              ) : (
                <div className="w-6 h-6 rounded-full bg-emerald-600/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-[10px] font-bold text-emerald-400">{(comment.authorName || 'U').charAt(0)}</span>
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-2">
                  <span className="text-xs font-medium text-slate-300">{comment.authorName}</span>
                  <span className="text-[10px] text-slate-600">{timeAgo(comment.createdAt)}</span>
                  {user && (comment.authorId === user.uid || canEdit(user, comment)) && (
                    <button
                      onClick={() => handleDelete(comment.id)}
                      className="opacity-0 group-hover:opacity-100 transition ml-auto"
                      title="Delete comment"
                    >
                      <Trash2 size={12} className="text-slate-600 hover:text-red-400" />
                    </button>
                  )}
                </div>
                <p className="text-sm text-slate-400 leading-relaxed break-words">{comment.text}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Comment input */}
      {user ? (
        <form onSubmit={handleSubmit} className="mt-3 flex gap-2">
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Add a comment..."
            maxLength={500}
            className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition"
          />
          <button
            type="submit"
            disabled={!text.trim() || submitting}
            className="px-3 py-2 bg-emerald-500 hover:bg-emerald-400 disabled:bg-slate-700 disabled:text-slate-500 text-white rounded-lg transition"
          >
            {submitting ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
          </button>
        </form>
      ) : (
        <p className="mt-3 text-xs text-slate-500 text-center py-2">Sign in to join the conversation</p>
      )}
    </div>
  );
}
