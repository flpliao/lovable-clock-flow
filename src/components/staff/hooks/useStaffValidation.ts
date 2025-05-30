
import { Staff, NewStaff } from '../types';

export const useStaffValidation = () => {
  const validateNewStaff = (newStaff: NewStaff): string | null => {
    if (!newStaff.name || !newStaff.position || !newStaff.department || !newStaff.contact || !newStaff.branch_id) {
      return "請填寫員工基本資料包含營業處";
    }
    return null;
  };

  const validateStaffUpdate = (staff: Staff): string | null => {
    if (!staff.name || !staff.position || !staff.department || !staff.contact) {
      return "請填寫所有必要的員工資料";
    }

    if (!staff.branch_id) {
      return "請選擇員工所屬的營業處";
    }

    return null;
  };

  const getErrorMessage = (error: unknown): string => {
    if (error instanceof Error) {
      if (error.message.includes('duplicate key')) {
        return "員工資料重複，請檢查姓名或聯絡資訊";
      } else if (error.message.includes('foreign key')) {
        return "營業處資料錯誤，請重新選擇營業處";
      } else if (error.message.includes('not null')) {
        return "必填欄位不能為空";
      }
      return error.message;
    }
    return "未知錯誤";
  };

  return {
    validateNewStaff,
    validateStaffUpdate,
    getErrorMessage
  };
};
