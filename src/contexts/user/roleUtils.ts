
import { User } from './types';
import { useMemo } from 'react';

export const createRoleChecker = (currentUser: User | null) => {
  // Use useMemo to stabilize functions, avoiding recreation on every render
  const isAdmin = useMemo((): (() => boolean) => {
    return () => {
      if (!currentUser) return false;
      
      // Role-based admin check - no hardcoded UUIDs
      const isRoleAdmin = currentUser?.role === 'admin';
      
      console.log('🔐 Admin permission check (secure):', {
        userName: currentUser.name,
        userId: currentUser.id,
        email: currentUser?.email,
        role: currentUser.role,
        result: isRoleAdmin
      });
      
      return isRoleAdmin;
    };
  }, [currentUser]);

  const isManager = useMemo((): (() => boolean) => {
    return () => {
      if (!currentUser) return false;
      
      // Role-based manager check
      const result = currentUser.role === 'manager' || isAdmin();
      
      console.log('🔐 Manager permission check:', {
        userName: currentUser.name,
        role: currentUser.role,
        result
      });
      
      return result;
    };
  }, [currentUser, isAdmin]);

  const canManageUser = useMemo(() => {
    return (userId: string): boolean => {
      if (!currentUser) return false;
      
      // Role-based user management check - no hardcoded UUIDs
      const result = currentUser.role === 'admin' || 
                    currentUser.role === 'manager' || 
                    currentUser.id === userId;
      
      console.log('🔐 User management permission check:', {
        userName: currentUser.name,
        role: currentUser.role,
        targetUserId: userId,
        result
      });
      
      return result;
    };
  }, [currentUser]);

  return { isAdmin, isManager, canManageUser };
};
