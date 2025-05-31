
import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { NewStaff } from '../types';
import { useStaffManagementContext } from '@/contexts/StaffManagementContext';

interface StaffSupervisorFieldsProps {
  newStaff: NewStaff;
  setNewStaff: (staff: NewStaff) => void;
}

const StaffSupervisorFields: React.FC<StaffSupervisorFieldsProps> = ({ newStaff, setNewStaff }) => {
  const { staffList } = useStaffManagementContext();
  
  return (
    <div className="grid grid-cols-4 items-center gap-3">
      <Label htmlFor="supervisor" className="text-right text-xs">
        主管
      </Label>
      <Select 
        value={newStaff.supervisor_id || ''} 
        onValueChange={(value) => setNewStaff({...newStaff, supervisor_id: value || undefined})}
      >
        <SelectTrigger className="col-span-3 h-8 text-xs" id="supervisor">
          <SelectValue placeholder="選擇主管" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="" className="text-xs">無主管</SelectItem>
          {staffList
            .filter(staff => newStaff.branch_id ? staff.branch_id === newStaff.branch_id || staff.branch_id === '1' : true)
            .map((staff) => (
            <SelectItem key={staff.id} value={staff.id} className="text-xs">
              {staff.name} ({staff.position})
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default StaffSupervisorFields;
