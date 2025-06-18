
import React from 'react';
import { LeaveRequest } from '@/types';
import { useLeaveManagementContext } from '@/contexts/LeaveManagementContext';
import { LeaveHistoryItem } from '@/components/leave/LeaveHistoryItem';

interface LeaveHistoryProps {
  onClick?: (leave: LeaveRequest) => void;
}

const LeaveHistory: React.FC<LeaveHistoryProps> = ({ onClick }) => {
  const { getLeaveHistory } = useLeaveManagementContext();
  const leaveHistory = getLeaveHistory();
  
  const handleClick = (leave: LeaveRequest) => {
    if (onClick) {
      onClick(leave);
    }
  };
  
  return (
    <div className="space-y-4">
      {leaveHistory.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6 backdrop-blur-xl border border-white/30 shadow-lg">
            <svg className="w-10 h-10 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <p className="text-white/80 font-semibold text-lg drop-shadow-md">尚無請假記錄</p>
          <p className="text-white/60 mt-2 drop-shadow-md">您的請假記錄將會顯示在這裡</p>
        </div>
      ) : (
        leaveHistory.map((leave) => (
          <LeaveHistoryItem 
            key={leave.id} 
            leave={leave}
            onClick={handleClick} 
          />
        ))
      )}
    </div>
  );
};

export default LeaveHistory;
