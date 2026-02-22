import { useNavigate } from 'react-router-dom';
import { MapPin, Clock } from 'lucide-react';

function toDate(val) {
  if (!val) return null;
  if (val.toDate) return val.toDate(); // Firestore Timestamp
  if (val.seconds) return new Date(val.seconds * 1000); // serialized Timestamp
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

export default function EventCard({ event }) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/event/${event.id}`);
  };

  return (
    <div
      onClick={handleClick}
      className="bg-slate-800/50 hover:bg-slate-800 rounded-lg overflow-hidden transition cursor-pointer border border-slate-700 hover:border-slate-600"
    >
      {/* Image */}
      {event.imageUrl && (
        <div className="w-full h-48 overflow-hidden bg-slate-900 relative">
          <img
            src={event.imageUrl}
            alt={event.title}
            className="w-full h-full object-cover hover:scale-105 transition"
          />
          {/* Date Badge */}
          <div className="absolute top-3 left-3 bg-blue-600 text-white px-3 py-2 rounded-lg font-bold text-center">
            <div className="text-sm">{(formatDate(event.date) || '').split(' ')[0]}</div>
            <div className="text-lg">{(formatDate(event.date) || '').split(' ')[1]}</div>
          </div>
        </div>
      )}

      <div className="p-4 space-y-3">
        {/* Title */}
        <h3 className="text-lg font-bold text-white line-clamp-2">{event.title}</h3>

        {/* Date and Time */}
        <div className="space-y-1 text-sm text-slate-400">
          <div className="flex items-center gap-2">
            <Clock size={16} />
            <span>
              {formatDate(event.date)}{formatTime(event.date) ? ` at ${formatTime(event.date)}` : ''}
            </span>
          </div>
        </div>

        {/* Location */}
        {event.location && (
          <div className="flex items-start gap-2 text-slate-400 text-sm">
            <MapPin size={16} className="flex-shrink-0 mt-0.5" />
            <span>{typeof event.location === 'string' ? event.location : event.location?.address || 'Downtown GSO'}</span>
          </div>
        )}

        {/* Description */}
        {event.description && (
          <p className="text-slate-300 text-sm line-clamp-3">{event.description}</p>
        )}

        {/* Link */}
        {event.link && (
          <div className="pt-2 border-t border-slate-700">
            <a
              href={event.link}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="text-blue-400 hover:text-blue-300 text-sm font-medium transition"
            >
              Learn More
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
