import { useState, useMemo, useEffect } from 'react';
import { Calendar } from 'lucide-react';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase-config';
import EventCard from '../components/events/EventCard';

function toDate(val) {
  if (!val) return null;
  if (val.toDate) return val.toDate();
  if (val.seconds) return new Date(val.seconds * 1000);
  return new Date(val);
}

function formatDateGroup(date) {
  const d = toDate(date);
  if (!d || isNaN(d)) return 'Upcoming';
  return d.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

export default function Events() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterTab, setFilterTab] = useState('week');

  useEffect(() => {
    const q = query(collection(db, 'events'), orderBy('date', 'asc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setEvents(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const filteredEvents = useMemo(() => {
    const now = new Date();
    const oneWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    const oneMonth = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

    return events.filter((event) => {
      const eventDate = toDate(event.date);
      if (!eventDate || isNaN(eventDate)) return filterTab === 'all';
      if (filterTab === 'week') return eventDate >= now && eventDate <= oneWeek;
      if (filterTab === 'month') return eventDate >= now && eventDate <= oneMonth;
      return eventDate >= now;
    });
  }, [events, filterTab]);

  const groupedEvents = useMemo(() => {
    const groups = {};
    filteredEvents.forEach((event) => {
      const dateKey = formatDateGroup(event.date);
      if (!groups[dateKey]) groups[dateKey] = [];
      groups[dateKey].push(event);
    });
    return groups;
  }, [filteredEvents]);

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8 pt-16">
        <div className="text-center text-slate-400">Loading events...</div>
      </div>
    );
  }

  const tabs = [
    { key: 'week', label: 'This Week' },
    { key: 'month', label: 'This Month' },
    { key: 'all', label: 'All Upcoming' }
  ];

  return (
    <div className="pt-16 pb-24 md:pb-8">
      {/* Header */}
      <div className="bg-gradient-to-br from-pink-900/30 via-slate-900 to-slate-900 px-4 py-10 border-b border-white/5">
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-pink-500/20 flex items-center justify-center">
              <Calendar size={24} className="text-pink-400" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-white">Upcoming Events</h1>
              <p className="text-slate-400 text-sm">What's happening in downtown Greensboro</p>
            </div>
          </div>

          <div className="flex gap-2">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setFilterTab(tab.key)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                  filterTab === tab.key
                    ? 'bg-pink-500 text-white shadow-lg shadow-pink-500/20'
                    : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
        {filteredEvents.length === 0 ? (
          <div className="text-center py-16">
            <Calendar size={48} className="mx-auto text-slate-700 mb-4" />
            <p className="text-slate-400">No upcoming events for this period.</p>
            <p className="text-slate-500 text-sm mt-1">Check back soon or try a different filter!</p>
          </div>
        ) : (
          Object.entries(groupedEvents).map(([dateGroup, dateEvents]) => (
            <div key={dateGroup} className="space-y-4">
              <h3 className="text-lg font-bold text-white border-b border-white/5 pb-3">{dateGroup}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {dateEvents.map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
