
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
  console.log('🔐 初始化憑證存儲');
  
  // 初始化預設憑證，包含人員管理中的所有員工
  credentialStore = {
    // 廖俊雄 - 總經理
    'admin@example.com': {
      userId: '550e8400-e29b-41d4-a716-446655440001',
      email: 'admin@example.com',
      password: 'password'
    },
    'liaojunxiong@company.com': {
      userId: '550e8400-e29b-41d4-a716-446655440001',
      email: 'liaojunxiong@company.com',
      password: 'password'
    },
    
    // 廖淑華 - 經理
    'lshuahua@company.com': {
      userId: '550e8400-e29b-41d4-a716-446655440004',
      email: 'lshuahua@company.com',
      password: 'password123'
    },
    'liaoshuhua@company.com': {
      userId: '550e8400-e29b-41d4-a716-446655440004',
      email: 'liaoshuhua@company.com',
      password: 'password123'
    },
    
    // 鄭宇伶 - HR
    'alinzheng55@gmail.com': {
      userId: '550e8400-e29b-41d4-a716-446655440003',
      email: 'alinzheng55@gmail.com',
      password: '0989022719'
    },
    'zhengyuling@company.com': {
      userId: '550e8400-e29b-41d4-a716-446655440003',
      email: 'zhengyuling@company.com',
      password: '0989022719'
    },
    
    // 廖小雄 - 經理
    'flpliao@gmail.com': {
      userId: '550e8400-e29b-41d4-a716-446655440002',
      email: 'flpliao@gmail.com',
      password: 'password'
    },
    'liaoxiaoxiong@company.com': {
      userId: '550e8400-e29b-41d4-a716-446655440002',
      email: 'liaoxiaoxiong@company.com',
      password: 'password'
    }
  };
  
  console.log('🔐 憑證存儲初始化完成，包含帳號:', Object.keys(credentialStore));
};

export const addCredential = (email: string, password: string, userId?: string) => {
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
  console.log('🔍 取得所有憑證');
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
