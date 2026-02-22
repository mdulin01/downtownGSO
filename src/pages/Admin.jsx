import { useState } from 'react';
import { collection, doc, setDoc, Timestamp } from 'firebase/firestore';
import { db } from '../firebase-config';
import { useAuth } from '../hooks/useAuth';
import { seedBusinesses, seedSuggestions, seedEvents } from '../seed-data';

const ADMIN_EMAILS = ['mdulin@gmail.com', 'adamjosephbritten@gmail.com'];

export default function Admin() {
  const { user } = useAuth();
  const [status, setStatus] = useState('');
  const [seeding, setSeeding] = useState(false);

  if (!user || !ADMIN_EMAILS.includes(user.email)) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <p className="text-white/50">Admin access required.</p>
      </div>
    );
  }

  const seedAll = async () => {
    setSeeding(true);
    setStatus('Seeding businesses...');
    try {
      // Seed businesses
      for (const biz of seedBusinesses) {
        const ref = doc(collection(db, 'businesses'));
        await setDoc(ref, {
          ...biz,
          createdAt: Timestamp.now(),
          createdBy: user.uid
        });
      }
      setStatus(`${seedBusinesses.length} businesses added. Seeding suggestions...`);

      // Seed suggestions as posts with type "suggestion"
      for (const sug of seedSuggestions) {
        const ref = doc(collection(db, 'posts'));
        await setDoc(ref, {
          type: 'suggestion',
          title: sug.title,
          description: sug.description,
          improvement: sug.improvement,
          impact: sug.impact,
          category: sug.category,
          location: sug.location,
          authorId: user.uid,
          authorName: user.displayName || 'Admin',
          authorAvatar: user.photoURL || '',
          upvoteCount: 0,
          commentCount: 0,
          status: 'new',
          createdAt: Timestamp.now()
        });
      }
      setStatus(`${seedSuggestions.length} suggestions added. Seeding events...`);

      // Seed events
      for (const evt of seedEvents) {
        const ref = doc(collection(db, 'events'));
        await setDoc(ref, {
          ...evt,
          date: Timestamp.fromDate(new Date(evt.date)),
          endDate: evt.endDate ? Timestamp.fromDate(new Date(evt.endDate)) : null,
          createdAt: Timestamp.now(),
          createdBy: user.uid
        });
      }

      setStatus(`Done! Seeded ${seedBusinesses.length} businesses, ${seedSuggestions.length} suggestions, ${seedEvents.length} events.`);
    } catch (err) {
      setStatus(`Error: ${err.message}`);
    }
    setSeeding(false);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-6">Admin Panel</h1>

      <div className="bg-white/5 border border-white/10 rounded-xl p-6 space-y-4">
        <h2 className="text-lg font-semibold">Seed Database</h2>
        <p className="text-sm text-white/50">
          Populate Firestore with {seedBusinesses.length} businesses, {seedSuggestions.length} infrastructure suggestions, and {seedEvents.length} events.
        </p>
        <button
          onClick={seedAll}
          disabled={seeding}
          className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 rounded-lg text-sm font-medium transition"
        >
          {seeding ? 'Seeding...' : 'Seed All Data'}
        </button>
        {status && (
          <p className="text-sm text-emerald-400 mt-2">{status}</p>
        )}
      </div>
    </div>
  );
}
