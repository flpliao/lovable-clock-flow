
import { UserStaffData } from './staffDataService';

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
