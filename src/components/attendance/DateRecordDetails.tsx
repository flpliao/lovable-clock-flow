import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckInRecord } from '@/types';
import { MissedCheckinRequest } from '@/types/missedCheckin';
import { Schedule } from '@/services/scheduleService';
import { MissedCheckinValidationService } from '@/services/missedCheckinValidationService';
import { formatTime } from '@/utils/checkInUtils';
import { format, isFuture } from 'date-fns';
import { useCurrentUser } from '@/hooks/useStores';
import { useToast } from '@/hooks/use-toast';
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';
import MissedCheckinFormFields from '@/components/check-in/components/MissedCheckinFormFields';
import { supabase } from '@/integrations/supabase/client';
import type { MissedCheckinFormData } from '@/components/check-in/components/MissedCheckinFormFields';

interface DateRecordDetailsProps {
  date: Date;
  selectedDateRecords: {
    checkIn?: CheckInRecord;
    checkOut?: CheckInRecord;
  };
  recordsCount: number;
  missedCheckinRecords?: MissedCheckinRequest[];
  hasScheduleForDate: (date: string) => boolean;
  getScheduleForDate: (date: string) => Schedule | undefined;
  onDataRefresh?: () => Promise<void>;
  isInDialog?: boolean;
}

const Dot = ({ color }: { color: string }) => (
  <span
    style={{ backgroundColor: color }}
    className="inline-block w-2 h-2 rounded-full mr-2 align-middle"
  />
);

const DateRecordDetails: React.FC<DateRecordDetailsProps> = ({
  date,
  selectedDateRecords,
  missedCheckinRecords = [],
  hasScheduleForDate,
  getScheduleForDate,
  onDataRefresh,
}) => {
  const currentUser = useCurrentUser();
  const { toast } = useToast();
  const isFutureDay = isFuture(date);
  const dateStr = format(date, 'yyyy-MM-dd');
  const hasSchedule = hasScheduleForDate(dateStr);
  const schedule = getScheduleForDate(dateStr);
  const hasCheckIn = !!selectedDateRecords.checkIn;
  const hasCheckOut = !!selectedDateRecords.checkOut;

  const dayMissedRecords = missedCheckinRecords.filter(record => record.request_date === dateStr);
  const pendingMissedRecords = dayMissedRecords.filter(record => record.status === 'pending');
  const approvedMissedRecords = dayMissedRecords.filter(record => record.status === 'approved');

  const [openDialog, setOpenDialog] = useState<null | 'checkin' | 'checkout'>(null);
  const navigate = useNavigate();
  const [showMissedDialog, setShowMissedDialog] = useState(false);
  const [missedFormData, setMissedFormData] = useState<MissedCheckinFormData>({
    request_date: '',
    missed_type: 'check_in',
    requested_check_in_time: '',
    requested_check_out_time: '',
    reason: '',
  });
  const [missedLoading, setMissedLoading] = useState(false);

  // 卡片陣列
  const cards: React.ReactNode[] = [];

  // 如果是未來日期
  if (isFutureDay) {
    cards.push(
      <div
        key="future"
        className="bg-white/20 backdrop-blur-2xl rounded-2xl border border-white/30 shadow-lg p-6"
      >
        <span className="font-medium text-gray-900">未來日期</span>
      </div>
    );
  }
  // 如果沒有排班（休假）
  else if (!hasSchedule) {
    cards.push(
      <div
        key="holiday"
        className="bg-white/20 backdrop-blur-2xl rounded-2xl border border-white/30 shadow-lg p-6"
      >
        <span className="font-medium text-gray-900">休假日（無排班）</span>
      </div>
    );
  }
  // 有排班的工作日
  else {
    // 上班未打卡
    if (!hasCheckIn) {
      const approvedCheckIn = approvedMissedRecords.find(r => r.missed_type === 'check_in');
      if (!approvedCheckIn) {
        cards.push(
          <div
            key="no-checkin"
            className="bg-white/20 backdrop-blur-2xl rounded-2xl border border-white/30 shadow-lg p-6 cursor-pointer hover:bg-blue-100/40 transition"
            onClick={() => setOpenDialog('checkin')}
          >
            <div className="flex items-center justify-between w-full">
              <span className="flex items-center">
                <Dot color="#ef4444" />
                <span className="font-medium text-gray-900">上班未打卡</span>
              </span>
              <ChevronRight className="h-5 w-5 text-gray-900" />
            </div>
          </div>
        );
      }
    }

    // 忘打卡申請（簽核中）卡片
    if (pendingMissedRecords.length > 0) {
      pendingMissedRecords.forEach((record, idx) => {
        cards.push(
          <div
            key={`pending-missed-${idx}`}
            className="bg-white/20 backdrop-blur-2xl rounded-2xl border border-white/30 shadow-lg p-6"
          >
            <Dot color="#ef4444" />
            <div>
              <div className="font-medium text-gray-900">簽核中</div>
              <div className="text-xs text-gray-500 mt-1">
                忘打卡申請（
                {record.missed_type === 'check_in' ? '上班' : '下班'}）
              </div>
            </div>
          </div>
        );
      });
    }

    // 下班未打卡
    if (!hasCheckOut) {
      const approvedCheckOut = approvedMissedRecords.find(r => r.missed_type === 'check_out');
      if (!approvedCheckOut) {
        cards.push(
          <div
            key="no-checkout"
            className="bg-white/20 backdrop-blur-2xl rounded-2xl border border-white/30 shadow-lg p-6 cursor-pointer hover:bg-blue-100/40 transition"
            onClick={() => setOpenDialog('checkout')}
          >
            <div className="flex items-center justify-between w-full">
              <span className="flex items-center">
                <Dot color="#ef4444" />
                <span className="font-medium text-gray-900">下班未打卡</span>
              </span>
              <ChevronRight className="h-5 w-5 text-gray-900" />
            </div>
          </div>
        );
      }
    }

    // 上班卡片
    if (hasCheckIn) {
      cards.push(
        <div
          key="checkin"
          className="bg-white/20 backdrop-blur-2xl rounded-2xl border border-white/30 shadow-lg p-6"
        >
          <div className="flex items-center">
            <Dot color="#2563eb" />
            <span className="font-medium text-gray-900">上班</span>
            <span className="ml-auto text-gray-700 font-bold">
              {formatTime(selectedDateRecords.checkIn.timestamp)}
            </span>
          </div>
          <div className="text-xs text-gray-500 mt-1">
            {selectedDateRecords.checkIn.type === 'location'
              ? `其他-${selectedDateRecords.checkIn.details.locationName}-定位打卡`
              : `IP打卡 - ${selectedDateRecords.checkIn.details.ip}`}
          </div>
        </div>
      );
    }

    // 下班卡片
    if (hasCheckOut) {
      cards.push(
        <div
          key="checkout"
          className="bg-white/20 backdrop-blur-2xl rounded-2xl border border-white/30 shadow-lg p-6"
        >
          <div className="flex items-center">
            <Dot color="#2563eb" />
            <span className="font-medium text-gray-900">下班</span>
            <span className="ml-auto text-gray-700 font-bold">
              {formatTime(selectedDateRecords.checkOut.timestamp)}
            </span>
          </div>
          <div className="text-xs text-gray-500 mt-1">
            {selectedDateRecords.checkOut.type === 'location'
              ? `其他-${selectedDateRecords.checkOut.details.locationName}-定位打卡`
              : `IP打卡 - ${selectedDateRecords.checkOut.details.ip}`}
          </div>
        </div>
      );
    }

    // 無下班卡片但有已核准的下班忘打卡
    if (!hasCheckOut) {
      const approvedCheckOut = approvedMissedRecords.find(r => r.missed_type === 'check_out');
      if (approvedCheckOut) {
        cards.push(
          <div
            key="approved-missed-checkout"
            className="bg-white/20 backdrop-blur-2xl rounded-2xl border border-white/30 shadow-lg p-6"
          >
            <Dot color="#22d3ee" />
            <span className="font-medium text-gray-900">下班（忘打卡已核准）</span>
          </div>
        );
      }
    }

    // 無上班卡片但有已核准的上班忘打卡
    if (!hasCheckIn) {
      const approvedCheckIn = approvedMissedRecords.find(r => r.missed_type === 'check_in');
      if (approvedCheckIn) {
        cards.push(
          <div
            key="approved-missed-checkin"
            className="bg-white/20 backdrop-blur-2xl rounded-2xl border border-white/30 shadow-lg p-6"
          >
            <Dot color="#22d3ee" />
            <span className="font-medium text-gray-900">上班（忘打卡已核准）</span>
          </div>
        );
      }
    }
  }

  // 彈窗開啟時自動帶入日期與未打卡範圍
  const handleOpenMissedDialog = (missedType?: 'check_in' | 'check_out') => {
    const dateStr = format(date, 'yyyy-MM-dd');

    // 根據傳入的類型或當前狀態決定忘打卡類型
    let missed_type: 'check_in' | 'check_out' = 'check_in';
    let requested_check_in_time = '';
    let requested_check_out_time = '';

    // 格式化時間字符串，確保符合 HH:mm 格式
    const formatTimeString = (timeStr: string) => {
      if (!timeStr) return '';
      // 移除可能的秒數部分，只保留 HH:mm
      const timeParts = timeStr.split(':');
      if (timeParts.length >= 2) {
        const hours = timeParts[0].padStart(2, '0');
        const minutes = timeParts[1].padStart(2, '0');
        return `${hours}:${minutes}`;
      }
      return timeStr;
    };

    if (missedType) {
      // 如果指定了類型，使用指定的類型
      missed_type = missedType;
      if (missedType === 'check_in') {
        requested_check_in_time = formatTimeString(schedule?.start_time || '09:30');
      } else {
        requested_check_out_time = formatTimeString(schedule?.end_time || '17:30');
      }
    } else {
      // 原本的邏輯：根據現有記錄判斷
      if (!selectedDateRecords.checkIn) {
        missed_type = 'check_in';
        requested_check_in_time = formatTimeString(schedule?.start_time || '09:30');
      } else if (!selectedDateRecords.checkOut) {
        missed_type = 'check_out';
        requested_check_out_time = formatTimeString(schedule?.end_time || '17:30');
      }
    }

    setMissedFormData({
      request_date: dateStr,
      missed_type,
      requested_check_in_time,
      requested_check_out_time,
      reason: '',
    });
    setShowMissedDialog(true);
  };

  const handleSubmitMissedCheckin = async (formData: MissedCheckinFormData) => {
    if (!currentUser?.id) {
      console.error('無法獲取用戶ID');
      toast({
        title: '提交失敗',
        description: '無法獲取用戶資訊，請重新登入',
        variant: 'destructive',
      });
      return;
    }

    // 驗證必填欄位
    if (!formData.reason.trim()) {
      toast({
        title: '提交失敗',
        description: '請填寫申請原因',
        variant: 'destructive',
      });
      return;
    }

    if (formData.missed_type === 'check_in' && !formData.requested_check_in_time) {
      toast({
        title: '提交失敗',
        description: '請選擇上班時間',
        variant: 'destructive',
      });
      return;
    }

    if (formData.missed_type === 'check_out' && !formData.requested_check_out_time) {
      toast({
        title: '提交失敗',
        description: '請選擇下班時間',
        variant: 'destructive',
      });
      return;
    }

    setMissedLoading(true);
    try {
      // 檢查是否已有重複申請
      const validationResult = await MissedCheckinValidationService.checkDuplicateRequest(
        currentUser.id,
        formData.request_date,
        formData.missed_type
      );

      if (!validationResult.canSubmit) {
        toast({
          title: '無法提交申請',
          description: validationResult.errorMessage,
          variant: 'destructive',
        });
        return;
      }

      // 驗證和格式化時間
      let formattedCheckInTime = null;
      let formattedCheckOutTime = null;

      if (formData.requested_check_in_time) {
        const checkInTimeStr = `${formData.request_date}T${formData.requested_check_in_time}:00`;
        const checkInDate = new Date(checkInTimeStr);
        if (isNaN(checkInDate.getTime())) {
          throw new Error('上班時間格式不正確');
        }
        formattedCheckInTime = checkInDate.toISOString();
      }

      if (formData.requested_check_out_time) {
        const checkOutTimeStr = `${formData.request_date}T${formData.requested_check_out_time}:00`;
        const checkOutDate = new Date(checkOutTimeStr);
        if (isNaN(checkOutDate.getTime())) {
          throw new Error('下班時間格式不正確');
        }
        formattedCheckOutTime = checkOutDate.toISOString();
      }

      const { error } = await supabase.from('missed_checkin_requests').insert([
        {
          staff_id: currentUser.id,
          request_date: formData.request_date,
          missed_type: formData.missed_type,
          requested_check_in_time: formattedCheckInTime,
          requested_check_out_time: formattedCheckOutTime,
          reason: formData.reason,
        },
      ]);

      if (error) {
        console.error('Supabase 錯誤:', error);
        throw new Error(error.message || '資料庫操作失敗');
      }

      // 提交成功
      toast({
        title: '申請已提交',
        description: `忘打卡申請已成功提交，等待主管審核`,
      });

      setShowMissedDialog(false);

      // 重新載入資料
      if (onDataRefresh) {
        await onDataRefresh();
      }
    } catch (error) {
      console.error('提交忘打卡申請失敗:', error);
      toast({
        title: '提交失敗',
        description: error instanceof Error ? error.message : '未知錯誤，請稍後再試',
        variant: 'destructive',
      });
    } finally {
      setMissedLoading(false);
    }
  };

  return (
    <div className="space-y-3">
      {cards.length > 0 ? (
        cards.map((card, index) => <React.Fragment key={index}>{card}</React.Fragment>)
      ) : (
        <div className="bg-white/20 backdrop-blur-2xl rounded-2xl border border-white/30 shadow-lg p-6">
          <span className="font-medium text-gray-900">無相關記錄</span>
        </div>
      )}

      {/* 忘打卡申請彈窗 */}
      <Dialog
        open={!!openDialog}
        onOpenChange={v => {
          if (!v) {
            setOpenDialog(null);
          }
        }}
      >
        <DialogContent className="max-w-md w-full rounded-t-2xl rounded-2xl p-0 overflow-hidden">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold px-6 pt-6 pb-2">
              {openDialog === 'checkin' ? '上班未打卡' : '下班未打卡'}
            </DialogTitle>
          </DialogHeader>
          <div className="border-t border-gray-200" />
          <div className="flex flex-col divide-y divide-gray-100">
            <button
              className="w-full text-left px-6 py-4 bg-transparent hover:bg-gray-100 focus:bg-gray-100 text-base"
              onClick={() => {
                navigate('/leave-request');
                setOpenDialog(null);
              }}
              type="button"
            >
              請假
            </button>
            <button
              className="w-full text-left px-6 py-4 bg-transparent hover:bg-gray-100 focus:bg-gray-100 text-base"
              onClick={() => {
                setOpenDialog(null);
                // 根據當前的 openDialog 狀態傳遞對應的類型
                const missedType = openDialog === 'checkin' ? 'check_in' : 'check_out';
                handleOpenMissedDialog(missedType);
              }}
              type="button"
            >
              忘打卡申請
            </button>
          </div>
          <DialogFooter className="flex justify-end px-6 py-4 border-t border-gray-200">
            <DialogClose asChild>
              <Button variant="outline" type="button">
                取消
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 忘打卡申請自訂 Dialog */}
      <Dialog
        open={showMissedDialog}
        onOpenChange={v => {
          if (!v) setShowMissedDialog(false);
        }}
      >
        <DialogContent className="max-w-md w-full rounded-t-2xl rounded-2xl p-0 overflow-hidden">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold px-6 pt-6 pb-2">忘記打卡申請</DialogTitle>
          </DialogHeader>
          <form
            className="space-y-4 px-6 pb-6 pt-2"
            onSubmit={async e => {
              e.preventDefault();
              await handleSubmitMissedCheckin(missedFormData);
            }}
          >
            <MissedCheckinFormFields
              formData={missedFormData}
              onFormDataChange={updates => setMissedFormData(prev => ({ ...prev, ...updates }))}
            />
            <div className="flex justify-end space-x-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowMissedDialog(false)}
                disabled={missedLoading}
              >
                取消
              </Button>
              <Button type="submit" disabled={missedLoading}>
                {missedLoading ? '提交中...' : '提交申請'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DateRecordDetails;
