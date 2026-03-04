import { MapPin, Clock, ExternalLink } from 'lucide-react';
import CategoryBadge from '../common/CategoryBadge';
import StarRating from '../common/StarRating';
import { getBusinessConfig } from '../../utils/categoryConfig';

export default function BusinessCard({ business, onOpenDetail }) {
  const config = getBusinessConfig(business.category);
  const Icon = config.icon;

  const handleClick = () => {
    if (onOpenDetail) onOpenDetail(business);
  };

  return (
    <div
      onClick={handleClick}
      className={`group bg-slate-800/60 hover:bg-slate-800 rounded-xl overflow-hidden transition-all cursor-pointer border border-slate-700/50 ${config.hoverBorder} hover:shadow-lg ${config.hoverShadow}`}
    >
      {/* Photo or Gradient Placeholder */}
      {business.photoUrl ? (
        <div className="w-full h-44 overflow-hidden bg-slate-900 relative">
          <img
            src={business.photoUrl}
            alt={business.name}
            className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent" />
          {business.averageRating > 0 && (
            <div className="absolute top-2 right-2 flex items-center gap-1 bg-black/50 backdrop-blur-sm px-2 py-1 rounded-lg">
              <StarRating rating={business.averageRating} count={business.totalRatings} size="sm" />
            </div>
          )}
        </div>
      ) : (
        <div className={`w-full h-32 bg-gradient-to-br ${config.gradient} flex items-center justify-center relative`}>
          <Icon size={40} className={config.iconColor} />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent" />
          {business.averageRating > 0 && (
            <div className="absolute top-2 right-2 flex items-center gap-1 bg-black/50 backdrop-blur-sm px-2 py-1 rounded-lg">
              <StarRating rating={business.averageRating} count={business.totalRatings} size="sm" />
            </div>
          )}
        </div>
      )}

      <div className="p-4 space-y-3">
        {/* Name and Category */}
        <div className="space-y-2">
          <h3 className={`text-lg font-bold text-white ${config.hoverText} transition`}>{business.name}</h3>
          {business.category && (
            <CategoryBadge category={business.category} size="sm" />
          )}
        </div>

        {/* Address */}
        {business.address && (
          <div className="flex items-start gap-2 text-slate-400 text-sm">
            <MapPin size={14} className={`flex-shrink-0 mt-0.5 ${config.accent} opacity-60`} />
            <span className="line-clamp-1">{business.address}</span>
          </div>
        )}

        {/* Hours */}
        {business.hours && (
          <div className="flex items-start gap-2 text-slate-400 text-sm">
            <Clock size={14} className={`flex-shrink-0 mt-0.5 ${config.accent} opacity-60`} />
            <span>{business.hours}</span>
          </div>
        )}

        {/* Description */}
        {business.description && (
          <p className="text-slate-400 text-sm line-clamp-2">{business.description}</p>
        )}

        {/* Links */}
        {(business.website || business.instagram || business.facebook) && (
          <div className="flex items-center gap-3 pt-2 border-t border-slate-700/50">
            {business.website && (
              <a
                href={business.website}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="flex items-center gap-1 text-emerald-400 hover:text-emerald-300 transition text-xs font-medium"
              >
                <ExternalLink size={12} />
                Website
              </a>
            )}
            {business.instagram && (
              <a
                href={`https://instagram.com/${business.instagram}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="text-pink-400 hover:text-pink-300 transition text-xs font-medium"
              >
                Instagram
              </a>
            )}
            {business.facebook && (
              <a
                href={business.facebook}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="text-blue-400 hover:text-blue-300 transition text-xs font-medium"
              >
                Facebook
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
