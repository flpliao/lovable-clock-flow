
import React from 'react';
import { LeaveRequest } from '@/types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { EditLeaveDatePicker } from './EditLeaveDatePicker';

interface EditLeaveFormFieldsProps {
  formData: {
    start_date: string;
    end_date: string;
    leave_type: LeaveRequest['leave_type'];
    hours: number;
    reason: string;
    status: 'pending' | 'approved' | 'rejected';
  };
  startDateObj: Date | undefined;
  endDateObj: Date | undefined;
  onFormDataChange: (data: Partial<EditLeaveFormFieldsProps['formData']>) => void;
  onStartDateChange: (date: Date | undefined) => void;
  onEndDateChange: (date: Date | undefined) => void;
}

export const EditLeaveFormFields: React.FC<EditLeaveFormFieldsProps> = ({
  formData,
  startDateObj,
  endDateObj,
  onFormDataChange,
  onStartDateChange,
  onEndDateChange
}) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <EditLeaveDatePicker
          label="開始日期"
          value={startDateObj}
          onChange={onStartDateChange}
        />
        
        <EditLeaveDatePicker
          label="結束日期"
          value={endDateObj}
          onChange={onEndDateChange}
        />
      </div>

      <div className="space-y-2">
        <Label>請假類型</Label>
        <Select 
          value={formData.leave_type} 
          onValueChange={(value: LeaveRequest['leave_type']) => 
            onFormDataChange({ leave_type: value })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="選擇請假類型" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="annual">特別休假</SelectItem>
            <SelectItem value="sick">病假</SelectItem>
            <SelectItem value="personal">事假</SelectItem>
            <SelectItem value="marriage">婚假</SelectItem>
            <SelectItem value="bereavement">喪假</SelectItem>
            <SelectItem value="maternity">產假</SelectItem>
            <SelectItem value="paternity">陪產假</SelectItem>
            <SelectItem value="parental">育嬰假</SelectItem>
            <SelectItem value="occupational">公傷假</SelectItem>
            <SelectItem value="menstrual">生理假</SelectItem>
            <SelectItem value="other">其他</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>請假時數</Label>
        <Input
          type="number"
          value={formData.hours}
          onChange={(e) => onFormDataChange({ hours: Number(e.target.value) })}
          min="0"
          step="0.5"
        />
      </div>

      <div className="space-y-2">
        <Label>狀態</Label>
        <Select 
          value={formData.status} 
          onValueChange={(value: 'pending' | 'approved' | 'rejected') => 
            onFormDataChange({ status: value })
          }
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="pending">待審核</SelectItem>
            <SelectItem value="approved">已核准</SelectItem>
            <SelectItem value="rejected">已退回</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>請假原因</Label>
        <Textarea
          value={formData.reason}
          onChange={(e) => onFormDataChange({ reason: e.target.value })}
          placeholder="請輸入請假原因"
          rows={3}
        />
      </div>
    </div>
  );
};
