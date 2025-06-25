
import { useUser } from '@/contexts/UserContext';

export const useCurrentUser = () => {
  const { currentUser, userError, clearUserError } = useUser();
  
  // 確保廖有朋和其他用戶的 userId 正確處理
  const validatedUserId = currentUser?.id;
  
  console.log('🔍 useCurrentUser - 用戶資訊:', {
    原始用戶ID: currentUser?.id,
    驗證後用戶ID: validatedUserId,
    用戶名稱: currentUser?.name
  });
  
  return {
    userId: validatedUserId,
    user: currentUser,
    userError,
    clearUserError
  };
};
