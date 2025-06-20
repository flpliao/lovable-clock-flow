
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MapPin, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useDepartmentManagementContext } from './DepartmentManagementContext';
import { Department } from './types';
import { GeocodingService } from '@/services/geocodingService';
import { toast } from '@/hooks/use-toast';

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

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <MapPin className="h-4 w-4 text-blue-600" />
        <span className="text-sm font-medium">GPS地址轉換</span>
      </div>
      
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
            轉換為GPS座標
          </>
        )}
      </Button>

      {/* GPS座標顯示 */}
      {department.latitude && department.longitude && (
        <div className="text-xs text-gray-600 bg-gray-50 p-2 rounded space-y-1">
          <div className="font-medium">GPS座標：</div>
          <div>緯度: {department.latitude.toFixed(6)}</div>
          <div>經度: {department.longitude.toFixed(6)}</div>
          <div className="flex items-center justify-between pt-1 border-t border-gray-200">
            <div className="flex items-center gap-1">
              {department.address_verified ? (
                <span className="text-green-600 flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3" />
                  已驗證
                </span>
              ) : (
                <span className="text-yellow-600 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  未驗證
                </span>
              )}
            </div>
            <span className="text-gray-500">
              半徑: {department.check_in_radius || 100}m
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default DepartmentGPSConverter;
