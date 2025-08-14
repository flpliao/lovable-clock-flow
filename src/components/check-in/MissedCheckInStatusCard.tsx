import { ApprovalStatus } from '@/constants/approvalStatus';
import { CheckInRecord } from '@/types';
import { getStatusConfig } from '@/utils/statusConfig';
import { AlertCircle, LogIn, LogOut } from 'lucide-react';
import React from 'react';

interface MissedCheckInStatusCardProps {
  checkInRecord: CheckInRecord;
  type: '上班' | '下班';
}

const MissedCheckInStatusCard: React.FC<MissedCheckInStatusCardProps> = ({
  checkInRecord,
  type,
}) => {
  const status = (checkInRecord?.approval_status as ApprovalStatus) || ApprovalStatus.PENDING;

  // 使用常數檔案中的狀態配置，但調整為適合此組件的樣式
  const baseConfig = getStatusConfig(status);

  // 為此組件調整樣式配置
  const config = {
    bgColor: baseConfig.bgGradient.replace('from-', 'bg-').replace(' to-', '-'),
    borderColor: baseConfig.borderColor,
    textColor: baseConfig.textColor,
    secondaryTextColor: baseConfig.secondaryTextColor,
    statusText: baseConfig.statusText,
    iconColor: baseConfig.iconColor,
  };

  return (
    <div className={`${config.bgColor} rounded-lg p-3 border ${config.borderColor}`}>
      <div className="flex items-center justify-center mb-2">
        {type === '上班' ? (
          <LogIn className={`h-4 w-4 ${config.iconColor} mr-1`} />
        ) : (
          <LogOut className={`h-4 w-4 ${config.iconColor} mr-1`} />
        )}
        <span className="font-medium">{type}</span>
      </div>
      <div className="text-center space-y-1.5">
        <div className={`font-mono ${config.textColor}`}>忘打卡申請</div>
        <div
          className={`flex items-center justify-center gap-1 ${config.secondaryTextColor} text-xs`}
        >
          <AlertCircle className="h-3 w-3" />
          <span>{config.statusText}</span>
        </div>
      </div>
    </div>
  );
};

export default MissedCheckInStatusCard;
