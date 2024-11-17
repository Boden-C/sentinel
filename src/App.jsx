import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { PrivateRoute } from './components/PrivateRoute';
import { AuthProvider } from './components/AuthContext';
import { ThemeProvider } from '@/components/ThemeProvider';

import DashboardPage from './pages/DashboardPage';
import Signin from './pages/SigninPage';
import SignUp from './pages/SignupPage';

function App() {
    return (
        <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
            <AuthProvider>
                <Router>
                    <Routes>
                        {/* Public Routes */}
                        <Route path="/" element={<Navigate to="/signup" />} />
                        <Route path="/signup" element={<SignUp />} />
                        <Route path="/signin" element={<Signin />} />

                        {/* Private Routes */}
                        <Route
                            path="/dashboard"
                            element={
                                <PrivateRoute>
                                    <DashboardPage />
                                </PrivateRoute>
                            }
                        />

                        {/* This route is only used for testing, and should be removed before deployment. */}
                        <Route path="/test" element={<Signin />} />

                        {/* 404 Route */}
                        <Route path="*" element={<h1>404: Not Found</h1>} />
                    </Routes>
                </Router>
            </AuthProvider>
        </ThemeProvider>
    );
}

export default App;
