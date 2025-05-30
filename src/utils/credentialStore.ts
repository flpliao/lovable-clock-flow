
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
    // 清空所有帳號資料，準備輸入正式資料
    window.userCredentialsStore = {};
    console.log('Credential store initialized and cleared for production data');
  } else {
    // 清空所有帳號，準備輸入正式資料
    window.userCredentialsStore = {};
    console.log('Credential store cleared and ready for production data');
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
