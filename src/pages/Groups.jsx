import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Plus, Lock, Globe, MessageCircle, ChevronRight } from 'lucide-react';
import { collection, query, orderBy, onSnapshot, addDoc, updateDoc, arrayUnion, arrayRemove, doc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase-config';
import { useAuth } from '../hooks/useAuth';

export default function Groups() {
  const { user, signIn } = useAuth();
  const navigate = useNavigate();
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [newGroup, setNewGroup] = useState({ name: '', description: '', privacy: 'public' });
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    const q = query(collection(db, 'groups'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setGroups(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const handleCreateGroup = async (e) => {
    e.preventDefault();
    if (!user || !newGroup.name.trim()) return;
    setCreating(true);
    try {
      await addDoc(collection(db, 'groups'), {
        name: newGroup.name.trim(),
        description: newGroup.description.trim(),
        privacy: newGroup.privacy,
        createdBy: user.uid,
        createdByName: user.displayName,
        createdByPhoto: user.photoURL,
        members: [user.uid],
        memberCount: 1,
        createdAt: serverTimestamp()
      });
      setNewGroup({ name: '', description: '', privacy: 'public' });
      setShowCreate(false);
    } catch (error) {
      console.error('Error creating group:', error);
    }
    setCreating(false);
  };

  const handleJoinLeave = async (group) => {
    if (!user) {
      try { await signIn(); } catch (e) { return; }
      return;
    }
    const groupRef = doc(db, 'groups', group.id);
    const isMember = group.members?.includes(user.uid);
    try {
      await updateDoc(groupRef, {
        members: isMember ? arrayRemove(user.uid) : arrayUnion(user.uid),
        memberCount: (group.memberCount || 0) + (isMember ? -1 : 1)
      });
    } catch (error) {
      console.error('Error updating membership:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="w-full pb-24 md:pb-8">
      <div className="max-w-4xl mx-auto px-4 pt-24 md:pt-24">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-violet-500/20 flex items-center justify-center">
              <Users size={20} className="text-violet-400" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-white">Groups</h1>
              <p className="text-sm text-slate-400">Connect with your neighbors and community</p>
            </div>
          </div>
          {user && (
            <button
              onClick={() => setShowCreate(!showCreate)}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-white rounded-lg font-medium transition text-sm"
            >
              <Plus size={16} />
              New Group
            </button>
          )}
        </div>

        {/* Create Group Form */}
        {showCreate && (
          <form onSubmit={handleCreateGroup} className="bg-slate-900/50 border border-white/10 rounded-xl p-5 mb-6 space-y-4">
            <h3 className="text-lg font-bold text-white">Create a Group</h3>
            <div>
              <label className="block text-sm text-slate-400 mb-1">Group Name</label>
              <input
                type="text"
                value={newGroup.name}
                onChange={(e) => setNewGroup({ ...newGroup, name: e.target.value })}
                placeholder="e.g., Governors Court Condos"
                className="w-full px-4 py-2.5 bg-slate-800 border border-white/10 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 text-sm"
                required
              />
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-1">Description</label>
              <textarea
                value={newGroup.description}
                onChange={(e) => setNewGroup({ ...newGroup, description: e.target.value })}
                placeholder="What is this group about?"
                rows={3}
                className="w-full px-4 py-2.5 bg-slate-800 border border-white/10 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 text-sm resize-none"
              />
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-1">Privacy</label>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setNewGroup({ ...newGroup, privacy: 'public' })}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition border ${
                    newGroup.privacy === 'public'
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                      : 'bg-slate-800 border-white/10 text-slate-400 hover:text-white'
                  }`}
                >
                  <Globe size={14} />
                  Public
                </button>
                <button
                  type="button"
                  onClick={() => setNewGroup({ ...newGroup, privacy: 'private' })}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition border ${
                    newGroup.privacy === 'private'
                      ? 'bg-violet-500/10 border-violet-500/30 text-violet-400'
                      : 'bg-slate-800 border-white/10 text-slate-400 hover:text-white'
                  }`}
                >
                  <Lock size={14} />
                  Private
                </button>
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowCreate(false)}
                className="px-4 py-2 text-sm text-slate-400 hover:text-white transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={creating || !newGroup.name.trim()}
                className="px-6 py-2 bg-emerald-500 hover:bg-emerald-400 text-white rounded-lg font-medium transition text-sm disabled:opacity-50"
              >
                {creating ? 'Creating...' : 'Create Group'}
              </button>
            </div>
          </form>
        )}

        {/* Not signed in prompt */}
        {!user && (
          <div className="bg-slate-900/50 border border-white/10 rounded-xl p-6 mb-6 text-center">
            <Users size={32} className="text-violet-400 mx-auto mb-3" />
            <p className="text-slate-300 mb-4">Sign in to create or join groups</p>
            <button
              onClick={signIn}
              className="px-6 py-2 bg-emerald-500 hover:bg-emerald-400 text-white rounded-lg font-medium transition text-sm"
            >
              Get Started
            </button>
          </div>
        )}

        {/* Groups List */}
        {groups.length === 0 ? (
          <div className="text-center py-16">
            <Users size={48} className="text-slate-600 mx-auto mb-4" />
            <p className="text-slate-400">No groups yet. Be the first to create one!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {groups.map((group) => {
              const isMember = user && group.members?.includes(user.uid);
              return (
                <div
                  key={group.id}
                  onClick={() => navigate(`/groups/${group.id}`)}
                  className="bg-slate-900/50 border border-white/5 rounded-xl p-5 hover:border-white/10 transition cursor-pointer"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-white font-bold truncate">{group.name}</h3>
                        {group.privacy === 'private' ? (
                          <Lock size={12} className="text-violet-400 shrink-0" />
                        ) : (
                          <Globe size={12} className="text-emerald-400 shrink-0" />
                        )}
                        <ChevronRight size={14} className="text-slate-600 shrink-0 ml-auto" />
                      </div>
                      {group.description && (
                        <p className="text-sm text-slate-400 line-clamp-2 mb-2">{group.description}</p>
                      )}
                      <div className="flex items-center gap-4 text-xs text-slate-500">
                        <span className="flex items-center gap-1">
                          <Users size={12} />
                          {group.memberCount || 0} {group.memberCount === 1 ? 'member' : 'members'}
                        </span>
                        <span className="flex items-center gap-1">
                          <MessageCircle size={12} />
                          {group.postCount || 0} posts
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleJoinLeave(group); }}
                      className={`shrink-0 px-4 py-2 rounded-lg text-sm font-medium transition ${
                        isMember
                          ? 'bg-white/5 text-slate-400 hover:bg-red-500/10 hover:text-red-400 border border-white/10'
                          : 'bg-emerald-500 hover:bg-emerald-400 text-white'
                      }`}
                    >
                      {isMember ? 'Joined' : 'Join'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
