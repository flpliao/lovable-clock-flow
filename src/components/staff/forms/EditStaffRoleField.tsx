
import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Staff, StaffRole } from '../types';

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
  const handleRoleChange = (value: string) => {
    const selectedRole = roles.find(r => r.id === value);
    console.log('🔄 角色變更:', {
      oldRole: currentStaff.role_id,
      newRole: value,
      selectedRole: selectedRole?.name
    });
    
    setCurrentStaff({
      ...currentStaff, 
      role_id: value,
      role: selectedRole?.name || 'user'
    });
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
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
