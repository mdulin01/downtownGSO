import { useState, useMemo, useEffect } from 'react';
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
  const [filterTab, setFilterTab] = useState('week'); // 'week', 'month', 'all'

  useEffect(() => {
    const q = query(
      collection(db, 'events'),
      orderBy('date', 'asc')
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }));
      setEvents(data);
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
      if (filterTab === 'week') {
        return eventDate >= now && eventDate <= oneWeek;
      } else if (filterTab === 'month') {
        return eventDate >= now && eventDate <= oneMonth;
      } else {
        return eventDate >= now;
      }
    });
  }, [events, filterTab]);

  // Group events by date
  const groupedEvents = useMemo(() => {
    const groups = {};
    filteredEvents.forEach((event) => {
      const dateKey = formatDateGroup(event.date);
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
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

  return (
    <div className="pt-16 pb-24 md:pb-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 px-4 py-8 border-b border-slate-700">
        <div className="max-w-6xl mx-auto space-y-6">
          <h1 className="text-3xl font-bold text-white">Upcoming Events</h1>

          {/* Filter Tabs */}
          <div className="flex gap-2">
            <button
              onClick={() => setFilterTab('week')}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                filterTab === 'week'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
            >
              This Week
            </button>
            <button
              onClick={() => setFilterTab('month')}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                filterTab === 'month'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
            >
              This Month
            </button>
            <button
              onClick={() => setFilterTab('all')}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                filterTab === 'all'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
            >
              All
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
        {filteredEvents.length === 0 ? (
          <div className="text-center py-12 text-slate-400">
            <p>No upcoming events. Check back soon!</p>
          </div>
        ) : (
          Object.entries(groupedEvents).map(([dateGroup, dateEvents]) => (
            <div key={dateGroup} className="space-y-4">
              <h3 className="text-xl font-bold text-white border-b border-slate-700 pb-3">
                {dateGroup}
              </h3>
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
