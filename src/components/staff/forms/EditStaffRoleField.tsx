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
  return (
    <div className="grid grid-cols-4 items-center gap-4">
      <Label htmlFor="role" className="text-right">
        角色
      </Label>
      <Select 
        value={currentStaff.role_id || currentStaff.role || ''} 
        onValueChange={(value) => {
          // If it's a system role ID, set both role and role_id
          if (value === 'admin' || value === 'user') {
            setCurrentStaff({...currentStaff, role: value, role_id: value});
          } else {
            // Otherwise it's a custom role, set role_id and role name for display
            const selectedRole = roles.find(r => r.id === value);
            setCurrentStaff({
              ...currentStaff, 
              role_id: value,
              role: selectedRole ? selectedRole.name : 'custom'
            });
          }
        }}
      >
        <SelectTrigger className="col-span-3" id="role">
          <SelectValue placeholder="選擇角色" />
        </SelectTrigger>
        <SelectContent>
          {roles.map((role) => (
            <SelectItem key={role.id} value={role.id}>
              {role.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
