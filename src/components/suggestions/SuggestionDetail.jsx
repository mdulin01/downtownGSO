import { useState } from 'react';
import { doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../../firebase-config';
import { useAuth } from '../../hooks/useAuth';
import { canEdit } from '../../utils/authUtils';
import { SUGGESTION_CATEGORIES, SUGGESTION_IMPACT, SUGGESTION_STATUS } from '../../constants';
import BaseModal from '../common/BaseModal';
import Upvote from '../common/Upvote';
import { MapPin, Pencil, Trash2, Save, X, Lightbulb } from 'lucide-react';

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

export default function SuggestionDetail({ suggestion, isOpen, onClose }) {
  const { user } = useAuth();
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({});

  if (!suggestion) return null;

  const userCanEdit = canEdit(user, suggestion);

  const startEdit = () => {
    setForm({
      title: suggestion.title || '',
      category: suggestion.category || '',
      impact: suggestion.impact || '',
      status: suggestion.status || 'New',
      problem: suggestion.problem || suggestion.description || '',
      suggestion: suggestion.suggestion || suggestion.improvement || '',
      location: typeof suggestion.location === 'string' ? suggestion.location : suggestion.location?.address || '',
      photoUrl: suggestion.photoUrl || '',
    });
    setEditing(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateDoc(doc(db, 'suggestions', suggestion.id), form);
      setEditing(false);
    } catch (err) {
      alert('Error saving: ' + err.message);
    }
    setSaving(false);
  };

  const handleDelete = async () => {
    if (!confirm('Delete this suggestion?')) return;
    try {
      await deleteDoc(doc(db, 'suggestions', suggestion.id));
      onClose();
    } catch (err) {
      alert('Error deleting: ' + err.message);
    }
  };

  const inputClass = 'w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-amber-500';

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} title={editing ? 'Edit Suggestion' : suggestion.title}>
      {editing ? (
        <div className="space-y-4">
          <div>
            <label className="text-xs text-slate-400 mb-1 block">Title</label>
            <input className={inputClass} value={form.title} onChange={e => setForm({...form, title: e.target.value})} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-slate-400 mb-1 block">Category</label>
              <select className={inputClass} value={form.category} onChange={e => setForm({...form, category: e.target.value})}>
                <option value="">Select...</option>
                {SUGGESTION_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1 block">Impact</label>
              <select className={inputClass} value={form.impact} onChange={e => setForm({...form, impact: e.target.value})}>
                <option value="">Select...</option>
                {SUGGESTION_IMPACT.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="text-xs text-slate-400 mb-1 block">Status</label>
            <select className={inputClass} value={form.status} onChange={e => setForm({...form, status: e.target.value})}>
              {SUGGESTION_STATUS.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs text-slate-400 mb-1 block">Problem</label>
            <textarea className={inputClass + ' h-24 resize-none'} value={form.problem} onChange={e => setForm({...form, problem: e.target.value})} placeholder="What's the issue?" />
          </div>
          <div>
            <label className="text-xs text-slate-400 mb-1 block">Suggestion</label>
            <textarea className={inputClass + ' h-24 resize-none'} value={form.suggestion} onChange={e => setForm({...form, suggestion: e.target.value})} placeholder="What's your idea?" />
          </div>
          <div>
            <label className="text-xs text-slate-400 mb-1 block">Location</label>
            <input className={inputClass} value={form.location} onChange={e => setForm({...form, location: e.target.value})} placeholder="Downtown GSO" />
          </div>
          <div>
            <label className="text-xs text-slate-400 mb-1 block">Photo URL</label>
            <input className={inputClass} value={form.photoUrl} onChange={e => setForm({...form, photoUrl: e.target.value})} placeholder="https://..." />
            {form.photoUrl && <img src={form.photoUrl} alt="Preview" className="mt-2 w-full h-32 object-cover rounded-lg" />}
          </div>
          <div className="flex gap-3 pt-2">
            <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-white rounded-lg font-medium text-sm transition disabled:opacity-50">
              <Save size={16} /> {saving ? 'Saving...' : 'Save'}
            </button>
            <button onClick={() => setEditing(false)} className="flex items-center gap-2 px-4 py-2 bg-slate-600 hover:bg-slate-500 text-white rounded-lg font-medium text-sm transition">
              <X size={16} /> Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {suggestion.photoUrl && (
            <img src={suggestion.photoUrl} alt={suggestion.title} className="w-full h-48 object-cover rounded-xl" />
          )}

          <div className="flex items-center gap-2 flex-wrap">
            {suggestion.category && <span className="px-3 py-1 bg-amber-500/20 text-amber-300 rounded-full text-xs font-medium">{suggestion.category}</span>}
            {suggestion.impact && <span className="px-3 py-1 bg-orange-500/20 text-orange-300 rounded-full text-xs font-medium">{suggestion.impact}</span>}
            {suggestion.status && <span className="px-3 py-1 bg-slate-600 text-slate-300 rounded-full text-xs font-medium">{suggestion.status}</span>}
            <span className="text-xs text-slate-500">{timeAgo(suggestion.createdAt)}</span>
          </div>

          {(suggestion.problem || suggestion.description) && (
            <div className="space-y-1">
              <h4 className="text-xs font-bold text-red-400 uppercase tracking-wider">Problem</h4>
              <p className="text-slate-300 text-sm leading-relaxed">{suggestion.problem || suggestion.description}</p>
            </div>
          )}

          {(suggestion.suggestion || suggestion.improvement) && (
            <div className="space-y-1">
              <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Suggestion</h4>
              <p className="text-slate-300 text-sm leading-relaxed">{suggestion.suggestion || suggestion.improvement}</p>
            </div>
          )}

          {suggestion.location && (
            <div className="flex items-center gap-2 text-slate-400 text-sm">
              <MapPin size={14} className="text-amber-400" />
              <span>{typeof suggestion.location === 'string' ? suggestion.location : suggestion.location.address || 'Downtown GSO'}</span>
            </div>
          )}

          <div className="flex items-center justify-between pt-3 border-t border-slate-700">
            <div className="flex items-center gap-2">
              {suggestion.authorAvatar ? (
                <img src={suggestion.authorAvatar} alt="" className="w-7 h-7 rounded-full" />
              ) : (
                <div className="w-7 h-7 rounded-full bg-amber-600/30 flex items-center justify-center">
                  <span className="text-xs font-bold text-amber-400">{(suggestion.authorName || 'U').charAt(0)}</span>
                </div>
              )}
              <span className="text-sm text-slate-400">{suggestion.authorName}</span>
            </div>
            <Upvote postId={suggestion.id} />
          </div>

          {userCanEdit && (
            <div className="flex gap-3 pt-3 border-t border-slate-700">
              <button onClick={startEdit} className="flex items-center gap-2 px-4 py-2 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 rounded-lg text-sm font-medium transition">
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
