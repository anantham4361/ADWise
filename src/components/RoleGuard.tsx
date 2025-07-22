import React from 'react';
import { useAuthStore } from '../stores/authStore';

interface RoleGuardProps {
  children: React.ReactNode;
  permission?: string;
  role?: 'admin' | 'analyst';
  fallback?: React.ReactNode;
}

const RoleGuard: React.FC<RoleGuardProps> = ({ 
  children, 
  permission, 
  role, 
  fallback = null 
}) => {
  const { profile, hasPermission } = useAuthStore();

  if (!profile) {
    return <>{fallback}</>;
  }

  if (role && profile.role !== role) {
    return <>{fallback}</>;
  }

  if (permission && !hasPermission(permission)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};

export default RoleGuard;