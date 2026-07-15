import { Navigate } from "react-router";
import { useAuth } from "../contexts/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireElite?: boolean;
}

export function ProtectedRoute({ children, requireElite = false }: ProtectedRouteProps) {
  const { user, userData, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center bg-slate-950">
        <div className="h-8 w-8 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (requireElite && userData?.membershipStatus !== "Elite") {
    return <Navigate to="/membership" replace />;
  }

  return <>{children}</>;
}
