import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useStaffStore } from '@/stores/staffStore';
import React from 'react';
import { NewStaff } from '../types';

interface StaffSupervisorFieldsProps {
  newStaff: NewStaff;
  setNewStaff: (staff: NewStaff) => void;
}

const StaffSupervisorFields: React.FC<StaffSupervisorFieldsProps> = ({ newStaff, setNewStaff }) => {
  const { staff } = useStaffStore();

  // 根據部門篩選可選的主管
  const potentialSupervisors = staff.filter(s => {
    // 如果新員工有設定部門，只顯示同部門的人員
    if (newStaff.department && s.department !== newStaff.department) {
      return false;
    }

    return true;
  });

  return (
    <div className="grid grid-cols-4 items-center gap-4">
      <Label htmlFor="supervisor" className="text-right">
        直屬主管
      </Label>
      <Select
        value={newStaff.supervisor_id || 'none'}
        onValueChange={value =>
          setNewStaff({ ...newStaff, supervisor_id: value === 'none' ? undefined : value })
        }
      >
        <SelectTrigger className="col-span-3" id="supervisor">
          <SelectValue placeholder="選擇直屬主管" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="none">無直屬主管</SelectItem>
          {potentialSupervisors.map(s => (
            <SelectItem key={s.id} value={s.id}>
              {s.name} - {s.position} ({s.department})
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default StaffSupervisorFields;
