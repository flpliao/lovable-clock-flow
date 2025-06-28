
import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { AuthService } from '@/services/authService';
import { UnifiedPermissionService } from '@/services/unifiedPermissionService';
import { User } from './types';
import { saveUserToStorage, clearUserStorage } from './userStorageUtils';

export const createAuthHandlers = (
  setCurrentUser: (user: User | null) => void,
  setIsAuthenticated: (auth: boolean) => void,
  setUserError: (error: string | null) => void
) => {
  const navigate = useNavigate();

  // Secure user data loading without exposing sensitive information
  const loadUserFromStaffTable = async (authUser: any): Promise<User | null> => {
    try {
      console.log('🔄 Loading user permission data from staff table');
      
      const { data: staffData, error } = await supabase
        .from('staff')
        .select('*')
        .eq('email', authUser.email)
        .single();
      
      if (error) {
        console.error('❌ Failed to load user from staff table:', error.message);
        return null;
      }
      
      if (staffData) {
        console.log('✅ Successfully loaded user data from staff table:', {
          staff_id: staffData.id,
          user_id: staffData.user_id,
          name: staffData.name,
          email: staffData.email,
          role: staffData.role
        });
        
        // Convert to User format using Supabase Auth user ID
        const user: User = {
          id: authUser.id,
          name: staffData.name,
          position: staffData.position,
          department: staffData.department,
          onboard_date: staffData.created_at?.split('T')[0] || new Date().toISOString().split('T')[0],
          hire_date: staffData.hire_date,
          supervisor_id: staffData.supervisor_id,
          role: staffData.role as 'admin' | 'manager' | 'user',
          email: staffData.email
        };
        
        console.log('🔐 User permission data loaded:', {
          auth_uid: user.id,
          staff_id: staffData.id,
          name: user.name,
          email: user.email,
          role: user.role
        });
        
        return user;
      }
      
      return null;
    } catch (error) {
      console.error('❌ System error loading staff table data:', error);
      return null;
    }
  };

  // Handle user login with secure data handling
  const handleUserLogin = useCallback(async (session: any) => {
    console.log('🔄 Processing user login...');
    
    try {
      // Load user data from staff table first
      const staffUser = await loadUserFromStaffTable(session.user);
      
      if (staffUser) {
        console.log('✅ Using staff table data:', staffUser.name, 'role:', staffUser.role);
        setCurrentUser(staffUser);
        setIsAuthenticated(true);
        saveUserToStorage(staffUser);
        setUserError(null);
        console.log('🔐 Authentication status set to true (staff)');
        return;
      }

      // Fallback to AuthService if no staff data
      const result = await AuthService.getUserFromSession(session.user.email);
      if (result.success && result.user) {
        console.log('✅ Using AuthService user data:', result.user.name);
        const user: User = {
          id: result.user.id,
          name: result.user.name,
          position: result.user.position,
          department: result.user.department,
          onboard_date: new Date().toISOString().split('T')[0],
          role: result.user.role,
          email: result.user.email
        };
        
        setCurrentUser(user);
        setIsAuthenticated(true);
        saveUserToStorage(user);
        setUserError(null);
        console.log('🔐 Authentication status set to true (auth service)');
        return;
      }

      // Final fallback to session basic data
      console.log('⚠️ Using session basic data as fallback');
      const fallbackUser: User = {
        id: session.user.id,
        name: session.user.user_metadata?.name || session.user.email?.split('@')[0] || 'User',
        position: 'Staff',
        department: 'General',
        onboard_date: new Date().toISOString().split('T')[0],
        role: 'user',
        email: session.user.email
      };
      
      setCurrentUser(fallbackUser);
      setIsAuthenticated(true);
      saveUserToStorage(fallbackUser);
      setUserError(null);
      console.log('🔐 Authentication status set to true (fallback)');
    } catch (error) {
      console.error('❌ User login processing failed:', error);
      setUserError('Failed to load user data');
      setIsAuthenticated(false);
    }
  }, [setCurrentUser, setIsAuthenticated, setUserError]);

  // Handle user logout with proper cleanup
  const handleUserLogout = useCallback(() => {
    console.log('🚪 Processing user logout');
    setCurrentUser(null);
    setIsAuthenticated(false);
    setUserError(null);
    clearUserStorage();
    
    // Clear permission cache
    const permissionService = UnifiedPermissionService.getInstance();
    permissionService.clearCache();
    
    // Navigate to login page
    console.log('🔄 Redirecting to login page after logout');
    navigate('/login', { replace: true });
  }, [navigate, setCurrentUser, setIsAuthenticated, setUserError]);

  return {
    handleUserLogin,
    handleUserLogout
  };
};
