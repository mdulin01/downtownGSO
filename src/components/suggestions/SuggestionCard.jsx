import { MapPin, Lightbulb, ChevronUp } from 'lucide-react';
import CategoryBadge from '../common/CategoryBadge';
import Upvote from '../common/Upvote';

export default function SuggestionCard({ suggestion, onOpenDetail }) {
  const handleClick = () => {
    if (onOpenDetail) onOpenDetail(suggestion);
  };

  return (
    <div
      onClick={handleClick}
      className="group bg-slate-800/60 hover:bg-slate-800 rounded-xl overflow-hidden transition-all cursor-pointer border border-slate-700/50 hover:border-amber-500/30 hover:shadow-lg hover:shadow-amber-500/5"
    >
      {/* Header with gradient and badges */}
      <div className="bg-gradient-to-br from-amber-600/20 to-orange-600/10 p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2 flex-wrap">
            {suggestion.category && <CategoryBadge category={suggestion.category} size="sm" />}
            {suggestion.impact && <CategoryBadge category={suggestion.impact} size="sm" />}
          </div>
          {suggestion.status && (
            <CategoryBadge category={suggestion.status} size="sm" />
          )}
        </div>
      </div>

      <div className="p-4 space-y-3">
        {/* Title */}
        <h3 className="text-lg font-bold text-white line-clamp-2 group-hover:text-amber-300 transition">{suggestion.title}</h3>

        {/* Problem + Suggestion summary */}
        <div className="space-y-2">
          {(suggestion.problem || suggestion.description) && (
            <div className="flex gap-2">
              <div className="w-1 bg-red-500/40 rounded-full flex-shrink-0" />
              <p className="text-slate-400 text-sm line-clamp-2">{suggestion.problem || suggestion.description}</p>
            </div>
          )}
          {(suggestion.suggestion || suggestion.improvement) && (
            <div className="flex gap-2">
              <div className="w-1 bg-emerald-500/40 rounded-full flex-shrink-0" />
              <p className="text-slate-300 text-sm line-clamp-2">{suggestion.suggestion || suggestion.improvement}</p>
            </div>
          )}
        </div>

        {/* Location */}
        {suggestion.location && (
          <div className="flex items-center gap-2 text-slate-500 text-xs">
            <MapPin size={12} />
            <span className="truncate">
              {typeof suggestion.location === 'string' ? suggestion.location : suggestion.location.address || 'Downtown GSO'}
            </span>
          </div>
        )}

        {/* Photo */}
        {suggestion.photoUrl && (
          <div className="h-36 rounded-lg overflow-hidden bg-slate-900">
            <img
              src={suggestion.photoUrl}
              alt={suggestion.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Footer: Upvote */}
        <div className="pt-3 border-t border-slate-700/50">
          <Upvote postId={suggestion.id} />
        </div>
      </div>
    </div>
  );
}
