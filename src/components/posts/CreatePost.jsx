import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { usePosts } from '../../hooks/usePosts';
import { POST_CATEGORIES } from '../../constants';
import ImageUpload from '../common/ImageUpload';
import LocationPicker from '../map/LocationPicker';
import CategoryBadge from '../common/CategoryBadge';

export default function CreatePost() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { createPost } = usePosts();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: POST_CATEGORIES[0],
    imageUrl: '',
    videoUrl: '',
    location: '',
    lat: null,
    lng: null
  });

  const [isVideo, setIsVideo] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!user) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8 text-center">
        <p className="text-slate-300 mb-4">Please sign in to create a post.</p>
        <button
          onClick={() => navigate('/')}
          className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition"
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
        imageUrl: e.target.result
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
    if (!formData.title || !formData.description || !formData.lat) {
      alert('Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      await createPost({
        title: formData.title,
        description: formData.description,
        category: formData.category,
        imageUrl: formData.imageUrl || null,
        videoUrl: formData.videoUrl || null,
        location: formData.location,
        lat: formData.lat,
        lng: formData.lng,
        authorId: user.uid,
        authorName: user.displayName,
        authorAvatar: user.photoURL,
        type: 'post'
      });

      navigate('/feed');
    } catch (error) {
      console.error('Error creating post:', error);
      alert('Error creating post. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 pb-24 md:pb-8">
      <h1 className="text-3xl font-bold text-white mb-8">Share Something</h1>

      <form onSubmit={handleSubmit} className="space-y-6 bg-slate-800/50 p-6 rounded-lg border border-slate-700">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Title *
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
            placeholder="What would you like to share?"
            className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500"
            required
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Description *
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
            placeholder="Tell us more about what you're sharing..."
            rows={4}
            className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500"
            required
          />
        </div>

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
            {POST_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          <div className="mt-2">
            <CategoryBadge category={formData.category} />
          </div>
        </div>

        {/* Media */}
        <div className="space-y-2">
          <div className="flex items-center gap-4 mb-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                checked={!isVideo}
                onChange={() => setIsVideo(false)}
                className="w-4 h-4"
              />
              <span className="text-slate-300">Image</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                checked={isVideo}
                onChange={() => setIsVideo(true)}
                className="w-4 h-4"
              />
              <span className="text-slate-300">Video URL</span>
            </label>
          </div>

          {!isVideo ? (
            <ImageUpload onImageSelected={handleImageSelected} existingUrl={formData.imageUrl} />
          ) : (
            <input
              type="url"
              value={formData.videoUrl}
              onChange={(e) => setFormData((prev) => ({ ...prev, videoUrl: e.target.value }))}
              placeholder="Paste YouTube or TikTok URL..."
              className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500"
            />
          )}
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
          {loading ? 'Posting...' : 'Post'}
        </button>
      </form>
    </div>
  );
}
