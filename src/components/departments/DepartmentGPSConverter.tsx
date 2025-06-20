
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MapPin, Loader2 } from 'lucide-react';
import { useDepartmentManagementContext } from './DepartmentManagementContext';
import { Department } from './types';

interface DepartmentGPSConverterProps {
  department: Department;
}

const DepartmentGPSConverter: React.FC<DepartmentGPSConverterProps> = ({ department }) => {
  const { convertAddressToGPS } = useDepartmentManagementContext();
  const [address, setAddress] = useState(department.location || '');
  const [loading, setLoading] = useState(false);

  const handleConvert = async () => {
    if (!address.trim()) {
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
          onChange={(e) => setAddress(e.target.value)}
          placeholder="請輸入完整地址"
          className="text-sm"
        />
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
            轉換中...
          </>
        ) : (
          <>
            <MapPin className="h-3 w-3 mr-1" />
            轉換為GPS座標
          </>
        )}
      </Button>

      {department.latitude && department.longitude && (
        <div className="text-xs text-gray-600 bg-gray-50 p-2 rounded">
          <div>緯度: {department.latitude.toFixed(6)}</div>
          <div>經度: {department.longitude.toFixed(6)}</div>
          <div className="flex items-center gap-1 mt-1">
            {department.address_verified ? (
              <span className="text-green-600">✓ 已驗證</span>
            ) : (
              <span className="text-yellow-600">⚠ 未驗證</span>
            )}
            <span>半徑: {department.check_in_radius || 100}m</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default DepartmentGPSConverter;
