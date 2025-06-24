
import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Staff, StaffRole } from '../types';
import { UnifiedPermissionService } from '@/services/unifiedPermissionService';

interface EditStaffRoleFieldProps {
  currentStaff: Staff;
  setCurrentStaff: (staff: Staff) => void;
  roles: StaffRole[];
}

export const EditStaffRoleField: React.FC<EditStaffRoleFieldProps> = ({
  currentStaff,
  setCurrentStaff,
  roles
}) => {
  const permissionService = UnifiedPermissionService.getInstance();
  
  const handleRoleChange = (value: string) => {
    const selectedRole = roles.find(r => r.id === value);
    console.log('🔄 角色變更:', {
      oldRole: currentStaff.role_id,
      newRole: value,
      selectedRole: selectedRole?.name,
      staffName: currentStaff.name
    });
    
    setCurrentStaff({
      ...currentStaff, 
      role_id: value,
      role: selectedRole?.name || 'user'
    });
    
    // 清除權限快取，確保新角色權限即時生效
    permissionService.clearCache();
    
    // 觸發權限更新事件
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent('permissionUpdated', {
        detail: { 
          operation: 'staffRoleUpdate', 
          staffData: { 
            ...currentStaff, 
            role_id: value,
            role: selectedRole?.name || 'user'
          },
          timestamp: Date.now()
        }
      }));
    }, 100);
  };

  return (
    <div className="grid grid-cols-4 items-center gap-4">
      <Label htmlFor="role" className="text-right">
        權限角色 <span className="text-red-500">*</span>
      </Label>
      <Select 
        value={currentStaff.role_id || ''} 
        onValueChange={handleRoleChange}
      >
        <SelectTrigger className="col-span-3" id="role">
          <SelectValue placeholder="選擇權限角色" />
        </SelectTrigger>
        <SelectContent>
          {roles.map((role) => (
            <SelectItem key={role.id} value={role.id}>
              {role.name}
              {role.description && (
                <span className="text-gray-500 ml-2">({role.description})</span>
              )}
              <span className="text-xs text-blue-600 ml-2">
                [{role.permissions.length} 個權限]
              </span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
