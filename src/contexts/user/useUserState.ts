
import { useState } from 'react';
import { AnnualLeaveBalance } from '@/types';
import { User } from './types';
import { useAuthStateManager } from './useAuthStateManager';
import { useAppUpdateDetection } from './useAppUpdateDetection';
import { useUserEffects } from './useUserEffects';
import { createAuthHandlers } from './authHandlers';

export const useUserState = () => {
  const [annualLeaveBalance, setAnnualLeaveBalance] = useState<AnnualLeaveBalance | null>(null);

  const {
    currentUser,
    setCurrentUser,
    isUserLoaded,
    userError,
    setUserError,
    isAuthenticated,
    setIsAuthenticated
  } = useAuthStateManager();

  const { handleUserLogout } = createAuthHandlers(
    setCurrentUser,
    setIsAuthenticated,
    setUserError
  );

  useAppUpdateDetection(handleUserLogout);

  const { clearUserError, resetUserState } = useUserEffects({
    currentUser,
    isAuthenticated,
    setAnnualLeaveBalance,
    setUserError
  });

  return {
    currentUser,
    setCurrentUser,
    annualLeaveBalance,
    setAnnualLeaveBalance,
    isUserLoaded,
    userError,
    clearUserError,
    resetUserState,
    isAuthenticated,
    setIsAuthenticated,
    setUserError
  };
};
