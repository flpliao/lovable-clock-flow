import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useRoles } from '@/hooks/useRoles';
import React, { useEffect } from 'react';
import { Staff } from '../types';

interface EditStaffRoleFieldProps {
  currentStaff: Staff;
  setCurrentStaff: (staff: Staff) => void;
}

export const EditStaffRoleField: React.FC<EditStaffRoleFieldProps> = ({
  currentStaff,
  setCurrentStaff,
}) => {
  const { data: roles, loadRoles } = useRoles();
  useEffect(() => {
    loadRoles();
  }, []);

  const handleRoleChange = (value: string) => {
    setCurrentStaff({
      ...currentStaff,
      role_id: value,
    });
  };

  return (
    <div className="grid grid-cols-4 items-center gap-4">
      <Label htmlFor="role" className="text-right">
        職位（權限） <span className="text-red-500">*</span>
      </Label>
      <Select value={currentStaff.role_id || ''} onValueChange={handleRoleChange}>
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
