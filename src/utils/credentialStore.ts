
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
  console.log('🔐 初始化憑證存儲 - 準備載入實際員工帳號');
  
  // 清空測試帳號，準備載入實際員工資料
  credentialStore = {};
  
  console.log('🔐 憑證存儲初始化完成，等待載入實際員工帳號');
};

// 從人員管理系統載入員工憑證
export const loadStaffCredentials = (staffList: any[]) => {
  console.log('📋 載入員工憑證資料，員工數量:', staffList.length);
  
  staffList.forEach(staff => {
    // 檢查員工是否已有設定的憑證
    if (window.userCredentialsStore && window.userCredentialsStore[staff.id]) {
      const existingCredential = window.userCredentialsStore[staff.id];
      console.log('🔐 載入員工憑證:', staff.name, '信箱:', existingCredential.email);
      
      credentialStore[existingCredential.email] = {
        userId: staff.id,
        email: existingCredential.email,
        password: existingCredential.password
      };
    } else {
      // 如果員工還沒有設定憑證，使用預設格式
      const defaultEmail = staff.email || `${staff.name.toLowerCase()}@company.com`;
      const defaultPassword = 'password123'; // 預設密碼，員工需要修改
      
      console.log('🔐 建立預設憑證:', staff.name, '信箱:', defaultEmail);
      
      credentialStore[defaultEmail] = {
        userId: staff.id,
        email: defaultEmail,
        password: defaultPassword
      };
      
      // 同時更新全域憑證存儲
      if (!window.userCredentialsStore) {
        window.userCredentialsStore = {};
      }
      window.userCredentialsStore[staff.id] = {
        userId: staff.id,
        email: defaultEmail,
        password: defaultPassword
      };
    }
  });
  
  console.log('🔐 員工憑證載入完成，總計:', Object.keys(credentialStore).length, '個帳號');
  console.log('🔐 可用帳號:', Object.keys(credentialStore));
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

export const getCredentialStore = () => {
  return credentialStore;
};

const generateUserId = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};
