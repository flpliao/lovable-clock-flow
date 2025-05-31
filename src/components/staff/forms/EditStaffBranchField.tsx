
import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Staff } from '../types';
import { useCompanyManagementContext } from '@/components/company/CompanyManagementContext';

interface EditStaffBranchFieldProps {
  currentStaff: Staff;
  setCurrentStaff: (staff: Staff) => void;
}

export const EditStaffBranchField: React.FC<EditStaffBranchFieldProps> = ({
  currentStaff,
  setCurrentStaff
}) => {
  const { branches } = useCompanyManagementContext();

  return (
    <div className="grid grid-cols-4 items-center gap-4">
      <Label htmlFor="branch" className="text-right">
        所屬營業處 <span className="text-red-500">*</span>
      </Label>
      <Select 
        value={currentStaff.branch_id || ''} 
        onValueChange={(value) => {
          const selectedBranch = branches.find(b => b.id === value);
          setCurrentStaff({
            ...currentStaff, 
            branch_id: value,
            branch_name: selectedBranch?.name || '',
            supervisor_id: undefined // 清除主管設定，因為可能跨營業處
          });
        }}
      >
        <SelectTrigger className="col-span-3" id="branch">
          <SelectValue placeholder="選擇營業處" />
        </SelectTrigger>
        <SelectContent>
          {branches.map((branch) => (
            <SelectItem key={branch.id} value={branch.id}>
              {branch.name} ({branch.type === 'headquarters' ? '總公司' : branch.type === 'branch' ? '分公司' : '門市'})
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
