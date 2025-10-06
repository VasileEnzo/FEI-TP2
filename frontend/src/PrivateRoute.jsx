import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";

export default function PrivateRoute({ children }) {
  const { user, jwt } = useAuth();
  const location = useLocation();

  // si no hay sesión, redirigimos a /login y recordamos a dónde quería ir
  if (!user || !jwt) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }
  return children;
}
