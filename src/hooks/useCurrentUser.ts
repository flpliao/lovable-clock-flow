
import { useUser } from '@/contexts/UserContext';
import { UserIdValidationService } from '@/services/userIdValidationService';

export const useCurrentUser = () => {
  const { currentUser, userError, clearUserError } = useUser();
  
  // 使用驗證服務確保 userId 正確
  const validatedUserId = currentUser?.id 
    ? UserIdValidationService.validateUserId(currentUser.id)
    : null;
  
  return {
    userId: validatedUserId,
    user: currentUser,
    userError,
    clearUserError
  };
};
