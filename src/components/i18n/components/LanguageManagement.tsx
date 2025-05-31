
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Globe } from 'lucide-react';
import { LanguageForm } from './LanguageForm';
import { LanguageSummary } from './LanguageSummary';
import { LanguageActions } from './LanguageActions';
import { useLanguageManagement } from '../hooks/useLanguageManagement';
import { SUPPORTED_COUNTRIES, SUPPORTED_LANGUAGES } from '../services/languageService';

export const LanguageManagement: React.FC = () => {
  const {
    selectedCountry,
    selectedLanguage,
    isLoading,
    hasChanges,
    handleCountryChange,
    handleLanguageChange,
    handleSave,
    handleReset
  } = useLanguageManagement();

  const selectedCountryInfo = SUPPORTED_COUNTRIES.find(c => c.code === selectedCountry);
  const selectedLanguageInfo = SUPPORTED_LANGUAGES.find(l => l.code === selectedLanguage);

  return (
    <Card>
      <CardHeader className="pb-2 px-3">
        <CardTitle className="flex items-center text-base">
          <Globe className="h-4 w-4 mr-1.5" />
          多語系管理
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-2.5 px-3 pb-3">
        <LanguageForm
          selectedCountry={selectedCountry}
          selectedLanguage={selectedLanguage}
          onCountryChange={handleCountryChange}
          onLanguageChange={handleLanguageChange}
          isLoading={isLoading}
        />

        <LanguageSummary
          selectedCountryInfo={selectedCountryInfo}
          selectedLanguageInfo={selectedLanguageInfo}
        />

        <LanguageActions
          onSave={handleSave}
          onReset={handleReset}
          isLoading={isLoading}
          hasChanges={hasChanges}
        />
      </CardContent>
    </Card>
  );
};
