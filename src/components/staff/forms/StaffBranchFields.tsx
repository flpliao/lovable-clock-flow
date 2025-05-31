
import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { NewStaff } from '../types';
import { useCompanyManagementContext } from '@/components/company/CompanyManagementContext';

interface StaffBranchFieldsProps {
  newStaff: NewStaff;
  setNewStaff: (staff: NewStaff) => void;
}

const StaffBranchFields: React.FC<StaffBranchFieldsProps> = ({ newStaff, setNewStaff }) => {
  const { branches } = useCompanyManagementContext();
  
  return (
    <div className="grid grid-cols-4 items-center gap-3">
      <Label htmlFor="branch" className="text-right text-xs">
        營業處
      </Label>
      <Select 
        value={newStaff.branch_id || ''} 
        onValueChange={(value) => {
          const selectedBranch = branches.find(b => b.id === value);
          setNewStaff({
            ...newStaff, 
            branch_id: value,
            branch_name: selectedBranch?.name
          });
        }}
      >
        <SelectTrigger className="col-span-3 h-8 text-xs" id="branch">
          <SelectValue placeholder="選擇營業處" />
        </SelectTrigger>
        <SelectContent>
          {branches.map((branch) => (
            <SelectItem key={branch.id} value={branch.id} className="text-xs">
              {branch.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default StaffBranchFields;
