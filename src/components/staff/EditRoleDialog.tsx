
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
  
  // Update local state when prop changes
  useEffect(() => {
    setEditedRole({...role});
  }, [role]);
  
  const permissionCategories = getPermissionCategories();
  const permissionsByCategory = getPermissionsByCategory();
  
  const handleSubmit = async () => {
    const success = await updateRole(editedRole);
    if (success) {
      onOpenChange(false);
    }
  };
  
  const togglePermission = (permission: Permission) => {
    setEditedRole(prev => {
      const hasPermission = prev.permissions.some(p => p.id === permission.id);
      
      if (hasPermission) {
        return {
          ...prev,
          permissions: prev.permissions.filter(p => p.id !== permission.id)
        };
      } else {
        return {
          ...prev,
          permissions: [...prev.permissions, permission]
        };
      }
    });
  };
  
  const isPermissionSelected = (permissionId: string) => {
    return editedRole.permissions.some(p => p.id === permissionId);
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
                onClick={() => onOpenChange(false)}
              >
                取消
              </Button>
              <Button onClick={() => setActiveTab('權限設定')}>
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
              >
                上一步
              </Button>
              <Button onClick={handleSubmit}>
                儲存變更
              </Button>
            </DialogFooter>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default EditRoleDialog;
