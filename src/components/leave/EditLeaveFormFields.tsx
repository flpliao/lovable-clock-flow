import React, { useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { EditLeaveDatePicker } from './EditLeaveDatePicker';
import useDefaultLeaveTypeStore from '@/stores/defaultLeaveTypeStore';

interface EditLeaveFormFieldsProps {
  formData: {
    start_date: string;
    end_date: string;
    leave_type: string;
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
  onEndDateChange,
}) => {
  const { defaultLeaveTypes, isLoading, isLoaded, fetchDefaultLeaveTypes } =
    useDefaultLeaveTypeStore();

  // 載入預設假別類型資料
  useEffect(() => {
    if (!isLoaded && !isLoading) {
      fetchDefaultLeaveTypes().catch(console.error);
    }
  }, [isLoaded, isLoading, fetchDefaultLeaveTypes]);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <EditLeaveDatePicker label="開始日期" value={startDateObj} onChange={onStartDateChange} />

        <EditLeaveDatePicker label="結束日期" value={endDateObj} onChange={onEndDateChange} />
      </div>

      <div className="space-y-2">
        <Label>請假類型</Label>
        <Select
          value={formData.leave_type}
          onValueChange={(value: string) => onFormDataChange({ leave_type: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="選擇請假類型" />
          </SelectTrigger>
          <SelectContent>
            {isLoading && (
              <SelectItem value="" disabled>
                載入中...
              </SelectItem>
            )}
            {!isLoading &&
              defaultLeaveTypes.map(type => (
                <SelectItem key={type.code} value={type.code.toLowerCase()}>
                  {type.name}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>請假時數</Label>
        <Input
          type="number"
          value={formData.hours}
          onChange={e => onFormDataChange({ hours: Number(e.target.value) })}
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
          onChange={e => onFormDataChange({ reason: e.target.value })}
          placeholder="請輸入請假原因"
          rows={3}
        />
      </div>
    </div>
  );
};
