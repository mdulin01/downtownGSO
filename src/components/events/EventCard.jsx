import { useNavigate } from 'react-router-dom';
import { MapPin, Clock, Calendar, ArrowUpRight } from 'lucide-react';

function toDate(val) {
  if (!val) return null;
  if (val.toDate) return val.toDate();
  if (val.seconds) return new Date(val.seconds * 1000);
  return new Date(val);
}

function formatDate(date) {
  const d = toDate(date);
  if (!d || isNaN(d)) return '';
  return d.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  });
}

function formatTime(date) {
  const d = toDate(date);
  if (!d || isNaN(d)) return '';
  return d.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit'
  });
}

function getMonthDay(date) {
  const d = toDate(date);
  if (!d || isNaN(d)) return { month: '---', day: '--' };
  return {
    month: d.toLocaleDateString('en-US', { month: 'short' }).toUpperCase(),
    day: d.getDate()
  };
}

export default function EventCard({ event }) {
  const navigate = useNavigate();
  const { month, day } = getMonthDay(event.date);

  const handleClick = () => {
    navigate(`/event/${event.id}`);
  };

  return (
    <div
      onClick={handleClick}
      className="group bg-slate-800/60 hover:bg-slate-800 rounded-xl overflow-hidden transition-all cursor-pointer border border-slate-700/50 hover:border-pink-500/30 hover:shadow-lg hover:shadow-pink-500/5"
    >
      {/* Image or Date Banner */}
      {event.imageUrl ? (
        <div className="w-full h-44 overflow-hidden bg-slate-900 relative">
          <img
            src={event.imageUrl}
            alt={event.title}
            className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent" />
          {/* Date Badge */}
          <div className="absolute top-3 left-3 bg-pink-600 text-white px-3 py-2 rounded-lg text-center shadow-lg">
            <div className="text-[10px] font-bold tracking-wider opacity-80">{month}</div>
            <div className="text-xl font-black leading-tight">{day}</div>
          </div>
        </div>
      ) : (
        <div className="w-full bg-gradient-to-br from-pink-600/30 to-rose-600/10 relative">
          <div className="flex items-center gap-4 p-5">
            <div className="bg-pink-600 text-white px-4 py-3 rounded-xl text-center shadow-lg flex-shrink-0">
              <div className="text-[10px] font-bold tracking-wider opacity-80">{month}</div>
              <div className="text-2xl font-black leading-tight">{day}</div>
            </div>
            <div className="min-w-0">
              <h3 className="text-lg font-bold text-white line-clamp-2 group-hover:text-pink-300 transition">{event.title}</h3>
              <div className="flex items-center gap-1 text-pink-300/60 text-sm mt-1">
                <Clock size={12} />
                <span>{formatTime(event.date) || 'TBA'}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="p-4 space-y-3">
        {/* Title (only if image exists, otherwise shown in banner) */}
        {event.imageUrl && (
          <h3 className="text-lg font-bold text-white line-clamp-2 group-hover:text-pink-300 transition">{event.title}</h3>
        )}

        {/* Date and Time */}
        {event.imageUrl && (
          <div className="flex items-center gap-2 text-sm text-slate-400">
            <Clock size={14} className="text-pink-400/60" />
            <span>
              {formatDate(event.date)}{formatTime(event.date) ? ` at ${formatTime(event.date)}` : ''}
            </span>
          </div>
        )}

        {/* Location */}
        {event.location && (
          <div className="flex items-start gap-2 text-slate-400 text-sm">
            <MapPin size={14} className="flex-shrink-0 mt-0.5 text-pink-400/60" />
            <span className="line-clamp-1">{typeof event.location === 'string' ? event.location : event.location?.address || 'Downtown GSO'}</span>
          </div>
        )}

        {/* Description */}
        {event.description && (
          <p className="text-slate-400 text-sm line-clamp-2">{event.description}</p>
        )}

        {/* Link */}
        {event.link && (
          <div className="pt-2 border-t border-slate-700/50">
            <a
              href={event.link}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="inline-flex items-center gap-1 text-pink-400 hover:text-pink-300 text-sm font-medium transition"
            >
              Learn More
              <ArrowUpRight size={14} />
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
