import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { branchService } from '@/services/branchService';
import { useBranchStore } from '@/stores/branchStore';
import { useCompanyStore } from '@/stores/companyStore';
import React, { useEffect, useState } from 'react';
import { NewStaff } from '../types';

interface StaffBranchFieldsProps {
  newStaff: NewStaff;
  setNewStaff: (staff: NewStaff) => void;
}

const StaffBranchFields: React.FC<StaffBranchFieldsProps> = ({ newStaff, setNewStaff }) => {
  const { branches, setBranches } = useBranchStore();
  const { company } = useCompanyStore();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchBranches = async () => {
      if (!company?.id) {
        console.log('沒有公司ID，跳過載入單位');
        return;
      }

      // 如果已經有分支數據，不需要重新載入
      if (branches.length > 0) return;

      setLoading(true);
      try {
        const data = await branchService.loadBranches(company.id);
        setBranches(data);
      } catch (error) {
        console.error('載入單位失敗:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchBranches();
  }, [company?.id, setBranches, branches.length]);

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
