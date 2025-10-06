import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

export default function ProtectedRoute({ children }) {
  const { jwt } = useAuth();
  if (!jwt) return <Navigate to="/login" replace />;
  return children;
}
