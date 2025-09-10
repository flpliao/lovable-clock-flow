import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/useToast';
import {
  createMissedCheckInRequest,
  getMyPendingMissedCheckInRequests,
} from '@/services/missedCheckInRequestService';
import { format } from 'date-fns';
import { formatTimeString } from '@/utils/dateTimeUtils';
import React, { useState } from 'react';

interface MissedCheckinFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  date: Date;
  missedType: 'check_in' | 'check_out';
  scheduleStartTime?: string;
  scheduleEndTime?: string;
  onSuccess?: () => void;
}

const MissedCheckinFormDialog: React.FC<MissedCheckinFormDialogProps> = ({
  open,
  onOpenChange,
  date,
  missedType,
  scheduleStartTime,
  scheduleEndTime,
  onSuccess,
}) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [reason, setReason] = useState('');

  const dateStr = format(date, 'yyyy-MM-dd');
  const isCheckIn = missedType === 'check_in';
  // 確保時間格式為 HH:mm
  const defaultTime = isCheckIn
    ? formatTimeString(scheduleStartTime || '09:30')
    : formatTimeString(scheduleEndTime || '17:30');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

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
      toast({
        title: '提交失敗',
        description:
          (error as { response?: { data?: { message?: string } } })?.response?.data?.message ||
          '提交申請時發生錯誤，請稍後再試',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      onOpenChange(false);
      setReason('');
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md w-full rounded-2xl p-0 overflow-hidden">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold px-6 pt-6 pb-2">忘記打卡申請</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 px-6 pb-6 pt-2">
          {/* 申請日期 */}
          <div className="space-y-2">
            <Label htmlFor="request_date">申請日期</Label>
            <Input id="request_date" value={dateStr} disabled className="bg-gray-50" />
          </div>

          {/* 申請類型 */}
          <div className="space-y-2">
            <Label htmlFor="request_type">申請類型</Label>
            <Input
              id="request_type"
              value={isCheckIn ? '忘記上班打卡' : '忘記下班打卡'}
              disabled
              className="bg-gray-50"
            />
          </div>

          {/* 時間 */}
          <div className="space-y-2">
            <Label htmlFor="checked_at">時間</Label>
            <Input id="checked_at" value={defaultTime} disabled className="bg-gray-50" />
          </div>

          {/* 申請原因 */}
          <div className="space-y-2">
            <Label htmlFor="reason">申請原因 *</Label>
            <Textarea
              id="reason"
              value={reason}
              onChange={e => setReason(e.target.value)}
              placeholder="請說明忘記打卡的原因..."
              className="min-h-[80px]"
              required
            />
          </div>

          <DialogFooter className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={handleClose} disabled={loading}>
              取消
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? '提交中...' : '提交申請'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default MissedCheckinFormDialog;
