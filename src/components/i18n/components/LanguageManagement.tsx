
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
    <div className="p-6">
      <div className="flex items-center gap-4 mb-6">
        <div className="p-3 bg-blue-500/90 rounded-2xl shadow-lg backdrop-blur-xl border border-blue-400/30 text-white">
          <Globe className="h-6 w-6" />
        </div>
        <div>
          <h3 className="text-2xl font-bold text-white">多語系管理</h3>
          <p className="text-white/80 mt-1">設定系統預設語言和地區</p>
        </div>
      </div>
      
      <div className="space-y-6">
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
      </div>
    </div>
  );
};
