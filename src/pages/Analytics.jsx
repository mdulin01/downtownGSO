import { useState, useEffect, useMemo } from 'react';
import { collection, query, where, orderBy, onSnapshot, Timestamp } from 'firebase/firestore';
import { db } from '../firebase-config';
import { useAuth } from '../hooks/useAuth';
import { isAdmin } from '../utils/authUtils';
import { BarChart3, Eye, Search, Users, TrendingUp, Clock, ArrowUp, MessageCircle, Lightbulb, Store, Calendar, RefreshCw } from 'lucide-react';

// ── Helpers ─────────────────────────────────────────────

function daysAgo(n) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  d.setHours(0, 0, 0, 0);
  return Timestamp.fromDate(d);
}

function formatDate(dateStr) {
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

// ── Stat Card ───────────────────────────────────────────

function StatCard({ label, value, icon: Icon, color = 'emerald', sub }) {
  const colors = {
    emerald: 'from-emerald-500/20 to-emerald-600/5 text-emerald-400 border-emerald-500/20',
    purple: 'from-purple-500/20 to-purple-600/5 text-purple-400 border-purple-500/20',
    pink: 'from-pink-500/20 to-pink-600/5 text-pink-400 border-pink-500/20',
    blue: 'from-blue-500/20 to-blue-600/5 text-blue-400 border-blue-500/20',
    amber: 'from-amber-500/20 to-amber-600/5 text-amber-400 border-amber-500/20',
  };
  return (
    <div className={`bg-gradient-to-br ${colors[color]} border rounded-xl p-4`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">{label}</span>
        <Icon size={16} className="opacity-60" />
      </div>
      <div className="text-2xl font-black">{value}</div>
      {sub && <div className="text-xs text-slate-500 mt-1">{sub}</div>}
    </div>
  );
}

// ── Simple Bar ──────────────────────────────────────────

function SimpleBar({ items, color = 'emerald' }) {
  const max = Math.max(...items.map(i => i.count), 1);
  const barColors = {
    emerald: 'bg-emerald-500',
    purple: 'bg-purple-500',
    pink: 'bg-pink-500',
    blue: 'bg-blue-500',
  };
  return (
    <div className="space-y-2">
      {items.map((item, i) => (
        <div key={i} className="flex items-center gap-3">
          <span className="text-xs text-slate-400 w-24 truncate text-right">{item.label}</span>
          <div className="flex-1 h-6 bg-white/5 rounded-md overflow-hidden">
            <div
              className={`h-full ${barColors[color]} rounded-md transition-all duration-500`}
              style={{ width: `${(item.count / max) * 100}%` }}
            />
          </div>
          <span className="text-xs font-mono text-slate-300 w-8 text-right">{item.count}</span>
        </div>
      ))}
    </div>
  );
}

// ── Event Log Table ─────────────────────────────────────

function EventLog({ events }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-white/10">
            <th className="text-left py-2 px-3 text-xs font-medium text-slate-500 uppercase">Time</th>
            <th className="text-left py-2 px-3 text-xs font-medium text-slate-500 uppercase">Event</th>
            <th className="text-left py-2 px-3 text-xs font-medium text-slate-500 uppercase">Details</th>
          </tr>
        </thead>
        <tbody>
          {events.slice(0, 50).map((evt, i) => {
            const t = evt.timestamp?.toDate?.() || new Date();
            const detail = evt.params?.page_title || evt.params?.business_name || evt.params?.event_name || evt.params?.search_term || evt.params?.filter_type || evt.params?.post_type || '';
            return (
              <tr key={i} className="border-b border-white/5 hover:bg-white/5 transition">
                <td className="py-2 px-3 text-slate-500 font-mono text-xs whitespace-nowrap">
                  {t.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                </td>
                <td className="py-2 px-3">
                  <span className="px-2 py-0.5 bg-white/10 rounded text-xs font-medium text-slate-300">{evt.event}</span>
                </td>
                <td className="py-2 px-3 text-slate-400 text-xs truncate max-w-[200px]">{detail}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
      {events.length === 0 && (
        <div className="text-center py-8 text-slate-600 text-sm">No events recorded yet. They'll appear here in real-time.</div>
      )}
    </div>
  );
}

// ── Main Component ──────────────────────────────────────

export default function Analytics() {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [range, setRange] = useState(7); // days
  const userIsAdmin = user && isAdmin(user);

  // Real-time listener for analytics events
  useEffect(() => {
    if (!userIsAdmin) return;
    const since = daysAgo(range);
    const q = query(
      collection(db, 'analytics_events'),
      where('timestamp', '>=', since),
      orderBy('timestamp', 'desc')
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setEvents(data);
      setLoading(false);
    });
    return unsubscribe;
  }, [range, userIsAdmin]);

  // ── Computed stats ──────────────────────────────────

  const stats = useMemo(() => {
    const pageViews = events.filter(e => e.event === 'page_view');
    const uniqueDates = new Set(events.map(e => e.date));
    const todayStr = new Date().toISOString().slice(0, 10);
    const todayEvents = events.filter(e => e.date === todayStr);
    const logins = events.filter(e => e.event === 'login');

    return {
      totalEvents: events.length,
      totalPageViews: pageViews.length,
      todayPageViews: todayEvents.filter(e => e.event === 'page_view').length,
      todayEvents: todayEvents.length,
      uniqueDays: uniqueDates.size,
      logins: logins.length,
      todayLogins: todayEvents.filter(e => e.event === 'login').length,
    };
  }, [events]);

  // Page view breakdown
  const pageBreakdown = useMemo(() => {
    const counts = {};
    events.filter(e => e.event === 'page_view').forEach(e => {
      const page = e.params?.page_title || 'Unknown';
      counts[page] = (counts[page] || 0) + 1;
    });
    return Object.entries(counts)
      .map(([label, count]) => ({ label, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
  }, [events]);

  // Event type breakdown
  const eventTypeBreakdown = useMemo(() => {
    const counts = {};
    events.forEach(e => {
      counts[e.event] = (counts[e.event] || 0) + 1;
    });
    return Object.entries(counts)
      .map(([label, count]) => ({ label, count }))
      .sort((a, b) => b.count - a.count);
  }, [events]);

  // Daily volume (for mini chart)
  const dailyVolume = useMemo(() => {
    const counts = {};
    events.forEach(e => {
      if (e.date) counts[e.date] = (counts[e.date] || 0) + 1;
    });
    return Object.entries(counts)
      .map(([label, count]) => ({ label: formatDate(label), count }))
      .sort((a, b) => a.label.localeCompare(b.label));
  }, [events]);

  // Top businesses viewed
  const topBusinesses = useMemo(() => {
    const counts = {};
    events.filter(e => e.event === 'view_business').forEach(e => {
      const name = e.params?.business_name || 'Unknown';
      counts[name] = (counts[name] || 0) + 1;
    });
    return Object.entries(counts)
      .map(([label, count]) => ({ label, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8);
  }, [events]);

  // Top searches
  const topSearches = useMemo(() => {
    const counts = {};
    events.filter(e => e.event === 'search_businesses').forEach(e => {
      const term = e.params?.search_term?.toLowerCase() || '';
      if (term) counts[term] = (counts[term] || 0) + 1;
    });
    return Object.entries(counts)
      .map(([label, count]) => ({ label, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8);
  }, [events]);

  // Guard: admin only (must be after all hooks)
  if (!userIsAdmin) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <p className="text-white/50">Admin access required.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <RefreshCw size={24} className="mx-auto text-slate-500 animate-spin mb-4" />
        <p className="text-slate-500">Loading analytics...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 pb-24 md:pb-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
            <BarChart3 size={20} className="text-emerald-400" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-white">Analytics</h1>
            <p className="text-xs text-slate-500">Real-time · Admin only</p>
          </div>
        </div>
        <div className="flex items-center gap-2 bg-white/5 rounded-lg p-1">
          {[1, 7, 30].map(d => (
            <button
              key={d}
              onClick={() => setRange(d)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition ${
                range === d ? 'bg-emerald-500 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              {d === 1 ? 'Today' : `${d}d`}
            </button>
          ))}
        </div>
      </div>

      {/* Top Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Page Views" value={stats.totalPageViews} icon={Eye} color="emerald" sub={`${stats.todayPageViews} today`} />
        <StatCard label="Total Events" value={stats.totalEvents} icon={TrendingUp} color="blue" sub={`${stats.todayEvents} today`} />
        <StatCard label="Logins" value={stats.logins} icon={Users} color="purple" sub={`${stats.todayLogins} today`} />
        <StatCard label="Active Days" value={stats.uniqueDays} icon={Clock} color="amber" sub={`of ${range}d window`} />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Daily Volume */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-5 space-y-4">
          <h2 className="text-sm font-bold text-slate-300 flex items-center gap-2">
            <TrendingUp size={14} className="text-emerald-400" /> Daily Volume
          </h2>
          {dailyVolume.length > 0 ? (
            <SimpleBar items={dailyVolume} color="emerald" />
          ) : (
            <p className="text-xs text-slate-600">No data yet</p>
          )}
        </div>

        {/* Pages */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-5 space-y-4">
          <h2 className="text-sm font-bold text-slate-300 flex items-center gap-2">
            <Eye size={14} className="text-blue-400" /> Top Pages
          </h2>
          {pageBreakdown.length > 0 ? (
            <SimpleBar items={pageBreakdown} color="blue" />
          ) : (
            <p className="text-xs text-slate-600">No page views yet</p>
          )}
        </div>
      </div>

      {/* Second Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Top Businesses */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-5 space-y-4">
          <h2 className="text-sm font-bold text-slate-300 flex items-center gap-2">
            <Store size={14} className="text-purple-400" /> Top Businesses Viewed
          </h2>
          {topBusinesses.length > 0 ? (
            <SimpleBar items={topBusinesses} color="purple" />
          ) : (
            <p className="text-xs text-slate-600">No business views yet</p>
          )}
        </div>

        {/* Top Searches */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-5 space-y-4">
          <h2 className="text-sm font-bold text-slate-300 flex items-center gap-2">
            <Search size={14} className="text-pink-400" /> Top Searches
          </h2>
          {topSearches.length > 0 ? (
            <SimpleBar items={topSearches} color="pink" />
          ) : (
            <p className="text-xs text-slate-600">No searches yet</p>
          )}
        </div>
      </div>

      {/* Event Type Breakdown */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-5 space-y-4">
        <h2 className="text-sm font-bold text-slate-300 flex items-center gap-2">
          <BarChart3 size={14} className="text-amber-400" /> All Event Types
        </h2>
        {eventTypeBreakdown.length > 0 ? (
          <SimpleBar items={eventTypeBreakdown} color="emerald" />
        ) : (
          <p className="text-xs text-slate-600">No events yet</p>
        )}
      </div>

      {/* Live Event Log */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-5 space-y-4">
        <h2 className="text-sm font-bold text-slate-300 flex items-center gap-2">
          <Clock size={14} className="text-emerald-400" /> Live Event Log
          <span className="ml-auto text-xs text-slate-600">Latest 50</span>
        </h2>
        <EventLog events={events} />
      </div>
    </div>
  );
}
