import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useUser } from '@/contexts/UserContext';
import { UserStaffData } from '@/services/staffDataService';

interface ValidationRequest {
  leave_type: string;
  start_date?: Date;
  end_date?: Date;
  hours: number;
}

interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  hasHireDate: boolean;
  userStaffData: UserStaffData | null;
}

export const useLeaveFormValidation = (request: ValidationRequest): ValidationResult => {
  const { currentUser } = useUser();
  const [validationResult, setValidationResult] = useState<ValidationResult>({
    isValid: false,
    errors: [],
    warnings: [],
    hasHireDate: false,
    userStaffData: null
  });

  useEffect(() => {
    const validateRequest = async () => {
      if (!currentUser?.id) {
        setValidationResult({
          isValid: false,
          errors: ['請先登入系統'],
          warnings: [],
          hasHireDate: false,
          userStaffData: null
        });
        return;
      }

      const errors: string[] = [];
      const warnings: string[] = [];
      let hasHireDate = false;
      let userStaffData: UserStaffData | null = null;

      try {
        // 載入員工資料
        console.log('🔍 useLeaveFormValidation: 載入員工資料，用戶ID:', currentUser.id);
        
        const { data: staffData, error: staffError } = await supabase
          .from('staff')
          .select('*')
          .eq('id', currentUser.id)
          .single();

        if (staffError || !staffData) {
          console.error('❌ useLeaveFormValidation: 載入員工資料失敗:', staffError);
          errors.push('找不到員工資料，請聯繫管理員');
        } else {
          console.log('✅ useLeaveFormValidation: 員工資料載入成功:', staffData);
          
          hasHireDate = Boolean(staffData.hire_date);
          
          if (!hasHireDate) {
            warnings.push('尚未設定入職日期，特休計算可能不準確');
          }

          // 計算年資和特休天數
          let yearsOfService = '未設定';
          let totalAnnualLeaveDays = 0;
          let usedAnnualLeaveDays = 0;
          let remainingAnnualLeaveDays = 0;

          if (hasHireDate) {
            const hireDate = new Date(staffData.hire_date);
            const now = new Date();
            const diffTime = Math.abs(now.getTime() - hireDate.getTime());
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            const years = Math.floor(diffDays / 365);
            const months = Math.floor((diffDays % 365) / 30);
            
            yearsOfService = years > 0 ? 
              (months > 0 ? `${years}年${months}個月` : `${years}年`) : 
              `${months}個月`;

            // 計算特休天數（簡化版本）
            if (years >= 1) {
              if (years < 2) totalAnnualLeaveDays = 7;
              else if (years < 3) totalAnnualLeaveDays = 10;
              else if (years < 5) totalAnnualLeaveDays = 14;
              else if (years < 10) totalAnnualLeaveDays = 15;
              else totalAnnualLeaveDays = Math.min(30, 15 + (years - 10));
            }

            // 計算已使用的特休天數
            const currentYear = new Date().getFullYear();
            const { data: leaveRecords } = await supabase
              .from('leave_requests')
              .select('hours')
              .or(`user_id.eq.${currentUser.id},staff_id.eq.${currentUser.id}`)
              .eq('leave_type', 'annual')
              .eq('status', 'approved')
              .gte('start_date', `${currentYear}-01-01`)
              .lte('start_date', `${currentYear}-12-31`);

            if (leaveRecords) {
              usedAnnualLeaveDays = leaveRecords.reduce((total, record) => {
                return total + (Number(record.hours) / 8);
              }, 0);
            }

            remainingAnnualLeaveDays = Math.max(0, totalAnnualLeaveDays - usedAnnualLeaveDays);
          }

          userStaffData = {
            name: staffData.name,
            department: staffData.department,
            position: staffData.position,
            hire_date: staffData.hire_date,
            supervisor_id: staffData.supervisor_id,
            yearsOfService,
            totalAnnualLeaveDays,
            usedAnnualLeaveDays,
            remainingAnnualLeaveDays
          };
        }

        // 基本驗證
        if (!request.start_date || !request.end_date) {
          errors.push('請選擇請假日期');
        }

        if (!request.leave_type) {
          errors.push('請選擇請假類型');
        }

        if (request.hours <= 0) {
          errors.push('請假時數必須大於0');
        }

        // 日期驗證
        if (request.start_date && request.end_date && request.start_date > request.end_date) {
          errors.push('結束日期不能早於開始日期');
        }

        // 特休驗證
        if (request.leave_type === 'annual' && userStaffData) {
          if (!hasHireDate) {
            errors.push('申請特休需要設定入職日期，請聯繫人事部門');
          } else {
            const requestDays = request.hours / 8;
            if (requestDays > userStaffData.remainingAnnualLeaveDays) {
              errors.push(`特休餘額不足！剩餘 ${userStaffData.remainingAnnualLeaveDays} 天，申請 ${requestDays} 天`);
            }
          }
        }

        // 過去日期警告
        if (request.start_date) {
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          if (request.start_date < today) {
            warnings.push('申請過去日期的請假可能需要特殊審核');
          }
        }

      } catch (error) {
        console.error('❌ useLeaveFormValidation: 驗證過程發生錯誤:', error);
        errors.push('驗證過程發生錯誤，請稍後重試');
      }

      setValidationResult({
        isValid: errors.length === 0,
        errors,
        warnings,
        hasHireDate,
        userStaffData
      });
    };

    // 只有在有基本資料時才進行驗證
    if (currentUser && (request.start_date || request.end_date || request.leave_type)) {
      validateRequest();
    } else {
      setValidationResult({
        isValid: false,
        errors: [],
        warnings: [],
        hasHireDate: false,
        userStaffData: null
      });
    }
  }, [currentUser, request.start_date, request.end_date, request.leave_type, request.hours]);

  return validationResult;
};
