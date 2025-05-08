import React, { useState, useEffect, useMemo } from 'react';
import { useMutation } from '@apollo/client';
import { UPDATE_USER, DELETE_USER } from '@lib/apollo/queries.ts';
import { Button } from '@/components/ui/button.tsx';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.tsx';
import { Input } from '@/components/ui/input.tsx';
import { Label } from '@/components/ui/label.tsx';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert.tsx';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '../ui/alert-dialog.tsx';
import { toast } from 'sonner';
import { Loader2, Check, X, Trash2, Save } from 'lucide-react';

interface User {
    id: string;
    username: string;
    email: string;
    createdAt: string;
    updatedAt: string;
}

interface UserProfileProps {
    user: User;
    onLogout: () => void;
    onAccountDeleted: () => void;
    refetchUserData: () => void;
}

type SaveStatus = 'idle' | 'dirty' | 'saving' | 'success' | 'error' | 'invalid';

const UserProfile: React.FC<UserProfileProps> = ({ user, onLogout, onAccountDeleted, refetchUserData }) => {
    const [formData, setFormData] = useState({
        username: user.username,
        email: user.email,
        password: '',
        confirmPassword: '',
    });
    const [apiError, setApiError] = useState<string | null>(null);
    const [validationErrors, setValidationErrors] = useState<Record<string, string | null>>({});
    const [isSaving, setIsSaving] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

    useEffect(() => {
        if (!isSaving) {
            setFormData({
                username: user.username,
                email: user.email,
                password: '',
                confirmPassword: '',
            });
            setValidationErrors({});
            setApiError(null);
        }
    }, [user.updatedAt, isSaving]);

    const isDirty = useMemo(() => {
        return (
            formData.username !== user.username ||
            formData.email !== user.email ||
            formData.password !== ''
        );
    }, [formData, user.username, user.email]);

    useEffect(() => {
        const errors: Record<string, string | null> = {};
        if (isDirty) {
            if (!formData.username) {
                errors.username = 'Username cannot be empty.';
            }
            if (!formData.email) {
                errors.email = 'Email cannot be empty.';
            } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
                errors.email = 'Invalid email format.';
            }
            if (formData.password && formData.password.length < 8) {
                errors.password = 'Password must be at least 8 characters long.';
            }
            if (formData.password && formData.password !== formData.confirmPassword) {
                errors.confirmPassword = 'Passwords do not match.';
            }
            if (!formData.password && formData.confirmPassword) {
                errors.confirmPassword = 'Please enter the main password first.';
            }
        }
        setValidationErrors(errors);
    }, [formData, isDirty]);

    const isValid = useMemo(() => {
        return Object.values(validationErrors).every(error => error === null);
    }, [validationErrors]);

    const saveStatus: SaveStatus = useMemo(() => {
        if (isSaving) return 'saving';
        if (!isDirty) return 'idle';
        if (!isValid) return 'invalid';
        return 'dirty';
    }, [isSaving, isDirty, isValid]);

    const [updateUserMutation] = useMutation(UPDATE_USER, {
        onCompleted: (data) => {
            setIsSaving(false);
            toast.success(`Your profile (${data.updateUser.username}) has been successfully updated.`);
            refetchUserData();
        },
        onError: (error) => {
            setIsSaving(false);
            setApiError(error.message || "Failed to update profile. Please try again.");
            toast.error(error.message || "Could not update your profile.");
        }
    });

    const [deleteUserMutation] = useMutation(DELETE_USER, {
        onCompleted: () => {
            setIsDeleting(false);
            setIsDeleteDialogOpen(false);
            toast.success("Your account has been successfully deleted.");
            onAccountDeleted();
        },
        onError: (error) => {
            setIsDeleting(false);
            toast.error(error.message || "Could not delete your account.");
        }
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setApiError(null);
    };

    const handleSave = () => {
        if (!isDirty || !isValid || isSaving) return;

        setApiError(null);
        setIsSaving(true);

        const variablesToUpdate: { id: string; email?: string; username?: string; password?: string } = { id: user.id };
        if (formData.email !== user.email) {
            variablesToUpdate.email = formData.email;
        }
        if (formData.username !== user.username) {
            variablesToUpdate.username = formData.username;
        }
        if (formData.password) {
            variablesToUpdate.password = formData.password;
        }

        updateUserMutation({ variables: { updateUserData: variablesToUpdate } });
    };

    const handleDeleteConfirm = () => {
        setIsDeleting(true);
        deleteUserMutation({ variables: { id: user.id } });
    };

    const getStatusIcon = () => {
        switch (saveStatus) {
            case 'saving': return <Loader2 className="h-4 w-4 animate-spin" />;
            case 'invalid': return <X className="h-4 w-4 text-destructive" />;
            case 'dirty': return <Save className="h-4 w-4 text-green-500" />;
            case 'idle':
            default:
                return <Save className="h-4 w-4 text-muted-foreground opacity-50" />;
        }
    };

    return (
        <div className="w-full max-w-md space-y-6">
            <Card>
                <CardHeader>
                    <div className="flex justify-between items-start">
                        <div>
                            <CardTitle>Welcome, {user.username}!</CardTitle>
                            <CardDescription>Edit your account details below.</CardDescription>
                        </div>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={handleSave}
                            disabled={saveStatus === 'idle' || saveStatus === 'saving' || saveStatus === 'invalid'}
                            aria-label="Save changes"
                            className={saveStatus === 'invalid' ? 'text-destructive hover:text-destructive' : (saveStatus === 'dirty' ? 'text-blue-500 hover:text-blue-700' : '')}
                        >
                            {getStatusIcon()}
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    {apiError && (
                        <Alert variant="destructive">
                            <AlertTitle>Update Error</AlertTitle>
                            <AlertDescription>{apiError}</AlertDescription>
                        </Alert>
                    )}
                    <div className="space-y-1">
                        <Label htmlFor="profile-username">Username</Label>
                        <Input
                            id="profile-username"
                            name="username"
                            type="text"
                            value={formData.username}
                            onChange={handleInputChange}
                            aria-invalid={!!validationErrors.username}
                            className={validationErrors.username ? 'border-destructive focus-visible:ring-destructive/40' : ''}
                        />
                        {validationErrors.username && <p className="text-xs text-destructive mt-1">{validationErrors.username}</p>}
                    </div>

                    <div className="space-y-1">
                        <Label htmlFor="profile-email">Email</Label>
                        <Input
                            id="profile-email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            aria-invalid={!!validationErrors.email}
                            className={validationErrors.email ? 'border-destructive focus-visible:ring-destructive/40' : ''}
                        />
                        {validationErrors.email && <p className="text-xs text-destructive mt-1">{validationErrors.email}</p>}
                    </div>

                    <div className="space-y-1">
                        <Label htmlFor="profile-password">New Password (optional)</Label>
                        <Input
                            id="profile-password"
                            name="password"
                            type="password"
                            placeholder="Leave blank to keep current password"
                            value={formData.password}
                            onChange={handleInputChange}
                            aria-invalid={!!validationErrors.password || !!validationErrors.confirmPassword}
                            className={(validationErrors.password || validationErrors.confirmPassword) ? 'border-destructive focus-visible:ring-destructive/40' : ''}
                        />
                        {validationErrors.password && <p className="text-xs text-destructive mt-1">{validationErrors.password}</p>}
                    </div>

                    <div className="space-y-1">
                        <Label htmlFor="profile-confirmPassword">Confirm New Password</Label>
                        <Input
                            id="profile-confirmPassword"
                            name="confirmPassword"
                            type="password"
                            placeholder="Confirm new password if entered above"
                            value={formData.confirmPassword}
                            onChange={handleInputChange}
                            disabled={!formData.password} // Désactivé si le champ password est vide
                            aria-invalid={!!validationErrors.confirmPassword}
                            className={validationErrors.confirmPassword ? 'border-destructive focus-visible:ring-destructive/40' : ''}
                        />
                        {validationErrors.confirmPassword && <p className="text-xs text-destructive mt-1">{validationErrors.confirmPassword}</p>}
                    </div>

                    <div className="space-y-1 pt-2">
                        <p className="text-sm font-medium">Member since:</p>
                        <p className="text-sm text-muted-foreground">{new Date(user.createdAt).toLocaleDateString()}</p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-2 pt-4">
                        <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                            <AlertDialogTrigger asChild>
                                <Button variant="outline" className="w-full sm:w-auto">
                                    <Trash2 className="mr-2 h-4 w-4" /> Delete Account
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        This action cannot be undone. This will permanently delete your
                                        account and remove your data from our servers.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
                                    <AlertDialogAction
                                        onClick={handleDeleteConfirm}
                                        disabled={isDeleting}
                                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                    >
                                        {isDeleting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                                        Continue
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>

                        <Button onClick={onLogout} variant="destructive" className="w-full sm:w-auto sm:ml-auto min-w-[8rem]">
                            Logout
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default UserProfile;