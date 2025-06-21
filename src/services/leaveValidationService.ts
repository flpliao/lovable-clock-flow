import { LeaveFormValues, getLeaveTypeById, getBereavementDays } from '@/utils/leaveTypes';
import { LeaveRequest, User } from '@/types';
import { differenceInYears, format, startOfMonth, endOfMonth, isSameMonth } from 'date-fns';

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
  bereavementUsed: { [relationship: string]: number };
  // 月度使用記錄
  monthlyMenstrualUsage: { [monthKey: string]: number };
}

export class LeaveValidationService {
  
  // 計算年資對應的特休天數
  static calculateAnnualLeaveDays(startDate: Date): number {
    const years = differenceInYears(new Date(), startDate);
    if (years < 1) return 3;
    if (years < 2) return 7;
    if (years < 3) return 10;
    if (years < 5) return 14;
    if (years < 10) return 15;
    return Math.min(30, 15 + Math.floor((years - 10) / 1) * 1);
  }

  // 計算工作日數（排除週末）
  static calculateWorkDays(startDate: Date, endDate: Date): number {
    let count = 0;
    const current = new Date(startDate);
    
    while (current <= endDate) {
      const dayOfWeek = current.getDay();
      if (dayOfWeek !== 0 && dayOfWeek !== 6) { // 非週末
        count++;
      }
      current.setDate(current.getDate() + 1);
    }
    return count;
  }

  // 計算請假時數（考慮上下班時間和午休）
  static calculateLeaveHours(startDate: Date, endDate: Date): number {
    const workDays = this.calculateWorkDays(startDate, endDate);
    return workDays * 8; // 每工作日8小時
  }

  // 主要驗證函數
  static async validateLeaveRequest(
    formData: LeaveFormValues,
    currentUser: User,
    leaveUsage: LeaveUsage,
    existingRequests: LeaveRequest[]
  ): Promise<ValidationResult> {
    const errors: string[] = [];
    const warnings: string[] = [];
    
    const leaveType = getLeaveTypeById(formData.leave_type);
    if (!leaveType) {
      errors.push('無效的請假類型');
      return { isValid: false, errors, warnings };
    }

    const requestDays = this.calculateWorkDays(formData.start_date, formData.end_date);
    const requestHours = this.calculateLeaveHours(formData.start_date, formData.end_date);

    // 基本驗證
    if (formData.start_date > formData.end_date) {
      errors.push('開始日期不能晚於結束日期');
    }

    if (!formData.reason.trim()) {
      errors.push('請假事由為必填項目');
    }

    // 針對不同請假類型的特殊驗證
    switch (formData.leave_type) {
      case 'annual':
        await this.validateAnnualLeave(formData, currentUser, leaveUsage, requestDays, errors, warnings);
        break;
      
      case 'personal':
        this.validatePersonalLeave(leaveUsage, requestDays, errors, warnings);
        break;
      
      case 'sick':
        this.validateSickLeave(formData, currentUser, leaveUsage, requestDays, leaveType, errors, warnings);
        break;
      
      case 'menstrual':
        this.validateMenstrualLeave(formData, currentUser, leaveUsage, requestDays, errors, warnings);
        break;
      
      case 'marriage':
        this.validateMarriageLeave(leaveUsage, requestDays, leaveType, errors, warnings);
        break;
      
      case 'bereavement':
        this.validateBereavementLeave(formData, leaveUsage, requestDays, errors, warnings);
        break;
      
      case 'maternity':
        this.validateMaternityLeave(currentUser, requestDays, errors, warnings);
        break;
      
      case 'paternity':
        this.validatePaternityLeave(currentUser, leaveUsage, requestDays, errors, warnings);
        break;
      
      case 'parental':
        this.validateParentalLeave(formData, existingRequests, errors, warnings);
        break;
      
      case 'occupational':
        this.validateOccupationalLeave(leaveType, formData, errors, warnings);
        break;
    }

    // 檢查是否需要附件
    if (leaveType.requiresAttachment && !formData.attachment) {
      errors.push(`${leaveType.name}需要上傳相關證明文件`);
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }

  // 特別休假驗證
  static async validateAnnualLeave(
    formData: LeaveFormValues,
    currentUser: User,
    leaveUsage: LeaveUsage,
    requestDays: number,
    errors: string[],
    warnings: string[]
  ) {
    const startDate = new Date(currentUser.onboard_date);
    const availableDays = this.calculateAnnualLeaveDays(startDate);
    const remainingDays = availableDays - leaveUsage.annualUsed;
    
    if (requestDays > remainingDays) {
      errors.push(`特休不足，剩餘 ${remainingDays} 天，申請 ${requestDays} 天`);
    }
    
    if (remainingDays <= 5) {
      warnings.push(`特休即將用完，剩餘 ${remainingDays} 天`);
    }
  }

  // 事假驗證
  static validatePersonalLeave(
    leaveUsage: LeaveUsage,
    requestDays: number,
    errors: string[],
    warnings: string[]
  ) {
    const totalDays = leaveUsage.personalUsed + requestDays;
    
    if (totalDays > 14) {
      errors.push(`事假超過年度上限14天，已使用 ${leaveUsage.personalUsed} 天，申請 ${requestDays} 天`);
    }
    
    if (totalDays > 10) {
      warnings.push(`事假使用量較高，已使用 ${leaveUsage.personalUsed} 天`);
    }
  }

  // 病假驗證 - 更新邏輯
  static validateSickLeave(
    formData: LeaveFormValues,
    currentUser: User,
    leaveUsage: LeaveUsage,
    requestDays: number,
    leaveType: any,
    errors: string[],
    warnings: string[]
  ) {
    // 計算病假和生理假的合併使用天數
    const combinedUsage = leaveUsage.sickUsed + leaveUsage.menstrualUsed;
    const totalDays = combinedUsage + requestDays;
    
    if (totalDays > 30) {
      errors.push(`病假/生理假已達上限30日，已使用 ${combinedUsage} 日，申請 ${requestDays} 日`);
    }
    
    if (combinedUsage >= 30) {
      errors.push('病假/生理假已達上限30日，無法再申請');
    }
    
    if (totalDays > 25) {
      warnings.push(`病假/生理假使用量接近上限，已使用 ${combinedUsage} 日`);
    }
    
    if (totalDays > 20) {
      warnings.push('病假使用量較高，請注意健康狀況');
    }
  }

  // 生理假驗證 - 新增
  static validateMenstrualLeave(
    formData: LeaveFormValues,
    currentUser: User,
    leaveUsage: LeaveUsage,
    requestDays: number,
    errors: string[],
    warnings: string[]
  ) {
    // 檢查性別限制
    // 注意：這裡假設 User 類型中有 gender 欄位，如果沒有可能需要其他方式判斷
    // if (currentUser.gender && currentUser.gender !== 'female') {
    //   errors.push('僅限女性員工可請生理假');
    //   return;
    // }

    // 檢查是否超過每月1日限制
    const requestMonth = format(formData.start_date, 'yyyy-MM');
    const monthlyUsage = leaveUsage.monthlyMenstrualUsage?.[requestMonth] || 0;
    
    if (monthlyUsage + requestDays > 1) {
      errors.push(`生理假每月限請1日，本月已請 ${monthlyUsage} 日`);
    }

    // 檢查跨月申請
    if (!isSameMonth(formData.start_date, formData.end_date)) {
      errors.push('生理假不得跨月申請');
    }

    // 檢查與病假合併上限
    const combinedUsage = leaveUsage.sickUsed + leaveUsage.menstrualUsed;
    const totalDays = combinedUsage + requestDays;
    
    if (totalDays > 30) {
      errors.push(`病假/生理假已達上限30日，已使用 ${combinedUsage} 日，申請 ${requestDays} 日`);
    }
    
    if (combinedUsage >= 30) {
      errors.push('病假/生理假已達上限30日，無法再申請');
    }

    // 提醒生理假計入病假統計
    if (requestDays > 0) {
      warnings.push('生理假將計入病假日數統計，與病假合計上限30日');
    }
  }

  // 婚假驗證
  static validateMarriageLeave(
    leaveUsage: LeaveUsage,
    requestDays: number,
    leaveType: any,
    errors: string[],
    warnings: string[]
  ) {
    if (leaveUsage.marriageUsed) {
      errors.push('婚假僅能申請一次');
    }
    
    if (requestDays > 8) {
      errors.push('婚假最多8天');
    }
  }

  // 喪假驗證
  static validateBereavementLeave(
    formData: LeaveFormValues,
    leaveUsage: LeaveUsage,
    requestDays: number,
    errors: string[],
    warnings: string[]
  ) {
    if (!formData.relationship) {
      errors.push('請選擇親屬關係');
      return;
    }
    
    const allowedDays = getBereavementDays(formData.relationship);
    const usedDays = leaveUsage.bereavementUsed[formData.relationship] || 0;
    
    if (usedDays + requestDays > allowedDays) {
      errors.push(`該親屬關係喪假已超過規定天數 ${allowedDays} 天`);
    }
  }

  // 產假驗證
  static validateMaternityLeave(
    currentUser: User,
    requestDays: number,
    errors: string[],
    warnings: string[]
  ) {
    // 假設用戶資料中有性別欄位，這裡需要根據實際資料結構調整
    // if (currentUser.gender !== 'female') {
    //   errors.push('產假僅限女性員工申請');
    // }
    
    if (requestDays !== 56) {
      errors.push('產假固定為8週（56天）');
    }
  }

  // 陪產假驗證
  static validatePaternityLeave(
    currentUser: User,
    leaveUsage: LeaveUsage,
    requestDays: number,
    errors: string[],
    warnings: string[]
  ) {
    // if (currentUser.gender !== 'male') {
    //   errors.push('陪產假僅限男性員工申請');
    // }
    
    if (requestDays > 7) {
      errors.push('陪產假最多7天');
    }
    
    if (leaveUsage.paternalUsed + requestDays > 7) {
      errors.push('陪產假總計不得超過7天');
    }
  }

  // 育嬰留停驗證
  static validateParentalLeave(
    formData: LeaveFormValues,
    existingRequests: LeaveRequest[],
    errors: string[],
    warnings: string[]
  ) {
    if (!formData.child_info?.birth_date) {
      errors.push('請提供子女出生日期');
      return;
    }
    
    const childAge = differenceInYears(new Date(), formData.child_info.birth_date);
    if (childAge >= 3) {
      errors.push('育嬰留停需於子女滿3歲前結束');
    }
    
    // 檢查該子女是否已申請過2年
    const existingParentalLeave = existingRequests.filter(req => 
      req.leave_type === 'parental' && 
      req.status === 'approved'
    );
    
    const totalDays = existingParentalLeave.reduce((sum, req) => sum + (req.hours / 8), 0);
    if (totalDays >= 730) { // 2年 = 730天
      errors.push('該子女育嬰留停已達2年上限');
    }
  }

  // 公傷病假驗證
  static validateOccupationalLeave(
    leaveType: any,
    formData: LeaveFormValues,
    errors: string[],
    warnings: string[]
  ) {
    if (!formData.attachment) {
      errors.push('公傷病假需檢附職災證明');
    }
    
    warnings.push('公傷病假不併入病假天數計算');
  }
}
