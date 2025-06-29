
import { User } from './types';
import { useMemo } from 'react';

export const createRoleChecker = (currentUser: User | null) => {
  // Use useMemo to stabilize functions, avoiding recreation on every render
  const isAdmin = useMemo((): (() => boolean) => {
    return () => {
      if (!currentUser) return false;
      
      // 超級管理員 UUID 檢查
      const isSuperAdmin = currentUser.id === '550e8400-e29b-41d4-a716-446655440001';
      
      // Role-based admin check
      const isRoleAdmin = currentUser?.role === 'admin';
      
      const result = isSuperAdmin || isRoleAdmin;
      
      console.log('🔐 Admin permission check:', {
        userName: currentUser.name,
        userId: currentUser.id,
        email: currentUser?.email,
        role: currentUser.role,
        isSuperAdmin,
        isRoleAdmin,
        result
      });
      
      return result;
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
      
      // Role-based user management check
      const result = currentUser.role === 'admin' || 
                    currentUser.role === 'manager' || 
                    currentUser.id === userId ||
                    currentUser.id === '550e8400-e29b-41d4-a716-446655440001'; // 超級管理員
      
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
