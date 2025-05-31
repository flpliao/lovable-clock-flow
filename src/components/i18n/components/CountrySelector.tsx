
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SUPPORTED_COUNTRIES } from '../services/languageService';
import { Country } from '../types';

interface CountrySelectorProps {
  value: string;
  onValueChange: (value: string) => void;
  disabled?: boolean;
}

export const CountrySelector: React.FC<CountrySelectorProps> = ({
  value,
  onValueChange,
  disabled = false
}) => {
  return (
    <Select value={value} onValueChange={onValueChange} disabled={disabled}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="選擇國家地區" />
      </SelectTrigger>
      <SelectContent>
        {SUPPORTED_COUNTRIES.filter(country => country.is_active).map((country) => (
          <SelectItem key={country.code} value={country.code}>
            <div className="flex items-center space-x-2">
              <span>{country.name_zh}</span>
              <span className="text-gray-500 text-sm">({country.name_en})</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
