
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
    // 使用正確的 UUID 格式並確保一致性
    window.userCredentialsStore = {
      '550e8400-e29b-41d4-a716-446655440001': { 
        userId: '550e8400-e29b-41d4-a716-446655440001', 
        email: 'admin@example.com', 
        password: 'password' 
      },
      '550e8400-e29b-41d4-a716-446655440002': { 
        userId: '550e8400-e29b-41d4-a716-446655440002', 
        email: 'flpliao@gmail.com', 
        password: 'password' 
      }
    };
    console.log('Credential store initialized with default accounts');
  } else {
    // 確保帳號存在並使用正確的 UUID
    if (!window.userCredentialsStore['550e8400-e29b-41d4-a716-446655440001']) {
      window.userCredentialsStore['550e8400-e29b-41d4-a716-446655440001'] = { 
        userId: '550e8400-e29b-41d4-a716-446655440001', 
        email: 'admin@example.com', 
        password: 'password' 
      };
      console.log('Added missing admin account to existing credential store');
    }
    if (!window.userCredentialsStore['550e8400-e29b-41d4-a716-446655440002']) {
      window.userCredentialsStore['550e8400-e29b-41d4-a716-446655440002'] = { 
        userId: '550e8400-e29b-41d4-a716-446655440002', 
        email: 'flpliao@gmail.com', 
        password: 'password' 
      };
      console.log('Added missing flpliao account to existing credential store');
    }
  }
  console.log('Current credential store:', window.userCredentialsStore);
};

// Function to find a user by email
export const findUserByEmail = (email: string) => {
  console.log('Searching for user with email:', email);
  console.log('Available credentials:', window.userCredentialsStore);
  
  // Convert to lowercase for case-insensitive comparison
  const lowerEmail = email.toLowerCase();
  
  // Search through the credentials store
  for (const userId in window.userCredentialsStore) {
    const creds = window.userCredentialsStore[userId];
    if (creds.email.toLowerCase() === lowerEmail) {
      console.log('Found user for email:', email, 'User:', { userId, credentials: creds });
      return { userId, credentials: creds };
    }
  }
  
  console.log('No user found for email:', email);
  return null;
};
