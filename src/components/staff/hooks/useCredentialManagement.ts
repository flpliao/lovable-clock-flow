import { useToast } from '@/hooks/use-toast';
import { useCanManageUser } from '@/hooks/useStores';
import { useState } from 'react';

export const useCredentialManagement = () => {
  const [isManagingCredentials, setIsManagingCredentials] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  
  const { toast } = useToast();
  const canManageUser = useCanManageUser();

  const openCredentialManagement = (userId: string) => {
    // Check if user has permission to manage this user's credentials
    if (!canManageUser(userId)) {
      toast({
        title: "權限不足",
        description: "您沒有權限管理此用戶的帳號設定",
        variant: "destructive"
      });
      return;
    }

    setSelectedUserId(userId);
    setIsManagingCredentials(true);
  };

  const closeCredentialManagement = () => {
    setSelectedUserId(null);
    setIsManagingCredentials(false);
  };

  return {
    isManagingCredentials,
    selectedUserId,
    openCredentialManagement,
    closeCredentialManagement
  };
};
