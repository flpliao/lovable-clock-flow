
import { useState, useEffect } from 'react';
import { LeaveTypeService } from '@/services/payroll/leaveTypeService';

interface LeaveFormData {
  leave_type: string;
  start_date: Date;
  end_date: Date;
  hours: number;
}

export const useLeaveFormValidation = (formData: LeaveFormData) => {
  const [validationResult, setValidationResult] = useState<{
    isValid: boolean;
    warnings: string[];
    errors: string[];
  }>({
    isValid: true,
    warnings: [],
    errors: []
  });

  useEffect(() => {
    validateLeaveRequest();
  }, [formData.leave_type, formData.hours]);

  const validateLeaveRequest = async () => {
    const warnings: string[] = [];
    const errors: string[] = [];

    if (!formData.leave_type || !formData.hours) {
      setValidationResult({ isValid: true, warnings: [], errors: [] });
      return;
    }

    try {
      const leaveType = await LeaveTypeService.getLeaveTypeByCode(formData.leave_type);
      
      if (!leaveType) {
        errors.push('無效的假別類型');
      } else {
        // 檢查是否為無薪假
        if (!leaveType.is_paid) {
          warnings.push('此為無薪假');
        }

        // 檢查最大天數限制
        if (leaveType.max_days_per_year) {
          const requestDays = formData.hours / 8; // 假設一天8小時
          if (requestDays > leaveType.max_days_per_year) {
            errors.push(`已超過該假別最大可請天數（${leaveType.max_days_per_year}天）`);
          }
        }

        // 檢查是否需要附件
        if (leaveType.requires_attachment) {
          warnings.push('此假別需要上傳相關證明文件');
        }
      }
    } catch (error) {
      console.error('驗證請假申請失敗:', error);
    }

    setValidationResult({
      isValid: errors.length === 0,
      warnings,
      errors
    });
  };

  return validationResult;
};
