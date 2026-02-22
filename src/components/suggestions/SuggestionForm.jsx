import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { SUGGESTION_CATEGORIES, SUGGESTION_IMPACT } from '../../constants';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebase-config';
import ImageUpload from '../common/ImageUpload';
import LocationPicker from '../map/LocationPicker';
import CategoryBadge from '../common/CategoryBadge';

export default function SuggestionForm() {
  const navigate = useNavigate();
  const { user } = useAuth();

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

  if (!user) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8 text-center">
        <p className="text-slate-300 mb-4">Please sign in to create a suggestion.</p>
        <button
          onClick={() => navigate('/')}
          className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition"
        >
          Go Home
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
            className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
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
            className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
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
            className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
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
            className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
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
            className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
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
          className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 text-white rounded-lg font-bold transition"
        >
          {loading ? 'Submitting...' : 'Submit Suggestion'}
        </button>
      </form>
    </div>
  );
}
