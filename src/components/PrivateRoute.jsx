import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/components/AuthContext';

/**
 * Route wrapper to protect routes that require authentication
 * @param {Object} props - Component props
 * @param {JSX.Element} props.children - Child components to render if authenticated
 * @returns {JSX.Element} Protected route
 */
export function PrivateRoute({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div>Loading...</div>; // TODO replace with spinner
  }

  if (!user) {
    // Redirect to signin but save the attempted url
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }

  return children;
}