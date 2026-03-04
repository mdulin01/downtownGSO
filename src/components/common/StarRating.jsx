import { Star } from 'lucide-react';

const sizes = {
  sm: { star: 12, text: 'text-[10px]' },
  md: { star: 14, text: 'text-xs' },
  lg: { star: 16, text: 'text-sm' },
};

export default function StarRating({ rating = 0, count = 0, size = 'sm', accentColor = 'text-yellow-400' }) {
  const { star: starSize, text: textClass } = sizes[size] || sizes.sm;

  return (
    <div className="flex items-center gap-1">
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((i) => {
          const filled = i <= Math.round(rating);
          return (
            <Star
              key={i}
              size={starSize}
              className={filled ? accentColor : 'text-slate-600'}
              fill={filled ? 'currentColor' : 'none'}
            />
          );
        })}
      </div>
      {count > 0 && (
        <span className={`${textClass} text-slate-500`}>({count})</span>
      )}
    </div>
  );
}
