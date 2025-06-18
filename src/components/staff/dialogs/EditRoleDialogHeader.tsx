
import React from 'react';
import { DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Shield } from 'lucide-react';

interface EditRoleDialogHeaderProps {
  isSystemRole: boolean;
}

export const EditRoleDialogHeader: React.FC<EditRoleDialogHeaderProps> = ({
  isSystemRole
}) => {
  return (
    <DialogHeader>
      <DialogTitle className="flex items-center">
        {isSystemRole && <Shield className="h-5 w-5 text-blue-500 mr-2" />}
        {isSystemRole ? '編輯系統角色權限' : '編輯角色'}
      </DialogTitle>
      <DialogDescription>
        {isSystemRole 
          ? '系統預設角色的名稱和描述無法修改，但您可以調整權限設定'
          : '編輯此角色的資訊與權限設定'}
      </DialogDescription>
    </DialogHeader>
  );
};
