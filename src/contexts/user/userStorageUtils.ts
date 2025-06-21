
import { User } from './types';

export const getUserFromStorage = (): User | null => {
  const storedUser = localStorage.getItem('currentUser');
  if (storedUser) {
    try {
      const user = JSON.parse(storedUser);
      console.log('👤 UserProvider: 從本地存儲恢復用戶:', user.name);
      return user;
    } catch (error) {
      console.error('👤 UserProvider: 解析存儲用戶資料失敗:', error);
      localStorage.removeItem('currentUser');
      return null;
    }
  }
  return null;
};

export const saveUserToStorage = (user: User | null): void => {
  if (user) {
    localStorage.setItem('currentUser', JSON.stringify(user));
  } else {
    localStorage.removeItem('currentUser');
  }
};

export const clearUserStorage = (): void => {
  localStorage.removeItem('currentUser');
};
