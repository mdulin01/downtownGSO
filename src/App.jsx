import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './hooks/useAuth';
import Header from './components/layout/Header';
import MobileNav from './components/layout/MobileNav';
import BuildFooter from './components/layout/BuildFooter';

// Pages
import Home from './pages/Home';
import MapExplore from './pages/MapExplore';
import Feed from './pages/Feed';
import Suggestions from './pages/Suggestions';
import Businesses from './pages/Businesses';
import Events from './pages/Events';
import About from './pages/About';
import Admin from './pages/Admin';

// Forms
import CreatePost from './components/posts/CreatePost';
import SuggestionForm from './components/suggestions/SuggestionForm';

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-slate-950 text-white">
          <Header />

          <main className="pt-16 md:pt-0">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/map" element={<MapExplore />} />
              <Route path="/forum" element={<Feed />} />
              <Route path="/feed" element={<Feed />} />
              <Route path="/ideas" element={<Suggestions />} />
              <Route path="/suggestions" element={<Suggestions />} />
              <Route path="/businesses" element={<Businesses />} />
              <Route path="/events" element={<Events />} />
              <Route path="/about" element={<About />} />
              <Route path="/post/new" element={<CreatePost />} />
              <Route path="/suggestion/new" element={<SuggestionForm />} />
              <Route path="/admin" element={<Admin />} />
            </Routes>
          </main>

          <BuildFooter />
          <MobileNav />
        </div>
      </Router>
    </AuthProvider>
  );
}
