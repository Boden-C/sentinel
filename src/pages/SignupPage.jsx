import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/components/AuthContext';
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
    CardDescription,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Checkbox } from '@/components/ui/checkbox';
import { Icons } from '@/components/ui/icons';

import { getUserFriendlyErrorMessage } from '@/scripts/utils';

/**
 * SignUp component for user registration
 * @returns {JSX.Element} The SignUp form component
 */
export default function SignUp() {
    const navigate = useNavigate();
    const location = useLocation();
    const { user, signup } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        rememberMe: true,
    });

    useEffect(() => {
        if (user) {
            const from = location.state?.from?.pathname || '/dashboard';
            navigate(from, { replace: true });
        }
    }, [user, navigate, location]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const isValidEmail = (email) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    /**
     * Handles form submission for user registration
     * @param {React.FormEvent<HTMLFormElement>} e - Form submission event
     */
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Basic validation
        if (!formData.email || !formData.password) {
            setError('Email and password are required');
            return;
        }

        if (!isValidEmail(formData.email)) {
            setError('Please enter a valid email address');
            return;
        }

        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters long');
            return;
        }

        setIsLoading(true);

        try {
            await signup(formData.email, formData.password, formData.name || null, formData.rememberMe);
        } catch (err) {
            setError(getUserFriendlyErrorMessage(err));
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="relative min-h-screen flex items-center justify-center p-4 overflow-hidden">
            <div className="auth-background absolute inset-0" />
            <div className="absolute inset-0 bg-black/50" />
            <Card className="relative w-full max-w-lg backdrop-blur-sm bg-background/95">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-3xl text-center">Create Account</CardTitle>
                    <CardDescription className="text-center">
                        Enter your details to create your account
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                        {error && (
                            <Alert variant="destructive">
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                        )}

                        <div className="space-y-2">
                            <Label htmlFor="name">Name (Optional)</Label>
                            <Input
                                id="name"
                                name="name"
                                type="text"
                                value={formData.name}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                name="password"
                                type="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="flex items-center space-x-2">
                            <Checkbox
                                id="rememberMe"
                                name="rememberMe"
                                checked={formData.rememberMe}
                                onCheckedChange={(checked) =>
                                    setFormData((prev) => ({ ...prev, rememberMe: checked }))
                                }
                            />
                            <Label htmlFor="rememberMe" className="text-sm font-normal">
                                Remember me
                            </Label>
                        </div>

                        <Button type="submit" className="w-full" disabled={isLoading}>
                            {isLoading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
                            Sign up
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="flex flex-col space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <Button variant="outline" type="button" onClick={() => signup('google')}>
                            <Icons.google className="mr-2 h-4 w-4" /> Google
                        </Button>
                        <Button variant="outline" type="button" onClick={() => signup('github')}>
                            <Icons.gitHub className="mr-2 h-4 w-4" /> GitHub
                        </Button>
                    </div>

                    <div className="text-center text-sm pt-4 text-muted-foreground">
                        Already have an account?{' '}
                        <a href="/signin" className="p-0 font-semibold text-primary hover:underline">
                            Sign In
                        </a>
                    </div>
                </CardFooter>
            </Card>
        </div>
    );
}