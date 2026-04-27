import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/useAuth';
import LoadingSpinner from '../shared/LoadingSpinner';

function ProtectedRoute({ allowedRoles }) {
  const { isAuthenticated, isLoading, user } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <LoadingSpinner message="Checking your session..." fullPage />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}

export default ProtectedRoute;
