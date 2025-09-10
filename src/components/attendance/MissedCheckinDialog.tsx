import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/useToast';
import {
  createMissedCheckInRequest,
  getMyPendingMissedCheckInRequests,
} from '@/services/missedCheckInRequestService';
import { format } from 'date-fns';
import { formatTimeString } from '@/utils/dateTimeUtils';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface MissedCheckinDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  date: Date;
  missedType: 'check_in' | 'check_out';
  scheduleStartTime?: string;
  scheduleEndTime?: string;
  onSuccess?: () => void;
}

const MissedCheckinDialog: React.FC<MissedCheckinDialogProps> = ({
  open,
  onOpenChange,
  date,
  missedType,
  scheduleStartTime,
  scheduleEndTime,
  onSuccess,
}) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [reason, setReason] = useState('');

  const dateStr = format(date, 'yyyy-MM-dd');
  const isCheckIn = missedType === 'check_in';
  const defaultTime = isCheckIn
    ? formatTimeString(scheduleStartTime || '09:30')
    : formatTimeString(scheduleEndTime || '17:30');

  const _handleSubmit = async () => {
    if (!reason.trim()) {
      toast({
        title: '提交失敗',
        description: '請填寫申請原因',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    try {
      // 檢查重複申請
      const pendingRequests = await getMyPendingMissedCheckInRequests();
      const hasDuplicate = pendingRequests.some(
        request => request.request_date === dateStr && request.request_type === missedType
      );

      if (hasDuplicate) {
        toast({
          title: '無法提交申請',
          description: '該日期已有相同類型的待審核申請',
          variant: 'destructive',
        });
        return;
      }

      // 提交申請
      await createMissedCheckInRequest({
        request_date: dateStr,
        request_type: missedType,
        check_in_time: missedType === 'check_in' ? defaultTime : undefined,
        check_out_time: missedType === 'check_out' ? defaultTime : undefined,
        reason: reason.trim(),
      });

      toast({
        title: '申請已提交',
        description: '忘打卡申請已成功提交，等待主管審核',
      });

      onOpenChange(false);
      setReason('');
      onSuccess?.();
    } catch (error: unknown) {
      console.error('提交忘打卡申請失敗:', error);
      const errorMessage =
        error && typeof error === 'object' && 'response' in error
          ? (error as { response?: { data?: { message?: string } } }).response?.data?.message
          : '提交申請時發生錯誤，請稍後再試';
      toast({
        title: '提交失敗',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLeaveRequest = () => {
    onOpenChange(false);
    navigate('/leave-request');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md w-full rounded-2xl p-0 overflow-hidden">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold px-6 pt-6 pb-2">
            {isCheckIn ? '上班未打卡' : '下班未打卡'}
          </DialogTitle>
        </DialogHeader>

        <div className="border-t border-gray-200" />

        <div className="flex flex-col divide-y divide-gray-100">
          <button
            className="w-full text-left px-6 py-4 bg-transparent hover:bg-gray-100 focus:bg-gray-100 text-base"
            onClick={handleLeaveRequest}
            type="button"
          >
            請假
          </button>
          <button
            className="w-full text-left px-6 py-4 bg-transparent hover:bg-gray-100 focus:bg-gray-100 text-base"
            onClick={() => {
              // 這裡可以打開忘打卡申請表單
              // 暫時先關閉對話框
              onOpenChange(false);
            }}
            type="button"
          >
            忘打卡申請
          </button>
        </div>

        <DialogFooter className="flex justify-end px-6 py-4 border-t border-gray-200">
          <DialogClose asChild>
            <Button variant="outline" type="button" disabled={loading}>
              取消
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default MissedCheckinDialog;
