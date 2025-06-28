
import { useState, useEffect } from 'react';
import { LeaveTypeService } from '@/services/payroll/leaveTypeService';

interface LeaveFormData {
  leave_type: string;
  start_date: Date;
  end_date: Date;
  hours: number;
}

interface ValidationResult {
  isValid: boolean;
  warnings: string[];
  errors: string[];
}

export const useLeaveFormValidation = (formData: LeaveFormData): ValidationResult => {
  const [validationResult, setValidationResult] = useState<ValidationResult>({
    isValid: true,
    warnings: [],
    errors: []
  });

  useEffect(() => {
    validateLeaveRequest();
  }, [formData.leave_type, formData.hours, formData.start_date, formData.end_date]);

  const validateLeaveRequest = async () => {
    const warnings: string[] = [];
    const errors: string[] = [];

    if (!formData.leave_type || !formData.hours || !formData.start_date || !formData.end_date) {
      setValidationResult({ isValid: true, warnings: [], errors: [] });
      return;
    }

    try {
      const leaveType = await LeaveTypeService.getLeaveTypeByCode(formData.leave_type);
      
      if (!leaveType) {
        errors.push('無效的假別類型');
      } else {
        const requestDays = formData.hours / 8; // 假設一天8小時

        // 檢查是否為無薪假
        if (!leaveType.is_paid) {
          warnings.push('此為無薪假別，請假期間不給薪');
        }

        // 檢查最大天數限制
        if (leaveType.max_days_per_year) {
          if (requestDays > leaveType.max_days_per_year) {
            errors.push(`申請天數（${requestDays}天）超過該假別年度上限（${leaveType.max_days_per_year}天）`);
          } else if (requestDays > leaveType.max_days_per_year * 0.8) {
            warnings.push(`申請天數接近年度上限（${leaveType.max_days_per_year}天），請確認是否正確`);
          }
        }

        // 檢查是否需要附件
        if (leaveType.requires_attachment) {
          warnings.push('此假別需要上傳相關證明文件');
        }

        // 檢查日期合理性
        if (formData.start_date > formData.end_date) {
          errors.push('開始日期不能晚於結束日期');
        }

        // 檢查是否為過去日期
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        if (formData.start_date < today) {
          warnings.push('申請過去日期的請假可能需要特殊審核');
        }
      }
    } catch (error) {
      console.error('驗證請假申請失敗:', error);
      errors.push('驗證請假申請時發生錯誤，請稍後再試');
    }

    setValidationResult({
      isValid: errors.length === 0,
      warnings,
      errors
    });
  };

  return validationResult;
};
