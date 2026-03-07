import { useState, useEffect } from 'react';
import { doc, updateDoc, serverTimestamp, collection, query, where, getDocs, arrayUnion, increment } from 'firebase/firestore';
import { db } from '../../firebase-config';
import { useAuth } from '../../hooks/useAuth';
import InterestsSelector from './InterestsSelector';
import { Sparkles, ArrowRight, Loader2, Users, Building2 } from 'lucide-react';

const PILOT_GROUP_NAME = 'Governors Court Condos';

export default function ProfileCompletionModal({ onComplete }) {
  const { user } = useAuth();
  const [interests, setInterests] = useState([]);
  const [customText, setCustomText] = useState('');
  const [joinGroup, setJoinGroup] = useState(true);
  const [pilotGroup, setPilotGroup] = useState(null);
  const [saving, setSaving] = useState(false);

  // Look up the Governors Court group
  useEffect(() => {
    const fetchGroup = async () => {
      try {
        const q = query(collection(db, 'groups'), where('name', '==', PILOT_GROUP_NAME));
        const snap = await getDocs(q);
        if (!snap.empty) {
          setPilotGroup({ id: snap.docs[0].id, ...snap.docs[0].data() });
        }
      } catch (err) {
        console.error('Error fetching pilot group:', err);
      }
    };
    fetchGroup();
  }, []);

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

      // Join the pilot group if opted in
      if (joinGroup && pilotGroup && !pilotGroup.members?.includes(user.uid)) {
        await updateDoc(doc(db, 'groups', pilotGroup.id), {
          members: arrayUnion(user.uid),
          memberCount: increment(1)
        });
      }

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

          {/* Governors Court group invite */}
          {pilotGroup && (
            <button
              type="button"
              onClick={() => setJoinGroup(!joinGroup)}
              className={`w-full flex items-center gap-3 p-4 rounded-xl border transition ${
                joinGroup
                  ? 'bg-violet-500/10 border-violet-500/30'
                  : 'bg-slate-800/50 border-slate-700 hover:border-slate-600'
              }`}
            >
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                joinGroup ? 'bg-violet-500/20' : 'bg-slate-700'
              }`}>
                <Building2 size={20} className={joinGroup ? 'text-violet-400' : 'text-slate-500'} />
              </div>
              <div className="flex-1 text-left">
                <p className={`text-sm font-semibold ${joinGroup ? 'text-white' : 'text-slate-300'}`}>
                  Join {PILOT_GROUP_NAME}
                </p>
                <p className="text-xs text-slate-400">
                  {pilotGroup.memberCount || 0} neighbors already here
                </p>
              </div>
              <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition ${
                joinGroup
                  ? 'bg-violet-500 border-violet-500'
                  : 'border-slate-600'
              }`}>
                {joinGroup && (
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M2.5 6L5 8.5L9.5 3.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </div>
            </button>
          )}

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
