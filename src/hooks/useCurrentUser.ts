
import { useUser } from '@/contexts/UserContext';
import { UserIdValidationService } from '@/services/userIdValidationService';

export const useCurrentUser = () => {
  const { currentUser, userError, clearUserError } = useUser();
  
  // 確保廖俊雄的 userId 正確 - 更新為正確的 UUID
  const validatedUserId = currentUser?.id === '0765138a-6f11-45f4-be07-dab965116a2d'
    ? currentUser.id
    : (currentUser?.id ? UserIdValidationService.validateUserId(currentUser.id) : null);
  
  return {
    userId: validatedUserId,
    user: currentUser,
    userError,
    clearUserError
  };
};
