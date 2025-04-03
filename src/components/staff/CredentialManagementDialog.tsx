
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { UserCog } from 'lucide-react';
import CredentialManagement from './CredentialManagement';
import { Staff } from './types';
import { useToast } from '@/hooks/use-toast';

interface CredentialManagementDialogProps {
  staff: Staff;
}

const CredentialManagementDialog: React.FC<CredentialManagementDialogProps> = ({ staff }) => {
  const [open, setOpen] = React.useState(false);
  const { toast } = useToast();
  
  const handleSuccess = () => {
    // Show success toast
    toast({
      title: "帳號設定已更新",
      description: "用戶需要使用新的憑據登錄。",
    });
    
    // Close dialog after successful update
    setOpen(false);
  };
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="ml-2">
          <UserCog className="h-4 w-4 mr-2" />
          帳號設定
        </Button>
      </DialogTrigger>
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
