
import React from 'react';
import { useUser } from '@/contexts/UserContext';
import { useCredentials } from '@/hooks/useCredentials';
import EmailManagementCard from './credentials/EmailManagementCard';
import PasswordManagementCard from './credentials/PasswordManagementCard';

interface CredentialManagementProps {
  userId?: string; // Optional - if provided, admin is managing another user's credentials
  onSuccess?: () => void;
}

const CredentialManagement: React.FC<CredentialManagementProps> = ({ 
  userId,
  onSuccess 
}) => {
  const { currentUser, isAdmin, canManageUser } = useUser();
  
  // Determine if this is admin managing someone else or user managing own account
  const managingOwnAccount = !userId || userId === currentUser?.id;
  const targetUserId = userId || currentUser?.id;
  
  // 系統管理員應該擁有所有帳號管理權限
  const isSystemAdmin = isAdmin();
  const canManageEmail = isSystemAdmin || managingOwnAccount;
  const canManagePassword = isSystemAdmin || managingOwnAccount;
  
  // Validate permissions - 系統管理員可以管理所有帳號
  const hasPermissionToManage = targetUserId && (
    managingOwnAccount || 
    (isSystemAdmin && canManageUser(targetUserId))
  );
  
  const { 
    currentEmail, 
    updateEmail, 
    updatePassword 
  } = useCredentials({ 
    userId: targetUserId, 
    onSuccess 
  });

  console.log('🔐 帳號管理權限檢查:', {
    currentUser: currentUser?.name,
    currentUserRole: currentUser?.role,
    isSystemAdmin,
    managingOwnAccount,
    targetUserId,
    canManageEmail,
    canManagePassword,
    hasPermissionToManage
  });

  if (!targetUserId) {
    return <div className="text-center p-4">無法管理帳號：用戶未登入</div>;
  }

  if (!hasPermissionToManage) {
    return (
      <div className="text-center p-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h3 className="text-red-800 font-medium mb-2">權限不足</h3>
          <p className="text-red-600 text-sm">
            您沒有權限管理此帳號設定。請聯繫系統管理員。
          </p>
          <div className="mt-2 text-xs text-red-500">
            調試資訊: 當前用戶角色 = {currentUser?.role}, 系統管理員 = {isSystemAdmin ? '是' : '否'}
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      {/* 權限提示 */}
      {!managingOwnAccount && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="text-blue-800 font-medium mb-2">管理員模式</h3>
          <p className="text-blue-600 text-sm">
            您正在以系統管理員身份修改其他使用者的帳號設定。修改後該使用者需要使用新的登入資訊。
          </p>
        </div>
      )}

      {/* 電子郵件管理 - 系統管理員和用戶本人都可以管理 */}
      {canManageEmail && (
        <EmailManagementCard 
          currentEmail={currentEmail} 
          onEmailChange={updateEmail} 
        />
      )}
      
      {/* 密碼管理 - 系統管理員和用戶本人都可以管理 */}
      {canManagePassword && (
        <PasswordManagementCard 
          managingOwnAccount={managingOwnAccount}
          onPasswordChange={updatePassword}
        />
      )}

      {/* 如果沒有任何管理權限 */}
      {!canManageEmail && !canManagePassword && (
        <div className="text-center p-4">
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <p className="text-gray-600">
              您沒有足夠的權限管理此帳號設定。
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default CredentialManagement;
