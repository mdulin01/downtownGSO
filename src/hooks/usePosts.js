import { useState, useEffect } from 'react';
import {
  collection,
  query,
  orderBy,
  limit,
  onSnapshot,
  addDoc,
  deleteDoc,
  doc,
  where
} from 'firebase/firestore';
import { db } from '../firebase-config';

export function usePosts(filters = {}) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    let q;
    const constraints = [orderBy('createdAt', 'desc'), limit(50)];

    if (filters.type) {
      constraints.unshift(where('type', '==', filters.type));
    }
    if (filters.category) {
      constraints.unshift(where('category', '==', filters.category));
    }

    q = query(collection(db, 'posts'), ...constraints);

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const postsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }));
      setPosts(postsData);
      setLoading(false);
    }, (error) => {
      console.error('Error fetching posts:', error);
      setLoading(false);
    });

    return unsubscribe;
  }, [filters.type, filters.category]);

  const createPost = async (data) => {
    try {
      const docRef = await addDoc(collection(db, 'posts'), {
        ...data,
        createdAt: new Date(),
        upvoteCount: 0,
        commentCount: 0
      });
      return docRef.id;
    } catch (error) {
      console.error('Error creating post:', error);
      throw error;
    }
  };

  const deletePost = async (postId) => {
    try {
      await deleteDoc(doc(db, 'posts', postId));
    } catch (error) {
      console.error('Error deleting post:', error);
      throw error;
    }
  };

  return { posts, loading, createPost, deletePost };
}
