
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface PayrollOvertimeFieldsProps {
  overtimeHours: number;
  overtimePay: number;
  holidayHours: number;
  holidayPay: number;
  onOvertimeHoursChange: (hours: number, pay: number) => void;
  onOvertimePayChange: (value: number) => void;
  onHolidayHoursChange: (hours: number, pay: number) => void;
  onHolidayPayChange: (value: number) => void;
}

const PayrollOvertimeFields: React.FC<PayrollOvertimeFieldsProps> = ({
  overtimeHours,
  overtimePay,
  holidayHours,
  holidayPay,
  onOvertimeHoursChange,
  onOvertimePayChange,
  onHolidayHoursChange,
  onHolidayPayChange
}) => {
  return (
    <div className="grid grid-cols-4 gap-4">
      <div>
        <Label htmlFor="overtime_hours">加班時數</Label>
        <Input
          type="number"
          step="0.5"
          value={overtimeHours}
          onChange={(e) => {
            const hours = Number(e.target.value);
            onOvertimeHoursChange(hours, overtimePay);
          }}
        />
      </div>

      <div>
        <Label htmlFor="overtime_pay">加班費</Label>
        <Input
          type="number"
          value={overtimePay}
          onChange={(e) => onOvertimePayChange(Number(e.target.value))}
        />
      </div>

      <div>
        <Label htmlFor="holiday_hours">假日工作時數</Label>
        <Input
          type="number"
          step="0.5"
          value={holidayHours}
          onChange={(e) => {
            const hours = Number(e.target.value);
            onHolidayHoursChange(hours, holidayPay);
          }}
        />
      </div>

      <div>
        <Label htmlFor="holiday_pay">假日工作費</Label>
        <Input
          type="number"
          value={holidayPay}
          onChange={(e) => onHolidayPayChange(Number(e.target.value))}
        />
      </div>
    </div>
  );
};

export default PayrollOvertimeFields;
