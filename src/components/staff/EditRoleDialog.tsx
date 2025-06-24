
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { useStaffManagementContext } from '@/contexts/StaffManagementContext';
import { useUser } from '@/contexts/UserContext';
import { StaffRole } from './types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { EditRoleDialogHeader } from './dialogs/EditRoleDialogHeader';
import { EditRoleBasicInfoTab } from './dialogs/EditRoleBasicInfoTab';
import { EditRolePermissionsTab } from './dialogs/EditRolePermissionsTab';
import { EditRoleDialogFooter } from './dialogs/EditRoleDialogFooter';
import { useToast } from '@/hooks/use-toast';

interface EditRoleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  role: StaffRole;
}

const EditRoleDialog = ({ open, onOpenChange, role }: EditRoleDialogProps) => {
  const { updateRole } = useStaffManagementContext();
  const { isAdmin } = useUser();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<string>('基本資料');
  const [editedRole, setEditedRole] = useState<StaffRole>({...role});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Update local state when prop changes and ensure permissions are properly loaded
  useEffect(() => {
    console.log('🔄 編輯角色對話框初始化:', role.name, '權限數量:', role.permissions.length);
    setEditedRole({
      ...role,
      permissions: [...role.permissions] // 確保權限陣列被正確複製
    });
  }, [role]);
  
  const handleSubmit = async () => {
    console.log('🔄 開始儲存角色變更:', editedRole.name, '權限數量:', editedRole.permissions.length);
    console.log('📋 要儲存的權限詳細:', editedRole.permissions.map(p => ({ id: p.id, name: p.name })));
    
    setIsSubmitting(true);
    
    try {
      // 確保權限資料格式正確
      const roleToUpdate = {
        ...editedRole,
        permissions: editedRole.permissions.map(permission => ({
          id: permission.id,
          name: permission.name,
          code: permission.code || permission.id,
          description: permission.description || '',
          category: permission.category || 'general'
        }))
      };
      
      console.log('💾 準備更新的角色資料:', roleToUpdate);
      
      const success = await updateRole(roleToUpdate);
      console.log('💾 角色更新結果:', success);
      
      if (success) {
        console.log('✅ 角色更新成功，關閉對話框');
        toast({
          title: "儲存成功",
          description: `已成功更新角色「${editedRole.name}」的設定`
        });
        onOpenChange(false);
        setActiveTab('基本資料'); // 重置到第一個標籤
      } else {
        console.error('❌ 角色更新失敗');
        toast({
          title: "儲存失敗",
          description: "角色更新過程中發生錯誤，請稍後重試",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('❌ 更新角色時發生錯誤:', error);
      toast({
        title: "儲存失敗",
        description: "角色更新過程中發生系統錯誤",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleCancel = () => {
    console.log('❌ 取消編輯，重置角色資料');
    setEditedRole({
      ...role,
      permissions: [...role.permissions] // 確保權限陣列被正確重置
    });
    setActiveTab('基本資料'); // 重置到第一個標籤
    onOpenChange(false);
  };
  
  const handleNext = () => {
    setActiveTab('權限設定');
  };
  
  const handlePrevious = () => {
    setActiveTab('基本資料');
  };
  
  // System roles can only be fully edited by admins
  const canEditBasicInfo = !editedRole.is_system_role || isAdmin();
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <EditRoleDialogHeader 
          isSystemRole={editedRole.is_system_role} 
          canEditBasicInfo={canEditBasicInfo}
        />
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="基本資料">基本資料</TabsTrigger>
            <TabsTrigger value="權限設定">權限設定</TabsTrigger>
          </TabsList>
          
          <TabsContent value="基本資料">
            <EditRoleBasicInfoTab
              editedRole={editedRole}
              setEditedRole={setEditedRole}
              isSystemRole={editedRole.is_system_role}
              canEditBasicInfo={canEditBasicInfo}
              isSubmitting={isSubmitting}
              onCancel={handleCancel}
              onNext={handleNext}
            />
          </TabsContent>
          
          <TabsContent value="權限設定">
            <EditRolePermissionsTab
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
