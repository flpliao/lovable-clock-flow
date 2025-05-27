
import { useUser } from '@/contexts/UserContext';

export const useCurrentUser = () => {
  const { currentUser } = useUser();
  
  return {
    userId: currentUser?.id || null,
    user: currentUser
  };
};
