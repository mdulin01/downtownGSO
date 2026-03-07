import { useState, useEffect } from 'react';
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  addDoc,
  deleteDoc,
  doc,
  serverTimestamp
} from 'firebase/firestore';
import { db } from '../firebase-config';

export function useGroupComments(groupId) {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!groupId) {
      setComments([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const q = query(
      collection(db, 'groups', groupId, 'comments'),
      orderBy('createdAt', 'asc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setComments(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })));
      setLoading(false);
    }, (error) => {
      console.error('Error fetching group comments:', error);
      setLoading(false);
    });

    return unsubscribe;
  }, [groupId]);

  const addComment = async (user, text) => {
    if (!groupId || !user || !text.trim()) return;
    await addDoc(collection(db, 'groups', groupId, 'comments'), {
      authorId: user.uid,
      authorName: user.displayName || 'Anonymous',
      authorAvatar: user.photoURL || '',
      text: text.trim(),
      createdAt: serverTimestamp()
    });
  };

  const deleteComment = async (commentId) => {
    if (!groupId || !commentId) return;
    await deleteDoc(doc(db, 'groups', groupId, 'comments', commentId));
  };

  return { comments, loading, addComment, deleteComment };
}
