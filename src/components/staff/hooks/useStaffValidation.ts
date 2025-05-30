
import { Staff, NewStaff } from '../types';

export const useStaffValidation = () => {
  const validateNewStaff = (newStaff: NewStaff): string | null => {
    console.log('🔍 驗證新員工資料:', newStaff);
    
    if (!newStaff.name?.trim()) {
      return "請填寫員工姓名";
    }
    
    if (!newStaff.position) {
      return "請選擇職位";
    }
    
    if (!newStaff.department) {
      return "請選擇部門";
    }
    
    if (!newStaff.contact?.trim()) {
      return "請填寫聯絡電話";
    }
    
    if (!newStaff.branch_id) {
      return "請選擇所屬營業處";
    }

    console.log('✅ 員工資料驗證通過');
    return null;
  };

  const validateStaffUpdate = (staff: Staff): string | null => {
    console.log('🔍 驗證員工更新資料:', staff);
    
    if (!staff.name?.trim()) {
      return "請填寫員工姓名";
    }

    if (!staff.position) {
      return "請選擇職位";
    }

    if (!staff.department) {
      return "請選擇部門";
    }

    if (!staff.contact?.trim()) {
      return "請填寫聯絡電話";
    }

    if (!staff.branch_id) {
      return "請選擇所屬營業處";
    }

    console.log('✅ 員工更新資料驗證通過');
    return null;
  };

  const getErrorMessage = (error: unknown): string => {
    console.log('🔍 分析錯誤:', error);
    
    if (error instanceof Error) {
      if (error.message.includes('duplicate key')) {
        return "員工資料重複，請檢查姓名或聯絡資訊";
      } else if (error.message.includes('foreign key')) {
        return "營業處資料錯誤，請重新選擇營業處";
      } else if (error.message.includes('not null')) {
        return "必填欄位不能為空";
      } else if (error.message.includes('violates')) {
        return "資料格式不正確，請檢查輸入內容";
      }
      return error.message;
    }
    
    return "系統發生未知錯誤，請稍後再試";
  };

  return {
    validateNewStaff,
    validateStaffUpdate,
    getErrorMessage
  };
};
