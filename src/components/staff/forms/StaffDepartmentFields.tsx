
import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { NewStaff } from '../types';
import { useDepartments } from '../hooks/useDepartments';

interface StaffDepartmentFieldsProps {
  newStaff: NewStaff;
  setNewStaff: (staff: NewStaff) => void;
}

const StaffDepartmentFields: React.FC<StaffDepartmentFieldsProps> = ({ newStaff, setNewStaff }) => {
  const { getDepartmentNames } = useDepartments();
  const departments = getDepartmentNames();

  return (
    <div className="grid grid-cols-4 items-center gap-3">
      <Label htmlFor="department" className="text-right text-xs">
        部門
      </Label>
      <Select 
        value={newStaff.department} 
        onValueChange={(value) => setNewStaff({...newStaff, department: value})}
      >
        <SelectTrigger className="col-span-3 h-8 text-xs" id="department">
          <SelectValue placeholder="選擇部門" />
        </SelectTrigger>
        <SelectContent>
          {departments.map((department) => (
            <SelectItem key={department} value={department} className="text-xs">
              {department}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default StaffDepartmentFields;
