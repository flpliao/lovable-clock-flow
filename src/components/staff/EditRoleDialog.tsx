
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { useSupabaseRoleManagement } from './hooks/useSupabaseRoleManagement';
import { StaffRole } from './types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { EditRoleDialogHeader } from './dialogs/EditRoleDialogHeader';
import { EditRoleBasicInfoTab } from './dialogs/EditRoleBasicInfoTab';
import { EditRolePermissionsTabSupabase } from './dialogs/EditRolePermissionsTabSupabase';
import { EditRoleDialogFooter } from './dialogs/EditRoleDialogFooter';

interface EditRoleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  role: StaffRole;
}

const EditRoleDialog = ({ open, onOpenChange, role }: EditRoleDialogProps) => {
  const { updateRole } = useSupabaseRoleManagement();
  const [activeTab, setActiveTab] = useState<string>('基本資料');
  const [editedRole, setEditedRole] = useState<StaffRole>({...role});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Update local state when prop changes
  useEffect(() => {
    setEditedRole({...role});
  }, [role]);
  
  const handleSubmit = async () => {
    console.log('開始儲存角色變更:', editedRole.name);
    setIsSubmitting(true);
    
    try {
      const success = await updateRole(editedRole);
      console.log('更新結果:', success);
      
      if (success) {
        console.log('角色更新成功，關閉對話框');
        onOpenChange(false);
        setActiveTab('基本資料'); // 重置到第一個標籤
      } else {
        console.error('角色更新失敗');
      }
    } catch (error) {
      console.error('更新角色時發生錯誤:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleCancel = () => {
    console.log('取消編輯，重置角色資料');
    setEditedRole({...role}); // 重置到原始狀態
    setActiveTab('基本資料'); // 重置到第一個標籤
    onOpenChange(false);
  };
  
  const handleNext = () => {
    setActiveTab('權限設定');
  };
  
  const handlePrevious = () => {
    setActiveTab('基本資料');
  };
  
  // Disable editing of name/description for system roles, but allow permission editing
  const isSystemRole = editedRole.is_system_role;
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <EditRoleDialogHeader isSystemRole={isSystemRole} />
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="基本資料">基本資料</TabsTrigger>
            <TabsTrigger value="權限設定">權限設定</TabsTrigger>
          </TabsList>
          
          <TabsContent value="基本資料">
            <EditRoleBasicInfoTab
              editedRole={editedRole}
              setEditedRole={setEditedRole}
              isSystemRole={isSystemRole}
              isSubmitting={isSubmitting}
              onCancel={handleCancel}
              onNext={handleNext}
            />
          </TabsContent>
          
          <TabsContent value="權限設定">
            <EditRolePermissionsTabSupabase
              editedRole={editedRole}
              setEditedRole={setEditedRole}
              isSubmitting={isSubmitting}
            />
            
            <EditRoleDialogFooter
              isSubmitting={isSubmitting}
              onPrevious={handlePrevious}
              onSubmit={handleSubmit}
            />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default EditRoleDialog;
