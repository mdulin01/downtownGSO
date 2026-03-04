import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogIn } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { SUGGESTION_CATEGORIES, SUGGESTION_IMPACT } from '../../constants';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebase-config';
import ImageUpload from '../common/ImageUpload';
import LocationPicker from '../map/LocationPicker';
import CategoryBadge from '../common/CategoryBadge';

export default function SuggestionForm() {
  const navigate = useNavigate();
  const { user, signIn } = useAuth();

  const [formData, setFormData] = useState({
    category: SUGGESTION_CATEGORIES[0],
    title: '',
    problem: '',
    suggestion: '',
    impact: SUGGESTION_IMPACT[0],
    photoUrl: '',
    location: '',
    lat: null,
    lng: null
  });

  const [loading, setLoading] = useState(false);

  const handleSignIn = async () => {
    try {
      await signIn();
    } catch (error) {
      console.error('Sign in error:', error);
      alert('Sign in failed: ' + error.message);
    }
  };

  if (!user) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-amber-500/20 flex items-center justify-center mx-auto">
          <LogIn size={32} className="text-amber-400" />
        </div>
        <div>
          <h2 className="text-2xl font-black text-white mb-2">Sign in to Share Ideas</h2>
          <p className="text-slate-400">Join the community to suggest improvements for downtown Greensboro.</p>
        </div>
        <button
          onClick={handleSignIn}
          className="inline-flex items-center gap-3 px-6 py-3 bg-white hover:bg-slate-100 text-slate-900 rounded-xl font-bold transition shadow-lg"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
          Sign in with Google
        </button>
        <button
          onClick={() => navigate('/')}
          className="block mx-auto text-sm text-slate-500 hover:text-slate-300 transition"
        >
          &larr; Back to main site
        </button>
      </div>
    );
  }

  const handleImageSelected = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      setFormData((prev) => ({
        ...prev,
        photoUrl: e.target.result
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleLocationChange = (location) => {
    setFormData((prev) => ({
      ...prev,
      location: location.address,
      lat: location.lat,
      lng: location.lng
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.problem || !formData.suggestion || !formData.lat) {
      alert('Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      await addDoc(collection(db, 'suggestions'), {
        category: formData.category,
        title: formData.title,
        problem: formData.problem,
        suggestion: formData.suggestion,
        impact: formData.impact,
        status: 'New',
        photoUrl: formData.photoUrl || null,
        location: formData.location,
        lat: formData.lat,
        lng: formData.lng,
        authorId: user.uid,
        authorName: user.displayName,
        authorAvatar: user.photoURL,
        createdAt: serverTimestamp(),
        upvoteCount: 0
      });

      navigate('/suggestions');
    } catch (error) {
      console.error('Error creating suggestion:', error);
      alert('Error creating suggestion. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 pb-24 md:pb-8">
      <h1 className="text-3xl font-bold text-white mb-8">How Can We Improve Downtown?</h1>

      <form onSubmit={handleSubmit} className="space-y-6 bg-slate-800/50 p-6 rounded-lg border border-slate-700">
        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Category *
          </label>
          <select
            value={formData.category}
            onChange={(e) => setFormData((prev) => ({ ...prev, category: e.target.value }))}
            className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-emerald-500"
          >
            {SUGGESTION_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          <div className="mt-2">
            <CategoryBadge category={formData.category} />
          </div>
        </div>

        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Title *
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
            placeholder="Summarize your idea..."
            className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500"
            required
          />
        </div>

        {/* Problem */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            What's the problem? *
          </label>
          <textarea
            value={formData.problem}
            onChange={(e) => setFormData((prev) => ({ ...prev, problem: e.target.value }))}
            placeholder="Describe the issue you've noticed..."
            rows={3}
            className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500"
            required
          />
        </div>

        {/* Suggestion */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            What's your suggestion? *
          </label>
          <textarea
            value={formData.suggestion}
            onChange={(e) => setFormData((prev) => ({ ...prev, suggestion: e.target.value }))}
            placeholder="What would improve the situation?"
            rows={3}
            className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500"
            required
          />
        </div>

        {/* Impact */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Impact Timeline *
          </label>
          <select
            value={formData.impact}
            onChange={(e) => setFormData((prev) => ({ ...prev, impact: e.target.value }))}
            className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-emerald-500"
          >
            {SUGGESTION_IMPACT.map((impact) => (
              <option key={impact} value={impact}>
                {impact}
              </option>
            ))}
          </select>
          <div className="mt-2">
            <CategoryBadge category={formData.impact} />
          </div>
        </div>

        {/* Photo */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Photo (optional)
          </label>
          <p className="text-sm text-slate-400 mb-2">Upload a photo of the current state</p>
          <ImageUpload onImageSelected={handleImageSelected} existingUrl={formData.photoUrl} />
        </div>

        {/* Location */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Location *
          </label>
          <LocationPicker onChange={handleLocationChange} />
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full px-6 py-3 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-600 text-white rounded-lg font-bold transition"
        >
          {loading ? 'Submitting...' : 'Submit Suggestion'}
        </button>
      </form>
    </div>
  );
}
