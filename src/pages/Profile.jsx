import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc, updateDoc, collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase-config';
import { useAuth } from '../hooks/useAuth';
import InterestsSelector from '../components/auth/InterestsSelector';
import PostDetail from '../components/posts/PostDetail';
import { User, Bell, BellOff, Save, Loader2, MapPin, Heart, MessageCircle } from 'lucide-react';

export default function Profile() {
  const { userId } = useParams();
  const { user: currentUser, refreshUser } = useAuth();
  const isOwnProfile = !userId || userId === 'me' || userId === currentUser?.uid;
  const targetUid = isOwnProfile ? currentUser?.uid : userId;

  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [interests, setInterests] = useState([]);
  const [customText, setCustomText] = useState('');
  const [notifications, setNotifications] = useState(true);
  const [selectedPost, setSelectedPost] = useState(null);

  // Load profile
  useEffect(() => {
    if (!targetUid) return;

    const loadProfile = async () => {
      const userDoc = await getDoc(doc(db, 'users', targetUid));
      if (userDoc.exists()) {
        const data = userDoc.data();
        setProfile(data);
        setInterests(data.interests || []);
        setCustomText((data.customInterests || []).join(', '));
        setNotifications(data.notificationsEnabled ?? true);
      }
      setLoading(false);
    };

    loadProfile();
  }, [targetUid]);

  // Load user's posts
  useEffect(() => {
    if (!targetUid) return;

    const q = query(
      collection(db, 'posts'),
      where('authorId', '==', targetUid),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setPosts(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
    });

    return unsubscribe;
  }, [targetUid]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const customInterests = customText.split(',').map(s => s.trim()).filter(Boolean);
      await updateDoc(doc(db, 'users', targetUid), {
        interests,
        customInterests,
        notificationsEnabled: notifications
      });
      setEditing(false);
      await refreshUser();
    } catch (err) {
      alert('Error saving: ' + err.message);
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 size={24} className="animate-spin text-emerald-400" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-slate-400">User not found</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      {/* Profile header */}
      <div className="flex items-center gap-4 mb-6">
        {profile.photoURL ? (
          <img src={profile.photoURL} alt="" className="w-16 h-16 rounded-full ring-2 ring-emerald-500/30" />
        ) : (
          <div className="w-16 h-16 rounded-full bg-emerald-600/30 flex items-center justify-center ring-2 ring-emerald-500/30">
            <User size={24} className="text-emerald-400" />
          </div>
        )}
        <div>
          <h1 className="text-xl font-bold text-white">{profile.displayName || 'Anonymous'}</h1>
          <p className="text-sm text-slate-400">{posts.length} post{posts.length !== 1 ? 's' : ''}</p>
        </div>
      </div>

      {/* Interests section */}
      {isOwnProfile && (
        <div className="bg-slate-900/50 rounded-2xl border border-white/5 p-5 mb-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-white">Your Interests</h2>
            {!editing && (
              <button onClick={() => setEditing(true)} className="text-xs text-emerald-400 hover:text-emerald-300">
                Edit
              </button>
            )}
          </div>

          {editing ? (
            <div className="space-y-4">
              <InterestsSelector
                selected={interests}
                onChange={setInterests}
                customText={customText}
                onCustomChange={setCustomText}
              />
              <div className="flex items-center justify-between pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  {notifications ? <Bell size={14} className="text-emerald-400" /> : <BellOff size={14} className="text-slate-500" />}
                  <span className="text-sm text-slate-300">Email notifications</span>
                  <input
                    type="checkbox"
                    checked={notifications}
                    onChange={(e) => setNotifications(e.target.checked)}
                    className="accent-emerald-500"
                  />
                </label>
                <div className="flex gap-2">
                  <button onClick={() => setEditing(false)} className="px-3 py-1.5 text-sm text-slate-400 hover:text-white transition">
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-white rounded-lg text-sm font-medium transition"
                  >
                    {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                    Save
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {(profile.interests || []).map(i => (
                <span key={i} className="px-2.5 py-1 bg-emerald-500/15 text-emerald-300 rounded-full text-xs font-medium">{i}</span>
              ))}
              {(profile.customInterests || []).map(i => (
                <span key={i} className="px-2.5 py-1 bg-slate-700/50 text-slate-300 rounded-full text-xs font-medium">{i}</span>
              ))}
              {(profile.interests || []).length === 0 && (profile.customInterests || []).length === 0 && (
                <p className="text-xs text-slate-500">No interests set yet</p>
              )}
            </div>
          )}
        </div>
      )}

      {/* Posts */}
      <h2 className="text-sm font-semibold text-white mb-3">
        {isOwnProfile ? 'Your Posts' : `Posts by ${profile.displayName?.split(' ')[0] || 'User'}`}
      </h2>
      {posts.length === 0 ? (
        <p className="text-sm text-slate-500 py-8 text-center">No posts yet</p>
      ) : (
        <div className="space-y-3">
          {posts.map(post => (
            <button
              key={post.id}
              onClick={() => setSelectedPost(post)}
              className="w-full text-left bg-slate-900/50 rounded-xl border border-white/5 p-4 hover:border-emerald-500/20 transition"
            >
              <div className="flex items-start gap-3">
                {post.imageUrl && (
                  <img src={post.imageUrl} alt="" className="w-16 h-16 rounded-lg object-cover flex-shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    {post.category && (
                      <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 rounded-full text-[10px] font-medium">{post.category}</span>
                    )}
                  </div>
                  <h3 className="text-sm font-medium text-white truncate">{post.title}</h3>
                  <p className="text-xs text-slate-400 line-clamp-2 mt-0.5">{post.description}</p>
                  <div className="flex items-center gap-3 mt-2 text-xs text-slate-500">
                    {post.location && (
                      <span className="flex items-center gap-1"><MapPin size={10} />{typeof post.location === 'string' ? post.location : post.location.address}</span>
                    )}
                    <span className="flex items-center gap-1"><Heart size={10} />{post.upvoteCount || 0}</span>
                    <span className="flex items-center gap-1"><MessageCircle size={10} />{post.commentCount || 0}</span>
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      {selectedPost && (
        <PostDetail post={selectedPost} isOpen={true} onClose={() => setSelectedPost(null)} />
      )}
    </div>
  );
}
