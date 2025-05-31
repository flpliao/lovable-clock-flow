
import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import StaffSelector from '../StaffSelector';

interface PayrollBasicFieldsProps {
  staffId: string;
  salaryStructureId: string;
  salaryStructures: any[];
  onStaffChange: (value: string) => void;
  onSalaryStructureChange: (value: string) => void;
}

const PayrollBasicFields: React.FC<PayrollBasicFieldsProps> = ({
  staffId,
  salaryStructureId,
  salaryStructures,
  onStaffChange,
  onSalaryStructureChange
}) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <StaffSelector
        value={staffId}
        onValueChange={onStaffChange}
        required
      />

      <div>
        <Label htmlFor="salary_structure_id">薪資結構</Label>
        <Select value={salaryStructureId} onValueChange={onSalaryStructureChange}>
          <SelectTrigger>
            <SelectValue placeholder="選擇薪資結構" />
          </SelectTrigger>
          <SelectContent>
            {salaryStructures.length === 0 ? (
              <SelectItem value="" disabled>
                尚未建立薪資結構
              </SelectItem>
            ) : (
              salaryStructures.map((structure) => (
                <SelectItem key={structure.id} value={structure.id}>
                  {structure.position} - {structure.department} (Level {structure.level})
                </SelectItem>
              ))
            )}
          </SelectContent>
        </Select>
        {salaryStructures.length === 0 && (
          <p className="text-xs text-gray-500 mt-1">
            請先建立薪資結構
          </p>
        )}
      </div>
    </div>
  );
};

export default PayrollBasicFields;
