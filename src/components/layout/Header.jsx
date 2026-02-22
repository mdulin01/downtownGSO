import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, LogOut } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

export default function Header() {
  const { user, signIn, signOut } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSignIn = async () => {
    try {
      await signIn();
    } catch (error) {
      console.error('Sign in error:', error);
      alert('Sign in failed: ' + error.message);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
      setMobileMenuOpen(false);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const navLinks = [
    { label: 'Explore', href: '/map' },
    { label: 'Feed', href: '/feed' },
    { label: 'Suggestions', href: '/suggestions' },
    { label: 'Businesses', href: '/businesses' },
    { label: 'Events', href: '/events' }
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-slate-900/95 backdrop-blur">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 text-2xl font-bold text-blue-400 hover:text-blue-300 transition">
            <span>🏙️</span>
            <span>DowntownGSO</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className="text-slate-300 hover:text-white transition font-medium"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right Side */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-4">
                <button
                  onClick={() => navigate('/post/new')}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition"
                >
                  Share Something
                </button>
                <div className="relative group">
                  <button className="flex items-center gap-2">
                    {user.photoURL ? (
                      <img
                        src={user.photoURL}
                        alt={user.displayName}
                        className="w-10 h-10 rounded-full"
                      />
                    ) : (
                      <div className="w-10 h-10 bg-slate-600 rounded-full flex items-center justify-center text-white font-bold">
                        {user.displayName?.charAt(0) || 'U'}
                      </div>
                    )}
                    <span className="text-slate-300">{user.displayName || 'User'}</span>
                  </button>
                  <div className="absolute right-0 mt-2 w-48 bg-slate-800 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition">
                    <button
                      onClick={() => navigate('/admin')}
                      className="w-full text-left px-4 py-2 text-slate-300 hover:text-white flex items-center gap-2 hover:bg-slate-700"
                    >
                      Admin
                    </button>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-slate-300 hover:text-white flex items-center gap-2 rounded-lg hover:bg-slate-700"
                    >
                      <LogOut size={18} />
                      Sign Out
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <button
                onClick={handleSignIn}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition"
              >
                Sign In
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-slate-300 hover:text-white"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-4 border-t border-slate-700">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-2 text-slate-300 hover:text-white transition"
              >
                {link.label}
              </Link>
            ))}
            {user ? (
              <>
                <button
                  onClick={() => { navigate('/admin'); setMobileMenuOpen(false); }}
                  className="block w-full text-left px-4 py-2 text-slate-300 hover:text-white transition"
                >
                  Admin
                </button>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-slate-300 hover:text-white transition"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <button
                onClick={handleSignIn}
                className="block w-full text-left px-4 py-2 text-blue-400 hover:text-blue-300 font-medium transition"
              >
                Sign In
              </button>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
