
import React from 'react';
import { DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Shield } from 'lucide-react';

interface EditRoleDialogHeaderProps {
  isSystemRole: boolean;
  canEditBasicInfo?: boolean;
}

export const EditRoleDialogHeader: React.FC<EditRoleDialogHeaderProps> = ({
  isSystemRole,
  canEditBasicInfo = true
}) => {
  return (
    <DialogHeader>
      <DialogTitle className="flex items-center">
        {isSystemRole && <Shield className="h-5 w-5 text-blue-500 mr-2" />}
        {isSystemRole ? '編輯系統角色' : '編輯角色'}
      </DialogTitle>
      <DialogDescription>
        {isSystemRole && !canEditBasicInfo
          ? '系統預設角色的名稱和描述無法修改，但您可以調整權限設定'
          : isSystemRole && canEditBasicInfo
          ? '系統管理員可以完整編輯系統角色的所有設定'
          : '編輯此角色的資訊與權限設定'
        }
      </DialogDescription>
    </DialogHeader>
  );
};
