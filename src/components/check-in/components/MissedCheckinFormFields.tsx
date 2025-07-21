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
import React from 'react';
import TimeInput from './TimeInput';

export interface MissedCheckinFormData {
  request_date: string;
  missed_type: 'check_in' | 'check_out';
  requested_check_in_time: string;
  requested_check_out_time: string;
  reason: string;
}

interface MissedCheckinFormFieldsProps {
  formData: MissedCheckinFormData;
  onFormDataChange: (updates: Partial<MissedCheckinFormData>) => void;
  disabledFields?: {
    request_date?: boolean;
    missed_type?: boolean;
  };
}

const MissedCheckinFormFields: React.FC<MissedCheckinFormFieldsProps> = ({
  formData,
  onFormDataChange,
  disabledFields = {},
}) => {
  const handleFieldChange = (field: keyof MissedCheckinFormData, value: string) => {
    // 如果欄位被禁用，則不允許修改
    if (disabledFields[field as keyof typeof disabledFields]) {
      return;
    }
    onFormDataChange({ [field]: value });
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="request_date">申請日期</Label>
        <Input
          id="request_date"
          type="date"
          value={formData.request_date}
          onChange={e => handleFieldChange('request_date', e.target.value)}
          disabled={disabledFields.request_date}
          required
          className={disabledFields.request_date ? 'bg-gray-100 cursor-not-allowed' : ''}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="missed_type">申請類型</Label>
        <Select
          value={formData.missed_type}
          onValueChange={(value: 'check_in' | 'check_out') =>
            handleFieldChange('missed_type', value)
          }
          disabled={disabledFields.missed_type}
        >
          <SelectTrigger
            className={disabledFields.missed_type ? 'bg-gray-100 cursor-not-allowed' : ''}
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="check_in">忘記上班打卡</SelectItem>
            <SelectItem value="check_out">忘記下班打卡</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {formData.missed_type === 'check_in' && (
        <TimeInput
          id="check_in_time"
          label="上班時間"
          value={formData.requested_check_in_time}
          onChange={value => handleFieldChange('requested_check_in_time', value)}
          required={formData.missed_type === 'check_in'}
        />
      )}

      {formData.missed_type === 'check_out' && (
        <TimeInput
          id="check_out_time"
          label="下班時間"
          value={formData.requested_check_out_time}
          onChange={value => handleFieldChange('requested_check_out_time', value)}
          required={formData.missed_type === 'check_out'}
        />
      )}

      <div className="space-y-2">
        <Label htmlFor="reason">申請原因</Label>
        <Textarea
          id="reason"
          placeholder="請說明忘記打卡的原因..."
          value={formData.reason}
          onChange={e => handleFieldChange('reason', e.target.value)}
          required
          rows={3}
        />
      </div>
    </div>
  );
};

export default MissedCheckinFormFields;
