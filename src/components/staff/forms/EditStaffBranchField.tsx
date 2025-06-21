
import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Staff } from '../types';
import { useBranches } from '../hooks/useBranches';

interface EditStaffBranchFieldProps {
  currentStaff: Staff;
  setCurrentStaff: (staff: Staff) => void;
}

export const EditStaffBranchField: React.FC<EditStaffBranchFieldProps> = ({
  currentStaff,
  setCurrentStaff
}) => {
  const { getBranchOptions } = useBranches();
  const branches = getBranchOptions();

  return (
    <div className="grid grid-cols-4 items-center gap-4">
      <Label htmlFor="branch" className="text-right">
        分店 <span className="text-red-500">*</span>
      </Label>
      <Select 
        value={currentStaff.branch_id || ''} 
        onValueChange={(value) => {
          const selectedBranch = branches.find(b => b.value === value);
          setCurrentStaff({
            ...currentStaff, 
            branch_id: value,
            branch_name: selectedBranch?.label || ''
          });
        }}
      >
        <SelectTrigger className="col-span-3" id="branch">
          <SelectValue placeholder="選擇分店" />
        </SelectTrigger>
        <SelectContent>
          {/* 如果當前員工的分店不在標準列表中，先顯示當前分店 */}
          {currentStaff.branch_name && currentStaff.branch_id && 
           !branches.find(b => b.value === currentStaff.branch_id) && (
            <SelectItem value={currentStaff.branch_id}>
              {currentStaff.branch_name} (當前設定)
            </SelectItem>
          )}
          {branches.map((branch) => (
            <SelectItem key={branch.value} value={branch.value}>
              {branch.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
