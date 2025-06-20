
import React from 'react';
import { Building2, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';
import { Department } from '@/components/departments/types';
import { isDepartmentReadyForCheckIn, getDepartmentGPSStatusMessage } from '@/utils/departmentCheckInUtils';

interface LocationInfoProps {
  currentUser: any;
  employeeDepartment?: Department;
}

const LocationInfo: React.FC<LocationInfoProps> = ({ currentUser, employeeDepartment }) => {
  const getComparisonLocationInfo = () => {
    if (!currentUser.department) {
      return {
        name: '總公司',
        status: 'available',
        statusColor: 'text-green-200',
        icon: <CheckCircle2 className="h-4 w-4" />
      };
    }

    if (!employeeDepartment) {
      return {
        name: currentUser.department,
        status: 'not_found',
        statusColor: 'text-red-200',
        icon: <XCircle className="h-4 w-4" />
      };
    }

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
    <div className="bg-white/10 backdrop-blur-xl rounded-lg p-3 border border-white/20">
      <div className="flex items-center gap-2 text-white/90 text-sm mb-2">
        <Building2 className="h-4 w-4" />
        <span className="font-medium">本次比對位置：</span>
      </div>
      <div className="flex items-center gap-2">
        {locationInfo.icon}
        <span className={`font-medium ${locationInfo.statusColor}`}>
          {locationInfo.name}
        </span>
        <span className="text-xs text-white/60">
          ({locationInfo.status === 'ready' ? 'GPS已設定' : 
            locationInfo.status === 'available' ? '總公司GPS' :
            locationInfo.status === 'not_found' ? '部門不存在' : 'GPS未設定'})
        </span>
      </div>
      
      {/* GPS狀態詳細說明 */}
      {employeeDepartment && (
        <div className="mt-2 text-xs text-white/70">
          {getDepartmentGPSStatusMessage(employeeDepartment)}
        </div>
      )}
    </div>
  );
};

export default LocationInfo;
