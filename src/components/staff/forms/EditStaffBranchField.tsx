import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useBranch } from '@/hooks/useBranch';
import { useCompanyStore } from '@/stores/companyStore';
import React, { useEffect } from 'react';
import { Staff } from '../types';

interface EditStaffBranchFieldProps {
  currentStaff: Staff;
  setCurrentStaff: (staff: Staff) => void;
}

export const EditStaffBranchField: React.FC<EditStaffBranchFieldProps> = ({
  currentStaff,
  setCurrentStaff,
}) => {
  const { company } = useCompanyStore();
  const { branches, loading, loadBranches } = useBranch();

  useEffect(() => {
    if (!company?.id) return;
    loadBranches(company.id);
  }, [company?.id]);

  return (
    <div className="grid grid-cols-4 items-center gap-4">
      <Label htmlFor="branch" className="text-right">
        單位 <span className="text-red-500">*</span>
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
        disabled={loading}
      >
        <SelectTrigger className="col-span-3" id="branch">
          <SelectValue placeholder={loading ? '載入中...' : '選擇單位'} />
        </SelectTrigger>
        <SelectContent>
          {/* 如果當前員工的單位不在標準列表中，先顯示當前單位 */}
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
