
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from 'lucide-react';
import TimeInput from './TimeInput';

interface MissedCheckinFormData {
  request_date: string;
  missed_type: 'check_in' | 'check_out' | 'both';
  requested_check_in_time: string;
  requested_check_out_time: string;
  reason: string;
}

interface MissedCheckinFormFieldsProps {
  formData: MissedCheckinFormData;
  onFormDataChange: (updates: Partial<MissedCheckinFormData>) => void;
}

const MissedCheckinFormFields: React.FC<MissedCheckinFormFieldsProps> = ({
  formData,
  onFormDataChange
}) => {
  const handleFieldChange = (field: keyof MissedCheckinFormData, value: string) => {
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
          onChange={(e) => handleFieldChange('request_date', e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="missed_type">申請類型</Label>
        <Select
          value={formData.missed_type}
          onValueChange={(value: 'check_in' | 'check_out' | 'both') => 
            handleFieldChange('missed_type', value)
          }
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="check_in">忘記上班打卡</SelectItem>
            <SelectItem value="check_out">忘記下班打卡</SelectItem>
            <SelectItem value="both">忘記上下班打卡</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {(formData.missed_type === 'check_in' || formData.missed_type === 'both') && (
        <TimeInput
          id="check_in_time"
          label="預計上班時間"
          value={formData.requested_check_in_time}
          onChange={(value) => handleFieldChange('requested_check_in_time', value)}
          required={formData.missed_type === 'check_in' || formData.missed_type === 'both'}
        />
      )}

      {(formData.missed_type === 'check_out' || formData.missed_type === 'both') && (
        <TimeInput
          id="check_out_time"
          label="預計下班時間"
          value={formData.requested_check_out_time}
          onChange={(value) => handleFieldChange('requested_check_out_time', value)}
          required={formData.missed_type === 'check_out' || formData.missed_type === 'both'}
        />
      )}

      <div className="space-y-2">
        <Label htmlFor="reason">申請原因</Label>
        <Textarea
          id="reason"
          placeholder="請說明忘記打卡的原因..."
          value={formData.reason}
          onChange={(e) => handleFieldChange('reason', e.target.value)}
          required
          rows={3}
        />
      </div>
    </div>
  );
};

export default MissedCheckinFormFields;
