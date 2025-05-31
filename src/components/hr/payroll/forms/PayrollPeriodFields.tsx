
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface PayrollPeriodFieldsProps {
  startDate: string;
  endDate: string;
  onStartDateChange: (value: string) => void;
  onEndDateChange: (value: string) => void;
}

const PayrollPeriodFields: React.FC<PayrollPeriodFieldsProps> = ({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange
}) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div>
        <Label htmlFor="pay_period_start">薪資期間開始</Label>
        <Input
          id="pay_period_start"
          name="pay_period_start"
          type="date"
          value={startDate}
          onChange={(e) => onStartDateChange(e.target.value)}
          required
        />
      </div>

      <div>
        <Label htmlFor="pay_period_end">薪資期間結束</Label>
        <Input
          id="pay_period_end"
          name="pay_period_end"
          type="date"
          value={endDate}
          onChange={(e) => onEndDateChange(e.target.value)}
          required
        />
      </div>
    </div>
  );
};

export default PayrollPeriodFields;
