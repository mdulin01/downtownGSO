import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogIn } from 'lucide-react';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useAuth } from '../../hooks/useAuth';
import { usePosts } from '../../hooks/usePosts';
import { storage } from '../../firebase-config';
import { POST_CATEGORIES } from '../../constants';
import ImageUpload from '../common/ImageUpload';
import LocationPicker from '../map/LocationPicker';
import CategoryBadge from '../common/CategoryBadge';
import { compressImage } from '../../utils/imageUtils';

export default function CreatePost() {
  const navigate = useNavigate();
  const { user, signIn } = useAuth();
  const { createPost } = usePosts();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: POST_CATEGORIES[0],
    videoUrl: '',
    location: '',
    lat: null,
    lng: null
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isVideo, setIsVideo] = useState(false);
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
        <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 flex items-center justify-center mx-auto">
          <LogIn size={32} className="text-emerald-400" />
        </div>
        <div>
          <h2 className="text-2xl font-black text-white mb-2">Sign in to Share</h2>
          <p className="text-slate-400">Join the community to share posts, ideas, and more about downtown Greensboro.</p>
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
    setImageFile(file);
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target.result);
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
      // Compress and upload image to Firebase Storage if one was selected
      let imageUrl = null;
      if (imageFile) {
        const compressed = await compressImage(imageFile);
        const storageRef = ref(storage, `posts/${user.uid}_${Date.now()}.jpg`);
        await uploadBytes(storageRef, compressed);
        imageUrl = await getDownloadURL(storageRef);
      }

      await createPost({
        title: formData.title,
        description: formData.description,
        category: formData.category,
        imageUrl,
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
            <ImageUpload onImageSelected={handleImageSelected} existingUrl={imagePreview} />
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
