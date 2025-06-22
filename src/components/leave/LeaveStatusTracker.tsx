
import React from 'react';
import { CheckCircle, Clock, XCircle, AlertCircle, User } from 'lucide-react';
import { LeaveRequest } from '@/types';
import { format } from 'date-fns';
import { getLeaveTypeText } from '@/utils/leaveUtils';

interface LeaveStatusTrackerProps {
  leaveRequest: LeaveRequest | null;
}

export function LeaveStatusTracker({ leaveRequest }: LeaveStatusTrackerProps) {
  if (!leaveRequest) {
    return (
      <div className="backdrop-blur-xl bg-white/20 border border-white/30 rounded-3xl shadow-xl p-6">
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-white/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <Clock className="w-8 h-8 text-white/60" />
          </div>
          <p className="text-white font-medium drop-shadow-sm">尚無待審核的請假申請</p>
          <p className="text-white/80 mt-1 font-medium drop-shadow-sm">您的申請狀態將顯示在這裡</p>
        </div>
      </div>
    );
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-300" />;
      case 'approved':
        return <CheckCircle className="h-5 w-5 text-green-300" />;
      case 'rejected':
        return <XCircle className="h-5 w-5 text-red-300" />;
      default:
        return <AlertCircle className="h-5 w-5 text-gray-300" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return '審核中';
      case 'approved':
        return '已核准';
      case 'rejected':
        return '已退回';
      default:
        return '未知狀態';
    }
  };

  const getStatusBg = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-500/20 border-yellow-300/30';
      case 'approved':
        return 'bg-green-500/20 border-green-300/30';
      case 'rejected':
        return 'bg-red-500/20 border-red-300/30';
      default:
        return 'bg-gray-500/20 border-gray-300/30';
    }
  };

  return (
    <div className="backdrop-blur-xl bg-white/20 border border-white/30 rounded-3xl shadow-xl p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
          <User className="h-5 w-5 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-white drop-shadow-md">申請狀態</h3>
          <p className="text-sm text-white/80 font-medium drop-shadow-sm">Leave Request Status</p>
        </div>
      </div>

      {/* 申請資訊 */}
      <div className="bg-white/10 rounded-2xl p-4 mb-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-white/70 font-medium mb-1">請假類型</p>
            <p className="text-white font-semibold">{getLeaveTypeText(leaveRequest.leave_type)}</p>
          </div>
          <div>
            <p className="text-sm text-white/70 font-medium mb-1">請假時數</p>
            <p className="text-white font-semibold">{leaveRequest.hours} 小時</p>
          </div>
          <div>
            <p className="text-sm text-white/70 font-medium mb-1">開始日期</p>
            <p className="text-white font-semibold">{format(new Date(leaveRequest.start_date), 'yyyy/MM/dd')}</p>
          </div>
          <div>
            <p className="text-sm text-white/70 font-medium mb-1">結束日期</p>
            <p className="text-white font-semibold">{format(new Date(leaveRequest.end_date), 'yyyy/MM/dd')}</p>
          </div>
        </div>
        
        {leaveRequest.reason && (
          <div className="mt-4 pt-4 border-t border-white/20">
            <p className="text-sm text-white/70 font-medium mb-1">請假原因</p>
            <p className="text-white">{leaveRequest.reason}</p>
          </div>
        )}
      </div>

      {/* 狀態顯示 */}
      <div className={`rounded-2xl p-4 border ${getStatusBg(leaveRequest.status)}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {getStatusIcon(leaveRequest.status)}
            <div>
              <p className="text-white font-semibold">{getStatusText(leaveRequest.status)}</p>
              <p className="text-white/70 text-sm">
                申請時間：{format(new Date(leaveRequest.created_at), 'yyyy/MM/dd HH:mm')}
              </p>
            </div>
          </div>
          
          {leaveRequest.status === 'pending' && (
            <div className="text-right">
              <p className="text-white/80 text-sm">等待主管審核</p>
              <p className="text-white/60 text-xs">預計 1-2 個工作天</p>
            </div>
          )}
        </div>

        {leaveRequest.rejection_reason && leaveRequest.status === 'rejected' && (
          <div className="mt-3 pt-3 border-t border-white/20">
            <p className="text-white/80 text-sm font-medium mb-1">退回原因：</p>
            <p className="text-white text-sm">{leaveRequest.rejection_reason}</p>
          </div>
        )}
      </div>
    </div>
  );
}
