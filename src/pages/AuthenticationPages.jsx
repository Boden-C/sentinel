import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Button, Input, AuthCard } from '@/components/Components';
import { signin, signup } from '@/scripts/auth';
import { getUserFriendlyErrorMessage } from '@/scripts/utils';
import { useAuth } from '../components/AuthContext';

// Sign-up page
const SignUp = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [errorMessage, setErrorMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage('');

        try {
            await signup(formData.email, formData.password);
            navigate('/dashboard');
        } catch (error) {
            setErrorMessage(getUserFriendlyErrorMessage(error));
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    return (
        <AuthCard title="Create Account">
            <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                <Input
                    label="Email Address"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="Enter your email"
                />
                <Input
                    label="Password"
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    placeholder="Enter your password"
                />
                {errorMessage && <p className="text-red-500 text-sm text-center">{errorMessage}</p>}
                <Button type="submit">Sign Up</Button>

                <p className="text-center text-sm text-gray-600">
                    Already have an account?{' '}
                    <a href="/signin" className="font-medium text-blue-600 hover:text-blue-500">
                        Sign in
                    </a>
                </p>
            </form>
        </AuthCard>
    );
};

// Sign-in page
const SignIn = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user } = useAuth();

    // Add this effect to handle automatic redirects when already authenticated
    useEffect(() => {
        if (user) {
            const from = location.state?.from?.pathname || '/dashboard';
            navigate(from, { replace: true });
        }
    }, [user, navigate, location]);

    // Your existing state setup
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage('');
        setIsLoading(true);

        try {
            await signin(formData.email, formData.password);
            // No need to navigate here - the useEffect above will handle it
            // when the auth state changes
        } catch (error) {
            setErrorMessage(getUserFriendlyErrorMessage(error));
            setIsLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    return (
        <AuthCard title="Welcome Back">
            <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                <Input
                    label="Email Address"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="Enter your email"
                    disabled={isLoading}
                    aria-label="Email Address"
                />
                <Input
                    label="Password"
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    placeholder="Enter your password"
                    disabled={isLoading}
                    aria-label="Password"
                />
                {errorMessage && (
                    <p className="text-red-500 text-sm text-center" role="alert" aria-live="polite">
                        {errorMessage}
                    </p>
                )}
                <Button type="submit">
                    {isLoading ? 'Signing in...' : 'Sign In'}
                </Button>

                <p className="text-center text-sm text-gray-600">
                    Don&apos;t have an account?{' '}
                    <Link to="/signup" className="font-medium text-blue-600 hover:text-blue-500">
                        Sign up
                    </Link>
                </p>
            </form>
        </AuthCard>
    );
};

export default SignIn;

export { SignUp, SignIn };
