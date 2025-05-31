
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SUPPORTED_LANGUAGES } from '../services/languageService';
import { Language } from '../types';

interface LanguageSelectorProps {
  value: string;
  onValueChange: (value: string) => void;
  disabled?: boolean;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  value,
  onValueChange,
  disabled = false
}) => {
  return (
    <Select value={value} onValueChange={onValueChange} disabled={disabled}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="選擇語言" />
      </SelectTrigger>
      <SelectContent>
        {SUPPORTED_LANGUAGES.filter(language => language.is_active).map((language) => (
          <SelectItem key={language.code} value={language.code}>
            <div className="flex items-center space-x-2">
              <span>{language.name_zh}</span>
              <span className="text-gray-500 text-sm">({language.name_native})</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
