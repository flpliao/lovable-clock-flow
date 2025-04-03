
import React from 'react';
import { useUser } from '@/contexts/UserContext';
import { useCredentials } from '@/hooks/useCredentials';
import EmailManagementCard from './credentials/EmailManagementCard';
import PasswordManagementCard from './credentials/PasswordManagementCard';

interface CredentialManagementProps {
  userId?: string; // Optional - if provided, admin is managing another user's credentials
  onSuccess?: () => void;
}

// Create a global store for credentials to simulate a database
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
if (!window.userCredentialsStore) {
  window.userCredentialsStore = {
    '1': { userId: '1', email: 'admin@example.com', password: 'password' }
  };
}

const CredentialManagement: React.FC<CredentialManagementProps> = ({ 
  userId,
  onSuccess 
}) => {
  const { currentUser, isAdmin, canManageUser } = useUser();
  
  // Determine if this is admin managing someone else or user managing own account
  const managingOwnAccount = !userId || userId === currentUser?.id;
  const targetUserId = userId || currentUser?.id;
  
  // Validate permissions
  const hasPermission = targetUserId && (
    managingOwnAccount || (isAdmin() && canManageUser(targetUserId))
  );
  
  const { 
    currentEmail, 
    updateEmail, 
    updatePassword 
  } = useCredentials({ 
    userId: targetUserId, 
    onSuccess 
  });

  if (!targetUserId) {
    return <div className="text-center p-4">無法管理帳號：用戶未登入</div>;
  }

  if (!hasPermission) {
    return <div className="text-center p-4">權限不足：您沒有權限管理此帳號</div>;
  }
  
  return (
    <div className="space-y-6">
      <EmailManagementCard 
        currentEmail={currentEmail} 
        onEmailChange={updateEmail} 
      />
      
      <PasswordManagementCard 
        managingOwnAccount={managingOwnAccount}
        onPasswordChange={updatePassword}
      />
    </div>
  );
};

export default CredentialManagement;
