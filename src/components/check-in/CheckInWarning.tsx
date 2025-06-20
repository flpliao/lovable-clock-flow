
import React from 'react';
import { AlertCircle } from 'lucide-react';
import { Department } from '@/components/departments/types';

interface CheckInWarningProps {
  checkInMethod: 'location' | 'ip';
  canUseLocationCheckIn: boolean;
  employeeDepartment?: Department;
}

const CheckInWarning: React.FC<CheckInWarningProps> = ({
  checkInMethod,
  canUseLocationCheckIn,
  employeeDepartment
}) => {
  if (checkInMethod !== 'location' || canUseLocationCheckIn) {
    return null;
  }

  return (
    <div className="bg-yellow-500/20 backdrop-blur-xl rounded-lg p-3 border border-yellow-400/30">
      <div className="flex items-center gap-2 text-yellow-200 text-sm">
        <AlertCircle className="h-4 w-4" />
        <span className="font-medium">位置打卡暫不可用</span>
      </div>
      <div className="text-yellow-200/80 text-xs mt-1">
        {employeeDepartment 
          ? `部門「${employeeDepartment.name}」的GPS座標尚未設定，請聯繫管理者進行設定後再使用位置打卡功能。`
          : '無法取得部門資訊，請聯繫管理者。'
        }
      </div>
    </div>
  );
};

export default CheckInWarning;
