import { useState } from 'react';
import { doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../../firebase-config';
import { useAuth } from '../../hooks/useAuth';
import { isAdmin } from '../../utils/authUtils';
import { BUSINESS_CATEGORIES } from '../../constants';
import BaseModal from '../common/BaseModal';
import { MapPin, Clock, ExternalLink, Pencil, Trash2, Save, X, Store } from 'lucide-react';

export default function BusinessDetail({ business, isOpen, onClose }) {
  const { user } = useAuth();
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({});

  if (!business) return null;

  const canEditBiz = isAdmin(user);

  const startEdit = () => {
    setForm({
      name: business.name || '',
      category: business.category || '',
      address: business.address || '',
      description: business.description || '',
      hours: business.hours || '',
      photoUrl: business.photoUrl || '',
      website: business.website || '',
      instagram: business.instagram || '',
      facebook: business.facebook || '',
    });
    setEditing(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateDoc(doc(db, 'businesses', business.id), form);
      setEditing(false);
    } catch (err) {
      alert('Error saving: ' + err.message);
    }
    setSaving(false);
  };

  const handleDelete = async () => {
    if (!confirm('Delete this business?')) return;
    try {
      await deleteDoc(doc(db, 'businesses', business.id));
      onClose();
    } catch (err) {
      alert('Error deleting: ' + err.message);
    }
  };

  const inputClass = 'w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-emerald-500';

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} title={editing ? 'Edit Business' : business.name}>
      {editing ? (
        <div className="space-y-4">
          <div>
            <label className="text-xs text-slate-400 mb-1 block">Name</label>
            <input className={inputClass} value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
          </div>
          <div>
            <label className="text-xs text-slate-400 mb-1 block">Category</label>
            <select className={inputClass} value={form.category} onChange={e => setForm({...form, category: e.target.value})}>
              <option value="">Select...</option>
              {BUSINESS_CATEGORIES.map(c => <option key={c} value={c.toLowerCase()}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs text-slate-400 mb-1 block">Address</label>
            <input className={inputClass} value={form.address} onChange={e => setForm({...form, address: e.target.value})} />
          </div>
          <div>
            <label className="text-xs text-slate-400 mb-1 block">Hours</label>
            <input className={inputClass} value={form.hours} onChange={e => setForm({...form, hours: e.target.value})} />
          </div>
          <div>
            <label className="text-xs text-slate-400 mb-1 block">Description</label>
            <textarea className={inputClass + ' h-24 resize-none'} value={form.description} onChange={e => setForm({...form, description: e.target.value})} />
          </div>
          <div>
            <label className="text-xs text-slate-400 mb-1 block">Photo URL</label>
            <input className={inputClass} value={form.photoUrl} onChange={e => setForm({...form, photoUrl: e.target.value})} placeholder="https://..." />
            {form.photoUrl && <img src={form.photoUrl} alt="Preview" className="mt-2 w-full h-32 object-cover rounded-lg" />}
          </div>
          <div>
            <label className="text-xs text-slate-400 mb-1 block">Website</label>
            <input className={inputClass} value={form.website} onChange={e => setForm({...form, website: e.target.value})} placeholder="https://..." />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-slate-400 mb-1 block">Instagram</label>
              <input className={inputClass} value={form.instagram} onChange={e => setForm({...form, instagram: e.target.value})} placeholder="@handle" />
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1 block">Facebook</label>
              <input className={inputClass} value={form.facebook} onChange={e => setForm({...form, facebook: e.target.value})} placeholder="https://..." />
            </div>
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
          {business.photoUrl ? (
            <img src={business.photoUrl} alt={business.name} className="w-full h-48 object-cover rounded-xl" />
          ) : (
            <div className="w-full h-32 bg-gradient-to-br from-purple-600/30 to-indigo-600/10 rounded-xl flex items-center justify-center">
              <Store size={36} className="text-white/20" />
            </div>
          )}

          {business.category && (
            <span className="inline-block px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-xs font-medium">{business.category}</span>
          )}

          {business.description && <p className="text-slate-300 text-sm leading-relaxed">{business.description}</p>}

          {business.address && (
            <div className="flex items-start gap-2 text-slate-400 text-sm">
              <MapPin size={14} className="flex-shrink-0 mt-0.5 text-purple-400" />
              <span>{business.address}</span>
            </div>
          )}

          {business.hours && (
            <div className="flex items-start gap-2 text-slate-400 text-sm">
              <Clock size={14} className="flex-shrink-0 mt-0.5 text-purple-400" />
              <span>{business.hours}</span>
            </div>
          )}

          {(business.website || business.instagram || business.facebook) && (
            <div className="flex flex-wrap gap-3 pt-2 border-t border-slate-700">
              {business.website && (
                <a href={business.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-emerald-400 hover:text-emerald-300 text-sm font-medium">
                  <ExternalLink size={14} /> Website
                </a>
              )}
              {business.instagram && (
                <a href={`https://instagram.com/${business.instagram}`} target="_blank" rel="noopener noreferrer" className="text-pink-400 hover:text-pink-300 text-sm font-medium">
                  Instagram
                </a>
              )}
              {business.facebook && (
                <a href={business.facebook} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 text-sm font-medium">
                  Facebook
                </a>
              )}
            </div>
          )}

          {canEditBiz && (
            <div className="flex gap-3 pt-3 border-t border-slate-700">
              <button onClick={startEdit} className="flex items-center gap-2 px-4 py-2 bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 rounded-lg text-sm font-medium transition">
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
