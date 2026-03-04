import { MessageCircle, MapPin, Flame } from 'lucide-react';
import CategoryBadge from '../common/CategoryBadge';
import StarRating from '../common/StarRating';
import Upvote from '../common/Upvote';
import VideoEmbed from '../common/VideoEmbed';
import { getPostConfig } from '../../utils/categoryConfig';

function timeAgo(date) {
  if (!date) return '';
  const d = date.toDate ? date.toDate() : date.seconds ? new Date(date.seconds * 1000) : new Date(date);
  const seconds = Math.floor((new Date() - d) / 1000);
  const intervals = {
    year: 31536000,
    month: 2592000,
    week: 604800,
    day: 86400,
    hour: 3600,
    minute: 60
  };

  for (const [key, value] of Object.entries(intervals)) {
    const interval = Math.floor(seconds / value);
    if (interval >= 1) {
      return `${interval}${key[0]} ago`;
    }
  }
  return 'now';
}

export default function PostCard({ post, onOpenDetail }) {
  const config = getPostConfig(post.category);
  const Icon = config.icon;
  const isHot = (post.upvoteCount || 0) > 5;

  const handleClick = () => {
    if (onOpenDetail) onOpenDetail(post);
  };

  return (
    <div
      onClick={handleClick}
      className={`group bg-slate-800/60 hover:bg-slate-800 rounded-xl overflow-hidden transition-all cursor-pointer border border-slate-700/50 ${config.hoverBorder} hover:shadow-lg ${config.hoverShadow}`}
    >
      {/* Image/Video Preview or Gradient */}
      {post.imageUrl ? (
        <div className="w-full h-44 overflow-hidden bg-slate-900 relative">
          <img
            src={post.imageUrl}
            alt={post.title}
            className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent" />
          {isHot && (
            <div className="absolute top-2 left-2 flex items-center gap-1 bg-orange-500/90 backdrop-blur-sm px-2 py-0.5 rounded-full">
              <Flame size={12} className="text-white" />
              <span className="text-[10px] font-bold text-white">Hot</span>
            </div>
          )}
        </div>
      ) : post.videoUrl ? (
        <div className="w-full h-44 bg-black relative">
          <VideoEmbed url={post.videoUrl} />
          {isHot && (
            <div className="absolute top-2 left-2 flex items-center gap-1 bg-orange-500/90 backdrop-blur-sm px-2 py-0.5 rounded-full z-10">
              <Flame size={12} className="text-white" />
              <span className="text-[10px] font-bold text-white">Hot</span>
            </div>
          )}
        </div>
      ) : (
        <div className={`w-full h-24 bg-gradient-to-br ${config.gradient} flex items-center justify-center relative`}>
          <Icon size={28} className={config.iconColor} />
          {isHot && (
            <div className="absolute top-2 left-2 flex items-center gap-1 bg-orange-500/90 backdrop-blur-sm px-2 py-0.5 rounded-full">
              <Flame size={12} className="text-white" />
              <span className="text-[10px] font-bold text-white">Hot</span>
            </div>
          )}
        </div>
      )}

      <div className="p-4 space-y-3">
        {/* Category + Time */}
        <div className="flex items-center justify-between">
          {post.category && <CategoryBadge category={post.category} size="sm" />}
          <span className="text-xs text-slate-500">{timeAgo(post.createdAt)}</span>
        </div>

        {/* Title */}
        <h3 className={`text-lg font-bold text-white line-clamp-2 ${config.hoverText} transition`}>{post.title}</h3>

        {/* Description */}
        <p className="text-slate-400 text-sm line-clamp-2">{post.description}</p>

        {/* Location */}
        {post.location && (
          <div className="flex items-center gap-2 text-slate-500 text-xs">
            <MapPin size={12} />
            <span className="truncate">
              {typeof post.location === 'string' ? post.location : post.location.address || 'Downtown GSO'}
            </span>
          </div>
        )}

        {/* Footer: Author + Actions */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-700/50">
          <div className="flex items-center gap-2 min-w-0">
            {post.authorAvatar ? (
              <img
                src={post.authorAvatar}
                alt={post.authorName}
                className="w-6 h-6 rounded-full flex-shrink-0"
              />
            ) : (
              <div className="w-6 h-6 rounded-full bg-emerald-600/30 flex items-center justify-center flex-shrink-0">
                <span className="text-[10px] font-bold text-emerald-400">
                  {(post.authorName || 'U').charAt(0)}
                </span>
              </div>
            )}
            <span className="text-xs text-slate-400 truncate">{post.authorName}</span>
          </div>
          <div className="flex items-center gap-2">
            <Upvote postId={post.id} />
            {post.averageRating > 0 && (
              <StarRating rating={post.averageRating} count={post.totalRatings} size="sm" />
            )}
            <div className="flex items-center gap-1 text-slate-500 text-xs">
              <MessageCircle size={14} />
              <span>{post.commentCount || 0}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
