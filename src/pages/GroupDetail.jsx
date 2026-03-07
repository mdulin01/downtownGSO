import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  doc, onSnapshot, updateDoc, arrayUnion, arrayRemove, increment,
  collection, query, orderBy, addDoc, deleteDoc, serverTimestamp,
  getDocs, where
} from 'firebase/firestore';
import { db } from '../firebase-config';
import { useAuth } from '../hooks/useAuth';
import { useGroupComments } from '../hooks/useGroupComments';
import {
  Users, MessageCircle, BookOpen, ArrowLeft, Globe, Lock,
  Send, Trash2, Loader2, Plus, X, Link2, FileText, HelpCircle,
  Crown, ChevronDown, ChevronUp
} from 'lucide-react';

function timeAgo(date) {
  if (!date) return '';
  const d = date.toDate ? date.toDate() : date.seconds ? new Date(date.seconds * 1000) : new Date(date);
  const seconds = Math.floor((new Date() - d) / 1000);
  if (seconds < 60) return 'just now';
  const intervals = { year: 31536000, month: 2592000, week: 604800, day: 86400, hour: 3600, minute: 60 };
  for (const [key, value] of Object.entries(intervals)) {
    const interval = Math.floor(seconds / value);
    if (interval >= 1) return `${interval}${key.charAt(0)} ago`;
  }
  return 'just now';
}

// ─── Discussion Tab ──────────────────────────────────────────────

function DiscussionTab({ groupId, isMember }) {
  const { user, signIn } = useAuth();
  const { comments, loading, addComment, deleteComment } = useGroupComments(groupId);
  const [text, setText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    if (bottomRef.current && comments.length > 0) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [comments.length]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim() || submitting) return;
    setSubmitting(true);
    try {
      await addComment(user, text);
      setText('');
    } catch (err) {
      console.error('Failed to post:', err);
    }
    setSubmitting(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 size={24} className="animate-spin text-slate-500" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {comments.length === 0 ? (
        <div className="text-center py-12">
          <MessageCircle size={36} className="text-slate-600 mx-auto mb-3" />
          <p className="text-slate-400 text-sm">No messages yet. Start the conversation!</p>
        </div>
      ) : (
        <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
          {comments.map((c) => (
            <div key={c.id} className="flex gap-2.5 group">
              {c.authorAvatar ? (
                <img src={c.authorAvatar} alt="" className="w-8 h-8 rounded-full flex-shrink-0" />
              ) : (
                <div className="w-8 h-8 rounded-full bg-emerald-600/30 flex items-center justify-center flex-shrink-0">
                  <span className="text-xs font-bold text-emerald-400">{(c.authorName || 'U').charAt(0)}</span>
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-2">
                  <span className="text-sm font-medium text-slate-200">{c.authorName}</span>
                  <span className="text-[11px] text-slate-600">{timeAgo(c.createdAt)}</span>
                  {user && c.authorId === user.uid && (
                    <button
                      onClick={() => { if (confirm('Delete this message?')) deleteComment(c.id); }}
                      className="opacity-0 group-hover:opacity-100 transition ml-auto"
                    >
                      <Trash2 size={12} className="text-slate-600 hover:text-red-400" />
                    </button>
                  )}
                </div>
                <p className="text-sm text-slate-300 leading-relaxed break-words">{c.text}</p>
              </div>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>
      )}

      {/* Input */}
      {!user ? (
        <div className="text-center py-3 border-t border-white/5">
          <button onClick={signIn} className="text-sm text-emerald-400 hover:text-emerald-300 font-medium">
            Sign in to join the conversation
          </button>
        </div>
      ) : !isMember ? (
        <p className="text-xs text-slate-500 text-center py-3 border-t border-white/5">
          Join this group to participate in the discussion
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="flex gap-2 border-t border-white/5 pt-4">
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Write a message..."
            maxLength={1000}
            className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-3 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition"
          />
          <button
            type="submit"
            disabled={!text.trim() || submitting}
            className="px-3 py-2.5 bg-emerald-500 hover:bg-emerald-400 disabled:bg-slate-700 disabled:text-slate-500 text-white rounded-lg transition"
          >
            {submitting ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
          </button>
        </form>
      )}
    </div>
  );
}

// ─── Members Tab ─────────────────────────────────────────────────

function MembersTab({ group }) {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!group?.members?.length) {
      setMembers([]);
      setLoading(false);
      return;
    }

    const fetchMembers = async () => {
      try {
        // Fetch user profiles for all members (batch in chunks of 10 for Firestore 'in' limit)
        const allMembers = [];
        const uids = [...group.members];
        while (uids.length > 0) {
          const batch = uids.splice(0, 10);
          const q = query(collection(db, 'users'), where('__name__', 'in', batch));
          const snap = await getDocs(q);
          snap.docs.forEach((d) => allMembers.push({ id: d.id, ...d.data() }));
        }
        setMembers(allMembers);
      } catch (err) {
        console.error('Error fetching members:', err);
      }
      setLoading(false);
    };

    fetchMembers();
  }, [group?.members]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 size={24} className="animate-spin text-slate-500" />
      </div>
    );
  }

  return (
    <div>
      <p className="text-sm text-slate-400 mb-4">{group.memberCount || members.length} member{(group.memberCount || members.length) !== 1 ? 's' : ''}</p>
      {members.length === 0 ? (
        <p className="text-sm text-slate-500 text-center py-8">No members yet</p>
      ) : (
        <div className="space-y-2">
          {members.map((m) => (
            <div key={m.id} className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-lg">
              {m.photoURL ? (
                <img src={m.photoURL} alt="" className="w-9 h-9 rounded-full" />
              ) : (
                <div className="w-9 h-9 rounded-full bg-emerald-600/30 flex items-center justify-center">
                  <span className="text-sm font-bold text-emerald-400">{(m.displayName || 'U').charAt(0)}</span>
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-white truncate">{m.displayName || 'Anonymous'}</span>
                  {m.id === group.createdBy && (
                    <span className="flex items-center gap-1 text-[10px] text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded-full">
                      <Crown size={10} /> Admin
                    </span>
                  )}
                </div>
                {m.interests?.length > 0 && (
                  <p className="text-xs text-slate-500 truncate mt-0.5">
                    {m.interests.slice(0, 3).join(' · ')}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Resources Tab ───────────────────────────────────────────────

function ResourcesTab({ groupId, group, isAdmin }) {
  const { user } = useAuth();
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [newResource, setNewResource] = useState({ title: '', content: '', type: 'faq', url: '' });
  const [saving, setSaving] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState(null);

  useEffect(() => {
    if (!groupId) return;
    const q = query(collection(db, 'groups', groupId, 'resources'), orderBy('order', 'asc'));
    const unsubscribe = onSnapshot(q, (snap) => {
      setResources(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      setLoading(false);
    });
    return unsubscribe;
  }, [groupId]);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newResource.title.trim()) return;
    setSaving(true);
    try {
      await addDoc(collection(db, 'groups', groupId, 'resources'), {
        title: newResource.title.trim(),
        content: newResource.content.trim(),
        type: newResource.type,
        url: newResource.url.trim(),
        order: resources.length,
        addedBy: user.uid,
        addedByName: user.displayName,
        createdAt: serverTimestamp()
      });
      setNewResource({ title: '', content: '', type: 'faq', url: '' });
      setShowAdd(false);
    } catch (err) {
      console.error('Error adding resource:', err);
    }
    setSaving(false);
  };

  const handleDelete = async (resourceId) => {
    if (!confirm('Delete this resource?')) return;
    try {
      await deleteDoc(doc(db, 'groups', groupId, 'resources', resourceId));
    } catch (err) {
      console.error('Error deleting resource:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 size={24} className="animate-spin text-slate-500" />
      </div>
    );
  }

  const faqs = resources.filter((r) => r.type === 'faq');
  const links = resources.filter((r) => r.type === 'link');
  const docs = resources.filter((r) => r.type === 'doc');

  return (
    <div className="space-y-6">
      {/* Add button for admin */}
      {isAdmin && (
        <button
          onClick={() => setShowAdd(!showAdd)}
          className="flex items-center gap-2 text-sm text-emerald-400 hover:text-emerald-300 font-medium"
        >
          {showAdd ? <X size={14} /> : <Plus size={14} />}
          {showAdd ? 'Cancel' : 'Add Resource'}
        </button>
      )}

      {/* Add form */}
      {showAdd && (
        <form onSubmit={handleAdd} className="bg-slate-800/50 border border-white/10 rounded-xl p-4 space-y-3">
          <div className="flex gap-2">
            {['faq', 'link', 'doc'].map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setNewResource({ ...newResource, type: t })}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition border ${
                  newResource.type === t
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                    : 'bg-slate-800 border-white/10 text-slate-400 hover:text-white'
                }`}
              >
                {t === 'faq' ? 'FAQ' : t === 'link' ? 'Link' : 'Document'}
              </button>
            ))}
          </div>
          <input
            type="text"
            value={newResource.title}
            onChange={(e) => setNewResource({ ...newResource, title: e.target.value })}
            placeholder={newResource.type === 'faq' ? 'Question' : 'Title'}
            className="w-full bg-slate-800 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            required
          />
          {newResource.type === 'link' && (
            <input
              type="url"
              value={newResource.url}
              onChange={(e) => setNewResource({ ...newResource, url: e.target.value })}
              placeholder="https://..."
              className="w-full bg-slate-800 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
          )}
          <textarea
            value={newResource.content}
            onChange={(e) => setNewResource({ ...newResource, content: e.target.value })}
            placeholder={newResource.type === 'faq' ? 'Answer' : 'Description (optional)'}
            rows={3}
            className="w-full bg-slate-800 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 resize-none"
          />
          <button
            type="submit"
            disabled={saving || !newResource.title.trim()}
            className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-white rounded-lg text-sm font-medium transition"
          >
            {saving ? 'Saving...' : 'Add'}
          </button>
        </form>
      )}

      {resources.length === 0 && !showAdd ? (
        <div className="text-center py-12">
          <BookOpen size={36} className="text-slate-600 mx-auto mb-3" />
          <p className="text-slate-400 text-sm">No resources yet.</p>
          {isAdmin && <p className="text-slate-500 text-xs mt-1">Add FAQs, links, and documents for your group members.</p>}
        </div>
      ) : (
        <>
          {/* FAQs */}
          {faqs.length > 0 && (
            <div>
              <h3 className="flex items-center gap-2 text-sm font-semibold text-white mb-3">
                <HelpCircle size={15} className="text-violet-400" />
                FAQ
              </h3>
              <div className="space-y-2">
                {faqs.map((faq) => (
                  <div key={faq.id} className="bg-slate-800/50 border border-white/5 rounded-lg overflow-hidden">
                    <button
                      onClick={() => setExpandedFaq(expandedFaq === faq.id ? null : faq.id)}
                      className="w-full flex items-center justify-between px-4 py-3 text-left group"
                    >
                      <span className="text-sm font-medium text-slate-200">{faq.title}</span>
                      <div className="flex items-center gap-2 shrink-0">
                        {isAdmin && (
                          <span
                            onClick={(e) => { e.stopPropagation(); handleDelete(faq.id); }}
                            className="opacity-0 group-hover:opacity-100 transition"
                          >
                            <Trash2 size={12} className="text-slate-600 hover:text-red-400" />
                          </span>
                        )}
                        {expandedFaq === faq.id ? <ChevronUp size={14} className="text-slate-500" /> : <ChevronDown size={14} className="text-slate-500" />}
                      </div>
                    </button>
                    {expandedFaq === faq.id && faq.content && (
                      <div className="px-4 pb-3 text-sm text-slate-400 leading-relaxed border-t border-white/5 pt-3">
                        {faq.content}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Links */}
          {links.length > 0 && (
            <div>
              <h3 className="flex items-center gap-2 text-sm font-semibold text-white mb-3">
                <Link2 size={15} className="text-emerald-400" />
                Links
              </h3>
              <div className="space-y-2">
                {links.map((link) => (
                  <div key={link.id} className="flex items-center gap-3 p-3 bg-slate-800/50 border border-white/5 rounded-lg group">
                    <Link2 size={14} className="text-emerald-400 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-medium text-emerald-400 hover:text-emerald-300 transition truncate block"
                      >
                        {link.title}
                      </a>
                      {link.content && <p className="text-xs text-slate-500 mt-0.5 truncate">{link.content}</p>}
                    </div>
                    {isAdmin && (
                      <button onClick={() => handleDelete(link.id)} className="opacity-0 group-hover:opacity-100 transition">
                        <Trash2 size={12} className="text-slate-600 hover:text-red-400" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Documents */}
          {docs.length > 0 && (
            <div>
              <h3 className="flex items-center gap-2 text-sm font-semibold text-white mb-3">
                <FileText size={15} className="text-sky-400" />
                Documents
              </h3>
              <div className="space-y-2">
                {docs.map((d) => (
                  <div key={d.id} className="flex items-center gap-3 p-3 bg-slate-800/50 border border-white/5 rounded-lg group">
                    <FileText size={14} className="text-sky-400 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <span className="text-sm font-medium text-slate-200 truncate block">{d.title}</span>
                      {d.content && <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">{d.content}</p>}
                    </div>
                    {isAdmin && (
                      <button onClick={() => handleDelete(d.id)} className="opacity-0 group-hover:opacity-100 transition">
                        <Trash2 size={12} className="text-slate-600 hover:text-red-400" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

// ─── Main GroupDetail Page ───────────────────────────────────────

const TABS = [
  { id: 'discussion', label: 'Discussion', icon: MessageCircle },
  { id: 'members', label: 'Members', icon: Users },
  { id: 'resources', label: 'Resources', icon: BookOpen }
];

export default function GroupDetail() {
  const { groupId } = useParams();
  const navigate = useNavigate();
  const { user, signIn } = useAuth();
  const [group, setGroup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('discussion');

  useEffect(() => {
    if (!groupId) return;
    const unsubscribe = onSnapshot(doc(db, 'groups', groupId), (snap) => {
      if (snap.exists()) {
        setGroup({ id: snap.id, ...snap.data() });
      } else {
        setGroup(null);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, [groupId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!group) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-slate-400">Group not found</p>
        <button onClick={() => navigate('/groups')} className="text-emerald-400 hover:text-emerald-300 text-sm font-medium">
          Back to Groups
        </button>
      </div>
    );
  }

  const isMember = user && group.members?.includes(user.uid);
  const isAdmin = user && group.createdBy === user.uid;

  const handleJoinLeave = async () => {
    if (!user) {
      try { await signIn(); } catch { return; }
      return;
    }
    try {
      await updateDoc(doc(db, 'groups', groupId), {
        members: isMember ? arrayRemove(user.uid) : arrayUnion(user.uid),
        memberCount: (group.memberCount || 0) + (isMember ? -1 : 1)
      });
    } catch (err) {
      console.error('Error updating membership:', err);
    }
  };

  return (
    <div className="w-full pb-24 md:pb-8">
      <div className="max-w-4xl mx-auto px-4 pt-24 md:pt-24">
        {/* Back button */}
        <button
          onClick={() => navigate('/groups')}
          className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-white transition mb-6"
        >
          <ArrowLeft size={16} />
          All Groups
        </button>

        {/* Group header */}
        <div className="bg-slate-900/50 border border-white/5 rounded-xl p-6 mb-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-2xl font-black text-white">{group.name}</h1>
                {group.privacy === 'private' ? (
                  <Lock size={14} className="text-violet-400 shrink-0" />
                ) : (
                  <Globe size={14} className="text-emerald-400 shrink-0" />
                )}
              </div>
              {group.description && (
                <p className="text-slate-400 text-sm mb-3">{group.description}</p>
              )}
              <div className="flex items-center gap-4 text-xs text-slate-500">
                <span className="flex items-center gap-1">
                  <Users size={12} />
                  {group.memberCount || 0} {(group.memberCount || 0) === 1 ? 'member' : 'members'}
                </span>
                {group.createdByName && (
                  <span>Created by {group.createdByName}</span>
                )}
              </div>
            </div>
            <button
              onClick={handleJoinLeave}
              className={`shrink-0 px-5 py-2.5 rounded-lg text-sm font-medium transition ${
                isMember
                  ? 'bg-white/5 text-slate-400 hover:bg-red-500/10 hover:text-red-400 border border-white/10'
                  : 'bg-emerald-500 hover:bg-emerald-400 text-white'
              }`}
            >
              {isMember ? 'Leave' : 'Join Group'}
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 bg-slate-900/30 p-1 rounded-lg border border-white/5">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-md text-sm font-medium transition ${
                  activeTab === tab.id
                    ? 'bg-slate-800 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Icon size={15} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab content */}
        <div className="bg-slate-900/50 border border-white/5 rounded-xl p-5">
          {activeTab === 'discussion' && <DiscussionTab groupId={groupId} isMember={isMember} />}
          {activeTab === 'members' && <MembersTab group={group} />}
          {activeTab === 'resources' && <ResourcesTab groupId={groupId} group={group} isAdmin={isAdmin} />}
        </div>
      </div>
    </div>
  );
}
