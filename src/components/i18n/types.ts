
export interface Country {
  id: string;
  code: string;
  name_zh: string;
  name_en: string;
  timezone: string;
  currency_code: string;
  date_format: string;
  time_format: string;
  week_start: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Language {
  code: 'zh-TW' | 'zh-CN' | 'en-US' | 'ja-JP' | 'ko-KR';
  name_zh: string;
  name_en: string;
  name_native: string;
  is_active: boolean;
}

export interface UserLanguagePreference {
  userId: string;
  countryCode: string;
  languageCode: string;
  timezone: string;
  dateFormat: string;
  timeFormat: string;
}
