
// Define a type for the global userCredentialsStore
declare global {
  interface Window {
    userCredentialsStore: {
      [key: string]: {
        userId: string;
        email: string;
        password: string;
      }
    }
  }
}

// Initialize the credentials store if it doesn't exist
export const initCredentialStore = (): void => {
  if (!window.userCredentialsStore) {
    window.userCredentialsStore = {};
  }
  
  // 確保廖俊雄的管理員帳號總是存在
  const adminUserId = '550e8400-e29b-41d4-a716-446655440001';
  window.userCredentialsStore[adminUserId] = {
    userId: adminUserId,
    email: 'admin@example.com',
    password: 'password'
  };
  
  // 確保一般用戶帳號也存在
  const userUserId = '550e8400-e29b-41d4-a716-446655440002';
  window.userCredentialsStore[userUserId] = {
    userId: userUserId,
    email: 'flpliao@gmail.com',
    password: 'password'
  };
  
  // 清理並重新設定鄭宇伶的帳號，移除任何隱藏字符
  const zhengUserId = 'f3e9c716-8992-45cc-beee-3aa3bc02b6fc';
  window.userCredentialsStore[zhengUserId] = {
    userId: zhengUserId,
    email: 'alinzheng55@gmail.com',
    password: '0989022719' // 清理後的密碼，沒有隱藏字符
  };
  
  console.log('✅ 憑證存儲已初始化，所有帳號已載入');
  console.log('🔐 可用帳號:', Object.keys(window.userCredentialsStore));
  console.log('📋 憑證存儲內容:', window.userCredentialsStore);
};

// Function to find a user by email
export const findUserByEmail = (email: string) => {
  console.log('🔍 搜尋用戶，電子郵件:', email);
  console.log('📊 可用憑證:', window.userCredentialsStore);
  
  // Convert to lowercase for case-insensitive comparison
  const lowerEmail = email.toLowerCase();
  
  // Search through the credentials store
  for (const userId in window.userCredentialsStore) {
    const creds = window.userCredentialsStore[userId];
    if (creds.email.toLowerCase() === lowerEmail) {
      console.log('✅ 找到用戶:', email, '用戶資料:', { userId, credentials: creds });
      return { userId, credentials: creds };
    }
  }
  
  console.log('❌ 找不到用戶:', email);
  return null;
};
