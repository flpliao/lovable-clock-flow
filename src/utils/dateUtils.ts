
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

// 將日期轉換為 YYYY-MM-DD 格式 - 完全使用本地日期，避免任何時區轉換
export const formatDateForDatabase = (date: Date): string => {
  // 取得本地日期的年、月、日，完全避免時區轉換
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  
  console.log('formatDateForDatabase 詳細資訊:', {
    originalDate: date,
    year,
    month,
    day,
    formattedResult: `${year}-${month}-${day}`,
    dateString: date.toString(),
    localeDateString: date.toLocaleDateString(),
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
  });
  
  return `${year}-${month}-${day}`;
};

// 從資料庫日期字串建立本地日期物件，避免時區轉換
export const parseDateFromDatabase = (dateString: string): Date => {
  const [year, month, day] = dateString.split('-').map(Number);
  // 使用本地時區建立日期，避免 UTC 轉換
  const resultDate = new Date(year, month - 1, day);
  
  console.log('parseDateFromDatabase 詳細資訊:', {
    inputString: dateString,
    parsedComponents: { year, month, day },
    resultDate: resultDate,
    resultString: resultDate.toString()
  });
  
  return resultDate;
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

// 新增：確保日期物件使用正確的本地時間
export const ensureLocalDate = (date: Date): Date => {
  // 如果日期已經是本地時間，直接返回
  // 這個函數確保我們處理的是本地日期而不是 UTC 日期
  const localDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  
  console.log('ensureLocalDate 轉換:', {
    input: date,
    output: localDate,
    inputString: date.toString(),
    outputString: localDate.toString()
  });
  
  return localDate;
};
