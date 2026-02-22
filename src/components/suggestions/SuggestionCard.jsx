import { useNavigate } from 'react-router-dom';
import { MapPin } from 'lucide-react';
import CategoryBadge from '../common/CategoryBadge';
import Upvote from '../common/Upvote';
import MapView from '../map/MapView';

export default function SuggestionCard({ suggestion }) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/suggestion/${suggestion.id}`);
  };

  return (
    <div
      onClick={handleClick}
      className="bg-slate-800/50 hover:bg-slate-800 rounded-lg overflow-hidden transition cursor-pointer border border-slate-700 hover:border-slate-600"
    >
      {/* Category and Impact Badges */}
      <div className="p-4 space-y-2 border-b border-slate-700">
        <div className="flex items-center gap-2 flex-wrap">
          <CategoryBadge category={suggestion.category} size="sm" />
          <CategoryBadge category={suggestion.impact} size="sm" />
          <CategoryBadge category={suggestion.status} size="sm" />
        </div>
      </div>

      {/* Title and Description */}
      <div className="p-4 space-y-3">
        <h3 className="text-lg font-bold text-white line-clamp-2">{suggestion.title}</h3>

        <div className="space-y-2">
          <div>
            <p className="text-xs text-slate-400 font-semibold uppercase">Problem</p>
            <p className="text-slate-300 text-sm line-clamp-2">{suggestion.problem}</p>
          </div>
          <div>
            <p className="text-xs text-slate-400 font-semibold uppercase">Suggestion</p>
            <p className="text-slate-300 text-sm line-clamp-2">{suggestion.suggestion}</p>
          </div>
        </div>

        {/* Location */}
        {suggestion.location && (
          <div className="flex items-center gap-2 text-slate-400 text-sm">
            <MapPin size={16} />
            <span className="truncate">{suggestion.location}</span>
          </div>
        )}

        {/* Mini Map Preview */}
        {suggestion.lat && suggestion.lng && (
          <div className="h-32 rounded-lg overflow-hidden bg-slate-900 border border-slate-700">
            <MapView
              markers={[
                {
                  id: suggestion.id,
                  lat: suggestion.lat,
                  lng: suggestion.lng,
                  type: 'suggestion',
                  title: suggestion.title
                }
              ]}
            />
          </div>
        )}

        {/* Photo */}
        {suggestion.photoUrl && (
          <div className="h-48 rounded-lg overflow-hidden bg-slate-900">
            <img
              src={suggestion.photoUrl}
              alt={suggestion.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Upvote */}
        <div className="pt-3 border-t border-slate-700">
          <Upvote postId={suggestion.id} />
        </div>
      </div>
    </div>
  );
}
