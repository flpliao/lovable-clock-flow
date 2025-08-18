import { FeatureCard, FeatureIcon, FeatureNumber } from '@/components/common/cards';
import { FileText } from 'lucide-react';
import React from 'react';

interface ApprovalStatsProps {
  pendingLeave: number;
  pendingMissedCheckin: number;
  onPendingLeaveClick?: () => void;
  onPendingMissedCheckinClick?: () => void;
}

const ApprovalStats: React.FC<ApprovalStatsProps> = ({
  pendingLeave,
  pendingMissedCheckin,
  onPendingLeaveClick,
  onPendingMissedCheckinClick,
}) => {
  const cards = [
    {
      title: '待審核請假',
      description: '點擊前往審核請假申請',
      rightContent: (
        <FeatureNumber
          number={pendingLeave}
          iconBg={pendingLeave > 0 ? 'bg-red-100' : 'bg-green-100'}
          iconColor={pendingLeave > 0 ? 'text-red-600' : 'text-green-600'}
        />
      ),
      onClick: onPendingLeaveClick,
      isClickable: true,
    },
    {
      title: '待審核打卡',
      description: '點擊前往審核忘打卡申請',
      rightContent: (
        <FeatureNumber
          number={pendingMissedCheckin}
          iconBg={pendingMissedCheckin > 0 ? 'bg-orange-100' : 'bg-green-100'}
          iconColor={pendingMissedCheckin > 0 ? 'text-orange-600' : 'text-green-600'}
        />
      ),
      onClick: onPendingMissedCheckinClick,
      isClickable: true,
    },
    {
      title: '請假紀錄',
      description: '查看請假申請歷史紀錄',
      rightContent: (
        <FeatureIcon
          icon={<FileText className="h-5 w-5" />}
          iconBg="bg-blue-100"
          iconColor="text-blue-600"
        />
      ),
      isClickable: false,
    },
    {
      title: '忘打卡紀錄',
      description: '查看忘打卡申請歷史紀錄',
      rightContent: (
        <FeatureIcon
          icon={<FileText className="h-5 w-5" />}
          iconBg="bg-purple-100"
          iconColor="text-blue-600"
        />
      ),
      isClickable: false,
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-4">
      {cards.map((card, index) => (
        <FeatureCard
          key={index}
          title={card.title}
          description={card.description}
          rightContent={card.rightContent}
          onClick={card.onClick}
          isClickable={card.isClickable}
        />
      ))}
    </div>
  );
};

export default ApprovalStats;
