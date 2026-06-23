import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import HomePage from '../pages/HomePage';

export default function RedirectHome() {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (user?.role === 'ADMIN' || user?.role === 'PROFESSOR') {
    return <Navigate to="/admin" replace />;
  }

  return <HomePage />;
}
