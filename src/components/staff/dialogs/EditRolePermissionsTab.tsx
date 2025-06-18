
import React from 'react';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { StaffRole, Permission } from '../types';
import { getPermissionCategories, getPermissionsByCategory } from '../RoleConstants';

interface EditRolePermissionsTabProps {
  editedRole: StaffRole;
  setEditedRole: (role: StaffRole) => void;
  isSubmitting: boolean;
}

export const EditRolePermissionsTab: React.FC<EditRolePermissionsTabProps> = ({
  editedRole,
  setEditedRole,
  isSubmitting
}) => {
  const permissionCategories = getPermissionCategories();
  const permissionsByCategory = getPermissionsByCategory();
  
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

  return (
    <div className="py-4">
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
    </div>
  );
};
