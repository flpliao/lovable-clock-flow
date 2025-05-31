
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

export interface Holiday {
  id: string;
  country_id?: string;
  branch_id?: string;
  name_zh: string;
  name_en: string;
  holiday_date: string;
  holiday_type: 'national' | 'regional' | 'company' | 'religious';
  is_recurring: boolean;
  recurring_rule?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface I18nLabel {
  id: string;
  label_key: string;
  language_code: 'zh-TW' | 'zh-CN' | 'en-US' | 'ja-JP' | 'ko-KR';
  label_value: string;
  category: string;
  description?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}
