
// 格式化日期的函數 - 使用台灣時區
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('zh-TW', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    timeZone: 'Asia/Taipei'
  });
};

// 格式化時間的函數 - 使用台灣時區
export const formatTime = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleTimeString('zh-TW', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    timeZone: 'Asia/Taipei'
  });
};

// 將日期轉換為 YYYY-MM-DD 格式，使用瀏覽器本地日期，避免時區轉換
export const formatDateForDatabase = (date: Date): string => {
  // 使用本地日期，避免 UTC 轉換
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// 從資料庫日期字串建立本地日期物件，避免時區轉換
export const parseDateFromDatabase = (dateString: string): Date => {
  const [year, month, day] = dateString.split('-').map(Number);
  // 使用本地時區建立日期，避免 UTC 轉換
  return new Date(year, month - 1, day);
};

// 確保日期顯示使用本地格式
export const formatDisplayDate = (date: Date): string => {
  // 直接使用本地日期格式化，不指定時區
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}/${month}/${day}`;
};

// 獲取當前本地日期
export const getCurrentTaipeiDate = (): Date => {
  return new Date();
};

// 檢查日期是否為今天（本地時區）
export const isToday = (date: Date): boolean => {
  const today = new Date();
  return date.toDateString() === today.toDateString();
};
