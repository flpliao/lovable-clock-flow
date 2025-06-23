
import { useState, useEffect } from 'react';
import { LeaveRequest } from '@/types';
import { parseDateFromDatabase } from '@/utils/dateUtils';

interface FormData {
  start_date: string;
  end_date: string;
  leave_type: LeaveRequest['leave_type'];
  hours: number;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
}

export const useEditLeaveForm = (leaveRecord: LeaveRequest | null) => {
  const [formData, setFormData] = useState<FormData>({
    start_date: '',
    end_date: '',
    leave_type: '' as LeaveRequest['leave_type'],
    hours: 0,
    reason: '',
    status: 'pending' as 'pending' | 'approved' | 'rejected'
  });
  const [startDateObj, setStartDateObj] = useState<Date | undefined>();
  const [endDateObj, setEndDateObj] = useState<Date | undefined>();

  useEffect(() => {
    if (leaveRecord) {
      setFormData({
        start_date: leaveRecord.start_date,
        end_date: leaveRecord.end_date,
        leave_type: leaveRecord.leave_type,
        hours: leaveRecord.hours,
        reason: leaveRecord.reason,
        status: leaveRecord.status
      });
      
      // 設定日期物件
      setStartDateObj(parseDateFromDatabase(leaveRecord.start_date));
      setEndDateObj(parseDateFromDatabase(leaveRecord.end_date));
    }
  }, [leaveRecord]);

  const handleFormDataChange = (updates: Partial<FormData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  const handleStartDateChange = (date: Date | undefined) => {
    if (date) {
      setStartDateObj(date);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      setFormData(prev => ({ ...prev, start_date: `${year}-${month}-${day}` }));
    }
  };

  const handleEndDateChange = (date: Date | undefined) => {
    if (date) {
      setEndDateObj(date);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      setFormData(prev => ({ ...prev, end_date: `${year}-${month}-${day}` }));
    }
  };

  return {
    formData,
    startDateObj,
    endDateObj,
    handleFormDataChange,
    handleStartDateChange,
    handleEndDateChange
  };
};
