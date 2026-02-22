import { useState, useEffect } from 'react';
import {
  doc,
  getDoc,
  setDoc,
  deleteDoc,
  updateDoc,
  increment
} from 'firebase/firestore';
import { db } from '../firebase-config';

export function useUpvote(postId, userId) {
  const [upvoted, setUpvoted] = useState(false);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!postId || !userId) {
      setUpvoted(false);
      return;
    }

    const checkUpvote = async () => {
      try {
        const upvoteId = `${postId}_${userId}`;
        const upvoteDoc = await getDoc(doc(db, 'upvotes', upvoteId));
        setUpvoted(upvoteDoc.exists());

        const postDoc = await getDoc(doc(db, 'posts', postId));
        if (postDoc.exists()) {
          setCount(postDoc.data().upvoteCount || 0);
        }
      } catch (error) {
        console.error('Error checking upvote:', error);
      }
    };

    checkUpvote();
  }, [postId, userId]);

  const toggleUpvote = async () => {
    if (!postId || !userId) return;

    try {
      const upvoteId = `${postId}_${userId}`;
      const upvoteRef = doc(db, 'upvotes', upvoteId);
      const postRef = doc(db, 'posts', postId);

      if (upvoted) {
        // Remove upvote
        await deleteDoc(upvoteRef);
        await updateDoc(postRef, { upvoteCount: increment(-1) });
        setUpvoted(false);
        setCount((prev) => Math.max(0, prev - 1));
      } else {
        // Add upvote
        await setDoc(upvoteRef, {
          postId,
          userId,
          createdAt: new Date()
        });
        await updateDoc(postRef, { upvoteCount: increment(1) });
        setUpvoted(true);
        setCount((prev) => prev + 1);
      }
    } catch (error) {
      console.error('Error toggling upvote:', error);
      throw error;
    }
  };

  return { upvoted, toggleUpvote, count };
}
