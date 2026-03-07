import { useState } from 'react';
import { Share2, Check, Link2 } from 'lucide-react';

export default function ShareButton({ title, text, url, size = 14, className = '' }) {
  const [copied, setCopied] = useState(false);
  const shareUrl = url || window.location.href;

  const handleShare = async (e) => {
    e.stopPropagation();

    // Use Web Share API on mobile if available
    if (navigator.share) {
      try {
        await navigator.share({
          title: title || 'DowntownGSO',
          text: text || '',
          url: shareUrl,
        });
        return;
      } catch (err) {
        if (err.name === 'AbortError') return;
      }
    }

    // Fallback: copy to clipboard
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <button
      onClick={handleShare}
      className={`flex items-center gap-1 text-slate-500 hover:text-emerald-400 transition ${className}`}
      title={copied ? 'Copied!' : 'Share'}
    >
      {copied ? (
        <>
          <Check size={size} className="text-emerald-400" />
          <span className="text-xs text-emerald-400">Copied</span>
        </>
      ) : (
        <Share2 size={size} />
      )}
    </button>
  );
}
