import dayjs from 'dayjs';

// 格式化日期的函數 - 使用台灣時區 (UTC+8)
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('zh-TW', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    timeZone: 'Asia/Taipei',
  });
};

// 格式化時間的函數 - 使用台灣時區 (UTC+8)
export const formatTime = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleTimeString('zh-TW', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    timeZone: 'Asia/Taipei',
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
    timeZone: 'Asia/Taipei',
  });
};

// 將日期轉換為 YYYY-MM-DD 格式 - 確保使用台灣時區
export const formatDateForDatabase = (date: Date): string => {
  // 建立一個新的 Date 物件，確保使用台灣時區
  const taipeiDate = new Date(date.getTime() + date.getTimezoneOffset() * 60000 + 8 * 3600000);

  const year = taipeiDate.getUTCFullYear();
  const month = String(taipeiDate.getUTCMonth() + 1).padStart(2, '0');
  const day = String(taipeiDate.getUTCDate()).padStart(2, '0');

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
    userTimezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  });

  return result;
};

// 從資料庫日期字串建立正確的日期物件 - 考慮台灣時區
export const parseDateFromDatabase = (dateString: string): Date => {
  // 直接解析 YYYY-MM-DD 格式，避免時區轉換問題
  const [year, month, day] = dateString.split('-').map(Number);
  // 建立本地時區的日期物件，避免 UTC 轉換
  const date = new Date(year, month - 1, day);

  console.log('parseDateFromDatabase - 資料庫日期解析:', {
    inputString: dateString,
    parsedYear: year,
    parsedMonth: month,
    parsedDay: day,
    resultDate: date,
    resultDateString: date.toString(),
    resultDateISO: date.toISOString(),
  });

  return date;
};

// 確保日期顯示使用台灣時區格式
export const formatDisplayDate = (date: Date): string => {
  return date
    .toLocaleDateString('zh-TW', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      timeZone: 'Asia/Taipei',
    })
    .replace(/\//g, '/');
};

// 專門用於請假記錄顯示的日期格式化 - 修正時區問題
export const formatLeaveRecordDate = (dateString: string): string => {
  // 如果是 YYYY-MM-DD 格式，直接解析為本地日期
  if (dateString.match(/^\d{4}-\d{2}-\d{2}$/)) {
    const [year, month, day] = dateString.split('-').map(Number);
    const date = new Date(year, month - 1, day);

    const formattedDate = `${year}/${month.toString().padStart(2, '0')}/${day.toString().padStart(2, '0')}`;

    console.log('formatLeaveRecordDate - 請假記錄日期格式化:', {
      inputString: dateString,
      parsedYear: year,
      parsedMonth: month,
      parsedDay: day,
      createdDate: date,
      formattedResult: formattedDate,
    });

    return formattedDate;
  }

  // 如果是其他格式，使用原來的邏輯但確保台灣時區
  const date = new Date(dateString);
  return date
    .toLocaleDateString('zh-TW', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      timeZone: 'Asia/Taipei',
    })
    .replace(/\//g, '/');
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
    isSameDay: date.getUTCDate() === taipeiDate.getDate(),
  });

  return taipeiDate;
};

// 從日期選擇器獲取的日期轉換為資料庫格式（台灣時區）- 修正版本
export const datePickerToDatabase = (pickerDate: Date): string => {
  // 直接使用本地日期組件，避免時區轉換
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
    result: result,
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
    timeZone: 'Asia/Taipei',
  });
};

// 格式化月份顯示 - 使用 dayjs 格式化為 YYYY年MM月 格式
export const formatMonthDisplay = (monthValue: string): string => {
  if (!monthValue) return '';
  return dayjs(monthValue).format('YYYY年MM月');
};

// 獲取指定月份的天數
export const getMonthDays = (yearMonth: string): { daysInMonth: number } => {
  const [year, month] = yearMonth.split('-').map(Number);
  const firstDay = dayjs(`${year}-${month}-01`);
  const lastDay = firstDay.endOf('month');
  const daysInMonth = lastDay.date();
  return { daysInMonth };
};

// 判斷指定日期是否為週末
export const isWeekend = (yearMonth: string, day: number): boolean => {
  const [year, month] = yearMonth.split('-').map(Number);
  const date = dayjs(`${year}-${month}-${day}`);
  const dayOfWeek = date.day();
  return dayOfWeek === 0 || dayOfWeek === 6; // 0 = 星期日, 6 = 星期六
};

// 將日期轉換為中文的「一至日」格式
export const getChineseWeekday = (yearMonth: string, day: number): string => {
  const [year, month] = yearMonth.split('-').map(Number);
  const date = dayjs(`${year}-${month}-${day}`);
  const dayOfWeek = date.day();
  const weekdays = ['日', '一', '二', '三', '四', '五', '六'];
  return weekdays[dayOfWeek];
};
