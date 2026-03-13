import { useState, useEffect } from 'react';
import {
  doc,
  setDoc,
  deleteDoc,
  collection,
  query,
  where,
  onSnapshot
} from 'firebase/firestore';
import { db } from '../firebase-config';

export function useUpvote(postId, userId) {
  const [upvoted, setUpvoted] = useState(false);
  const [count, setCount] = useState(0);

  // Real-time listener on all upvotes for this post
  useEffect(() => {
    if (!postId) return;

    const q = query(collection(db, 'upvotes'), where('postId', '==', postId));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setCount(snapshot.size);
      if (userId) {
        const myUpvote = snapshot.docs.find((d) => d.data().userId === userId);
        setUpvoted(!!myUpvote);
      } else {
        setUpvoted(false);
      }
    });

    return unsubscribe;
  }, [postId, userId]);

  const toggleUpvote = async () => {
    if (!postId || !userId) return;

    const upvoteId = `${postId}_${userId}`;
    const upvoteRef = doc(db, 'upvotes', upvoteId);

    try {
      if (upvoted) {
        await deleteDoc(upvoteRef);
      } else {
        await setDoc(upvoteRef, {
          postId,
          userId,
          createdAt: new Date()
        });
      }
      // No need for optimistic updates — onSnapshot handles it in real-time
    } catch (error) {
      console.error('Error toggling upvote:', error);
      throw error;
    }
  };

  return { upvoted, toggleUpvote, count };
}
