import { useState, useEffect, useRef } from 'react';
import { Newspaper, ExternalLink, Clock, MessageCircle, ChevronDown, ChevronUp, Pencil, X, ImagePlus, Plus, Trash2 as TrashIcon } from 'lucide-react';
import { collection, query, orderBy, onSnapshot, addDoc, updateDoc, deleteDoc, serverTimestamp, doc, Timestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../firebase-config';
import { useAuth } from '../hooks/useAuth';
import { isAdmin, canEdit } from '../utils/authUtils';
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

// ─── News Comments ───────────────────────────────────────────────

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

// ─── Article Edit Form ───────────────────────────────────────────

function ArticleEditForm({ article, onClose }) {
  const [form, setForm] = useState({
    title: article.title || '',
    summary: article.summary || '',
    category: article.category || '',
    source: article.source || '',
    sourceUrl: article.sourceUrl || '',
    imageUrl: article.imageUrl || '',
  });
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [imagePreview, setImagePreview] = useState(article.imageUrl || '');
  const fileInputRef = useRef(null);

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Preview immediately
    const reader = new FileReader();
    reader.onload = (ev) => setImagePreview(ev.target.result);
    reader.readAsDataURL(file);

    setUploading(true);
    try {
      const ext = file.name.split('.').pop();
      const storageRef = ref(storage, `news/${article.id}_${Date.now()}.${ext}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      setForm((f) => ({ ...f, imageUrl: url }));
      setImagePreview(url);
    } catch (err) {
      console.error('Upload failed:', err);
      alert('Image upload failed. Check Firebase Storage rules.');
    }
    setUploading(false);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateDoc(doc(db, 'news', article.id), {
        title: form.title.trim(),
        summary: form.summary.trim(),
        category: form.category.trim(),
        source: form.source.trim(),
        sourceUrl: form.sourceUrl.trim(),
        imageUrl: form.imageUrl.trim(),
        updatedAt: serverTimestamp(),
      });
      onClose();
    } catch (err) {
      console.error('Save failed:', err);
      alert('Save failed: ' + err.message);
    }
    setSaving(false);
  };

  return (
    <div className="bg-slate-900/80 border border-emerald-500/30 rounded-xl overflow-hidden">
      {/* Image section */}
      <div className="relative">
        {imagePreview ? (
          <div className="aspect-[3/1] overflow-hidden relative group">
            <img src={imagePreview} alt="" className="w-full h-full object-cover" />
            <div
              className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="flex items-center gap-2 text-white text-sm font-medium">
                <ImagePlus size={18} />
                Change Image
              </div>
            </div>
          </div>
        ) : (
          <div
            onClick={() => fileInputRef.current?.click()}
            className="aspect-[3/1] bg-slate-800 border-b border-white/5 flex items-center justify-center cursor-pointer hover:bg-slate-700 transition"
          >
            <div className="text-center text-slate-400">
              <ImagePlus size={32} className="mx-auto mb-2" />
              <span className="text-sm">Click to add an image</span>
            </div>
          </div>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="hidden"
        />
        {uploading && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <Loader2 size={24} className="animate-spin text-emerald-400" />
          </div>
        )}
      </div>

      <div className="p-5 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-emerald-400 uppercase tracking-wider">Editing Article</span>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition">
            <X size={18} />
          </button>
        </div>

        {/* Image URL (manual fallback) */}
        <div>
          <label className="block text-xs text-slate-500 mb-1">Image URL (or upload above)</label>
          <input
            type="url"
            value={form.imageUrl}
            onChange={(e) => { setForm({ ...form, imageUrl: e.target.value }); setImagePreview(e.target.value); }}
            placeholder="https://..."
            className="w-full bg-slate-800 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
          />
        </div>

        {/* Title */}
        <div>
          <label className="block text-xs text-slate-500 mb-1">Title</label>
          <input
            type="text"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="w-full bg-slate-800 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
          />
        </div>

        {/* Summary */}
        <div>
          <label className="block text-xs text-slate-500 mb-1">Summary</label>
          <textarea
            value={form.summary}
            onChange={(e) => setForm({ ...form, summary: e.target.value })}
            rows={4}
            className="w-full bg-slate-800 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 resize-none"
          />
        </div>

        {/* Category + Source row */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs text-slate-500 mb-1">Category</label>
            <input
              type="text"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              placeholder="Development, Business, etc."
              className="w-full bg-slate-800 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>
          <div>
            <label className="block text-xs text-slate-500 mb-1">Source</label>
            <input
              type="text"
              value={form.source}
              onChange={(e) => setForm({ ...form, source: e.target.value })}
              placeholder="FOX8, WFMY, etc."
              className="w-full bg-slate-800 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>

        {/* Source URL */}
        <div>
          <label className="block text-xs text-slate-500 mb-1">Source URL</label>
          <input
            type="url"
            value={form.sourceUrl}
            onChange={(e) => setForm({ ...form, sourceUrl: e.target.value })}
            placeholder="https://..."
            className="w-full bg-slate-800 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
          />
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-slate-400 hover:text-white transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving || uploading || !form.title.trim()}
            className="px-5 py-2 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-white rounded-lg text-sm font-medium transition"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── New Article Form ────────────────────────────────────────────

function NewArticleForm({ onClose }) {
  const [form, setForm] = useState({
    title: '', summary: '', category: 'News', source: '', sourceUrl: '', imageUrl: '',
  });
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [imagePreview, setImagePreview] = useState('');
  const fileInputRef = useRef(null);

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setImagePreview(ev.target.result);
    reader.readAsDataURL(file);
    setUploading(true);
    try {
      const ext = file.name.split('.').pop();
      const storageRef = ref(storage, `news/new_${Date.now()}.${ext}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      setForm((f) => ({ ...f, imageUrl: url }));
      setImagePreview(url);
    } catch (err) {
      console.error('Upload failed:', err);
      alert('Image upload failed. Check Firebase Storage rules.');
    }
    setUploading(false);
  };

  const handleCreate = async () => {
    if (!form.title.trim()) return;
    setSaving(true);
    try {
      await addDoc(collection(db, 'news'), {
        title: form.title.trim(),
        summary: form.summary.trim(),
        category: form.category.trim() || 'News',
        source: form.source.trim(),
        sourceUrl: form.sourceUrl.trim(),
        imageUrl: form.imageUrl.trim(),
        publishedAt: Timestamp.now(),
      });
      onClose();
    } catch (err) {
      console.error('Create failed:', err);
      alert('Failed to create article: ' + err.message);
    }
    setSaving(false);
  };

  return (
    <div className="bg-slate-900/80 border border-emerald-500/30 rounded-xl overflow-hidden">
      {/* Image upload area */}
      <div className="relative">
        {imagePreview ? (
          <div className="aspect-[3/1] overflow-hidden relative group">
            <img src={imagePreview} alt="" className="w-full h-full object-cover" />
            <div
              className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="flex items-center gap-2 text-white text-sm font-medium">
                <ImagePlus size={18} /> Change Image
              </div>
            </div>
          </div>
        ) : (
          <div
            onClick={() => fileInputRef.current?.click()}
            className="aspect-[3/1] bg-slate-800 border-b border-white/5 flex items-center justify-center cursor-pointer hover:bg-slate-700 transition"
          >
            <div className="text-center text-slate-400">
              <ImagePlus size={32} className="mx-auto mb-2" />
              <span className="text-sm">Click to add an image</span>
            </div>
          </div>
        )}
        <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
        {uploading && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <Loader2 size={24} className="animate-spin text-emerald-400" />
          </div>
        )}
      </div>

      <div className="p-5 space-y-4">
        <span className="text-xs font-medium text-emerald-400 uppercase tracking-wider">New Article</span>

        <div>
          <label className="block text-xs text-slate-500 mb-1">Title *</label>
          <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder="Article headline" className="w-full bg-slate-800 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500" />
        </div>
        <div>
          <label className="block text-xs text-slate-500 mb-1">Summary</label>
          <textarea value={form.summary} onChange={(e) => setForm({ ...form, summary: e.target.value })}
            rows={4} placeholder="Brief summary of the article..."
            className="w-full bg-slate-800 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 resize-none" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs text-slate-500 mb-1">Category</label>
            <input type="text" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}
              placeholder="Development, Business..." className="w-full bg-slate-800 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500" />
          </div>
          <div>
            <label className="block text-xs text-slate-500 mb-1">Source</label>
            <input type="text" value={form.source} onChange={(e) => setForm({ ...form, source: e.target.value })}
              placeholder="FOX8, WFMY..." className="w-full bg-slate-800 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500" />
          </div>
        </div>
        <div>
          <label className="block text-xs text-slate-500 mb-1">Source URL</label>
          <input type="url" value={form.sourceUrl} onChange={(e) => setForm({ ...form, sourceUrl: e.target.value })}
            placeholder="https://..." className="w-full bg-slate-800 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500" />
        </div>
        <div>
          <label className="block text-xs text-slate-500 mb-1">Image URL (or upload above)</label>
          <input type="url" value={form.imageUrl} onChange={(e) => { setForm({ ...form, imageUrl: e.target.value }); setImagePreview(e.target.value); }}
            placeholder="https://..." className="w-full bg-slate-800 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500" />
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <button onClick={onClose} className="px-4 py-2 text-sm text-slate-400 hover:text-white transition">Cancel</button>
          <button onClick={handleCreate} disabled={saving || uploading || !form.title.trim()}
            className="px-5 py-2 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-white rounded-lg text-sm font-medium transition">
            {saving ? 'Publishing...' : 'Publish Article'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main News Page ──────────────────────────────────────────────

export default function News() {
  const { user } = useAuth();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [showNewForm, setShowNewForm] = useState(false);
  const admin = isAdmin(user);

  useEffect(() => {
    const q = query(collection(db, 'news'), orderBy('publishedAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setArticles(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const handleDeleteArticle = async (articleId, title) => {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;
    try {
      await deleteDoc(doc(db, 'news', articleId));
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

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
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
              <Newspaper size={20} className="text-blue-400" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-white">Downtown News</h1>
              <p className="text-sm text-slate-400">Updates from downtown Greensboro — react and discuss</p>
            </div>
          </div>
          {admin && (
            <button
              onClick={() => { setShowNewForm(!showNewForm); setEditingId(null); }}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-white rounded-lg font-medium transition text-sm"
            >
              {showNewForm ? <X size={16} /> : <Plus size={16} />}
              {showNewForm ? 'Cancel' : 'New Article'}
            </button>
          )}
        </div>

        {/* New article form */}
        {showNewForm && (
          <div className="mb-6">
            <NewArticleForm onClose={() => setShowNewForm(false)} />
          </div>
        )}

        {articles.length === 0 ? (
          <div className="text-center py-16">
            <Newspaper size={48} className="text-slate-600 mx-auto mb-4" />
            <p className="text-slate-400">No news articles yet</p>
          </div>
        ) : (
          <div className="space-y-6">
            {articles.map((article) => (
              editingId === article.id ? (
                <ArticleEditForm
                  key={article.id}
                  article={article}
                  onClose={() => setEditingId(null)}
                />
              ) : (
                <article
                  key={article.id}
                  className="bg-slate-900/50 border border-white/5 rounded-xl overflow-hidden hover:border-white/10 transition group/article"
                >
                  {article.imageUrl && (
                    <div className="aspect-[3/1] overflow-hidden relative">
                      <img
                        src={article.imageUrl}
                        alt={article.title}
                        className="w-full h-full object-cover"
                      />
                      {admin && (
                        <button
                          onClick={() => { setEditingId(article.id); setShowNewForm(false); }}
                          className="absolute top-3 right-3 p-2 bg-black/60 hover:bg-black/80 text-white rounded-lg opacity-0 group-hover/article:opacity-100 transition"
                          title="Edit article"
                        >
                          <Pencil size={14} />
                        </button>
                      )}
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
                      {/* Admin controls */}
                      {admin && (
                        <div className="ml-auto flex items-center gap-2 opacity-0 group-hover/article:opacity-100 transition">
                          <button
                            onClick={() => { setEditingId(article.id); setShowNewForm(false); }}
                            className="flex items-center gap-1 text-emerald-400 hover:text-emerald-300 transition"
                            title="Edit"
                          >
                            <Pencil size={12} /> Edit
                          </button>
                          <button
                            onClick={() => handleDeleteArticle(article.id, article.title)}
                            className="flex items-center gap-1 text-red-400 hover:text-red-300 transition"
                            title="Delete"
                          >
                            <TrashIcon size={12} /> Delete
                          </button>
                        </div>
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
              )
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
