
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Globe, Save, RefreshCw } from 'lucide-react';
import { CountrySelector } from './CountrySelector';
import { LanguageSelector } from './LanguageSelector';
import { 
  languagePreferenceService, 
  getDefaultLanguageByCountry,
  SUPPORTED_COUNTRIES,
  SUPPORTED_LANGUAGES 
} from '../services/languageService';
import { UserLanguagePreference } from '../types';
import { useToast } from '@/hooks/use-toast';

export const LanguageManagement: React.FC = () => {
  const [selectedCountry, setSelectedCountry] = useState<string>('');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const { toast } = useToast();

  // 初始化設定
  useEffect(() => {
    const savedPreference = languagePreferenceService.getUserPreference();
    
    if (savedPreference) {
      setSelectedCountry(savedPreference.countryCode);
      setSelectedLanguage(savedPreference.languageCode);
    } else {
      // 使用瀏覽器語言自動偵測
      const browserCountry = languagePreferenceService.getCountryByBrowserLanguage();
      const browserLanguage = languagePreferenceService.getBrowserLanguage();
      
      setSelectedCountry(browserCountry);
      setSelectedLanguage(browserLanguage);
    }
  }, []);

  // 監聽變更
  useEffect(() => {
    const savedPreference = languagePreferenceService.getUserPreference();
    const currentPreference = {
      countryCode: selectedCountry,
      languageCode: selectedLanguage
    };
    
    const hasUnsavedChanges = !savedPreference || 
      savedPreference.countryCode !== currentPreference.countryCode ||
      savedPreference.languageCode !== currentPreference.languageCode;
    
    setHasChanges(hasUnsavedChanges);
  }, [selectedCountry, selectedLanguage]);

  const handleCountryChange = (countryCode: string) => {
    setSelectedCountry(countryCode);
    
    // 自動設定該國家的預設語言
    const defaultLanguage = getDefaultLanguageByCountry(countryCode);
    setSelectedLanguage(defaultLanguage);
  };

  const handleLanguageChange = (languageCode: string) => {
    setSelectedLanguage(languageCode);
  };

  const handleSave = async () => {
    setIsLoading(true);
    
    try {
      const country = SUPPORTED_COUNTRIES.find(c => c.code === selectedCountry);
      
      if (!country) {
        throw new Error('無效的國家選擇');
      }

      const preference: UserLanguagePreference = {
        userId: 'current-user',
        countryCode: selectedCountry,
        languageCode: selectedLanguage,
        timezone: country.timezone,
        dateFormat: country.date_format,
        timeFormat: country.time_format
      };

      languagePreferenceService.saveUserPreference(preference);
      
      toast({
        title: '設定已儲存',
        description: '您的語系偏好設定已成功儲存',
      });
      
      setHasChanges(false);
    } catch (error) {
      console.error('儲存語系設定失敗:', error);
      toast({
        title: '儲存失敗',
        description: '無法儲存語系設定，請稍後再試',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    const browserCountry = languagePreferenceService.getCountryByBrowserLanguage();
    const browserLanguage = languagePreferenceService.getBrowserLanguage();
    
    setSelectedCountry(browserCountry);
    setSelectedLanguage(browserLanguage);
    
    toast({
      title: '設定已重置',
      description: '已重置為瀏覽器預設語系設定',
    });
  };

  const selectedCountryInfo = SUPPORTED_COUNTRIES.find(c => c.code === selectedCountry);
  const selectedLanguageInfo = SUPPORTED_LANGUAGES.find(l => l.code === selectedLanguage);

  return (
    <Card>
      <CardHeader className="pb-3 px-4">
        <CardTitle className="flex items-center text-base">
          <Globe className="h-4 w-4 mr-2" />
          多語系管理
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4 px-4 pb-4">
        <div className="space-y-3">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">國家地區</label>
            <CountrySelector
              value={selectedCountry}
              onValueChange={handleCountryChange}
              disabled={isLoading}
            />
          </div>
          
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">語言</label>
            <LanguageSelector
              value={selectedLanguage}
              onValueChange={handleLanguageChange}
              disabled={isLoading}
            />
          </div>
        </div>

        {selectedCountryInfo && selectedLanguageInfo && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <h4 className="font-medium text-blue-900 mb-2">選擇摘要：</h4>
            <div className="space-y-0.5 text-sm text-blue-800">
              <p>國家：{selectedCountryInfo.name_zh} ({selectedCountryInfo.name_en})</p>
              <p>語言：{selectedLanguageInfo.name_zh} ({selectedLanguageInfo.name_native})</p>
              <p>時區：{selectedCountryInfo.timezone}</p>
              <p>日期格式：{selectedCountryInfo.date_format}</p>
              <p>時間格式：{selectedCountryInfo.time_format}</p>
            </div>
          </div>
        )}

        <div className="flex gap-2 pt-1">
          <Button
            onClick={handleSave}
            disabled={isLoading || !hasChanges}
            className="flex-1 bg-blue-600 hover:bg-blue-700"
          >
            {isLoading ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                儲存中...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                儲存設定
              </>
            )}
          </Button>
          
          <Button
            variant="outline"
            onClick={handleReset}
            disabled={isLoading}
            className="px-4"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            重置
          </Button>
        </div>

        {hasChanges && (
          <Alert className="bg-yellow-50 border-yellow-200">
            <AlertDescription className="text-sm text-yellow-800">
              您有未儲存的變更，請記得點擊「儲存設定」。
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};
