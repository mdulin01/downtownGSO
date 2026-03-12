import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { doc, setDoc, deleteDoc, collection, onSnapshot } from 'firebase/firestore';
import { db } from '../../firebase-config';
import { useAuth } from '../../hooks/useAuth';

const REACTION_TYPES = [
  { emoji: '❤️', label: 'Love' },
  { emoji: '🔥', label: 'Fire' },
  { emoji: '👏', label: 'Clap' },
  { emoji: '💡', label: 'Insightful' },
  { emoji: '😢', label: 'Sad' },
];

export default function Reactions({ collectionName, itemId }) {
  const { user, signIn } = useAuth();
  const [reactions, setReactions] = useState({});
  const [userReaction, setUserReaction] = useState(null);
  const [showPicker, setShowPicker] = useState(false);
  const pickerBtnRef = useRef(null);
  const [pickerPos, setPickerPos] = useState({ top: 0, left: 0 });

  useEffect(() => {
    if (!itemId) return;
    const reactionsRef = collection(db, collectionName, itemId, 'reactions');
    const unsubscribe = onSnapshot(reactionsRef, (snapshot) => {
      const counts = {};
      let myReaction = null;
      snapshot.forEach((doc) => {
        const data = doc.data();
        const emoji = data.emoji;
        counts[emoji] = (counts[emoji] || 0) + 1;
        if (user && doc.id === user.uid) {
          myReaction = emoji;
        }
      });
      setReactions(counts);
      setUserReaction(myReaction);
    });
    return unsubscribe;
  }, [collectionName, itemId, user]);

  const handleReact = async (emoji) => {
    if (!user) {
      try { await signIn(); } catch (e) { return; }
      return;
    }

    const reactionRef = doc(db, collectionName, itemId, 'reactions', user.uid);

    if (userReaction === emoji) {
      // Toggle off
      await deleteDoc(reactionRef);
    } else {
      await setDoc(reactionRef, {
        emoji,
        userId: user.uid,
        userName: user.displayName,
      });
    }
    setShowPicker(false);
  };

  const totalReactions = Object.values(reactions).reduce((a, b) => a + b, 0);
  const topReactions = Object.entries(reactions)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);

  return (
    <div className="relative flex items-center gap-2">
      {/* Show existing reactions as pills */}
      {topReactions.map(([emoji, count]) => (
        <button
          key={emoji}
          onClick={() => handleReact(emoji)}
          className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs transition border ${
            userReaction === emoji
              ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
              : 'bg-slate-800/60 border-slate-700/50 text-slate-400 hover:border-slate-600'
          }`}
        >
          <span>{emoji}</span>
          <span className="font-medium">{count}</span>
        </button>
      ))}

      {/* Add reaction button */}
      <div className="relative">
        <button
          ref={pickerBtnRef}
          onClick={() => {
            if (!showPicker && pickerBtnRef.current) {
              const rect = pickerBtnRef.current.getBoundingClientRect();
              setPickerPos({ top: rect.top - 8, left: rect.left });
            }
            setShowPicker(!showPicker);
          }}
          className="flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-slate-800/40 border border-slate-700/30 text-slate-500 hover:text-slate-300 hover:border-slate-600 transition"
        >
          <span>+</span>
          <span>😀</span>
        </button>

        {showPicker && createPortal(
          <>
            <div className="fixed inset-0 z-40" onClick={() => setShowPicker(false)} />
            <div
              className="fixed z-50 flex items-center gap-1 p-1.5 bg-slate-800 border border-slate-700 rounded-xl shadow-xl"
              style={{ top: pickerPos.top, left: pickerPos.left, transform: 'translateY(-100%)' }}
            >
              {REACTION_TYPES.map(({ emoji, label }) => (
                <button
                  key={emoji}
                  onClick={() => handleReact(emoji)}
                  className={`p-1.5 rounded-lg transition hover:bg-slate-700 hover:scale-110 ${
                    userReaction === emoji ? 'bg-emerald-500/20 ring-1 ring-emerald-500/40' : ''
                  }`}
                  title={label}
                >
                  <span className="text-lg">{emoji}</span>
                </button>
              ))}
            </div>
          </>,
          document.body
        )}
      </div>

      {totalReactions === 0 && !showPicker && (
        <span className="text-xs text-slate-600">Be the first to react</span>
      )}
    </div>
  );
}
