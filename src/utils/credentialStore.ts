/**
 * @deprecated 此檔案已棄用，現在使用 Supabase staff 表格進行驗證
 * 請使用 src/services/authService.ts 代替
 */

interface Credentials {
  userId: string;
  email: string;
  password: string;
}

interface CredentialStore {
  [key: string]: Credentials;
}

let credentialStore: CredentialStore = {};

export const initCredentialStore = () => {
  console.log('⚠️ credentialStore 已棄用，請使用 AuthService');
  
  // 保留舊的初始化邏輯以防萬一
  credentialStore = {
    'admin@example.com': {
      userId: '550e8400-e29b-41d4-a716-446655440001',
      email: 'admin@example.com',
      password: 'password'
    },
    'liao.junxiong@company.com': {
      userId: '550e8400-e29b-41d4-a716-446655440001',
      email: 'liao.junxiong@company.com',
      password: 'password123'
    },
    'flpliao@gmail.com': {
      userId: '550e8400-e29b-41d4-a716-446655440002',
      email: 'flpliao@gmail.com',
      password: 'password'
    },
    'alinzheng55@gmail.com': {
      userId: '550e8400-e29b-41d4-a716-446655440003',
      email: 'alinzheng55@gmail.com',
      password: '0989022719'
    },
    'lshuahua@company.com': {
      userId: '550e8400-e29b-41d4-a716-446655440004',
      email: 'lshuahua@company.com',
      password: 'password123'
    },
    'liaoyuwii@yahoo.tw': {
      userId: '550e8400-e29b-41d4-a716-446655440004',
      email: 'liaoyuwii@yahoo.tw',
      password: '123456'
    }
  };
  
  console.log('⚠️ 建議遷移到使用 Supabase AuthService 進行驗證');
};

// 保留舊的函數以防萬一，但標記為已棄用
export const addCredential = (email: string, password: string, userId?: string) => {
  console.warn('⚠️ addCredential 已棄用，請使用 Supabase staff 表格');
  console.log('🔐 新增憑證:', email);
  
  const finalUserId = userId || generateUserId();
  
  credentialStore[email] = {
    userId: finalUserId,
    email: email,
    password: password
  };
  
  console.log('🔐 憑證新增成功:', email, 'UserID:', finalUserId);
  console.log('🔐 目前存儲的所有帳號:', Object.keys(credentialStore));
  
  return finalUserId;
};

export const updateCredential = (email: string, newPassword: string) => {
  console.warn('⚠️ updateCredential 已棄用，請使用 Supabase staff 表格');
  console.log('🔐 更新憑證:', email);
  
  if (credentialStore[email]) {
    credentialStore[email].password = newPassword;
    console.log('🔐 憑證更新成功:', email);
    return true;
  }
  
  console.log('🔐 憑證更新失敗 - 找不到帳號:', email);
  return false;
};

export const findUserByEmail = (email: string) => {
  console.warn('⚠️ findUserByEmail 已棄用，請使用 AuthService.findUserByEmail');
  console.log('🔍 搜尋用戶:', email);
  console.log('🔍 目前存儲的帳號:', Object.keys(credentialStore));
  
  const credentials = credentialStore[email];
  if (credentials) {
    console.log('🔍 找到用戶:', credentials);
    return {
      userId: credentials.userId,
      credentials: credentials
    };
  }
  
  console.log('🔍 未找到用戶:', email);
  return null;
};

export const getAllCredentials = () => {
  console.warn('⚠️ getAllCredentials 已棄用，請直接查詢 Supabase staff 表格');
  return Object.values(credentialStore);
};

const generateUserId = () => {
  // 生成簡單的 UUID 格式
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};
