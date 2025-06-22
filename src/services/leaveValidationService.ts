
import { UserStaffData } from './staffDataService';

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export interface LeaveUsage {
  annualUsed: number;
  personalUsed: number;
  sickUsed: number;
  menstrualUsed: number;
  marriageUsed: boolean;
  paternalUsed: number;
  bereavementUsed: Record<string, number>;
  monthlyMenstrualUsage: Record<string, number>;
}

export const validateAnnualLeave = (
  leaveType: string,
  calculatedHours: number,
  userStaffData: UserStaffData | null
): string | null => {
  if (leaveType === 'annual' && userStaffData && calculatedHours > 0) {
    const requestDays = calculatedHours / 8;
    if (requestDays > userStaffData.remainingAnnualLeaveDays) {
      return `特休餘額不足！您的剩餘特休天數為 ${userStaffData.remainingAnnualLeaveDays} 天，但申請了 ${requestDays} 天。`;
    }
  } else if (leaveType === 'annual' && userStaffData && !userStaffData.hire_date) {
    return '尚未設定入職日期，無法申請特別休假。';
  }
  return null;
};

export class LeaveValidationService {
  static calculateLeaveHours(startDate: Date, endDate: Date): number {
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return diffDays * 8;
  }

  static async validateLeaveRequest(
    formData: any,
    currentUser: any,
    leaveUsage: LeaveUsage,
    existingRequests: any[]
  ): Promise<ValidationResult> {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Basic validation
    if (!formData.start_date || !formData.end_date) {
      errors.push('請選擇開始和結束日期');
    }

    if (!formData.leave_type) {
      errors.push('請選擇請假類型');
    }

    if (!formData.reason?.trim()) {
      errors.push('請填寫請假原因');
    }

    // Date validation
    if (formData.start_date && formData.end_date && formData.start_date > formData.end_date) {
      errors.push('結束日期不能早於開始日期');
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }
}
