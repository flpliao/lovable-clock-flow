import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Schedule } from '@/services/scheduleService';
import { CheckInRecord } from '@/types';
import { MissedCheckinRequest } from '@/services/missedCheckinService';
import { format, isFuture } from 'date-fns';
import { ChevronRight } from 'lucide-react';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MissedCheckinFormDialog from './MissedCheckinFormDialog';
import dayjs from 'dayjs';

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
  const [showMissedFormDialog, setShowMissedFormDialog] = useState(false);
  const [missedType, setMissedType] = useState<'check_in' | 'check_out'>('check_in');

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
    if (!hasCheckIn || (hasCheckIn && selectedDateRecords.checkIn.status === 'failed')) {
      const approvedCheckIn = approvedMissedRecords.find(r => r.request_type === 'check_in');
      if (!approvedCheckIn) {
        // 重新設計異常判斷邏輯 - 檢查是否需要檢查上班記錄
        const today = new Date();
        const isToday = today.toDateString() === date.toDateString();
        const now = new Date();

        const shouldCheckIn = (() => {
          if (isToday) {
            // 當天：只有當前時間超過上班時間時才需要檢查
            if (!schedule?.start_time) return false;
            const [startHour, startMinute] = schedule.start_time.split(':').map(Number);
            const workStartTime = new Date();
            workStartTime.setHours(startHour, startMinute, 0, 0);
            return now > workStartTime;
          } else {
            // 過去日期：一定要有上班記錄
            return true;
          }
        })();

        if (shouldCheckIn) {
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
                {record.request_type === 'check_in' ? '上班' : '下班'}）
              </div>
            </div>
          </div>
        );
      });
    }

    // 下班未打卡
    if (!hasCheckOut) {
      const approvedCheckOut = approvedMissedRecords.find(r => r.request_type === 'check_out');
      if (!approvedCheckOut) {
        // 重新設計異常判斷邏輯 - 檢查是否需要檢查下班記錄
        const today = new Date();
        const isToday = today.toDateString() === date.toDateString();
        const now = new Date();

        const shouldCheckOut = (() => {
          if (isToday) {
            // 當天：只有當前時間超過下班時間時才需要檢查
            if (!schedule?.end_time) return false;
            const [endHour, endMinute] = schedule.end_time.split(':').map(Number);
            const workEndTime = new Date();
            workEndTime.setHours(endHour, endMinute, 0, 0);
            return now > workEndTime;
          } else {
            // 過去日期：一定要有下班記錄
            return true;
          }
        })();

        if (shouldCheckOut) {
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
    }

    // 上班卡片
    if (hasCheckIn && selectedDateRecords.checkIn.status === 'success') {
      cards.push(
        <div
          key="checkin"
          className="bg-white/20 backdrop-blur-2xl rounded-2xl border border-white/30 shadow-lg p-6"
        >
          <div className="flex items-center">
            <Dot color="#2563eb" />
            <span className="font-medium text-gray-900">上班</span>
            <span className="ml-auto text-gray-700 font-bold">
              {dayjs(selectedDateRecords.checkIn.checked_at).format('HH:mm:ss')}
            </span>
          </div>
          <div className="text-xs text-gray-500 mt-1">
            {selectedDateRecords.checkIn.method === 'location'
              ? `定位打卡-${selectedDateRecords.checkIn.location_name || '未知位置'}`
              : `IP打卡 - ${selectedDateRecords.checkIn.ip_address}`}
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
              {dayjs(selectedDateRecords.checkOut.checked_at).format('HH:mm:ss')}
            </span>
          </div>
          <div className="text-xs text-gray-500 mt-1">
            {selectedDateRecords.checkOut.method === 'location'
              ? `定位打卡-${selectedDateRecords.checkOut.location_name || '未知位置'}`
              : `IP打卡 - ${selectedDateRecords.checkOut.ip_address}`}
          </div>
        </div>
      );
    }

    // 無下班卡片但有已核准的下班忘打卡
    if (!hasCheckOut) {
      const approvedCheckOut = approvedMissedRecords.find(r => r.request_type === 'check_out');
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
      const approvedCheckIn = approvedMissedRecords.find(r => r.request_type === 'check_in');
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

  // 處理忘打卡申請
  const handleMissedCheckinRequest = (type: 'check_in' | 'check_out') => {
    setMissedType(type);
    setShowMissedFormDialog(true);
  };

  return (
    <div className="space-y-3">
      {cards.length > 0 ? (
        cards.map((card, index) => <div key={index}>{card}</div>)
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
                handleMissedCheckinRequest(missedType);
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

      {/* 忘打卡申請表單彈窗 */}
      <MissedCheckinFormDialog
        open={showMissedFormDialog}
        onOpenChange={setShowMissedFormDialog}
        date={date}
        missedType={missedType}
        scheduleStartTime={schedule?.start_time}
        scheduleEndTime={schedule?.end_time}
        onSuccess={onDataRefresh}
      />
    </div>
  );
};

export default DateRecordDetails;
