
import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useStaffManagementSafe } from '@/components/company/hooks/useStaffManagementSafe';

interface StaffSelectorProps {
  value: string;
  onValueChange: (value: string) => void;
  required?: boolean;
}

const StaffSelector: React.FC<StaffSelectorProps> = ({
  value,
  onValueChange,
  required = false
}) => {
  const { staffList } = useStaffManagementSafe();

  return (
    <div>
      <Label htmlFor="staff_id">員工</Label>
      <Select value={value} onValueChange={onValueChange} required={required}>
        <SelectTrigger>
          <SelectValue placeholder="選擇員工" />
        </SelectTrigger>
        <SelectContent>
          {staffList.length === 0 ? (
            <SelectItem value="" disabled>
              尚未載入員工資料
            </SelectItem>
          ) : (
            staffList.map((staff) => (
              <SelectItem key={staff.id} value={staff.id}>
                {staff.name} - {staff.position} ({staff.department})
              </SelectItem>
            ))
          )}
        </SelectContent>
      </Select>
      {staffList.length === 0 && (
        <p className="text-xs text-gray-500 mt-1">
          請先在人員管理中新增員工資料
        </p>
      )}
    </div>
  );
};

export default StaffSelector;
