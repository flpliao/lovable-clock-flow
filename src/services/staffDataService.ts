
import { supabase } from '@/integrations/supabase/client';

export interface UserStaffData {
  name: string;
  department: string;
  position: string;
  hire_date: string | null;
  supervisor_id: string | null;
  yearsOfService: string;
  totalAnnualLeaveDays: number;
  usedAnnualLeaveDays: number;
  remainingAnnualLeaveDays: number;
}

export const loadUserStaffData = async (userId: string): Promise<UserStaffData | null> => {
  try {
    console.log('🔍 正在載入員工資料，用戶ID:', userId);
    
    // 從 staff 表獲取員工資料（包含 supervisor_id）
    const { data: staffData, error: staffError } = await supabase
      .from('staff')
      .select('name, department, position, hire_date, supervisor_id, role, email')
      .eq('id', userId)
      .maybeSingle();

    console.log('📊 員工資料查詢結果:', { staffData, staffError });

    if (staffError) {
      console.error('❌ 載入員工資料失敗:', staffError);
      throw new Error(`載入員工資料失敗: ${staffError.message}`);
    }

    if (!staffData) {
      console.log('⚠️ 找不到員工資料，用戶ID:', userId);
      
      // 調試：檢查是否有其他員工資料
      const { data: debugStaff, error: debugError } = await supabase
        .from('staff')
        .select('id, name, email')
        .limit(5);
      
      console.log('🔍 調試 - 系統中的員工資料樣例:', debugStaff);
      
      throw new Error('找不到員工資料。請確認您的帳戶已正確設定在員工管理系統中。');
    }

    console.log('✅ 成功載入員工基本資料:', {
      name: staffData.name,
      department: staffData.department,
      position: staffData.position,
      hire_date: staffData.hire_date,
      has_supervisor: !!staffData.supervisor_id,
      role: staffData.role
    });

    // 計算年資
    let yearsOfService = '0年';
    let totalAnnualLeaveDays = 0;
    
    if (staffData.hire_date) {
      const hireDate = new Date(staffData.hire_date);
      const now = new Date();
      const diffTime = Math.abs(now.getTime() - hireDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      const years = Math.floor(diffDays / 365);
      const months = Math.floor((diffDays % 365) / 30);
      
      if (years > 0) {
        yearsOfService = months > 0 ? `${years}年${months}個月` : `${years}年`;
      } else {
        yearsOfService = `${months}個月`;
      }

      // 根據年資計算特休天數
      if (years >= 10) {
        totalAnnualLeaveDays = Math.min(30, 15 + (years - 10) + 1);
      } else if (years >= 5) {
        totalAnnualLeaveDays = 15;
      } else if (years >= 3) {
        totalAnnualLeaveDays = 14;
      } else if (years >= 2) {
        totalAnnualLeaveDays = 10;
      } else if (years >= 1) {
        totalAnnualLeaveDays = 7;
      } else if (diffDays >= 180) {
        totalAnnualLeaveDays = 3;
      }

      console.log('📊 年資計算結果:', {
        yearsOfService,
        totalAnnualLeaveDays,
        diffDays
      });
    } else {
      console.log('⚠️ 未設定入職日期，無法計算特休天數');
    }

    // 計算已使用的特休天數
    const currentYear = new Date().getFullYear();
    console.log('🔍 查詢已使用特休天數，年度:', currentYear);
    
    const { data: leaveRecords, error: leaveError } = await supabase
      .from('leave_requests')
      .select('hours')
      .eq('user_id', userId)
      .eq('leave_type', 'annual')
      .eq('status', 'approved')
      .gte('start_date', `${currentYear}-01-01`)
      .lte('start_date', `${currentYear}-12-31`);

    let usedAnnualLeaveDays = 0;
    if (leaveError) {
      console.warn('⚠️ 查詢特休使用記錄時發生錯誤:', leaveError);
    } else if (leaveRecords) {
      usedAnnualLeaveDays = leaveRecords.reduce((total, record) => {
        return total + (Number(record.hours) / 8);
      }, 0);
      console.log('📊 已使用特休統計:', {
        recordCount: leaveRecords.length,
        totalHours: leaveRecords.reduce((total, record) => total + Number(record.hours), 0),
        usedDays: usedAnnualLeaveDays
      });
    }

    const remainingAnnualLeaveDays = Math.max(0, totalAnnualLeaveDays - usedAnnualLeaveDays);

    const result = {
      name: staffData.name,
      department: staffData.department,
      position: staffData.position,
      hire_date: staffData.hire_date,
      supervisor_id: staffData.supervisor_id,
      yearsOfService,
      totalAnnualLeaveDays,
      usedAnnualLeaveDays,
      remainingAnnualLeaveDays,
    };

    console.log('✅ 員工資料載入完成:', result);
    return result;

  } catch (error) {
    console.error('❌ 載入員工資料時發生錯誤:', error);
    throw error;
  }
};
