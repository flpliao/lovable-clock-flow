
import { useUser } from '@/contexts/UserContext';
import { UserIdValidationService } from '@/services/userIdValidationService';

export const useCurrentUser = () => {
  const { currentUser, userError, clearUserError } = useUser();
  
  // 確保廖俊雄的 userId 正確
  const validatedUserId = currentUser?.id === '550e8400-e29b-41d4-a716-446655440001'
    ? currentUser.id
    : (currentUser?.id ? UserIdValidationService.validateUserId(currentUser.id) : null);
  
  return {
    userId: validatedUserId,
    user: currentUser,
    userError,
    clearUserError
  };
};
