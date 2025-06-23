
// 計算工作時數的工具函式
export const calculateWorkingHours = (startDate: Date, endDate: Date): number => {
  if (!startDate || !endDate || startDate > endDate) {
    return 0;
  }

  // 計算日期差異（包含起始日）
  const timeDiff = endDate.getTime() - startDate.getTime();
  const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24)) + 1;
  
  // 假設每天工作8小時
  const workingHours = daysDiff * 8;
  
  console.log('calculateWorkingHours:', {
    startDate: startDate.toISOString(),
    endDate: endDate.toISOString(),
    daysDiff,
    workingHours
  });
  
  return workingHours;
};
