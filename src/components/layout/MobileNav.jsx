import { Link, useLocation } from 'react-router-dom';
import { Home, Map, Plus, Store, Calendar } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

export default function MobileNav() {
  const location = useLocation();
  const { user } = useAuth();

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="fixed bottom-0 left-0 right-0 md:hidden bg-slate-950/90 backdrop-blur-xl border-t border-white/5 z-40">
      <div className="flex items-center justify-around h-16 px-2">
        <Link
          to="/"
          className={`flex flex-col items-center justify-center w-16 py-1 rounded-lg transition ${
            isActive('/') ? 'text-emerald-400' : 'text-slate-500 hover:text-slate-300'
          }`}
        >
          <Home size={20} />
          <span className="text-[10px] mt-0.5 font-medium">Home</span>
        </Link>

        <Link
          to="/map"
          className={`flex flex-col items-center justify-center w-16 py-1 rounded-lg transition ${
            isActive('/map') ? 'text-emerald-400' : 'text-slate-500 hover:text-slate-300'
          }`}
        >
          <Map size={20} />
          <span className="text-[10px] mt-0.5 font-medium">Map</span>
        </Link>

        <Link
          to={user ? '/post/new' : '/'}
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
          <span className="text-[10px] mt-0.5 font-medium">Local</span>
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
