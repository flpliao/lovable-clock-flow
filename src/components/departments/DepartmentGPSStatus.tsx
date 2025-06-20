
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, AlertTriangle, Clock } from 'lucide-react';
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
          label: '已設定',
          variant: 'default' as const,
        };
      case 'failed':
        return {
          icon: <AlertTriangle className="h-3 w-3" />,
          label: '轉換失敗',
          variant: 'destructive' as const,
        };
      default:
        return {
          icon: <Clock className="h-3 w-3" />,
          label: '未設定',
          variant: 'secondary' as const,
        };
    }
  };

  const statusInfo = getGPSStatusInfo();

  return (
    <Badge variant={statusInfo.variant} className="flex items-center gap-1 text-xs">
      {statusInfo.icon}
      <span>{statusInfo.label}</span>
    </Badge>
  );
};

export default DepartmentGPSStatus;
