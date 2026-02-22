export default function VideoEmbed({ url }) {
  if (!url) return null;

  // Extract YouTube video ID
  const youtubeMatch = url.match(/(?:https?:\/\/)?(?:www\.)?(?:youtube\.com|youtu\.be)\/(?:watch\?v=)?([a-zA-Z0-9_-]{11})/);
  if (youtubeMatch) {
    const videoId = youtubeMatch[1];
    return (
      <div className="aspect-video w-full rounded-lg overflow-hidden">
        <iframe
          width="100%"
          height="100%"
          src={`https://www.youtube.com/embed/${videoId}`}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    );
  }

  // Extract TikTok video ID
  const tiktokMatch = url.match(/(?:https?:\/\/)?(?:www\.)?(?:tiktok\.com\/@[\w.]+\/video\/|vm\.tiktok\.com\/)(\d+)/);
  if (tiktokMatch) {
    const videoId = tiktokMatch[1];
    return (
      <div className="aspect-video w-full rounded-lg overflow-hidden bg-black flex items-center justify-center">
        <iframe
          width="100%"
          height="100%"
          src={`https://www.tiktok.com/embed/v/${videoId}`}
          frameBorder="0"
          allow="autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    );
  }

  // Fallback: show link
  return (
    <div className="p-4 bg-slate-800 rounded-lg text-slate-300">
      <p className="text-sm">Video link: </p>
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-emerald-400 hover:text-emerald-300 truncate break-all"
      >
        {url}
      </a>
    </div>
  );
}
