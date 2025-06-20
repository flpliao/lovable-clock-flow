
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MapPin, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useDepartmentManagementContext } from './DepartmentManagementContext';
import { Department } from './types';
import { GeocodingService } from '@/services/geocodingService';
import { toast } from '@/hooks/use-toast';
import DepartmentGPSStatus from './DepartmentGPSStatus';

interface DepartmentGPSConverterProps {
  department: Department;
}

const DepartmentGPSConverter: React.FC<DepartmentGPSConverterProps> = ({ department }) => {
  const { convertAddressToGPS } = useDepartmentManagementContext();
  const [address, setAddress] = useState(department.location || '');
  const [loading, setLoading] = useState(false);
  const [validation, setValidation] = useState<{
    isValid: boolean;
    suggestions: string[];
    errors: string[];
  } | null>(null);

  // 即時地址格式驗證
  const handleAddressChange = (value: string) => {
    setAddress(value);
    if (value.length > 3) {
      const result = GeocodingService.validateAddressFormat(value);
      setValidation(result);
    } else {
      setValidation(null);
    }
  };

  const handleConvert = async () => {
    if (!address.trim()) {
      toast({
        title: "請輸入地址",
        description: "請先輸入完整地址再進行轉換",
        variant: "destructive",
      });
      return;
    }

    // 最終驗證
    const finalValidation = GeocodingService.validateAddressFormat(address);
    if (!finalValidation.isValid) {
      toast({
        title: "地址格式不正確",
        description: finalValidation.errors[0] + '。' + (finalValidation.suggestions[0] || ''),
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      await convertAddressToGPS(department.id, address);
    } finally {
      setLoading(false);
    }
  };

  const getStatusMessage = () => {
    switch (department.gps_status) {
      case 'converted':
        return '已成功設定GPS座標，員工可正常打卡';
      case 'failed':
        return '地址轉換失敗，請檢查地址格式是否正確或改用 Google Maps 建議格式';
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
        <Input
          id={`address-${department.id}`}
          value={address}
          onChange={(e) => handleAddressChange(e.target.value)}
          placeholder="請輸入完整地址（如：台南市東區長榮路一段85號）"
          className={`text-sm ${
            validation && !validation.isValid ? 'border-red-300 focus:border-red-500' : ''
          }`}
          disabled={loading}
        />
        
        {/* 地址格式提示 */}
        {validation && !validation.isValid && (
          <div className="flex items-start gap-2 p-2 bg-red-50 border border-red-200 rounded text-xs">
            <AlertCircle className="h-3 w-3 text-red-500 mt-0.5 flex-shrink-0" />
            <div className="space-y-1">
              <div className="text-red-700 font-medium">地址格式需要改進：</div>
              {validation.errors.map((error, index) => (
                <div key={index} className="text-red-600">• {error}</div>
              ))}
              {validation.suggestions.length > 0 && (
                <div className="text-red-600 mt-1">
                  <div className="font-medium">建議格式：</div>
                  {validation.suggestions.map((suggestion, index) => (
                    <div key={index} className="ml-2">• {suggestion}</div>
                  ))}
                </div>
              )}
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
      </div>

      <Button
        onClick={handleConvert}
        disabled={loading || !address.trim() || (validation && !validation.isValid)}
        size="sm"
        className="w-full"
      >
        {loading ? (
          <>
            <Loader2 className="h-3 w-3 mr-1 animate-spin" />
            轉換中...
          </>
        ) : (
          <>
            <MapPin className="h-3 w-3 mr-1" />
            {department.gps_status === 'converted' ? '重新轉換GPS座標' : '轉換為GPS座標'}
          </>
        )}
      </Button>

      {/* 狀態說明 */}
      <div className="text-xs text-gray-600 bg-gray-50 p-2 rounded">
        <div className="font-medium mb-1">狀態說明：</div>
        <div>{getStatusMessage()}</div>
      </div>
    </div>
  );
};

export default DepartmentGPSConverter;
