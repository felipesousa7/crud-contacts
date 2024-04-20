import React, { ReactNode, useEffect, useState } from 'react';
import { onAuthStateChanged, getAuth, User, signOut } from 'firebase/auth';
import { AuthContext } from './AuthContext';
import { firebaseApp } from '../firebase/firebaseConfig';

interface AuthContextProviderProps {
    children: ReactNode;
}

const auth = getAuth(firebaseApp);

const AuthContextProvider: React.FC<AuthContextProviderProps> = ({
    children,
}) => {
    const [userAuth, setUserAuth] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (authUserCredentials: User | null) => {
            setUserAuth(authUserCredentials);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    async function logout() {
        let result = null,
            error = null;
        try {
            result = await signOut(auth);
        } catch (e) {
            error = e;
        }

        return { result, error };
    }

    return (
        <AuthContext.Provider value={{ userAuth, logout }}>
            {loading ? (
                <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
                    <h1 className="text-center text-3xl font-extrabold text-gray-900">Loading...</h1>
                </div>
            ) : (
                children
            )}
        </AuthContext.Provider>
    );
};

export default AuthContextProvider;
