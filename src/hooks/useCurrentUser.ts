import { useUser } from '@/contexts/UserContext';

export const useCurrentUser = () => {
  const { currentUser } = useUser();

  return {
    currentUser,
    isAuthenticated: !!currentUser,
    userId: currentUser?.id,
    userRole: currentUser?.role_id,
    userName: currentUser?.name
  };
};
