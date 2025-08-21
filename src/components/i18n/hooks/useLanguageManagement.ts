
import { useState, useEffect } from 'react';
import { 
  languagePreferenceService, 
  getDefaultLanguageByCountry,
  SUPPORTED_COUNTRIES 
} from '../services/languageService';
import { UserLanguagePreference } from '../types';
import { useToast } from '@/hooks/use-toast';

export const useLanguageManagement = () => {
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

  return {
    selectedCountry,
    selectedLanguage,
    isLoading,
    hasChanges,
    handleCountryChange,
    handleLanguageChange,
    handleSave,
    handleReset
  };
};
