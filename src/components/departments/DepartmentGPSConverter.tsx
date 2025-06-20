import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { MapPin, Loader2, AlertCircle, CheckCircle2, Lightbulb, ExternalLink } from 'lucide-react';
import { useDepartmentManagementContext } from './DepartmentManagementContext';
import { Department } from './types';
import { GeocodingService, AddressSuggestion } from '@/services/geocodingService';
import { toast } from '@/hooks/use-toast';
import DepartmentGPSStatus from './DepartmentGPSStatus';

interface DepartmentGPSConverterProps {
  department: Department;
}

const DepartmentGPSConverter: React.FC<DepartmentGPSConverterProps> = ({
  department
}) => {
  const {
    convertAddressToGPS,
    refreshDepartments
  } = useDepartmentManagementContext();
  
  const [address, setAddress] = useState(department.location || '');
  const [loading, setLoading] = useState(false);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [validation, setValidation] = useState<{
    isValid: boolean;
    suggestions: string[];
    errors: string[];
  } | null>(null);
  const [addressSuggestions, setAddressSuggestions] = useState<AddressSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // 即時地址格式驗證 - 使用寬鬆條件
  const handleAddressChange = (value: string) => {
    setAddress(value);
    if (value.length > 3) {
      const basicValidation = {
        isValid: value.trim().length >= 5,
        suggestions: value.trim().length < 5 ? ['請輸入更完整的地址'] : [],
        errors: value.trim().length < 5 ? ['地址長度太短'] : []
      };
      setValidation(basicValidation);
    } else {
      setValidation(null);
    }
    setShowSuggestions(false);
  };

  // 取得地址建議
  const handleGetSuggestions = async () => {
    if (!address.trim() || address.length < 5) {
      toast({
        title: "請輸入更完整的地址",
        description: "至少需要5個字元才能搜尋建議",
        variant: "destructive"
      });
      return;
    }
    setLoadingSuggestions(true);
    try {
      const suggestions = await GeocodingService.getAddressSuggestions(address);
      setAddressSuggestions(suggestions);
      setShowSuggestions(true);
      if (suggestions.length === 0) {
        toast({
          title: "找不到相似地址",
          description: "請嘗試修改地址格式或使用 Google Maps 確認地址",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('取得地址建議失敗:', error);
      toast({
        title: "無法取得地址建議",
        description: "請稍後重試或直接進行轉換",
        variant: "destructive"
      });
    } finally {
      setLoadingSuggestions(false);
    }
  };

  // 選擇建議地址
  const handleSelectSuggestion = (suggestion: AddressSuggestion) => {
    setAddress(suggestion.address);
    setShowSuggestions(false);
    const result = {
      isValid: true,
      suggestions: [],
      errors: []
    };
    setValidation(result);
  };

  const handleConvert = async () => {
    if (!address.trim()) {
      toast({
        title: "請輸入地址",
        description: "請先輸入完整地址再進行轉換",
        variant: "destructive"
      });
      return;
    }

    if (address.trim().length < 5) {
      toast({
        title: "地址太短",
        description: "請輸入更完整的地址資訊（至少5個字元）",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const success = await convertAddressToGPS(department.id, address);
      if (success) {
        // 轉換成功後立即刷新部門資料
        await refreshDepartments();
        console.log('🔄 GPS轉換成功，已刷新部門資料');
      } else {
        console.warn('⚠️ GPS轉換失敗，但允許用戶繼續操作');
      }
    } finally {
      setLoading(false);
    }
  };

  // 開啟 Google Maps 搜尋
  const handleOpenGoogleMaps = () => {
    const encodedAddress = encodeURIComponent(address || '台南市東區長榮路一段85號');
    const googleMapsUrl = `https://www.google.com/maps/search/${encodedAddress}`;
    window.open(googleMapsUrl, '_blank');
  };

  const getStatusMessage = () => {
    switch (department.gps_status) {
      case 'converted':
        return '已成功設定GPS座標，員工可正常打卡';
      case 'failed':
        return '地址轉換失敗，請檢查地址格式或參考 Google Maps 建議';
      default:
        return '尚未轉換GPS座標，員工無法使用位置打卡';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <MapPin className="h-4 w-4 text-blue-600" />
        <span className="text-sm font-medium">GPS地址轉換</span>
      </div>
      
      {/* GPS 狀態顯示 */}
      <DepartmentGPSStatus department={department} showDetails={true} />
      
      <div className="space-y-2">
        <Label htmlFor={`address-${department.id}`} className="text-xs">
          部門地址
        </Label>
        <div className="space-y-2">
          <Input 
            id={`address-${department.id}`} 
            value={address} 
            onChange={e => handleAddressChange(e.target.value)} 
            placeholder="請輸入完整地址（如：台南市東區長榮路一段85號）" 
            className={`text-sm ${validation && !validation.isValid ? 'border-red-300 focus:border-red-500' : ''}`} 
            disabled={loading} 
          />
          
          {/* 地址輔助工具 */}
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleGetSuggestions}
              disabled={loading || loadingSuggestions || !address.trim()}
              className="text-xs"
            >
              {loadingSuggestions ? (
                <>
                  <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                  搜尋中...
                </>
              ) : (
                <>
                  <Lightbulb className="h-3 w-3 mr-1" />
                  取得建議
                </>
              )}
            </Button>
            
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleOpenGoogleMaps}
              className="text-xs"
            >
              <ExternalLink className="h-3 w-3 mr-1" />
              Google Maps
            </Button>
          </div>
        </div>
        
        {/* 地址格式提示 - 只在真正有錯誤時顯示 */}
        {validation && !validation.isValid && validation.errors.length > 0 && (
          <div className="flex items-start gap-2 p-2 bg-red-50 border border-red-200 rounded text-xs">
            <AlertCircle className="h-3 w-3 text-red-500 mt-0.5 flex-shrink-0" />
            <div className="space-y-1">
              <div className="text-red-700 font-medium">請檢查地址：</div>
              {validation.errors.map((error, index) => (
                <div key={index} className="text-red-600">• {error}</div>
              ))}
            </div>
          </div>
        )}
        
        {/* 格式正確提示 */}
        {validation && validation.isValid && (
          <div className="flex items-center gap-2 text-xs text-green-600">
            <CheckCircle2 className="h-3 w-3" />
            <span>地址格式正確</span>
          </div>
        )}
        
        {/* 地址建議列表 */}
        {showSuggestions && addressSuggestions.length > 0 && (
          <Card className="mt-2">
            <CardContent className="p-3">
              <div className="text-xs font-medium mb-2 text-gray-700">建議地址：</div>
              <div className="space-y-1 max-h-32 overflow-y-auto">
                {addressSuggestions.slice(0, 5).map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => handleSelectSuggestion(suggestion)}
                    className="w-full text-left p-2 text-xs hover:bg-gray-50 rounded border border-gray-200 transition-colors"
                  >
                    <div className="font-medium text-gray-900">{suggestion.address}</div>
                    <div className="text-gray-500 mt-1">
                      來源: {suggestion.source} | 信心度: {(suggestion.confidence * 100).toFixed(1)}%
                    </div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <Button 
        onClick={handleConvert} 
        disabled={loading || !address.trim()} 
        size="sm" 
        className="w-full"
      >
        {loading ? (
          <>
            <Loader2 className="h-3 w-3 mr-1 animate-spin" />
            转换中...
          </>
        ) : (
          <>
            <MapPin className="h-3 w-3 mr-1" />
            {department.gps_status === 'converted' ? '重新转換GPS座標' : '转換為GPS座標'}
          </>
        )}
      </Button>

      {/* 独態說明和提示 */}
      <div className="text-xs text-gray-600 bg-gray-50 p-2 rounded space-y-2">
        <div className="font-medium">狀態說明：</div>
        <div>{getStatusMessage()}</div>
        
        {department.gps_status === 'failed' && (
          <div className="bg-yellow-50 border border-yellow-200 p-2 rounded mt-2">
            <div className="font-medium text-yellow-800 mb-1">轉換失敗解決建議：</div>
            <ul className="text-yellow-700 space-y-1">
              <li>• 點击「取得建議」查看系統找到的相似地址</li>
              <li>• 點击「Google Maps」确认地址在地圖上的正确格式</li>
              <li>• 嘗试添加邮递区号（如：701台南市东区...）</li>
              <li>• 使用 Google Maps 上搜寻得到的完整地址格式</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default DepartmentGPSConverter;
