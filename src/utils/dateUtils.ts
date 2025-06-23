
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

// 將日期轉換為 YYYY-MM-DD 格式 - 直接使用本地日期組件，避免任何時區轉換
export const formatDateForDatabase = (date: Date): string => {
  // 直接從日期物件取得本地時間的年月日，完全避免時區轉換
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  
  const result = `${year}-${month}-${day}`;
  
  console.log('formatDateForDatabase - 本地日期轉換:', {
    inputDate: date,
    inputDateString: date.toString(),
    inputDateISO: date.toISOString(),
    localYear: year,
    localMonth: month,
    localDay: day,
    result: result,
    userTimezone: Intl.DateTimeFormat().resolvedOptions().timeZone
  });
  
  return result;
};

// 從資料庫日期字串建立本地日期物件
export const parseDateFromDatabase = (dateString: string): Date => {
  const [year, month, day] = dateString.split('-').map(Number);
  // 使用本地時區建立日期
  const resultDate = new Date(year, month - 1, day, 12, 0, 0); // 設定為中午12點避免夏令時間問題
  
  console.log('parseDateFromDatabase - 資料庫日期解析:', {
    inputString: dateString,
    parsedYear: year,
    parsedMonth: month,
    parsedDay: day,
    resultDate: resultDate,
    resultDateString: resultDate.toString(),
    resultDateISO: resultDate.toISOString()
  });
  
  return resultDate;
};

// 確保日期顯示使用本地格式
export const formatDisplayDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}/${month}/${day}`;
};

// 專門用於請假記錄顯示的日期格式化
export const formatLeaveRecordDate = (dateString: string): string => {
  // 解析資料庫的日期字串
  const [year, month, day] = dateString.split('-').map(Number);
  
  console.log('formatLeaveRecordDate - 請假記錄日期格式化:', {
    inputString: dateString,
    parsedYear: year,
    parsedMonth: month,
    parsedDay: day,
    formattedResult: `${year}/${String(month).padStart(2, '0')}/${String(day).padStart(2, '0')}`
  });
  
  return `${year}/${String(month).padStart(2, '0')}/${String(day).padStart(2, '0')}`;
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

// 確保日期物件使用正確的本地時間
export const ensureLocalDate = (date: Date): Date => {
  // 建立一個新的日期物件，確保使用本地日期組件
  const localDate = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 12, 0, 0);
  
  console.log('ensureLocalDate - 確保本地日期:', {
    inputDate: date,
    inputDateString: date.toString(),
    inputDateISO: date.toISOString(),
    outputDate: localDate,
    outputDateString: localDate.toString(),
    outputDateISO: localDate.toISOString(),
    sameDay: date.getDate() === localDate.getDate()
  });
  
  return localDate;
};

// 從日期選擇器獲取的日期轉換為資料庫格式（避免時區問題）
export const datePickerToDatabase = (pickerDate: Date): string => {
  // 直接使用日期選擇器返回的本地日期組件
  const year = pickerDate.getFullYear();
  const month = String(pickerDate.getMonth() + 1).padStart(2, '0');
  const day = String(pickerDate.getDate()).padStart(2, '0');
  
  const result = `${year}-${month}-${day}`;
  
  console.log('datePickerToDatabase - 日期選擇器轉資料庫:', {
    pickerDate: pickerDate,
    pickerDateString: pickerDate.toString(),
    pickerDateISO: pickerDate.toISOString(),
    extractedYear: year,
    extractedMonth: month,
    extractedDay: day,
    result: result
  });
  
  return result;
};
