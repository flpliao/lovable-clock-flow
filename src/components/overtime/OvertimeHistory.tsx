
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Clock, Calendar, FileText, User } from 'lucide-react';
import { format } from 'date-fns';
import { useOvertimeManagementContext } from '@/contexts/OvertimeManagementContext';

const OvertimeHistory: React.FC = () => {
  const { getOvertimeHistory } = useOvertimeManagementContext();
  const overtimeHistory = getOvertimeHistory();

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-500/20 text-green-100 border-green-300/30">已批准</Badge>;
      case 'rejected':
        return <Badge className="bg-red-500/20 text-red-100 border-red-300/30">已拒絕</Badge>;
      case 'pending':
        return <Badge className="bg-orange-500/20 text-orange-100 border-orange-300/30">待審核</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  if (overtimeHistory.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-white/30 rounded-full flex items-center justify-center mx-auto mb-4">
          <Clock className="w-8 h-8 text-white/60" />
        </div>
        <p className="text-white font-medium drop-shadow-sm">尚無加班記錄</p>
        <p className="text-white/80 mt-1 font-medium drop-shadow-sm">您的加班申請記錄將顯示在這裡</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {overtimeHistory.map((overtime) => (
        <div key={overtime.id} className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6 hover:bg-white/15 transition-all duration-200">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex-1 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                  <Clock className="h-4 w-4 text-white" />
                </div>
                <div className="flex items-center gap-3">
                  <h3 className="text-white font-medium drop-shadow-sm">
                    加班申請 - {format(new Date(overtime.overtime_date), 'yyyy年MM月dd日')}
                  </h3>
                  {getStatusBadge(overtime.status)}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="flex items-center gap-2 text-white/80">
                  <Calendar className="h-4 w-4" />
                  <span>日期: {format(new Date(overtime.overtime_date), 'yyyy-MM-dd')}</span>
                </div>
                <div className="flex items-center gap-2 text-white/80">
                  <Clock className="h-4 w-4" />
                  <span>時間: {overtime.start_time} - {overtime.end_time}</span>
                </div>
                <div className="flex items-center gap-2 text-white/80">
                  <User className="h-4 w-4" />
                  <span>時數: {overtime.hours} 小時</span>
                </div>
              </div>

              {overtime.reason && (
                <div className="flex items-start gap-2 text-white/80 text-sm">
                  <FileText className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <span>原因: {overtime.reason}</span>
                </div>
              )}

              {overtime.rejection_reason && (
                <div className="bg-red-500/20 border border-red-300/30 rounded-lg p-3">
                  <p className="text-red-100 text-sm">
                    <strong>拒絕原因:</strong> {overtime.rejection_reason}
                  </p>
                </div>
              )}
            </div>

            <div className="text-white/60 text-xs">
              申請時間: {format(new Date(overtime.created_at), 'yyyy-MM-dd HH:mm')}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default OvertimeHistory;
