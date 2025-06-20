
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { MapPin, AlertTriangle, CheckCircle2, Clock } from 'lucide-react';
import { Department } from './types';

interface DepartmentGPSStatusProps {
  department: Department;
  showDetails?: boolean;
}

const DepartmentGPSStatus: React.FC<DepartmentGPSStatusProps> = ({ 
  department, 
  showDetails = false 
}) => {
  const getGPSStatusInfo = () => {
    switch (department.gps_status) {
      case 'converted':
        return {
          icon: <CheckCircle2 className="h-3 w-3" />,
          label: 'GPS已設定',
          variant: 'default' as const,
          color: 'text-green-600',
          bgColor: 'bg-green-50 border-green-200'
        };
      case 'failed':
        return {
          icon: <AlertTriangle className="h-3 w-3" />,
          label: 'GPS轉換失敗',
          variant: 'destructive' as const,
          color: 'text-red-600',
          bgColor: 'bg-red-50 border-red-200'
        };
      default:
        return {
          icon: <Clock className="h-3 w-3" />,
          label: 'GPS未設定',
          variant: 'secondary' as const,
          color: 'text-yellow-600',
          bgColor: 'bg-yellow-50 border-yellow-200'
        };
    }
  };

  const statusInfo = getGPSStatusInfo();

  if (showDetails) {
    return (
      <div className={`p-3 rounded-lg border ${statusInfo.bgColor}`}>
        <div className="flex items-center gap-2 mb-2">
          <MapPin className="h-4 w-4 text-gray-600" />
          <span className="font-medium text-sm">GPS狀態</span>
        </div>
        <div className="flex items-center gap-2">
          {statusInfo.icon}
          <span className={`text-sm ${statusInfo.color}`}>
            {statusInfo.label}
          </span>
        </div>
        {department.gps_status === 'converted' && department.latitude && department.longitude && (
          <div className="mt-2 text-xs text-gray-500">
            <div>緯度: {department.latitude.toFixed(6)}</div>
            <div>經度: {department.longitude.toFixed(6)}</div>
            <div>允許範圍: {department.check_in_radius || 100}公尺</div>
          </div>
        )}
        {department.gps_status === 'failed' && (
          <div className="mt-2 text-xs text-red-600">
            請檢查地址格式或使用 Google Maps 建議格式
          </div>
        )}
      </div>
    );
  }

  return (
    <Badge variant={statusInfo.variant} className="flex items-center gap-1">
      {statusInfo.icon}
      <span>{statusInfo.label}</span>
    </Badge>
  );
};

export default DepartmentGPSStatus;
