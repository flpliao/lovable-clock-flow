import { LeaveRequest } from '@/types/leaveRequest';
import React from 'react';
import LeaveRequestItem from './LeaveRequestItem';

const MyLeaveRequestList: React.FC<{
  requests: LeaveRequest[];
  isLoading: boolean;
}> = ({ requests, isLoading }) => {
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

  if (requests.length === 0) {
    return (
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
    );
  }

  return (
    <div className="space-y-3">
      {requests.map(leaveRequest => (
        <LeaveRequestItem key={leaveRequest.slug} leaveRequest={leaveRequest} />
      ))}
    </div>
  );
};

export default MyLeaveRequestList;
