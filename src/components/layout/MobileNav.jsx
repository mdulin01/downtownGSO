import { Link, useLocation } from 'react-router-dom';
import { MessageCircle, Newspaper, Store, Calendar, Plus } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

export default function MobileNav() {
  const location = useLocation();
  const { user, signIn } = useAuth();

  const isActive = (path) => location.pathname === path;

  const handlePlusClick = async (e) => {
    if (!user) {
      e.preventDefault();
      try {
        await signIn();
      } catch (error) {
        console.error('Sign in error:', error);
      }
    }
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 md:hidden bg-slate-950/90 backdrop-blur-xl border-t border-white/5 z-40">
      <div className="flex items-center justify-around h-16 px-2">
        <Link
          to="/forum"
          className={`flex flex-col items-center justify-center w-16 py-1 rounded-lg transition ${
            isActive('/forum') || isActive('/feed') ? 'text-emerald-400' : 'text-slate-500 hover:text-slate-300'
          }`}
        >
          <MessageCircle size={20} />
          <span className="text-[10px] mt-0.5 font-medium">Chat</span>
        </Link>

        <Link
          to="/news"
          className={`flex flex-col items-center justify-center w-16 py-1 rounded-lg transition ${
            isActive('/news') ? 'text-emerald-400' : 'text-slate-500 hover:text-slate-300'
          }`}
        >
          <Newspaper size={20} />
          <span className="text-[10px] mt-0.5 font-medium">News</span>
        </Link>

        <Link
          to={user ? '/post/new' : '#'}
          onClick={handlePlusClick}
          className="flex items-center justify-center w-12 h-12 bg-emerald-500 hover:bg-emerald-400 text-white rounded-xl transition shadow-lg shadow-emerald-500/30 -mt-4"
        >
          <Plus size={24} />
        </Link>

        <Link
          to="/businesses"
          className={`flex flex-col items-center justify-center w-16 py-1 rounded-lg transition ${
            isActive('/businesses') ? 'text-emerald-400' : 'text-slate-500 hover:text-slate-300'
          }`}
        >
          <Store size={20} />
          <span className="text-[10px] mt-0.5 font-medium">Places</span>
        </Link>

        <Link
          to="/events"
          className={`flex flex-col items-center justify-center w-16 py-1 rounded-lg transition ${
            isActive('/events') ? 'text-emerald-400' : 'text-slate-500 hover:text-slate-300'
          }`}
        >
          <Calendar size={20} />
          <span className="text-[10px] mt-0.5 font-medium">Events</span>
        </Link>
      </div>
    </nav>
  );
}
