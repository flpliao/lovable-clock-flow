
import React, { useEffect } from 'react';
import { useOvertimeRequests } from '../hooks/useOvertimeRequests';
import { useUnifiedPermissions } from '@/hooks/useUnifiedPermissions';
import { OVERTIME_PERMISSIONS } from '@/components/staff/constants/permissions/overtimePermissions';
import ApplicationCard from './ApplicationCard';
import { Card, CardContent } from '@/components/ui/card';
import { Clock, Lock } from 'lucide-react';

const OvertimeApprovalTab: React.FC = () => {
  const { overtimeRequests, isLoading, loadOvertimeRequests, handleOvertimeApproval } = useOvertimeRequests();
  const { hasPermission } = useUnifiedPermissions();

  // 檢查是否有審核加班的權限
  const canApproveOvertime = hasPermission(OVERTIME_PERMISSIONS.APPROVE_OVERTIME_LEVEL_1);

  useEffect(() => {
    // 只有具備審核權限的用戶才載入待審核申請
    if (canApproveOvertime) {
      loadOvertimeRequests();
    }
  }, [loadOvertimeRequests, canApproveOvertime]);

  // 如果沒有審核權限，顯示權限不足提示
  if (!canApproveOvertime) {
    return (
      <div className="space-y-4">
        <Card>
          <CardContent className="p-8 text-center">
            <Lock className="h-16 w-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-700 mb-2">權限不足</h3>
            <p className="text-gray-500">
              您沒有審核加班申請的權限。如需申請相關權限，請聯繫系統管理員。
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-gray-100 rounded-lg p-4 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  if (overtimeRequests.length === 0) {
    return (
      <div className="text-center py-12">
        <Clock className="h-16 w-16 mx-auto text-gray-400 mb-4" />
        <h3 className="text-lg font-semibold text-gray-700 mb-2">暫無待審核申請</h3>
        <p className="text-gray-500">目前沒有需要審核的加班申請</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {overtimeRequests.map((request) => (
        <ApplicationCard
          key={request.id}
          application={{
            id: request.id,
            type: 'overtime',
            title: '加班申請',
            applicant: (request as any).staff?.name || '未知申請人',
            department: (request as any).staff?.department || '未知部門',
            date: request.overtime_date,
            status: request.status,
            reason: request.reason,
            details: {
              overtimeDate: request.overtime_date,
              startTime: request.start_time,
              endTime: request.end_time,
              hours: request.hours,
              overtimeType: request.overtime_type
            }
          }}
          onApprove={(comment) => handleOvertimeApproval(request.id, 'approve', comment)}
          onReject={(comment) => handleOvertimeApproval(request.id, 'reject', comment)}
        />
      ))}
    </div>
  );
};

export default OvertimeApprovalTab;
