import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Branch } from '@/types/company';
import React, { useEffect, useState } from 'react';
import { BranchApiService } from '../services/branchApiService';
import { Staff } from '../types';

interface EditStaffBranchFieldProps {
  currentStaff: Staff;
  setCurrentStaff: (staff: Staff) => void;
}

export const EditStaffBranchField: React.FC<EditStaffBranchFieldProps> = ({
  currentStaff,
  setCurrentStaff,
}) => {
  const [branches, setBranches] = useState<Branch[]>([]);

  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const data = await BranchApiService.loadBranches();
        setBranches(data);
      } catch (error) {
        console.error('載入營業處失敗:', error);
      }
    };
    fetchBranches();
  }, []);

  return (
    <div className="grid grid-cols-4 items-center gap-4">
      <Label htmlFor="branch" className="text-right">
        分店 <span className="text-red-500">*</span>
      </Label>
      <Select
        value={currentStaff.branch_id || ''}
        onValueChange={value => {
          const selectedBranch = branches.find(b => b.id === value);
          setCurrentStaff({
            ...currentStaff,
            branch_id: value,
            branch_name: selectedBranch?.name || '',
          });
        }}
      >
        <SelectTrigger className="col-span-3" id="branch">
          <SelectValue placeholder="選擇分店" />
        </SelectTrigger>
        <SelectContent>
          {/* 如果當前員工的分店不在標準列表中，先顯示當前分店 */}
          {currentStaff.branch_name &&
            currentStaff.branch_id &&
            !branches.find(b => b.id === currentStaff.branch_id) && (
              <SelectItem value={currentStaff.branch_id}>
                {currentStaff.branch_name} (當前設定)
              </SelectItem>
            )}
          {branches.map(branch => (
            <SelectItem key={branch.id} value={branch.id}>
              {branch.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
