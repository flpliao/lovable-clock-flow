
interface LeaveValidationRequest {
  leave_type: string;
  start_date: Date;
  end_date: Date;
  hours: number;
  user_id: string;
}

interface LeaveValidationResult {
  isValid: boolean;
  message: string;
}

// 驗證請假申請的函式
export const validateLeaveRequest = async (request: LeaveValidationRequest): Promise<LeaveValidationResult> => {
  console.log('validateLeaveRequest:', request);

  // 基本驗證
  if (!request.start_date || !request.end_date) {
    return {
      isValid: false,
      message: '請選擇請假日期'
    };
  }

  if (request.start_date > request.end_date) {
    return {
      isValid: false,
      message: '結束日期不能早於開始日期'
    };
  }

  if (request.hours <= 0) {
    return {
      isValid: false,
      message: '請假時數必須大於0'
    };
  }

  if (!request.leave_type) {
    return {
      isValid: false,
      message: '請選擇請假類型'
    };
  }

  // 檢查是否為過去日期
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  if (request.start_date < today) {
    return {
      isValid: true,
      message: '申請過去日期的請假可能需要特殊審核'
    };
  }

  // 基本驗證通過
  return {
    isValid: true,
    message: '驗證通過'
  };
};
