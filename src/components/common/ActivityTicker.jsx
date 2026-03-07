import { useState, useEffect } from 'react';
import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { db } from '../../firebase-config';
import { MessageCircle, Heart, Users, Lightbulb, Zap } from 'lucide-react';

function timeAgo(date) {
  if (!date) return '';
  const d = date.toDate ? date.toDate() : date.seconds ? new Date(date.seconds * 1000) : new Date(date);
  const seconds = Math.floor((new Date() - d) / 1000);
  if (seconds < 60) return 'just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}

export default function ActivityTicker() {
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    const unsubscribers = [];

    // Recent posts
    const postsQ = query(collection(db, 'posts'), orderBy('createdAt', 'desc'), limit(3));
    unsubscribers.push(
      onSnapshot(postsQ, (snap) => {
        const items = snap.docs.map(d => {
          const data = d.data();
          return {
            id: `post-${d.id}`,
            type: 'post',
            text: `${data.authorName?.split(' ')[0] || 'Someone'} shared "${data.title}"`,
            time: data.createdAt,
            icon: MessageCircle,
            color: 'text-emerald-400',
          };
        });
        setActivities(prev => {
          const filtered = prev.filter(a => a.type !== 'post');
          return [...filtered, ...items].sort((a, b) => {
            const aTime = a.time?.seconds || 0;
            const bTime = b.time?.seconds || 0;
            return bTime - aTime;
          }).slice(0, 5);
        });
      })
    );

    // Recent suggestions
    const sugQ = query(collection(db, 'suggestions'), orderBy('createdAt', 'desc'), limit(2));
    unsubscribers.push(
      onSnapshot(sugQ, (snap) => {
        const items = snap.docs.map(d => {
          const data = d.data();
          return {
            id: `sug-${d.id}`,
            type: 'suggestion',
            text: `${data.authorName?.split(' ')[0] || 'Someone'} suggested "${data.title}"`,
            time: data.createdAt,
            icon: Lightbulb,
            color: 'text-amber-400',
          };
        });
        setActivities(prev => {
          const filtered = prev.filter(a => a.type !== 'suggestion');
          return [...filtered, ...items].sort((a, b) => {
            const aTime = a.time?.seconds || 0;
            const bTime = b.time?.seconds || 0;
            return bTime - aTime;
          }).slice(0, 5);
        });
      })
    );

    // Recent groups
    const groupsQ = query(collection(db, 'groups'), orderBy('createdAt', 'desc'), limit(2));
    unsubscribers.push(
      onSnapshot(groupsQ, (snap) => {
        const items = snap.docs.map(d => {
          const data = d.data();
          return {
            id: `group-${d.id}`,
            type: 'group',
            text: `${data.createdByName?.split(' ')[0] || 'Someone'} created "${data.name}"`,
            time: data.createdAt,
            icon: Users,
            color: 'text-violet-400',
          };
        });
        setActivities(prev => {
          const filtered = prev.filter(a => a.type !== 'group');
          return [...filtered, ...items].sort((a, b) => {
            const aTime = a.time?.seconds || 0;
            const bTime = b.time?.seconds || 0;
            return bTime - aTime;
          }).slice(0, 5);
        });
      })
    );

    return () => unsubscribers.forEach(u => u());
  }, []);

  if (activities.length === 0) return null;

  return (
    <div className="bg-slate-900/30 border border-white/5 rounded-xl p-4">
      <div className="flex items-center gap-2 mb-3">
        <Zap size={14} className="text-emerald-400" />
        <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">Live Activity</span>
      </div>
      <div className="space-y-2.5">
        {activities.map((activity) => {
          const Icon = activity.icon;
          return (
            <div key={activity.id} className="flex items-center gap-3">
              <Icon size={14} className={activity.color + ' shrink-0'} />
              <span className="text-sm text-slate-400 truncate flex-1">{activity.text}</span>
              <span className="text-[10px] text-slate-600 shrink-0">{timeAgo(activity.time)}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
