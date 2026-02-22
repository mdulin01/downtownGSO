import { useState } from 'react';
import { doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../../firebase-config';
import { useAuth } from '../../hooks/useAuth';
import { canEdit } from '../../utils/authUtils';
import { POST_CATEGORIES } from '../../constants';
import BaseModal from '../common/BaseModal';
import Upvote from '../common/Upvote';
import VideoEmbed from '../common/VideoEmbed';
import { MapPin, MessageCircle, Pencil, Trash2, Save, X, Newspaper } from 'lucide-react';

function timeAgo(date) {
  if (!date) return '';
  const d = date.toDate ? date.toDate() : date.seconds ? new Date(date.seconds * 1000) : new Date(date);
  const seconds = Math.floor((new Date() - d) / 1000);
  const intervals = { year: 31536000, month: 2592000, week: 604800, day: 86400, hour: 3600, minute: 60 };
  for (const [key, value] of Object.entries(intervals)) {
    const interval = Math.floor(seconds / value);
    if (interval >= 1) return `${interval} ${key}${interval > 1 ? 's' : ''} ago`;
  }
  return 'just now';
}

export default function PostDetail({ post, isOpen, onClose }) {
  const { user } = useAuth();
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({});

  if (!post) return null;

  const userCanEdit = canEdit(user, post);

  const startEdit = () => {
    setForm({
      title: post.title || '',
      description: post.description || '',
      category: post.category || '',
      imageUrl: post.imageUrl || '',
      videoUrl: post.videoUrl || '',
      location: typeof post.location === 'string' ? post.location : post.location?.address || '',
    });
    setEditing(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateDoc(doc(db, 'posts', post.id), form);
      setEditing(false);
    } catch (err) {
      alert('Error saving: ' + err.message);
    }
    setSaving(false);
  };

  const handleDelete = async () => {
    if (!confirm('Delete this post?')) return;
    try {
      await deleteDoc(doc(db, 'posts', post.id));
      onClose();
    } catch (err) {
      alert('Error deleting: ' + err.message);
    }
  };

  const inputClass = 'w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-emerald-500';

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} title={editing ? 'Edit Post' : post.title}>
      {editing ? (
        <div className="space-y-4">
          <div>
            <label className="text-xs text-slate-400 mb-1 block">Title</label>
            <input className={inputClass} value={form.title} onChange={e => setForm({...form, title: e.target.value})} />
          </div>
          <div>
            <label className="text-xs text-slate-400 mb-1 block">Category</label>
            <select className={inputClass} value={form.category} onChange={e => setForm({...form, category: e.target.value})}>
              <option value="">Select...</option>
              {POST_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs text-slate-400 mb-1 block">Description</label>
            <textarea className={inputClass + ' h-32 resize-none'} value={form.description} onChange={e => setForm({...form, description: e.target.value})} />
          </div>
          <div>
            <label className="text-xs text-slate-400 mb-1 block">Image URL</label>
            <input className={inputClass} value={form.imageUrl} onChange={e => setForm({...form, imageUrl: e.target.value})} placeholder="https://..." />
            {form.imageUrl && <img src={form.imageUrl} alt="Preview" className="mt-2 w-full h-32 object-cover rounded-lg" />}
          </div>
          <div>
            <label className="text-xs text-slate-400 mb-1 block">Video URL</label>
            <input className={inputClass} value={form.videoUrl} onChange={e => setForm({...form, videoUrl: e.target.value})} placeholder="YouTube or TikTok URL" />
          </div>
          <div>
            <label className="text-xs text-slate-400 mb-1 block">Location</label>
            <input className={inputClass} value={form.location} onChange={e => setForm({...form, location: e.target.value})} placeholder="Downtown GSO" />
          </div>
          <div className="flex gap-3 pt-2">
            <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-white rounded-lg font-medium text-sm transition disabled:opacity-50">
              <Save size={16} /> {saving ? 'Saving...' : 'Save'}
            </button>
            <button onClick={() => setEditing(false)} className="flex items-center gap-2 px-4 py-2 bg-slate-600 hover:bg-slate-500 text-white rounded-lg font-medium text-sm transition">
              <X size={16} /> Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {post.imageUrl ? (
            <img src={post.imageUrl} alt={post.title} className="w-full h-48 object-cover rounded-xl" />
          ) : post.videoUrl ? (
            <div className="w-full h-48 rounded-xl overflow-hidden bg-black">
              <VideoEmbed url={post.videoUrl} />
            </div>
          ) : (
            <div className="w-full h-24 bg-gradient-to-br from-emerald-600/30 to-green-600/10 rounded-xl flex items-center justify-center">
              <Newspaper size={28} className="text-white/20" />
            </div>
          )}

          <div className="flex items-center gap-3">
            {post.category && <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 rounded-full text-xs font-medium">{post.category}</span>}
            <span className="text-xs text-slate-500">{timeAgo(post.createdAt)}</span>
          </div>

          {post.description && <p className="text-slate-300 text-sm leading-relaxed">{post.description}</p>}

          {post.location && (
            <div className="flex items-center gap-2 text-slate-400 text-sm">
              <MapPin size={14} className="text-emerald-400" />
              <span>{typeof post.location === 'string' ? post.location : post.location.address || 'Downtown GSO'}</span>
            </div>
          )}

          <div className="flex items-center justify-between pt-3 border-t border-slate-700">
            <div className="flex items-center gap-2">
              {post.authorAvatar ? (
                <img src={post.authorAvatar} alt="" className="w-7 h-7 rounded-full" />
              ) : (
                <div className="w-7 h-7 rounded-full bg-emerald-600/30 flex items-center justify-center">
                  <span className="text-xs font-bold text-emerald-400">{(post.authorName || 'U').charAt(0)}</span>
                </div>
              )}
              <span className="text-sm text-slate-400">{post.authorName}</span>
            </div>
            <div className="flex items-center gap-3">
              <Upvote postId={post.id} />
              <div className="flex items-center gap-1 text-slate-500 text-sm">
                <MessageCircle size={14} />
                <span>{post.commentCount || 0}</span>
              </div>
            </div>
          </div>

          {userCanEdit && (
            <div className="flex gap-3 pt-3 border-t border-slate-700">
              <button onClick={startEdit} className="flex items-center gap-2 px-4 py-2 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 rounded-lg text-sm font-medium transition">
                <Pencil size={14} /> Edit
              </button>
              <button onClick={handleDelete} className="flex items-center gap-2 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg text-sm font-medium transition">
                <Trash2 size={14} /> Delete
              </button>
            </div>
          )}
        </div>
      )}
    </BaseModal>
  );
}
