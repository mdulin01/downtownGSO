import { useState } from 'react';
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebase-config';
import { useAuth } from '../../hooks/useAuth';
import InterestsSelector from './InterestsSelector';
import { Sparkles, ArrowRight, Loader2 } from 'lucide-react';

export default function ProfileCompletionModal({ onComplete }) {
  const { user } = useAuth();
  const [interests, setInterests] = useState([]);
  const [customText, setCustomText] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (interests.length === 0) return;

    setSaving(true);
    try {
      const customInterests = customText
        .split(',')
        .map(s => s.trim())
        .filter(Boolean);

      await updateDoc(doc(db, 'users', user.uid), {
        interests,
        customInterests,
        notificationsEnabled: true,
        profileCompleted: true,
        profileCompletedAt: serverTimestamp()
      });

      onComplete?.();
    } catch (err) {
      console.error('Error saving profile:', err);
      alert('Failed to save. Please try again.');
    }
    setSaving(false);
  };

  if (!user) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-slate-900 rounded-2xl border border-white/10 shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 space-y-5">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/10 rounded-full">
              <Sparkles size={14} className="text-emerald-400" />
              <span className="text-xs font-medium text-emerald-300">Welcome to DowntownGSO</span>
            </div>
            <h2 className="text-xl font-bold text-white">
              Hey {user.displayName?.split(' ')[0] || 'there'}! What are you into?
            </h2>
            <p className="text-sm text-slate-400">
              Pick your interests so we can show you the good stuff and keep you in the loop.
            </p>
          </div>

          {/* Interest picker */}
          <InterestsSelector
            selected={interests}
            onChange={setInterests}
            customText={customText}
            onCustomChange={setCustomText}
          />

          {/* Save */}
          <div className="flex items-center justify-between pt-2">
            <span className="text-xs text-slate-500">
              {interests.length === 0 ? 'Pick at least 1' : `${interests.length} selected`}
            </span>
            <button
              onClick={handleSave}
              disabled={interests.length === 0 || saving}
              className="flex items-center gap-2 px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 disabled:bg-slate-700 disabled:text-slate-500 text-white rounded-xl font-medium text-sm transition shadow-lg shadow-emerald-500/20 disabled:shadow-none"
            >
              {saving ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <>
                  Let's go <ArrowRight size={16} />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
