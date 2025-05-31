
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface PayrollDeductionFieldsProps {
  tax: number;
  laborInsurance: number;
  healthInsurance: number;
  deductions: number;
  onTaxChange: (value: number) => void;
  onLaborInsuranceChange: (value: number) => void;
  onHealthInsuranceChange: (value: number) => void;
  onDeductionsChange: (value: number) => void;
}

const PayrollDeductionFields: React.FC<PayrollDeductionFieldsProps> = ({
  tax,
  laborInsurance,
  healthInsurance,
  deductions,
  onTaxChange,
  onLaborInsuranceChange,
  onHealthInsuranceChange,
  onDeductionsChange
}) => {
  return (
    <div className="grid grid-cols-4 gap-4">
      <div>
        <Label htmlFor="tax">所得稅</Label>
        <Input
          type="number"
          value={tax}
          onChange={(e) => onTaxChange(Number(e.target.value))}
        />
      </div>

      <div>
        <Label htmlFor="labor_insurance">勞保</Label>
        <Input
          type="number"
          value={laborInsurance}
          onChange={(e) => onLaborInsuranceChange(Number(e.target.value))}
        />
      </div>

      <div>
        <Label htmlFor="health_insurance">健保</Label>
        <Input
          type="number"
          value={healthInsurance}
          onChange={(e) => onHealthInsuranceChange(Number(e.target.value))}
        />
      </div>

      <div>
        <Label htmlFor="deductions">其他扣款</Label>
        <Input
          type="number"
          value={deductions}
          onChange={(e) => onDeductionsChange(Number(e.target.value))}
        />
      </div>
    </div>
  );
};

export default PayrollDeductionFields;
