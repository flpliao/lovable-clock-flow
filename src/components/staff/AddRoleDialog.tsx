
import React, { useState } from 'react';
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
import { NewStaffRole, Permission } from './types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { getPermissionCategories, getPermissionsByCategory } from './RoleConstants';

interface AddRoleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AddRoleDialog = ({ open, onOpenChange }: AddRoleDialogProps) => {
  const { addRole } = useStaffManagementContext();
  const [activeTab, setActiveTab] = useState<string>('基本資料');
  
  const [newRole, setNewRole] = useState<NewStaffRole>({
    name: '',
    description: '',
    permissions: []
  });
  
  const permissionCategories = getPermissionCategories();
  const permissionsByCategory = getPermissionsByCategory();
  
  const handleSubmit = async () => {
    const success = await addRole(newRole);
    if (success) {
      onOpenChange(false);
      // Reset form
      setNewRole({
        name: '',
        description: '',
        permissions: []
      });
      setActiveTab('基本資料');
    }
  };
  
  const togglePermission = (permission: Permission) => {
    setNewRole(prev => {
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
    return newRole.permissions.some(p => p.id === permissionId);
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>新增角色</DialogTitle>
          <DialogDescription>
            新增系統角色並設定權限
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
                value={newRole.name}
                onChange={(e) => setNewRole({...newRole, name: e.target.value})}
                className="col-span-3"
                placeholder="例如：門市經理、行銷人員"
              />
            </div>
            
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="description" className="text-right pt-2">
                描述
              </Label>
              <Textarea
                id="description"
                value={newRole.description}
                onChange={(e) => setNewRole({...newRole, description: e.target.value})}
                className="col-span-3"
                placeholder="描述此角色的權限範圍與用途"
                rows={3}
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
                          id={permission.id} 
                          checked={isPermissionSelected(permission.id)}
                          onCheckedChange={() => togglePermission(permission)}
                        />
                        <div>
                          <Label 
                            htmlFor={permission.id} 
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
                建立角色
              </Button>
            </DialogFooter>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default AddRoleDialog;
