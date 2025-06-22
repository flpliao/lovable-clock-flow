
import React from 'react';
import { LeaveRequest } from '@/types';
import { useLeaveManagementContext } from '@/contexts/LeaveManagementContext';
import { LeaveHistoryItem } from '@/components/leave/LeaveHistoryItem';

interface LeaveHistoryProps {
  onClick?: (leave: LeaveRequest) => void;
}

const LeaveHistory: React.FC<LeaveHistoryProps> = ({ onClick }) => {
  const { getLeaveHistory } = useLeaveManagementContext();
  const allLeaveHistory = getLeaveHistory();
  
  // 顯示所有請假記錄（包含待審核、已核准、已退回）
  const leaveHistoryToShow = allLeaveHistory.sort((a, b) => 
    new Date(b.created_at || b.start_date).getTime() - new Date(a.created_at || a.start_date).getTime()
  );
  
  const handleClick = (leave: LeaveRequest) => {
    if (onClick) {
      onClick(leave);
    }
  };
  
  return (
    <div className="space-y-3">
      {leaveHistoryToShow.length === 0 ? (
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <p className="text-gray-600 font-medium">尚無請假記錄</p>
          <p className="text-gray-500 mt-1">您的請假記錄將會顯示在這裡</p>
        </div>
      ) : (
        leaveHistoryToShow.map((leave) => (
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
