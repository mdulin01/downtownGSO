import { Link, useLocation } from 'react-router-dom';
import { Home, Map, Plus, Store, User } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

export default function MobileNav() {
  const location = useLocation();
  const { user } = useAuth();

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="fixed bottom-0 left-0 right-0 md:hidden bg-slate-900 border-t border-slate-700 z-40">
      <div className="flex items-center justify-around h-20">
        <Link
          to="/"
          className={`flex flex-col items-center justify-center w-20 h-20 ${
            isActive('/') ? 'text-blue-400' : 'text-slate-400 hover:text-slate-300'
          } transition`}
        >
          <Home size={24} />
          <span className="text-xs mt-1">Home</span>
        </Link>

        <Link
          to="/map"
          className={`flex flex-col items-center justify-center w-20 h-20 ${
            isActive('/map') ? 'text-blue-400' : 'text-slate-400 hover:text-slate-300'
          } transition`}
        >
          <Map size={24} />
          <span className="text-xs mt-1">Map</span>
        </Link>

        <Link
          to={user ? '/post/new' : '/'}
          className="flex flex-col items-center justify-center w-20 h-20 bg-blue-600 hover:bg-blue-700 text-white rounded-full transform -translate-y-8 transition"
        >
          <Plus size={28} />
          <span className="text-xs mt-1">Add</span>
        </Link>

        <Link
          to="/businesses"
          className={`flex flex-col items-center justify-center w-20 h-20 ${
            isActive('/businesses') ? 'text-blue-400' : 'text-slate-400 hover:text-slate-300'
          } transition`}
        >
          <Store size={24} />
          <span className="text-xs mt-1">Businesses</span>
        </Link>

        <Link
          to={user ? '/profile' : '/'}
          className={`flex flex-col items-center justify-center w-20 h-20 ${
            isActive('/profile') ? 'text-blue-400' : 'text-slate-400 hover:text-slate-300'
          } transition`}
        >
          <User size={24} />
          <span className="text-xs mt-1">Profile</span>
        </Link>
      </div>
    </nav>
  );
}
