import React, { createContext, useContext, useState, useEffect } from 'react';
import { onAuthStateChanged, signOut, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth, db } from '../firebase-config';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const userRef = doc(db, 'users', firebaseUser.uid);

        // Check if user doc already exists (returning user vs new)
        const existingDoc = await getDoc(userRef);
        const isNewUser = !existingDoc.exists();

        // Create or update user doc in Firestore
        const userData = {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
          photoURL: firebaseUser.photoURL,
          lastSignIn: serverTimestamp()
        };

        // Only set defaults for new users
        if (isNewUser) {
          userData.createdAt = serverTimestamp();
          userData.interests = [];
          userData.customInterests = [];
          userData.notificationsEnabled = true;
          userData.profileCompleted = false;
        }

        await setDoc(userRef, userData, { merge: true });

        // Read back the full user doc to get interests etc.
        const updatedDoc = await getDoc(userRef);
        const fullData = updatedDoc.data();

        setUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
          photoURL: firebaseUser.photoURL,
          interests: fullData?.interests || [],
          customInterests: fullData?.customInterests || [],
          notificationsEnabled: fullData?.notificationsEnabled ?? true,
          profileCompleted: fullData?.profileCompleted || false
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signIn = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    }
  };

  const logOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    }
  };

  // Allow refreshing user data after profile updates
  const refreshUser = async () => {
    if (!user) return;
    const userDoc = await getDoc(doc(db, 'users', user.uid));
    if (userDoc.exists()) {
      const data = userDoc.data();
      setUser(prev => ({
        ...prev,
        interests: data.interests || [],
        customInterests: data.customInterests || [],
        notificationsEnabled: data.notificationsEnabled ?? true,
        profileCompleted: data.profileCompleted || false
      }));
    }
  };

  const value = {
    user,
    loading,
    signIn,
    signOut: logOut,
    refreshUser
  };

  return React.createElement(
    AuthContext.Provider,
    { value },
    children
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
