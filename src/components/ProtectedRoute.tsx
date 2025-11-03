import { Navigate } from 'react-router-dom';
import { useAppStore } from '../stores/appStore';
import { ReactNode } from 'react';

interface ProtectedRouteProps {
  children: ReactNode;
  requireAdmin?: boolean;
  requireVerification?: boolean;
}

export function ProtectedRoute({
  children,
  requireAdmin = false,
  requireVerification = false,
}: ProtectedRouteProps) {
  const { isAdmin, isAgeVerified } = useAppStore();

  if (requireAdmin && !isAdmin) {
    return <Navigate to="/admin-login" replace />;
  }

  if (requireVerification && !isAgeVerified) {
    return <Navigate to="/verify-age" replace />;
  }

  return <>{children}</>;
}
