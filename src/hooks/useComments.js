import { useState, useEffect } from 'react';
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  addDoc,
  deleteDoc,
  doc,
  updateDoc,
  increment,
  serverTimestamp
} from 'firebase/firestore';
import { db } from '../firebase-config';

export function useComments(postId) {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!postId) {
      setComments([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const q = query(
      collection(db, 'posts', postId, 'comments'),
      orderBy('createdAt', 'asc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }));
      setComments(data);
      setLoading(false);
    }, (error) => {
      console.error('Error fetching comments:', error);
      setLoading(false);
    });

    return unsubscribe;
  }, [postId]);

  const addComment = async (user, text) => {
    if (!postId || !user || !text.trim()) return;

    try {
      await addDoc(collection(db, 'posts', postId, 'comments'), {
        authorId: user.uid,
        authorName: user.displayName || 'Anonymous',
        authorAvatar: user.photoURL || '',
        text: text.trim(),
        createdAt: serverTimestamp()
      });

      // Increment comment count on the post
      await updateDoc(doc(db, 'posts', postId), {
        commentCount: increment(1)
      });
    } catch (error) {
      console.error('Error adding comment:', error);
      throw error;
    }
  };

  const deleteComment = async (commentId) => {
    if (!postId || !commentId) return;

    try {
      await deleteDoc(doc(db, 'posts', postId, 'comments', commentId));
      await updateDoc(doc(db, 'posts', postId), {
        commentCount: increment(-1)
      });
    } catch (error) {
      console.error('Error deleting comment:', error);
      throw error;
    }
  };

  return { comments, loading, addComment, deleteComment };
}
