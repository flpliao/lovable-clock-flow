import { LeaveRequestStatus } from '@/constants/leave';
import { useMyLeaveRequest } from '@/hooks/useMyLeaveRequest';
import { useMyLeaveRequestsStore } from '@/stores/leaveRequestStore';
import { LeaveRequest } from '@/types/leaveRequest';
import { useEffect, useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../ui/alert-dialog';
import LeaveRequestItem from './LeaveRequestItem';

export function MyPendingLeaveRequestsList() {
  const { isLoading, loadMyLeaveRequests, handleCancelMyLeaveRequest } = useMyLeaveRequest();
  const getRequestByStatus = useMyLeaveRequestsStore(state => state.getRequestsByStatus);

  // 共享的確認對話框狀態
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const [pendingCancelSlug, setPendingCancelSlug] = useState<string | null>(null);

  useEffect(() => {
    loadMyLeaveRequests();
  }, [loadMyLeaveRequests]);

  // 篩選出待審核的請假申請
  const pendingRequests = getRequestByStatus(LeaveRequestStatus.PENDING);

  // 處理取消請假申請的點擊
  const handleCancelClick = (slug: string) => {
    setPendingCancelSlug(slug);
    setShowCancelDialog(true);
  };

  // 處理確認取消
  const handleConfirmCancel = async () => {
    if (!pendingCancelSlug) return;

    setIsCancelling(true);
    const success = await handleCancelMyLeaveRequest(pendingCancelSlug);
    if (success) {
      setShowCancelDialog(false);
      setPendingCancelSlug(null);
    }
    setIsCancelling(false);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        <span className="ml-2 text-white">載入中...</span>
      </div>
    );
  }

  if (pendingRequests.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-white/30 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg
            className="w-8 h-8 text-white/60"
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
        <p className="text-white font-medium drop-shadow-sm">尚無待審核的請假申請</p>
        <p className="text-white/80 mt-1 font-medium drop-shadow-sm">
          您可以在申請請假頁面提交新的請假申請
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-3">
        {pendingRequests.map((leaveRequest: LeaveRequest) => (
          <LeaveRequestItem
            key={leaveRequest.slug}
            leaveRequest={leaveRequest}
            onCancel={handleCancelClick}
          />
        ))}
      </div>

      {/* 共享的取消確認對話框 */}
      <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>確認取消請假申請</AlertDialogTitle>
            <AlertDialogDescription>
              您確定要取消這筆請假申請嗎？取消後將無法恢復，需要重新申請。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isCancelling}>取消</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmCancel}
              disabled={isCancelling}
              className="bg-red-500 hover:bg-red-600"
            >
              {isCancelling ? '取消中...' : '確定'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

export default MyPendingLeaveRequestsList;
