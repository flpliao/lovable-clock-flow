
import React from 'react';
import { LeaveRequest } from '@/types';
import { useLeaveManagementContext } from '@/contexts/LeaveManagementContext';
import { LeaveHistoryItem } from '@/components/leave/LeaveHistoryItem';

interface LeaveHistoryProps {
  onClick?: (leave: LeaveRequest) => void;
  showAll?: boolean; // 新增參數，用於控制是否顯示所有記錄
}

const LeaveHistory: React.FC<LeaveHistoryProps> = ({ onClick, showAll = false }) => {
  const { getLeaveHistory } = useLeaveManagementContext();
  const allLeaveHistory = getLeaveHistory();
  
  // 根據 showAll 參數決定要顯示的記錄
  const displayLeaveHistory = showAll 
    ? allLeaveHistory // 顯示所有記錄（包含待審核、已核准、已退回）
    : allLeaveHistory.filter(leave => leave.status === 'approved' || leave.status === 'rejected'); // 只顯示完成的記錄
  
  const handleClick = (leave: LeaveRequest) => {
    if (onClick) {
      onClick(leave);
    }
  };

  // Debug 資訊 - 顯示實際資料筆數
  console.log('📊 請假記錄 Debug 資訊:', {
    總記錄數: allLeaveHistory.length,
    顯示記錄數: displayLeaveHistory.length,
    記錄詳情: displayLeaveHistory.map(leave => ({
      id: leave.id,
      類型: leave.leave_type,
      狀態: leave.status,
      開始日期: leave.start_date,
      結束日期: leave.end_date
    }))
  });

  // 計算狀態分布
  const statusDistribution = displayLeaveHistory.reduce((acc, leave) => {
    acc[leave.status] = (acc[leave.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  return (
    <div className="space-y-3">
      {displayLeaveHistory.length === 0 ? (
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <p className="text-gray-600 font-medium">
            {showAll ? '尚無請假記錄' : '尚無已處理的請假記錄'}
          </p>
          <p className="text-gray-500 mt-1">
            {showAll ? '您的請假記錄將會顯示在這裡' : '已核准或已退回的請假記錄將會顯示在這裡'}
          </p>
          
          {/* Debug 資訊顯示 */}
          <div className="mt-4 p-3 bg-blue-50 rounded-lg text-left text-xs">
            <p className="font-semibold text-blue-800 mb-1">Debug 資訊：</p>
            <p className="text-blue-600">資料庫總記錄數：{allLeaveHistory.length}</p>
            <p className="text-blue-600">目前顯示模式：{showAll ? '全部記錄' : '已處理記錄'}</p>
            <p className="text-blue-600">顯示記錄數：{displayLeaveHistory.length}</p>
          </div>
        </div>
      ) : (
        <>
          {displayLeaveHistory.map((leave) => (
            <LeaveHistoryItem 
              key={leave.id} 
              leave={leave}
              onClick={handleClick} 
            />
          ))}
          
          {/* Debug 資訊顯示 */}
          <div className="mt-4 p-3 bg-blue-50 rounded-lg text-xs">
            <p className="font-semibold text-blue-800 mb-1">Debug 資訊：</p>
            <p className="text-blue-600">成功載入 {displayLeaveHistory.length} 筆請假記錄</p>
            {displayLeaveHistory.length > 0 && (
              <div className="text-blue-600">
                狀態分布：
                {Object.entries(statusDistribution).map(([status, count], index) => (
                  <span key={status}>
                    {index > 0 && ', '}
                    {status}: {count}筆
                  </span>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default LeaveHistory;
