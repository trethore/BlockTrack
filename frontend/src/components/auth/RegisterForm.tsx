import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { CREATE_USER } from '@lib/apollo/queries.ts';
import { Button } from '@/components/ui/button.tsx';
import { Input } from '@/components/ui/input.tsx';
import { Label } from '@/components/ui/label.tsx';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert.tsx';

interface RegisterFormProps {
    onRegisterSuccess: (token: string) => void;
    switchToLogin: () => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onRegisterSuccess, switchToLogin }) => {
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);

    const [createUser, { loading }] = useMutation(CREATE_USER, {
        onCompleted: (data) => {
            if (data.createUser.accessToken) {
                onRegisterSuccess(data.createUser.accessToken);
            } else {
                setError('Registration completed, but failed to retrieve session token. Please try logging in.');
            }
        },
        onError: (apolloError) => {
            setError(apolloError.message || 'Registration failed. Please try again.');
            console.error("Registration error:", apolloError);
        }
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        if (!email || !username || !password) {
            setError("Please fill in all fields.");
            return;
        }
        if (password.length < 8) {
            setError("Password must be at least 8 characters long.");
            return;
        }

        try {
            await createUser({ variables: { createUserData: { email, username, password } } });
        } catch (err) {
        }
    };

    return (
        <div className="w-full max-w-md space-y-6">
            <div className="text-center">
                <h2 className="text-2xl font-semibold">Register</h2>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                    <Alert variant="destructive">
                        <AlertTitle>Error</AlertTitle>
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}
                <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="mt-1"
                    />
                </div>
                <div>
                    <Label htmlFor="username">Username</Label>
                    <Input
                        id="username"
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        className="mt-1"
                    />
                </div>
                <div>
                    <Label htmlFor="reg-password">Password</Label>
                    <Input
                        id="reg-password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        minLength={8}
                        className="mt-1"
                    />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? 'Registering...' : 'Register'}
                </Button>
            </form>
            <p className="text-center text-sm text-muted-foreground">
                Already have an account?{' '}
                <Button variant="link" onClick={switchToLogin} className="p-0 h-auto font-medium">
                    Login here
                </Button>
            </p>
        </div>
    );
};

export default RegisterForm;