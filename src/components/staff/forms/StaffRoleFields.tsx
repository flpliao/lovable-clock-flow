import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import React from 'react';
import { NewStaff, StaffRole } from '../types';

interface StaffRoleFieldsProps {
  newStaff: NewStaff;
  setNewStaff: (staff: NewStaff) => void;
  roles: StaffRole[];
}

const StaffRoleFields: React.FC<StaffRoleFieldsProps> = ({ newStaff, setNewStaff, roles }) => {
  const handleRoleChange = (value: string) => {
    setNewStaff({
      ...newStaff,
      role_id: value,
    });
  };

  return (
    <div className="grid grid-cols-4 items-center gap-3">
      <Label htmlFor="role" className="text-right text-xs">
        角色
      </Label>
      <Select value={newStaff.role_id} onValueChange={handleRoleChange}>
        <SelectTrigger className="col-span-3 h-8 text-xs" id="role">
          <SelectValue placeholder="選擇角色" />
        </SelectTrigger>
        <SelectContent>
          {roles.map(role => (
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
