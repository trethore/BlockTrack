import React, { useState, useEffect } from 'react';
import { useLazyQuery, useQuery } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import { GET_ME, IS_TOKEN_VALID } from '../lib/apollo/queries.ts';
import LoginForm from '../components/auth/LoginForm.tsx';
import RegisterForm from '../components/auth/RegisterForm.tsx';
import UserProfile from '../components/auth/UserProfile.tsx';
import { Button } from '../components/ui/button.tsx';
import { Loader2 } from 'lucide-react'; // Pour l'icône de chargement
import { Alert, AlertDescription, AlertTitle } from '../components/ui/alert.tsx';

const ACCESS_TOKEN_KEY = 'AccessToken';

interface User {
    id: string;
    username: string;
    email: string;
    createdAt: string;
    updatedAt: string;
}

const AccountPage: React.FC = () => {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [isAuthLoading, setIsAuthLoading] = useState(true);
    const [authError, setAuthError] = useState<string | null>(null);
    const [showLogin, setShowLogin] = useState(true);
    const navigate = useNavigate();

    const { refetch: checkTokenValidity } = useQuery(IS_TOKEN_VALID, {
        skip: true,
        fetchPolicy: 'network-only',
        onError: (error) => {
            console.error("Token validation error:", error);
            localStorage.removeItem(ACCESS_TOKEN_KEY);
            setCurrentUser(null);
            setIsAuthLoading(false);
            setAuthError('Session expired or invalid. Please log in again.');
        },
        onCompleted: (data) => {
            if (data && data.isTokenValid) {
                fetchMe();
            } else {
                localStorage.removeItem(ACCESS_TOKEN_KEY);
                setCurrentUser(null);
                setIsAuthLoading(false);
            }
        }
    });

    const [fetchMe, { loading: loadingMe, error: errorMe }] = useLazyQuery<{ me: User }>(GET_ME, {
        fetchPolicy: 'network-only',
        onCompleted: (data) => {
            if (data && data.me) {
                setCurrentUser(data.me);
                setAuthError(null);
            } else {
                localStorage.removeItem(ACCESS_TOKEN_KEY);
                setCurrentUser(null);
                setAuthError('Failed to retrieve user data. Please log in again.');
            }
            setIsAuthLoading(false);
        },
        onError: (apolloError) => {
            console.error("Error fetching user data:", apolloError);
            localStorage.removeItem(ACCESS_TOKEN_KEY);
            setCurrentUser(null);
            if (apolloError.networkError || (apolloError.graphQLErrors && apolloError.graphQLErrors.some(e => (e.extensions?.code as string)?.includes('UNAUTHENTICATED') || e.message.toLowerCase().includes('unauthorized')))) {
                setAuthError('Your session has expired or is invalid. Please log in.');
            } else if (apolloError.graphQLErrors && apolloError.graphQLErrors.some(e => (e.extensions?.originalError as any)?.statusCode === 403)) {
                setAuthError('Access Forbidden (403). You do not have permission to access this resource or your token is invalid.');
            }
            else {
                setAuthError('An error occurred while fetching your profile. Please try again.');
            }
            setIsAuthLoading(false);
        },
    });

    useEffect(() => {
        const token = localStorage.getItem(ACCESS_TOKEN_KEY);
        if (token) {
            checkTokenValidity();
        } else {
            setCurrentUser(null);
            setIsAuthLoading(false);
        }
    }, [checkTokenValidity, fetchMe]);

    const handleLoginSuccess = (token: string) => {
        localStorage.setItem(ACCESS_TOKEN_KEY, token);
        setIsAuthLoading(true);
        fetchMe();
    };

    const handleRegisterSuccess = (token: string) => {
        localStorage.setItem(ACCESS_TOKEN_KEY, token);
        setIsAuthLoading(true);
        fetchMe();
    };

    const handleAccountDeleted = () => {
        localStorage.removeItem(ACCESS_TOKEN_KEY);
        setCurrentUser(null);
        setShowLogin(true);
        setAuthError(null);
        navigate('/');
    };

    const handleLogout = () => {
        localStorage.removeItem(ACCESS_TOKEN_KEY);
        setCurrentUser(null);
        setShowLogin(true);
        navigate('/account');
        setAuthError(null);
    };

    if (isAuthLoading || loadingMe) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[calc(100vh-10rem)] text-center p-4">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
                <p className="mt-4 text-lg text-muted-foreground">Loading account...</p>
            </div>
        );
    }

    if (authError && !currentUser) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[calc(100vh-10rem)] text-center p-4">
                <Alert variant="destructive" className="max-w-md">
                    <AlertTitle>Authentication Error</AlertTitle>
                    <AlertDescription>{authError}</AlertDescription>
                </Alert>
                <Button onClick={() => { setAuthError(null); setIsAuthLoading(false); setShowLogin(true); }} className="mt-4">
                    Try to login again
                </Button>
            </div>
        );
    }


    return (
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-10rem)] py-8 px-4">
            {currentUser ? (
                <UserProfile
                    user={currentUser}
                    onLogout={handleLogout}
                    onAccountDeleted={handleAccountDeleted}
                    refetchUserData={fetchMe}
                />
            ) : (
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