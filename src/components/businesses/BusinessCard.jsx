import { useNavigate } from 'react-router-dom';
import { MapPin, Clock, Link as LinkIcon } from 'lucide-react';
import CategoryBadge from '../common/CategoryBadge';

export default function BusinessCard({ business }) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/business/${business.id}`);
  };

  return (
    <div
      onClick={handleClick}
      className="bg-slate-800/50 hover:bg-slate-800 rounded-lg overflow-hidden transition cursor-pointer border border-slate-700 hover:border-slate-600"
    >
      {/* Photo */}
      {business.photoUrl && (
        <div className="w-full h-48 overflow-hidden bg-slate-900">
          <img
            src={business.photoUrl}
            alt={business.name}
            className="w-full h-full object-cover hover:scale-105 transition"
          />
        </div>
      )}

      <div className="p-4 space-y-3">
        {/* Name and Category */}
        <div className="space-y-2">
          <h3 className="text-lg font-bold text-white">{business.name}</h3>
          {business.category && (
            <CategoryBadge category={business.category} size="sm" />
          )}
        </div>

        {/* Address */}
        {business.address && (
          <div className="flex items-start gap-2 text-slate-400 text-sm">
            <MapPin size={16} className="flex-shrink-0 mt-0.5" />
            <span>{business.address}</span>
          </div>
        )}

        {/* Hours */}
        {business.hours && (
          <div className="flex items-start gap-2 text-slate-400 text-sm">
            <Clock size={16} className="flex-shrink-0 mt-0.5" />
            <span>{business.hours}</span>
          </div>
        )}

        {/* Description */}
        {business.description && (
          <p className="text-slate-300 text-sm line-clamp-3">{business.description}</p>
        )}

        {/* Links */}
        {(business.website || business.instagram || business.facebook) && (
          <div className="flex items-center gap-2 pt-2 border-t border-slate-700">
            {business.website && (
              <a
                href={business.website}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="text-emerald-400 hover:text-emerald-300 transition"
              >
                <LinkIcon size={18} />
              </a>
            )}
            {business.instagram && (
              <a
                href={`https://instagram.com/${business.instagram}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="text-pink-400 hover:text-pink-300 transition text-sm font-medium"
              >
                IG
              </a>
            )}
            {business.facebook && (
              <a
                href={business.facebook}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="text-emerald-500 hover:text-emerald-400 transition text-sm font-medium"
              >
                FB
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
