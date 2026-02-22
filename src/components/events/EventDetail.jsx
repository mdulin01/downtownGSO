import { useState } from 'react';
import { doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../../firebase-config';
import { useAuth } from '../../hooks/useAuth';
import { isAdmin } from '../../utils/authUtils';
import BaseModal from '../common/BaseModal';
import { MapPin, Clock, Calendar, ExternalLink, Pencil, Trash2, Save, X } from 'lucide-react';

function toDate(val) {
  if (!val) return null;
  if (val.toDate) return val.toDate();
  if (val.seconds) return new Date(val.seconds * 1000);
  return new Date(val);
}

function formatDateTime(date) {
  const d = toDate(date);
  if (!d || isNaN(d)) return '';
  return d.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit'
  });
}

function toInputDatetime(val) {
  const d = toDate(val);
  if (!d || isNaN(d)) return '';
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export default function EventDetail({ event, isOpen, onClose }) {
  const { user } = useAuth();
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({});

  if (!event) return null;

  const canEditEvent = isAdmin(user);

  const startEdit = () => {
    setForm({
      title: event.title || '',
      description: event.description || '',
      date: toInputDatetime(event.date),
      location: typeof event.location === 'string' ? event.location : event.location?.address || '',
      imageUrl: event.imageUrl || '',
      link: event.link || '',
    });
    setEditing(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const updates = { ...form };
      if (form.date) {
        updates.date = new Date(form.date);
      }
      await updateDoc(doc(db, 'events', event.id), updates);
      setEditing(false);
    } catch (err) {
      alert('Error saving: ' + err.message);
    }
    setSaving(false);
  };

  const handleDelete = async () => {
    if (!confirm('Delete this event?')) return;
    try {
      await deleteDoc(doc(db, 'events', event.id));
      onClose();
    } catch (err) {
      alert('Error deleting: ' + err.message);
    }
  };

  const inputClass = 'w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-pink-500';

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} title={editing ? 'Edit Event' : event.title}>
      {editing ? (
        <div className="space-y-4">
          <div>
            <label className="text-xs text-slate-400 mb-1 block">Title</label>
            <input className={inputClass} value={form.title} onChange={e => setForm({...form, title: e.target.value})} />
          </div>
          <div>
            <label className="text-xs text-slate-400 mb-1 block">Date & Time</label>
            <input type="datetime-local" className={inputClass} value={form.date} onChange={e => setForm({...form, date: e.target.value})} />
          </div>
          <div>
            <label className="text-xs text-slate-400 mb-1 block">Description</label>
            <textarea className={inputClass + ' h-32 resize-none'} value={form.description} onChange={e => setForm({...form, description: e.target.value})} />
          </div>
          <div>
            <label className="text-xs text-slate-400 mb-1 block">Location</label>
            <input className={inputClass} value={form.location} onChange={e => setForm({...form, location: e.target.value})} placeholder="Downtown GSO" />
          </div>
          <div>
            <label className="text-xs text-slate-400 mb-1 block">Image URL</label>
            <input className={inputClass} value={form.imageUrl} onChange={e => setForm({...form, imageUrl: e.target.value})} placeholder="https://..." />
            {form.imageUrl && <img src={form.imageUrl} alt="Preview" className="mt-2 w-full h-32 object-cover rounded-lg" />}
          </div>
          <div>
            <label className="text-xs text-slate-400 mb-1 block">External Link</label>
            <input className={inputClass} value={form.link} onChange={e => setForm({...form, link: e.target.value})} placeholder="https://..." />
          </div>
          <div className="flex gap-3 pt-2">
            <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 px-4 py-2 bg-pink-500 hover:bg-pink-400 text-white rounded-lg font-medium text-sm transition disabled:opacity-50">
              <Save size={16} /> {saving ? 'Saving...' : 'Save'}
            </button>
            <button onClick={() => setEditing(false)} className="flex items-center gap-2 px-4 py-2 bg-slate-600 hover:bg-slate-500 text-white rounded-lg font-medium text-sm transition">
              <X size={16} /> Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {event.imageUrl && (
            <img src={event.imageUrl} alt={event.title} className="w-full h-48 object-cover rounded-xl" />
          )}

          <div className="flex items-center gap-2 text-slate-300 text-sm">
            <Calendar size={14} className="text-pink-400" />
            <span>{formatDateTime(event.date) || 'Date TBA'}</span>
          </div>

          {event.location && (
            <div className="flex items-center gap-2 text-slate-400 text-sm">
              <MapPin size={14} className="text-pink-400" />
              <span>{typeof event.location === 'string' ? event.location : event.location.address || 'Downtown GSO'}</span>
            </div>
          )}

          {event.description && <p className="text-slate-300 text-sm leading-relaxed">{event.description}</p>}

          {event.link && (
            <div className="pt-2 border-t border-slate-700">
              <a href={event.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-pink-400 hover:text-pink-300 text-sm font-medium">
                <ExternalLink size={14} /> Learn More
              </a>
            </div>
          )}

          {canEditEvent && (
            <div className="flex gap-3 pt-3 border-t border-slate-700">
              <button onClick={startEdit} className="flex items-center gap-2 px-4 py-2 bg-pink-500/20 hover:bg-pink-500/30 text-pink-300 rounded-lg text-sm font-medium transition">
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
