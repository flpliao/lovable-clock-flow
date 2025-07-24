import { useUserStore } from '@/stores/userStore';

export const useCurrentUser = () => {
  const currentUser = useUserStore(state => state.currentUser);

  return {
    currentUser,
    isAuthenticated: !!currentUser,
    userId: currentUser?.id,
    userRole: currentUser?.role_id,
    userName: currentUser?.name,
  };
};
