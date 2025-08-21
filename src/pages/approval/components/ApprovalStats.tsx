
import React from 'react';

interface ApprovalStatsProps {
  pendingLeave: number;
  pendingMissedCheckin: number;
  pendingOvertime: number;
  todayApproved: number;
  todayRejected: number;
}

const ApprovalStats: React.FC<ApprovalStatsProps> = ({
  pendingLeave,
  pendingMissedCheckin,
  pendingOvertime,
  todayApproved,
  todayRejected
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
      <div className="backdrop-blur-xl bg-white/20 border border-white/30 rounded-2xl p-4 text-center">
        <div className="text-3xl font-bold text-white mb-2">{pendingLeave}</div>
        <div className="text-white/80 text-sm font-medium">待審核請假</div>
      </div>
      <div className="backdrop-blur-xl bg-white/20 border border-white/30 rounded-2xl p-4 text-center">
        <div className="text-3xl font-bold text-white mb-2">{pendingMissedCheckin}</div>
        <div className="text-white/80 text-sm font-medium">待審核打卡</div>
      </div>
      <div className="backdrop-blur-xl bg-white/20 border border-white/30 rounded-2xl p-4 text-center">
        <div className="text-3xl font-bold text-white mb-2">{pendingOvertime}</div>
        <div className="text-white/80 text-sm font-medium">待審核加班</div>
      </div>
      <div className="backdrop-blur-xl bg-white/20 border border-white/30 rounded-2xl p-4 text-center">
        <div className="text-3xl font-bold text-green-300 mb-2">{todayApproved}</div>
        <div className="text-white/80 text-sm font-medium">今日已核准</div>
      </div>
      <div className="backdrop-blur-xl bg-white/20 border border-white/30 rounded-2xl p-4 text-center">
        <div className="text-3xl font-bold text-red-300 mb-2">{todayRejected}</div>
        <div className="text-white/80 text-sm font-medium">今日已拒絕</div>
      </div>
    </div>
  );
};

export default ApprovalStats;
