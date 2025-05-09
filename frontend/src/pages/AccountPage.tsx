import React, { useState, useEffect } from 'react';
import { useQuery, useLazyQuery } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import { GET_ME, IS_TOKEN_VALID } from '@/lib/apollo/queries.ts'; // Assuming queries are here
import LoginForm from '@/components/auth/LoginForm.tsx';
import RegisterForm from '@/components/auth/RegisterForm.tsx';
import UserProfile from '@/components/auth/UserProfile.tsx';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert.tsx';
import { Button } from '@/components/ui/button.tsx';
import { Loader2 } from 'lucide-react'; // Assuming lucide-react is installed

import { User } from '../types/user.ts';

const ACCESS_TOKEN_KEY = 'accessToken';

const AccountPage: React.FC = () => {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [authStatus, setAuthStatus] = useState<'loading' | 'authenticated' | 'unauthenticated' | 'error'>('loading');
    const [authErrorMessage, setAuthErrorMessage] = useState<string | null>(null);
    const [showLogin, setShowLogin] = useState(true);
    const navigate = useNavigate();

    const handleAuthError = (message: string, error?: any) => {
        if (error) console.error("Authentication process error:", error);
        localStorage.removeItem(ACCESS_TOKEN_KEY);
        setCurrentUser(null);
        setAuthStatus('error');
        setAuthErrorMessage(message);
    };

    const { refetch: checkTokenValidity } = useQuery(IS_TOKEN_VALID, {
        skip: true,
        fetchPolicy: 'network-only',
        onError: (error) => handleAuthError('Session expired or invalid. Please log in again.', error),
        onCompleted: (data) => {
            if (data && data.isTokenValid) {
                fetchMe(); // Déclenchera le fetch des données utilisateur
            } else {
                handleAuthError('Session token is no longer valid. Please log in.');
            }
        }
    });

    const [fetchMe, { loading: loadingMe }] = useLazyQuery<{ me: User }>(GET_ME, { // loadingMe est géré par authStatus
        fetchPolicy: 'network-only',
        onCompleted: (data) => {
            if (data && data.me) {
                setCurrentUser(data.me);
                setAuthStatus('authenticated');
                setAuthErrorMessage(null);
            } else {
                handleAuthError('Failed to retrieve user data. Please log in again.');
            }
        },
        onError: (apolloError) => {
            let message = 'An error occurred while fetching your profile. Please try again.';
            if (apolloError.networkError || apolloError.graphQLErrors?.some(e => (e.extensions?.code as string)?.includes('UNAUTHENTICATED') || e.message.toLowerCase().includes('unauthorized'))) {
                message = 'Your session has expired or is invalid. Please log in.';
            } else if (apolloError.graphQLErrors?.some(e => (e.extensions?.originalError as any)?.statusCode === 403)) {
                message = 'Access Forbidden (403). You do not have permission to access this resource or your token is invalid.';
            }
            handleAuthError(message, apolloError);
        },
    });

    useEffect(() => {
        const token = localStorage.getItem(ACCESS_TOKEN_KEY);
        if (token) {
            setAuthStatus('loading'); // Indique qu'on vérifie le token
            checkTokenValidity();
        } else {
            setAuthStatus('unauthenticated');
            setCurrentUser(null);
        }
    }, [checkTokenValidity]); // fetchMe n'est pas une dépendance ici car il est appelé conditionnellement

    const handleLoginSuccess = (token: string) => {
        localStorage.setItem(ACCESS_TOKEN_KEY, token);
        setAuthStatus('loading'); // On va re-fetch 'me'
        fetchMe();
    };

    const handleRegisterSuccess = (token: string) => { // Similaire à login
        localStorage.setItem(ACCESS_TOKEN_KEY, token);
        setAuthStatus('loading');
        fetchMe();
    };

    const handleAccountAction = (isLogout: boolean = false) => {
        localStorage.removeItem(ACCESS_TOKEN_KEY);
        setCurrentUser(null);
        setAuthStatus('unauthenticated');
        setShowLogin(true);
        setAuthErrorMessage(null);
        if (!isLogout) navigate('/'); // Redirige vers la landing page après suppression
        else navigate('/account'); // Reste sur la page de compte pour se reconnecter
    };

    if (authStatus === 'loading') {
        return (
            <div className="flex flex-col items-center justify-center min-h-[calc(100vh-10rem)] text-center p-4">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
                <p className="mt-4 text-lg text-muted-foreground">Loading account...</p>
            </div>
        );
    }

    if (authStatus === 'error') {
        return (
            <div className="flex flex-col items-center justify-center min-h-[calc(100vh-10rem)] text-center p-4">
                <Alert variant="destructive" className="max-w-md">
                    <AlertTitle>Authentication Error</AlertTitle>
                    <AlertDescription>{authErrorMessage || 'An unknown error occurred.'}</AlertDescription>
                </Alert>
                <Button onClick={() => { setAuthStatus('unauthenticated'); setAuthErrorMessage(null); setShowLogin(true); }} className="mt-4">
                    Go to Login
                </Button>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-10rem)] py-8 px-4">
            {authStatus === 'authenticated' && currentUser ? (
                <UserProfile
                    user={currentUser}
                    onLogout={() => handleAccountAction(true)}
                    onAccountDeleted={() => handleAccountAction(false)}
                    refetchUserData={fetchMe} // fetchMe est stable, pas besoin de useCallback
                />
            ) : ( // 'unauthenticated'
                showLogin ? (
                    <LoginForm onLoginSuccess={handleLoginSuccess} switchToRegister={() => setShowLogin(false)} />
                ) : (
                    <RegisterForm onRegisterSuccess={handleRegisterSuccess} switchToLogin={() => setShowLogin(true)} />
                )
            )}
        </div>
    );
};

export default AccountPage;