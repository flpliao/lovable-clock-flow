import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Role } from '@/types/role';
import React from 'react';
import { NewStaff } from '../types';

interface StaffRoleFieldsProps {
  newStaff: NewStaff;
  setNewStaff: (staff: NewStaff) => void;
  roles: Role[];
}

const StaffRoleFields: React.FC<StaffRoleFieldsProps> = ({ newStaff, setNewStaff, roles }) => {
  const handleRoleChange = (value: string) => {
    setNewStaff({
      ...newStaff,
      role_id: value,
    });
  };

  return (
    <div className="grid grid-cols-4 items-center gap-4">
      <Label htmlFor="role" className="text-right">
        職位（權限） <span className="text-red-500">*</span>
      </Label>
      <Select value={newStaff.role_id} onValueChange={handleRoleChange}>
        <SelectTrigger className="col-span-3" id="role">
          <SelectValue placeholder="選擇權限角色" />
        </SelectTrigger>
        <SelectContent>
          {roles.map(role => (
            <SelectItem key={role.id} value={role.id}>
              {role.name}
              {role.description && <span className="text-gray-500 ml-2">({role.description})</span>}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default StaffRoleFields;
