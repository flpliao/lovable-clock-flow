
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

// 將日期轉換為 YYYY-MM-DD 格式，現在資料庫時區已設定為 Asia/Taipei
export const formatDateForDatabase = (date: Date): string => {
  // 由於資料庫現在使用 Asia/Taipei 時區，可以直接使用本地日期
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// 從資料庫日期字串建立本地日期物件 - 資料庫現在使用 Asia/Taipei 時區
export const parseDateFromDatabase = (dateString: string): Date => {
  // 資料庫現在使用 Asia/Taipei 時區，可以直接解析
  const [year, month, day] = dateString.split('-').map(Number);
  return new Date(year, month - 1, day);
};

// 確保日期顯示使用台灣時區格式
export const formatDisplayDate = (date: Date): string => {
  return date.toLocaleDateString('zh-TW', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    timeZone: 'Asia/Taipei'
  }).replace(/\//g, '/');
};

// 新增：獲取當前台灣時區的日期
export const getCurrentTaipeiDate = (): Date => {
  return new Date();
};

// 新增：檢查日期是否為今天（台灣時區）
export const isToday = (date: Date): boolean => {
  const today = new Date();
  return date.toDateString() === today.toDateString();
};
