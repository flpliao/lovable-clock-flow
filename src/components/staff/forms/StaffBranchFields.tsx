import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { branchService } from '@/services/branchService';
import { Branch } from '@/types/company';
import React, { useEffect, useState } from 'react';
import { NewStaff } from '../types';

interface StaffBranchFieldsProps {
  newStaff: NewStaff;
  setNewStaff: (staff: NewStaff) => void;
}

const StaffBranchFields: React.FC<StaffBranchFieldsProps> = ({ newStaff, setNewStaff }) => {
  const [branches, setBranches] = useState<Branch[]>([]);

  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const data = await branchService.loadBranches();
        setBranches(data);
      } catch (error) {
        console.error('載入單位失敗:', error);
      }
    };
    fetchBranches();
  }, []);

  return (
    <div className="grid grid-cols-4 items-center gap-3">
      <Label htmlFor="branch" className="text-right text-xs">
        單位
      </Label>
      <Select
        value={newStaff.branch_id || ''}
        onValueChange={value => {
          const selectedBranch = branches.find(b => b.id === value);
          setNewStaff({
            ...newStaff,
            branch_id: value,
            branch_name: selectedBranch?.name || '',
          });
        }}
      >
        <SelectTrigger className="col-span-3 h-8 text-xs" id="branch">
          <SelectValue placeholder="選擇單位" />
        </SelectTrigger>
        <SelectContent>
          {branches.map(branch => (
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
