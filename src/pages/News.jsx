import { useState, useEffect } from 'react';
import { Newspaper, ExternalLink, Clock, MessageCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp, doc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase-config';
import { useAuth } from '../hooks/useAuth';
import { canEdit } from '../utils/authUtils';
import Reactions from '../components/common/Reactions';
import ShareButton from '../components/common/ShareButton';
import { Send, Trash2, Loader2 } from 'lucide-react';

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

function NewsComments({ articleId }) {
  const { user } = useAuth();
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [text, setText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const q = query(
      collection(db, 'news', articleId, 'comments'),
      orderBy('createdAt', 'desc')
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setComments(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
      setLoading(false);
    });
    return unsubscribe;
  }, [articleId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim() || submitting || !user) return;
    setSubmitting(true);
    try {
      await addDoc(collection(db, 'news', articleId, 'comments'), {
        text: text.trim(),
        authorId: user.uid,
        authorName: user.displayName,
        authorAvatar: user.photoURL,
        createdAt: serverTimestamp(),
      });
      setText('');
      setExpanded(true);
    } catch (err) {
      console.error('Failed to add comment:', err);
    }
    setSubmitting(false);
  };

  const handleDelete = async (commentId) => {
    if (!confirm('Delete this comment?')) return;
    try {
      await deleteDoc(doc(db, 'news', articleId, 'comments', commentId));
    } catch (err) {
      console.error('Failed to delete:', err);
    }
  };

  const visibleComments = expanded ? comments : comments.slice(0, 2);

  return (
    <div className="border-t border-white/5 pt-4 mt-4 space-y-3">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-2 text-sm text-slate-400 hover:text-slate-300 transition"
      >
        <MessageCircle size={15} />
        <span>{comments.length} comment{comments.length !== 1 ? 's' : ''}</span>
        {comments.length > 2 && (
          expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />
        )}
      </button>

      {!loading && visibleComments.length > 0 && (
        <div className="space-y-2.5 pl-1">
          {visibleComments.map((comment) => (
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
                    >
                      <Trash2 size={12} className="text-slate-600 hover:text-red-400" />
                    </button>
                  )}
                </div>
                <p className="text-sm text-slate-400 leading-relaxed">{comment.text}</p>
              </div>
            </div>
          ))}
          {!expanded && comments.length > 2 && (
            <button
              onClick={() => setExpanded(true)}
              className="text-xs text-emerald-400 hover:text-emerald-300 transition pl-8"
            >
              Show {comments.length - 2} more
            </button>
          )}
        </div>
      )}

      {/* Comment input */}
      {user ? (
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Share your thoughts..."
            maxLength={500}
            className="flex-1 bg-slate-800/50 border border-white/5 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/50 transition"
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
        <p className="text-xs text-slate-500 text-center py-1">Sign in to join the conversation</p>
      )}
    </div>
  );
}

export default function News() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'news'), orderBy('publishedAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setArticles(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const formatDate = (timestamp) => {
    if (!timestamp) return '';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="w-full pb-24 md:pb-8">
      <div className="max-w-4xl mx-auto px-4 pt-24 md:pt-24">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
            <Newspaper size={20} className="text-blue-400" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-white">Downtown News</h1>
            <p className="text-sm text-slate-400">Updates from downtown Greensboro — react and discuss</p>
          </div>
        </div>

        {articles.length === 0 ? (
          <div className="text-center py-16">
            <Newspaper size={48} className="text-slate-600 mx-auto mb-4" />
            <p className="text-slate-400">No news articles yet</p>
          </div>
        ) : (
          <div className="space-y-6">
            {articles.map((article) => (
              <article
                key={article.id}
                className="bg-slate-900/50 border border-white/5 rounded-xl overflow-hidden hover:border-white/10 transition"
              >
                {article.imageUrl && (
                  <div className="aspect-[3/1] overflow-hidden">
                    <img
                      src={article.imageUrl}
                      alt={article.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="p-5 space-y-3">
                  <div className="flex items-center gap-3 text-xs text-slate-400">
                    <span className="px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 font-medium">
                      {article.category || 'News'}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock size={12} />
                      {formatDate(article.publishedAt)}
                    </span>
                    {article.source && (
                      <span className="text-slate-500">via {article.source}</span>
                    )}
                  </div>
                  <h2 className="text-lg font-bold text-white leading-snug">{article.title}</h2>
                  <p className="text-slate-300 text-sm leading-relaxed">{article.summary}</p>

                  <div className="flex items-center justify-between pt-2">
                    {article.sourceUrl && (
                      <a
                        href={article.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-sm text-emerald-400 hover:text-emerald-300 font-medium transition"
                      >
                        Read full article <ExternalLink size={14} />
                      </a>
                    )}
                    <ShareButton
                      title={article.title}
                      text={article.summary}
                      url={`${window.location.origin}/news`}
                    />
                  </div>

                  {/* Reactions */}
                  <div className="pt-2">
                    <Reactions collectionName="news" itemId={article.id} />
                  </div>

                  {/* Comments */}
                  <NewsComments articleId={article.id} />
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
