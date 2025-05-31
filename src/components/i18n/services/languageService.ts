
import { Language, Country, UserLanguagePreference } from '../types';

// 支援的語言列表
export const SUPPORTED_LANGUAGES: Language[] = [
  {
    code: 'zh-TW',
    name_zh: '繁體中文',
    name_en: 'Traditional Chinese',
    name_native: '繁體中文',
    is_active: true
  },
  {
    code: 'zh-CN',
    name_zh: '簡體中文',
    name_en: 'Simplified Chinese',
    name_native: '简体中文',
    is_active: true
  },
  {
    code: 'en-US',
    name_zh: '英文',
    name_en: 'English',
    name_native: 'English',
    is_active: true
  },
  {
    code: 'ja-JP',
    name_zh: '日文',
    name_en: 'Japanese',
    name_native: '日本語',
    is_active: true
  },
  {
    code: 'ko-KR',
    name_zh: '韓文',
    name_en: 'Korean',
    name_native: '한국어',
    is_active: true
  }
];

// 國家地區列表
export const SUPPORTED_COUNTRIES: Country[] = [
  {
    id: 'tw',
    code: 'TW',
    name_zh: '台灣',
    name_en: 'Taiwan',
    timezone: 'Asia/Taipei',
    currency_code: 'TWD',
    date_format: 'YYYY/MM/DD',
    time_format: '24h',
    week_start: 1,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'hk',
    code: 'HK',
    name_zh: '香港',
    name_en: 'Hong Kong',
    timezone: 'Asia/Hong_Kong',
    currency_code: 'HKD',
    date_format: 'DD/MM/YYYY',
    time_format: '12h',
    week_start: 1,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'cn',
    code: 'CN',
    name_zh: '中國大陸',
    name_en: 'China',
    timezone: 'Asia/Shanghai',
    currency_code: 'CNY',
    date_format: 'YYYY-MM-DD',
    time_format: '24h',
    week_start: 1,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'us',
    code: 'US',
    name_zh: '美國',
    name_en: 'United States',
    timezone: 'America/New_York',
    currency_code: 'USD',
    date_format: 'MM/DD/YYYY',
    time_format: '12h',
    week_start: 0,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'jp',
    code: 'JP',
    name_zh: '日本',
    name_en: 'Japan',
    timezone: 'Asia/Tokyo',
    currency_code: 'JPY',
    date_format: 'YYYY/MM/DD',
    time_format: '24h',
    week_start: 0,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'kr',
    code: 'KR',
    name_zh: '韓國',
    name_en: 'South Korea',
    timezone: 'Asia/Seoul',
    currency_code: 'KRW',
    date_format: 'YYYY.MM.DD',
    time_format: '12h',
    week_start: 0,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

// 根據國家代碼獲取預設語言
export const getDefaultLanguageByCountry = (countryCode: string): string => {
  const defaultLanguageMap: { [key: string]: string } = {
    'TW': 'zh-TW',
    'HK': 'zh-TW',
    'CN': 'zh-CN',
    'US': 'en-US',
    'JP': 'ja-JP',
    'KR': 'ko-KR'
  };
  
  return defaultLanguageMap[countryCode] || 'zh-TW';
};

// 語系偏好設定服務
export const languagePreferenceService = {
  // 儲存使用者語系偏好設定到 localStorage
  saveUserPreference: (preference: UserLanguagePreference) => {
    localStorage.setItem('userLanguagePreference', JSON.stringify(preference));
  },
  
  // 從 localStorage 讀取使用者語系偏好設定
  getUserPreference: (): UserLanguagePreference | null => {
    const stored = localStorage.getItem('userLanguagePreference');
    return stored ? JSON.parse(stored) : null;
  },
  
  // 獲取瀏覽器語言
  getBrowserLanguage: (): string => {
    const browserLang = navigator.language || navigator.languages?.[0] || 'zh-TW';
    
    // 匹配支援的語言
    if (browserLang.startsWith('zh-TW') || browserLang.startsWith('zh-Hant')) {
      return 'zh-TW';
    } else if (browserLang.startsWith('zh-CN') || browserLang.startsWith('zh-Hans')) {
      return 'zh-CN';
    } else if (browserLang.startsWith('en')) {
      return 'en-US';
    } else if (browserLang.startsWith('ja')) {
      return 'ja-JP';
    } else if (browserLang.startsWith('ko')) {
      return 'ko-KR';
    }
    
    return 'zh-TW'; // 預設回到繁體中文
  },
  
  // 根據瀏覽器語言推測國家
  getCountryByBrowserLanguage: (): string => {
    const browserLang = navigator.language || navigator.languages?.[0] || 'zh-TW';
    
    if (browserLang.includes('TW') || browserLang.includes('Hant')) {
      return 'TW';
    } else if (browserLang.includes('CN') || browserLang.includes('Hans')) {
      return 'CN';
    } else if (browserLang.includes('HK')) {
      return 'HK';
    } else if (browserLang.includes('US')) {
      return 'US';
    } else if (browserLang.includes('JP')) {
      return 'JP';
    } else if (browserLang.includes('KR')) {
      return 'KR';
    }
    
    return 'TW'; // 預設台灣
  }
};
