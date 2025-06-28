
import { useState, useEffect } from 'react';
import { useUser } from '@/contexts/UserContext';
import { loadUserStaffData, UserStaffData } from '@/services/staffDataService';
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
  hasHireDate: boolean;
  userStaffData: UserStaffData | null;
}

export const useLeaveFormValidation = (formData: LeaveFormData): ValidationResult => {
  const { currentUser } = useUser();
  const [validationResult, setValidationResult] = useState<ValidationResult>({
    isValid: true,
    warnings: [],
    errors: [],
    hasHireDate: false,
    userStaffData: null
  });

  useEffect(() => {
    validateLeaveRequest();
  }, [formData.leave_type, formData.hours, formData.start_date, formData.end_date, currentUser?.id]);

  const validateLeaveRequest = async () => {
    const warnings: string[] = [];
    const errors: string[] = [];
    let hasHireDate = false;
    let userStaffData: UserStaffData | null = null;

    if (!formData.leave_type || !formData.hours || !formData.start_date || !formData.end_date) {
      setValidationResult({ 
        isValid: true, 
        warnings: [], 
        errors: [], 
        hasHireDate: false,
        userStaffData: null 
      });
      return;
    }

    try {
      // 載入員工資料 - 現在會受到更新的 RLS 政策保護
      if (currentUser?.id) {
        console.log('🔍 載入員工資料用於驗證，用戶ID:', currentUser.id);
        console.log('🔐 使用更新的 RLS 政策 (基於 role)');
        
        userStaffData = await loadUserStaffData(currentUser.id);
        
        if (userStaffData) {
          hasHireDate = !!userStaffData.hire_date;
          console.log('✅ 員工資料載入成功 (RLS 驗證通過):', {
            name: userStaffData.name,
            hire_date: userStaffData.hire_date,
            hasHireDate,
            totalAnnualLeaveDays: userStaffData.totalAnnualLeaveDays,
            remainingAnnualLeaveDays: userStaffData.remainingAnnualLeaveDays
          });
        } else {
          console.log('⚠️ 找不到員工資料或 RLS 權限不足');
          errors.push('找不到員工資料，請聯繫管理員');
        }
      }

      // 特別休假驗證
      if (formData.leave_type === 'annual') {
        if (!hasHireDate) {
          errors.push('申請特別休假需要設定入職日期，請至人員管理更新您的入職日期');
        } else if (userStaffData) {
          const requestDays = formData.hours / 8;
          if (requestDays > userStaffData.remainingAnnualLeaveDays) {
            errors.push(`特休餘額不足！您的剩餘特休天數為 ${userStaffData.remainingAnnualLeaveDays} 天，但申請了 ${requestDays} 天`);
          } else if (requestDays > userStaffData.remainingAnnualLeaveDays * 0.8) {
            warnings.push(`申請天數接近特休餘額上限，剩餘 ${userStaffData.remainingAnnualLeaveDays} 天`);
          }
        }
      }

      // 其他假別驗證
      const leaveType = await LeaveTypeService.getLeaveTypeByCode(formData.leave_type);
      
      if (!leaveType && formData.leave_type !== 'annual') {
        errors.push('無效的假別類型');
      } else if (leaveType) {
        const requestDays = formData.hours / 8;

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
    } catch (error) {
      console.error('❌ 驗證請假申請失敗 (可能是 RLS 權限問題):', error);
      errors.push('驗證請假申請時發生錯誤，請稍後再試或聯繫管理員');
    }

    setValidationResult({
      isValid: errors.length === 0,
      warnings,
      errors,
      hasHireDate,
      userStaffData
    });
  };

  return validationResult;
};
