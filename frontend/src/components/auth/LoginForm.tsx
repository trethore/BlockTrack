import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { LOGIN_USER } from '@lib/apollo/queries.ts';
import { Button } from '@/components/ui/button.tsx';
import { Input } from '@/components/ui/input.tsx';
import { Label } from '@/components/ui/label.tsx';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert.tsx';

interface LoginFormProps {
    onLoginSuccess: (token: string) => void;
    switchToRegister: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLoginSuccess, switchToRegister }) => {
    const [emailOrUsername, setEmailOrUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);

    const [loginUser, { loading }] = useMutation(LOGIN_USER, {
        onCompleted: (data) => {
            if (data.login.accessToken) {
                onLoginSuccess(data.login.accessToken);
            }
        },
        onError: (apolloError) => {
            setError(apolloError.message || 'Login failed. Please try again.');
            console.error("Login error:", apolloError);
        }
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        if (!emailOrUsername || !password) {
            setError("Please fill in all fields.");
            return;
        }
        try {
            await loginUser({ variables: { loginData: { emailOrUsername, password } } });
        } catch (err) {
        }
    };

    return (
        <div className="w-full max-w-md space-y-6">
            <div className="text-center">
                <h2 className="text-2xl font-semibold">Login</h2>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                    <Alert variant="destructive">
                        <AlertTitle>Error</AlertTitle>
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}
                <div>
                    <Label htmlFor="emailOrUsername">Email or Username</Label>
                    <Input
                        id="emailOrUsername"
                        type="text"
                        value={emailOrUsername}
                        onChange={(e) => setEmailOrUsername(e.target.value)}
                        required
                        className="mt-1"
                    />
                </div>
                <div>
                    <Label htmlFor="password">Password</Label>
                    <Input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="mt-1"
                    />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? 'Logging in...' : 'Login'}
                </Button>
            </form>
            <p className="text-center text-sm text-muted-foreground">
                Don't have an account?{' '}
                <Button variant="link" onClick={switchToRegister} className="p-0 h-auto font-medium">
                    Register here
                </Button>
            </p>
        </div>
    );
};

export default LoginForm;