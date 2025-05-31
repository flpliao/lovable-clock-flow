
import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Staff } from '../types';

interface EditStaffSupervisorFieldProps {
  currentStaff: Staff;
  setCurrentStaff: (staff: Staff) => void;
  potentialSupervisors: Staff[];
}

export const EditStaffSupervisorField: React.FC<EditStaffSupervisorFieldProps> = ({
  currentStaff,
  setCurrentStaff,
  potentialSupervisors
}) => {
  return (
    <div className="grid grid-cols-4 items-center gap-4">
      <Label htmlFor="supervisor" className="text-right">
        上級主管
      </Label>
      <Select 
        value={currentStaff.supervisor_id || ''} 
        onValueChange={(value) => setCurrentStaff({...currentStaff, supervisor_id: value || undefined})}
      >
        <SelectTrigger className="col-span-3" id="supervisor">
          <SelectValue placeholder="選擇上級主管" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="">無上級主管</SelectItem>
          {potentialSupervisors.map((staff) => (
            <SelectItem key={staff.id} value={staff.id}>
              {staff.name} ({staff.position}) - {staff.branch_name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
