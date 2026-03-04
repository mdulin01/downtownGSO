import { MessageSquare } from 'lucide-react';
import PostFeed from '../components/posts/PostFeed';

export default function Feed() {
  return (
    <div className="pt-16 pb-24 md:pb-8">
      <div className="bg-gradient-to-br from-emerald-900/30 via-slate-900 to-slate-900 px-4 py-10 border-b border-white/5">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center text-2xl">
              💬
            </div>
            <div>
              <h1 className="text-3xl font-black text-white">Discussion</h1>
              <p className="text-slate-400 text-sm">Join the conversation about downtown Greensboro</p>
            </div>
          </div>
        </div>
      </div>
      <div className="max-w-6xl mx-auto px-4 py-8">
        <PostFeed />
      </div>
    </div>
  );
}
