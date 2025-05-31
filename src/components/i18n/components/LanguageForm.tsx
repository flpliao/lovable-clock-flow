
import React from 'react';
import { CountrySelector } from './CountrySelector';
import { LanguageSelector } from './LanguageSelector';

interface LanguageFormProps {
  selectedCountry: string;
  selectedLanguage: string;
  onCountryChange: (countryCode: string) => void;
  onLanguageChange: (languageCode: string) => void;
  isLoading: boolean;
}

export const LanguageForm: React.FC<LanguageFormProps> = ({
  selectedCountry,
  selectedLanguage,
  onCountryChange,
  onLanguageChange,
  isLoading
}) => {
  return (
    <div className="space-y-3">
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-gray-700">國家地區</label>
        <CountrySelector
          value={selectedCountry}
          onValueChange={onCountryChange}
          disabled={isLoading}
        />
      </div>
      
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-gray-700">語言</label>
        <LanguageSelector
          value={selectedLanguage}
          onValueChange={onLanguageChange}
          disabled={isLoading}
        />
      </div>
    </div>
  );
};
