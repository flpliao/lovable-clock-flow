
import React from 'react';
import { Building2, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';
import { Department } from '@/components/departments/types';
import { isDepartmentReadyForCheckIn, getDepartmentGPSStatusMessage } from '@/utils/departmentCheckInUtils';

interface LocationInfoProps {
  currentUser: any;
  employeeDepartment?: Department;
}

const LocationInfo: React.FC<LocationInfoProps> = ({
  currentUser,
  employeeDepartment
}) => {
  const getComparisonLocationInfo = () => {
    // 如果員工沒有設定部門，使用總公司
    if (!currentUser.department) {
      return {
        name: '總公司',
        status: 'available',
        statusColor: 'text-green-200',
        icon: <CheckCircle2 className="h-4 w-4" />
      };
    }

    // 如果員工有部門但找不到部門資料
    if (!employeeDepartment) {
      return {
        name: currentUser.department,
        status: 'not_found',
        statusColor: 'text-red-200',
        icon: <XCircle className="h-4 w-4" />
      };
    }

    // 檢查部門GPS是否準備就緒
    const isReady = isDepartmentReadyForCheckIn(employeeDepartment);
    return {
      name: employeeDepartment.name,
      status: isReady ? 'ready' : 'not_ready',
      statusColor: isReady ? 'text-green-200' : 'text-yellow-200',
      icon: isReady ? <CheckCircle2 className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />
    };
  };

  const locationInfo = getComparisonLocationInfo();

  return (
    <div className="flex items-center space-x-2 text-white/90 text-sm">
      <Building2 className="h-4 w-4" />
      <span>比對位置: {locationInfo.name}</span>
      <div className={locationInfo.statusColor}>
        {locationInfo.icon}
      </div>
    </div>
  );
};

export default LocationInfo;
