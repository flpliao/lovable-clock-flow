
import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { NewStaff } from '../types';
import { useStaffManagementContext } from '@/contexts/StaffManagementContext';

interface StaffRoleFieldsProps {
  newStaff: NewStaff;
  setNewStaff: (staff: NewStaff) => void;
}

const StaffRoleFields: React.FC<StaffRoleFieldsProps> = ({ newStaff, setNewStaff }) => {
  const { roles } = useStaffManagementContext();
  
  return (
    <div className="grid grid-cols-4 items-center gap-3">
      <Label htmlFor="role" className="text-right text-xs">
        角色
      </Label>
      <Select 
        value={newStaff.role_id} 
        onValueChange={(value) => {
          if (value === 'admin' || value === 'user') {
            setNewStaff({...newStaff, role: value, role_id: value});
          } else {
            const selectedRole = roles.find(r => r.id === value);
            setNewStaff({
              ...newStaff, 
              role_id: value,
              role: selectedRole ? selectedRole.name : 'custom'
            });
          }
        }}
      >
        <SelectTrigger className="col-span-3 h-8 text-xs" id="role">
          <SelectValue placeholder="選擇角色" />
        </SelectTrigger>
        <SelectContent>
          {roles.map((role) => (
            <SelectItem key={role.id} value={role.id} className="text-xs">
              {role.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default StaffRoleFields;
