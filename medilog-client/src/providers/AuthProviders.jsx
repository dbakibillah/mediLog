import {
    createUserWithEmailAndPassword,
    GoogleAuthProvider,
    onAuthStateChanged,
    sendPasswordResetEmail,
    signInWithEmailAndPassword,
    signInWithPopup,
    signOut,
    updateProfile
} from "firebase/auth";
import { createContext, useEffect, useState } from "react";
import { auth } from "../firebase/firebase.init";
import axios from "axios";
import Loading from "../pages/common/Loading";

export const AuthContext = createContext(null);

// eslint-disable-next-line react/prop-types
const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const provider = new GoogleAuthProvider();

    const createUser = (email, password) => {
        setLoading(true);
        return createUserWithEmailAndPassword(auth, email, password);
    };

    const updateUserProfile = (profile) => {
        return updateProfile(auth.currentUser, profile);
    };

    const googleSignIn = () => {
        setLoading(true);
        return signInWithPopup(auth, provider);
    };

    const signInUser = (email, password) => {
        setLoading(true);
        return signInWithEmailAndPassword(auth, email, password);
    };

    const signOutUser = () => {
        setLoading(true);
        return signOut(auth).finally(() => setLoading(false));
    };

    const forgotPassword = (email) => {
        return sendPasswordResetEmail(auth, email);
    }

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);

            if (currentUser?.email) {
                const user = { email: currentUser.email }
                axios.post("https://blog-t-server.vercel.app/jwt", user, {
                    withCredentials: true
                })
                    .then((response) => {
                        console.log(response.data);
                        setLoading(false);
                    })
            }
            else {
                axios.post("https://blog-t-server.vercel.app/logout", {
                    withCredentials: true
                })
                    .then((response) => {
                        console.log(response.data);
                        setLoading(false);
                    })
            }
        });

        return () => unsubscribe();
    }, []);

    const authInfo = {
        user,
        setUser,
        createUser,
        googleSignIn,
        updateUserProfile,
        signInUser,
        signOutUser,
        loading,
        forgotPassword
    };

    return (
        <AuthContext.Provider value={authInfo}>
            {loading ? <Loading /> : children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;
