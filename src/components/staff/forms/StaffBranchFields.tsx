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
import { NewStaff } from '../types';

interface StaffBranchFieldsProps {
  newStaff: NewStaff;
  setNewStaff: (staff: NewStaff) => void;
}

const StaffBranchFields: React.FC<StaffBranchFieldsProps> = ({ newStaff, setNewStaff }) => {
  const { company } = useCompanyStore();
  const { branches, loading, loadBranches } = useBranch();

  useEffect(() => {
    if (!company?.id) return;
    loadBranches(company.id);
  }, [company?.id]);

  return (
    <div className="grid grid-cols-4 items-center gap-4">
      <Label htmlFor="branch" className="text-right">
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
        disabled={loading}
      >
        <SelectTrigger className="col-span-3" id="branch">
          <SelectValue placeholder={loading ? '載入中...' : '選擇單位'} />
        </SelectTrigger>
        <SelectContent>
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

export default StaffBranchFields;
