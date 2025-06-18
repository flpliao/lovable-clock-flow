
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useStaffManagementContext } from '@/contexts/StaffManagementContext';
import { StaffRole, Permission } from './types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { getPermissionCategories, getPermissionsByCategory } from './RoleConstants';
import { Shield } from 'lucide-react';

interface EditRoleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  role: StaffRole;
}

const EditRoleDialog = ({ open, onOpenChange, role }: EditRoleDialogProps) => {
  const { updateRole } = useStaffManagementContext();
  const [activeTab, setActiveTab] = useState<string>('基本資料');
  const [editedRole, setEditedRole] = useState<StaffRole>({...role});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Update local state when prop changes
  useEffect(() => {
    setEditedRole({...role});
  }, [role]);
  
  const permissionCategories = getPermissionCategories();
  const permissionsByCategory = getPermissionsByCategory();
  
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
  
  const togglePermission = (permission: Permission) => {
    console.log('切換權限:', permission.name);
    setEditedRole(prev => {
      const hasPermission = prev.permissions.some(p => p.id === permission.id);
      
      if (hasPermission) {
        const newPermissions = prev.permissions.filter(p => p.id !== permission.id);
        console.log('移除權限，剩餘權限數量:', newPermissions.length);
        return {
          ...prev,
          permissions: newPermissions
        };
      } else {
        const newPermissions = [...prev.permissions, permission];
        console.log('新增權限，總權限數量:', newPermissions.length);
        return {
          ...prev,
          permissions: newPermissions
        };
      }
    });
  };
  
  const isPermissionSelected = (permissionId: string) => {
    return editedRole.permissions.some(p => p.id === permissionId);
  };
  
  const handleCancel = () => {
    console.log('取消編輯，重置角色資料');
    setEditedRole({...role}); // 重置到原始狀態
    setActiveTab('基本資料'); // 重置到第一個標籤
    onOpenChange(false);
  };
  
  // Disable editing of name/description for system roles, but allow permission editing
  const isSystemRole = editedRole.is_system_role;
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
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
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="基本資料">基本資料</TabsTrigger>
            <TabsTrigger value="權限設定">權限設定</TabsTrigger>
          </TabsList>
          
          <TabsContent value="基本資料" className="space-y-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                角色名稱
              </Label>
              <Input
                id="name"
                value={editedRole.name}
                onChange={(e) => setEditedRole({...editedRole, name: e.target.value})}
                className="col-span-3"
                disabled={isSystemRole}
              />
            </div>
            
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="description" className="text-right pt-2">
                描述
              </Label>
              <Textarea
                id="description"
                value={editedRole.description}
                onChange={(e) => setEditedRole({...editedRole, description: e.target.value})}
                className="col-span-3"
                rows={3}
                disabled={isSystemRole}
              />
            </div>
            
            <div className="flex justify-end space-x-2 pt-4">
              <Button 
                variant="outline" 
                onClick={handleCancel}
                disabled={isSubmitting}
              >
                取消
              </Button>
              <Button 
                onClick={() => setActiveTab('權限設定')}
                disabled={isSubmitting}
              >
                下一步：設定權限
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="權限設定" className="py-4">
            <div className="space-y-6">
              {permissionCategories.map(category => (
                <div key={category} className="space-y-2">
                  <h3 className="text-sm font-semibold text-gray-700 border-b pb-1">{category}</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {permissionsByCategory[category].map(permission => (
                      <div key={permission.id} className="flex items-start space-x-2 p-2 rounded hover:bg-gray-50">
                        <Checkbox 
                          id={`edit-${permission.id}`} 
                          checked={isPermissionSelected(permission.id)}
                          onCheckedChange={() => togglePermission(permission)}
                          disabled={isSubmitting}
                        />
                        <div>
                          <Label 
                            htmlFor={`edit-${permission.id}`} 
                            className="font-medium cursor-pointer"
                          >
                            {permission.name}
                          </Label>
                          <p className="text-xs text-gray-500">{permission.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            
            <DialogFooter className="mt-6">
              <Button 
                variant="outline" 
                onClick={() => setActiveTab('基本資料')}
                disabled={isSubmitting}
              >
                上一步
              </Button>
              <Button 
                onClick={handleSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? '儲存中...' : '儲存變更'}
              </Button>
            </DialogFooter>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default EditRoleDialog;
