import { LeaveHistoryItem } from '@/components/leave/LeaveHistoryItem';
import { useMyLeaveRequest } from '@/hooks/useMyLeaveRequest';
import useEmployeeStore from '@/stores/employeeStore';
import React, { useEffect } from 'react';

const LeaveHistory: React.FC = () => {
  const { employee } = useEmployeeStore();
  const { requests, isLoading, loadMyLeaveRequests } = useMyLeaveRequest();

  // 初始載入
  useEffect(() => {
    loadMyLeaveRequests();
  }, [employee]);

  // 顯示所有請假記錄（包含待審核、已核准、已退回）
  const leaveHistoryToShow = requests.sort(
    (a, b) =>
      new Date(b.created_at || b.start_date).getTime() -
      new Date(a.created_at || a.start_date).getTime()
  );

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg
            className="w-8 h-8 text-gray-400 animate-spin"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
        </div>
        <p className="text-gray-600 font-medium">載入中...</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {leaveHistoryToShow.length === 0 ? (
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <p className="text-gray-600 font-medium">尚無請假記錄</p>
          <p className="text-gray-500 mt-1">您的請假記錄將會顯示在這裡</p>
        </div>
      ) : (
        leaveHistoryToShow.map(leave => <LeaveHistoryItem key={leave.id} leave={leave} />)
      )}
    </div>
  );
};

export default LeaveHistory;
