
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface PayrollSalaryFieldsProps {
  baseSalary: number;
  allowances: number;
  onBaseSalaryChange: (value: number) => void;
  onAllowancesChange: (value: number) => void;
}

const PayrollSalaryFields: React.FC<PayrollSalaryFieldsProps> = ({
  baseSalary,
  allowances,
  onBaseSalaryChange,
  onAllowancesChange
}) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div>
        <Label htmlFor="base_salary">基本薪資</Label>
        <Input
          type="number"
          value={baseSalary}
          onChange={(e) => onBaseSalaryChange(Number(e.target.value))}
          required
        />
      </div>

      <div>
        <Label htmlFor="allowances">津貼</Label>
        <Input
          type="number"
          value={allowances}
          onChange={(e) => onAllowancesChange(Number(e.target.value))}
        />
      </div>
    </div>
  );
};

export default PayrollSalaryFields;
