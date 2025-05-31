
import React from 'react';
import { Country, Language } from '../types';

interface LanguageSummaryProps {
  selectedCountryInfo: Country | undefined;
  selectedLanguageInfo: Language | undefined;
}

export const LanguageSummary: React.FC<LanguageSummaryProps> = ({
  selectedCountryInfo,
  selectedLanguageInfo
}) => {
  if (!selectedCountryInfo || !selectedLanguageInfo) {
    return null;
  }

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-2.5">
      <h4 className="font-medium text-blue-900 mb-1.5">選擇摘要：</h4>
      <div className="space-y-0.5 text-sm text-blue-800">
        <p>國家：{selectedCountryInfo.name_zh} ({selectedCountryInfo.name_en})</p>
        <p>語言：{selectedLanguageInfo.name_zh} ({selectedLanguageInfo.name_native})</p>
        <p>時區：{selectedCountryInfo.timezone}</p>
        <p>日期格式：{selectedCountryInfo.date_format}</p>
        <p>時間格式：{selectedCountryInfo.time_format}</p>
      </div>
    </div>
  );
};
