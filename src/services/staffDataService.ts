
import { supabase } from '@/integrations/supabase/client';

export interface UserStaffData {
  name: string;
  department: string;
  position: string;
  hire_date: string | null;
  supervisor_id?: string | null;
  yearsOfService: string;
  totalAnnualLeaveDays: number;
  usedAnnualLeaveDays: number;
  remainingAnnualLeaveDays: number;
}

export const loadUserStaffData = async (userId: string): Promise<UserStaffData> => {
  console.log('🚀 loadUserStaffData: 開始載入用戶資料，用戶ID:', userId);

  try {
    // 修正：使用 user_id 欄位載入員工資料
    const { data: staffData, error: staffError } = await supabase
      .from('staff')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (staffError) {
      console.error('❌ loadUserStaffData: 載入員工資料失敗:', staffError);
      
      if (staffError.code === 'PGRST116') {
        throw new Error('找不到員工資料記錄，請聯繫管理員進行帳號設定');
      } else {
        throw new Error(`載入員工資料失敗：${staffError.message}`);
      }
    }

    if (!staffData) {
      console.error('❌ loadUserStaffData: 員工資料為空');
      throw new Error('員工資料不存在，請聯繫管理員確認帳號設定');
    }

    console.log('✅ loadUserStaffData: 員工資料載入成功:', staffData);

    const hasHireDate = Boolean(staffData.hire_date);
    
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

      // 修正：計算已使用的特休天數 - 使用正確的 user_id 查詢
      const currentYear = new Date().getFullYear();
      const { data: leaveRecords } = await supabase
        .from('leave_requests')
        .select('hours')
        .eq('user_id', userId)
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

    return {
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

  } catch (error) {
    console.error('❌ loadUserStaffData: 載入員工資料時發生錯誤:', error);
    throw error;
  }
};
