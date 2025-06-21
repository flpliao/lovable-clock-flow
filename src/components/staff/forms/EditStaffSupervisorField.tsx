
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
        直屬主管
      </Label>
      <Select 
        value={currentStaff.supervisor_id || 'none'} 
        onValueChange={(value) => setCurrentStaff({
          ...currentStaff, 
          supervisor_id: value === 'none' ? undefined : value
        })}
      >
        <SelectTrigger className="col-span-3" id="supervisor">
          <SelectValue placeholder="選擇直屬主管" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="none">無直屬主管</SelectItem>
          {potentialSupervisors.map((supervisor) => (
            <SelectItem key={supervisor.id} value={supervisor.id}>
              {supervisor.name} - {supervisor.position}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
