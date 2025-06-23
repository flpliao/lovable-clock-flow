
// 格式化日期的函數 - 使用台灣時區 (UTC+8)
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('zh-TW', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    timeZone: 'Asia/Taipei'
  });
};

// 格式化時間的函數 - 使用台灣時區 (UTC+8)
export const formatTime = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleTimeString('zh-TW', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    timeZone: 'Asia/Taipei'
  });
};

// 格式化完整日期時間 - 使用台灣時區 (UTC+8)
export const formatDateTime = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleString('zh-TW', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Asia/Taipei'
  });
};

// 將日期轉換為 YYYY-MM-DD 格式 - 使用台灣時區
export const formatDateForDatabase = (date: Date): string => {
  // 轉換為台灣時區的日期
  const taipeiDate = new Date(date.toLocaleString('en-US', { timeZone: 'Asia/Taipei' }));
  
  const year = taipeiDate.getFullYear();
  const month = String(taipeiDate.getMonth() + 1).padStart(2, '0');
  const day = String(taipeiDate.getDate()).padStart(2, '0');
  
  const result = `${year}-${month}-${day}`;
  
  console.log('formatDateForDatabase - 台灣時區日期轉換:', {
    inputDate: date,
    inputDateString: date.toString(),
    inputDateISO: date.toISOString(),
    taipeiDate: taipeiDate,
    taipeiYear: year,
    taipeiMonth: month,
    taipeiDay: day,
    result: result,
    userTimezone: Intl.DateTimeFormat().resolvedOptions().timeZone
  });
  
  return result;
};

// 從資料庫日期字串建立台灣時區日期物件
export const parseDateFromDatabase = (dateString: string): Date => {
  const [year, month, day] = dateString.split('-').map(Number);
  // 建立台灣時區的日期物件
  const date = new Date();
  date.setFullYear(year, month - 1, day);
  date.setHours(12, 0, 0, 0); // 設定為中午避免時區問題
  
  console.log('parseDateFromDatabase - 資料庫日期解析 (台灣時區):', {
    inputString: dateString,
    parsedYear: year,
    parsedMonth: month,
    parsedDay: day,
    resultDate: date,
    resultDateString: date.toString(),
    resultDateISO: date.toISOString()
  });
  
  return date;
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

// 專門用於請假記錄顯示的日期格式化 - 確保使用台灣時區
export const formatLeaveRecordDate = (dateString: string): string => {
  // 解析資料庫的日期字串並轉換為台灣時區顯示
  const [year, month, day] = dateString.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  
  // 使用台灣時區格式化
  const formattedDate = date.toLocaleDateString('zh-TW', {
    year: 'numeric',
    month: '2-digit', 
    day: '2-digit',
    timeZone: 'Asia/Taipei'
  }).replace(/\//g, '/');
  
  console.log('formatLeaveRecordDate - 請假記錄日期格式化 (台灣時區):', {
    inputString: dateString,
    parsedYear: year,
    parsedMonth: month,
    parsedDay: day,
    createdDate: date,
    formattedResult: formattedDate
  });
  
  return formattedDate;
};

// 獲取當前台灣時區的日期
export const getCurrentTaipeiDate = (): Date => {
  const now = new Date();
  // 轉換為台灣時區
  const taipeiTime = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Taipei' }));
  return taipeiTime;
};

// 檢查日期是否為今天（台灣時區）
export const isToday = (date: Date): boolean => {
  const today = getCurrentTaipeiDate();
  const targetDate = new Date(date.toLocaleString('en-US', { timeZone: 'Asia/Taipei' }));
  
  return targetDate.toDateString() === today.toDateString();
};

// 確保日期物件使用正確的台灣時區
export const ensureLocalDate = (date: Date): Date => {
  // 轉換為台灣時區的日期物件
  const taipeiDate = new Date(date.toLocaleString('en-US', { timeZone: 'Asia/Taipei' }));
  
  console.log('ensureLocalDate - 確保台灣時區日期:', {
    inputDate: date,
    inputDateString: date.toString(),
    inputDateISO: date.toISOString(),
    taipeiDate: taipeiDate,
    taipeiDateString: taipeiDate.toString(),
    taipeiDateISO: taipeiDate.toISOString(),
    isSameDay: date.getUTCDate() === taipeiDate.getDate()
  });
  
  return taipeiDate;
};

// 從日期選擇器獲取的日期轉換為資料庫格式（台灣時區）
export const datePickerToDatabase = (pickerDate: Date): string => {
  // 確保使用台灣時區的日期組件
  const taipeiDate = new Date(pickerDate.toLocaleString('en-US', { timeZone: 'Asia/Taipei' }));
  
  const year = taipeiDate.getFullYear();
  const month = String(taipeiDate.getMonth() + 1).padStart(2, '0');
  const day = String(taipeiDate.getDate()).padStart(2, '0');
  
  const result = `${year}-${month}-${day}`;
  
  console.log('datePickerToDatabase - 日期選擇器轉資料庫 (台灣時區):', {
    pickerDate: pickerDate,
    pickerDateString: pickerDate.toString(),
    pickerDateISO: pickerDate.toISOString(),
    taipeiDate: taipeiDate,
    extractedYear: year,
    extractedMonth: month,
    extractedDay: day,
    result: result
  });
  
  return result;
};

// 格式化請假記錄的建立時間 - 台灣時區
export const formatLeaveRecordCreatedTime = (dateTimeString: string): string => {
  const date = new Date(dateTimeString);
  return date.toLocaleString('zh-TW', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Asia/Taipei'
  });
};
