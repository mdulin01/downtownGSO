import { useNavigate } from 'react-router-dom';
import { MessageCircle, MapPin } from 'lucide-react';
import CategoryBadge from '../common/CategoryBadge';
import Upvote from '../common/Upvote';
import VideoEmbed from '../common/VideoEmbed';

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

export default function PostCard({ post }) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/post/${post.id}`);
  };

  return (
    <div
      onClick={handleClick}
      className="bg-slate-800/50 hover:bg-slate-800 rounded-lg overflow-hidden transition cursor-pointer border border-slate-700 hover:border-slate-600"
    >
      {/* Image/Video Preview */}
      {post.imageUrl && (
        <div className="w-full h-48 overflow-hidden bg-slate-900">
          <img
            src={post.imageUrl}
            alt={post.title}
            className="w-full h-full object-cover hover:scale-105 transition"
          />
        </div>
      )}

      {post.videoUrl && (
        <div className="w-full h-48 bg-black">
          <VideoEmbed url={post.videoUrl} />
        </div>
      )}

      <div className="p-4 space-y-3">
        {/* Title and Category */}
        <div className="space-y-2">
          <h3 className="text-lg font-bold text-white line-clamp-2">{post.title}</h3>
          {post.category && (
            <CategoryBadge category={post.category} size="sm" />
          )}
        </div>

        {/* Description */}
        <p className="text-slate-300 text-sm line-clamp-3">{post.description}</p>

        {/* Location */}
        {post.location && (
          <div className="flex items-center gap-2 text-slate-400 text-sm">
            <MapPin size={16} />
            <span className="truncate">
              {typeof post.location === 'string' ? post.location : post.location.address || 'Downtown GSO'}
            </span>
          </div>
        )}

        {/* Author */}
        <div className="flex items-center gap-2 pt-2 border-t border-slate-700">
          {post.authorAvatar && (
            <img
              src={post.authorAvatar}
              alt={post.authorName}
              className="w-8 h-8 rounded-full"
            />
          )}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-slate-200 truncate">
              {post.authorName}
            </p>
            <p className="text-xs text-slate-400">{timeAgo(post.createdAt)}</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 pt-2 border-t border-slate-700">
          <Upvote postId={post.id} />
          <button className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-800 text-slate-400 hover:text-slate-300 hover:bg-slate-700 transition text-sm">
            <MessageCircle size={18} />
            <span>{post.commentCount || 0}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
