/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect } from 'react';
import {
    signInWithEmailAndPassword,
    signInWithPopup,
    createUserWithEmailAndPassword,
    GoogleAuthProvider,
    GithubAuthProvider,
    signOut,
    setPersistence,
    browserSessionPersistence,
    browserLocalPersistence,
    updateProfile,
} from 'firebase/auth';
import { auth } from '@/scripts/firebaseConfig';

const AuthContext = createContext(null);

const googleProvider = new GoogleAuthProvider();
const githubProvider = new GithubAuthProvider();

/**
 * @typedef {Object} AuthContextType
 * @property {import('firebase/auth').User | null} user - The current user
 * @property {boolean} loading - Whether the auth state is being determined
 * @property {Function} signin - Sign in function
 * @property {Function} signup - Sign up function
 * @property {Function} signout - Sign out function
 */

/**
 * Provider component that wraps your app and makes auth object available to any
 * child component that calls useAuth().
 */
export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Listen for auth state changes
        const unsubscribe = auth.onAuthStateChanged((user) => {
            setUser(user);
            setLoading(false);
        });

        // Cleanup subscription
        return unsubscribe;
    }, []);

    /**
     * Sign in with email/password or provider
     * @param {string|'google'|'github'} email - Email or provider name
     * @param {string} [password] - Password (not needed for provider signin)
     * @param {boolean} [remember=false] - Whether to persist auth state
     */
    const signin = async (email, password, remember = false) => {
        // Set persistence based on remember preference
        await setPersistence(auth, remember ? browserLocalPersistence : browserSessionPersistence);

        if (email === 'google') {
            await signInWithPopup(auth, googleProvider);
        } else if (email === 'github') {
            await signInWithPopup(auth, githubProvider);
        } else {
            await signInWithEmailAndPassword(auth, email, password);
        }
    };

    /**
     * Sign up with email/password or provider
     * @param {string|'google'|'github'} email - Email or provider name
     * @param {string} [password] - Password (not needed for provider signup)
     * @param {string|null} [name=null] - Optional display name
     * @param {boolean} [remember=true] - Whether to persist auth state
     */
    const signup = async (email, password, name = null, remember = true) => {
        // Set persistence based on remember preference
        await setPersistence(auth, remember ? browserLocalPersistence : browserSessionPersistence);

        let userCredential;

        if (email === 'google') {
            userCredential = await signInWithPopup(auth, googleProvider);
        } else if (email === 'github') {
            userCredential = await signInWithPopup(auth, githubProvider);
        } else {
            userCredential = await createUserWithEmailAndPassword(auth, email, password);

            // If a name was provided, update the user profile
            if (name && userCredential.user) {
                await updateProfile(userCredential.user, {
                    displayName: name,
                });
            }
        }
    };

    const signout = () => signOut(auth);

    const value = {
        user,
        loading,
        signin,
        signup,
        signout,
    };

    return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
}

/**
 * Hook for using auth context
 * @returns {AuthContextType} Auth context value
 */
export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
