
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Loader2, AlertCircle, CheckCircle2, Eye, EyeOff, ExternalLink } from 'lucide-react';
import { SystemSettingsService } from '@/services/systemSettingsService';
import { toast } from '@/hooks/use-toast';

const GoogleMapsApiKeySettings = () => {
  const [apiKey, setApiKey] = useState('');
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [showApiKey, setShowApiKey] = useState(false);
  const [hasApiKey, setHasApiKey] = useState(false);

  const loadApiKey = async () => {
    try {
      const existingApiKey = await SystemSettingsService.getGoogleMapsApiKey();
      if (existingApiKey) {
        setApiKey(existingApiKey);
        setHasApiKey(true);
      } else {
        setHasApiKey(false);
      }
    } catch (error) {
      console.error('載入 Google Maps API 金鑰失敗:', error);
      toast({
        title: "載入失敗",
        description: "無法載入 Google Maps API 金鑰設定",
        variant: "destructive",
      });
    } finally {
      setInitialLoading(false);
    }
  };

  useEffect(() => {
    loadApiKey();
  }, []);

  const handleSave = async () => {
    if (!apiKey.trim()) {
      toast({
        title: "請輸入 API 金鑰",
        description: "Google Maps API 金鑰不能為空",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const success = await SystemSettingsService.setGoogleMapsApiKey(apiKey.trim());
      
      if (success) {
        setHasApiKey(true);
        toast({
          title: "設定成功",
          description: "Google Maps API 金鑰已儲存",
        });
      } else {
        toast({
          title: "設定失敗",
          description: "無法儲存 Google Maps API 金鑰，請稍後重試",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('儲存 Google Maps API 金鑰失敗:', error);
      toast({
        title: "系統錯誤",
        description: "儲存過程中發生錯誤，請聯繫系統管理員",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClear = async () => {
    setLoading(true);
    try {
      const success = await SystemSettingsService.setGoogleMapsApiKey('');
      
      if (success) {
        setApiKey('');
        setHasApiKey(false);
        toast({
          title: "清除成功",
          description: "Google Maps API 金鑰已清除",
        });
      } else {
        toast({
          title: "清除失敗",
          description: "無法清除 Google Maps API 金鑰，請稍後重試",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('清除 Google Maps API 金鑰失敗:', error);
      toast({
        title: "系統錯誤",
        description: "清除過程中發生錯誤，請聯繫系統管理員",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <Card className="backdrop-blur-2xl bg-white/10 border border-white/20 rounded-3xl shadow-2xl">
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-white mr-2" />
          <span className="text-white">載入中...</span>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="backdrop-blur-2xl bg-white/10 border border-white/20 rounded-3xl shadow-2xl">
      <CardHeader className="pb-4">
        <CardTitle className="text-white flex items-center gap-3 text-lg">
          <MapPin className="h-5 w-5" />
          Google Maps API 設定
        </CardTitle>
        <div className="flex items-center gap-2 mt-2">
          {hasApiKey ? (
            <>
              <CheckCircle2 className="h-4 w-4 text-green-400" />
              <span className="text-green-100 text-sm">已設定 API 金鑰</span>
            </>
          ) : (
            <>
              <AlertCircle className="h-4 w-4 text-yellow-400" />
              <span className="text-yellow-100 text-sm">未設定 API 金鑰</span>
            </>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* API 金鑰輸入 */}
        <div className="space-y-2">
          <Label htmlFor="google-maps-api-key" className="text-white font-medium">
            Google Maps API 金鑰
          </Label>
          <div className="relative">
            <Input
              id="google-maps-api-key"
              type={showApiKey ? "text" : "password"}
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="請輸入您的 Google Maps API 金鑰"
              className="bg-white/10 border-white/20 text-white placeholder:text-white/50 pr-10 backdrop-blur-xl"
              disabled={loading}
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 p-0 text-white/60 hover:text-white hover:bg-white/10"
              onClick={() => setShowApiKey(!showApiKey)}
            >
              {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {/* 操作按鈕 */}
        <div className="flex gap-2">
          <Button
            onClick={handleSave}
            disabled={loading || !apiKey.trim()}
            className="flex-1 bg-blue-500/80 hover:bg-blue-600/80 text-white backdrop-blur-xl"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                儲存中...
              </>
            ) : (
              '儲存設定'
            )}
          </Button>
          
          {hasApiKey && (
            <Button
              onClick={handleClear}
              disabled={loading}
              variant="outline"
              className="bg-white/10 border-white/20 text-white hover:bg-white/20 backdrop-blur-xl"
            >
              清除
            </Button>
          )}
        </div>

        {/* 取得 API 金鑰連結 */}
        <div className="pt-2 border-t border-white/20">
          <Button
            variant="link"
            size="sm"
            className="text-white/80 hover:text-white p-0 h-auto text-sm"
            onClick={() => window.open('https://developers.google.com/maps/documentation/geocoding/get-api-key', '_blank')}
          >
            <ExternalLink className="h-3 w-3 mr-1" />
            如何取得 Google Maps API 金鑰
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default GoogleMapsApiKeySettings;
