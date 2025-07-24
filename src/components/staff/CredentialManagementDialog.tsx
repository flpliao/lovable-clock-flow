
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/useToast';
import React from 'react';
import CredentialManagement from './CredentialManagement';
import { Staff } from './types';

interface CredentialManagementDialogProps {
  staff: Staff;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CredentialManagementDialog: React.FC<CredentialManagementDialogProps> = ({ 
  staff, 
  open, 
  onOpenChange 
}) => {
  const { toast } = useToast();
  
  const handleSuccess = () => {
    console.log('✅ 帳號設定更新成功:', staff.name);
    
    // Show success toast
    toast({
      title: "帳號設定已更新",
      description: `${staff.name} 的帳號設定已成功更新，該用戶需要使用新的憑據登錄。`,
    });
    
    // Close dialog after successful update
    onOpenChange(false);
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>管理 {staff.name} 的帳號設定</DialogTitle>
          <DialogDescription>
            您可以在此設置用戶的電子郵件地址和密碼。更改生效後，用戶需要使用新的憑據登錄。
          </DialogDescription>
        </DialogHeader>
        <CredentialManagement 
          userId={staff.id} 
          onSuccess={handleSuccess}
        />
      </DialogContent>
    </Dialog>
  );
};

export default CredentialManagementDialog;
