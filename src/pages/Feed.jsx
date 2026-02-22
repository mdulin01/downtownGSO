import PostFeed from '../components/posts/PostFeed';

export default function Feed() {
  return (
    <div className="pt-16">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Community Feed</h1>
          <p className="text-slate-400">Discover what people are sharing about downtown Greensboro</p>
        </div>
        <PostFeed />
      </div>
    </div>
  );
}
