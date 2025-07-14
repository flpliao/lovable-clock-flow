import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckInRecord } from '@/types';
import { MissedCheckinRequest } from '@/types/missedCheckin';
import { formatTime } from '@/utils/checkInUtils';
import { format, isFuture, isWeekend } from 'date-fns';
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
  recordsCount,
  missedCheckinRecords = [],
  isInDialog = false,
}) => {
  const textClass = isInDialog ? 'text-gray-900' : 'text-gray-900';
  const subTextClass = isInDialog ? 'text-gray-600' : 'text-gray-500';
  const borderClass = isInDialog ? 'border-gray-200' : 'border-gray-100';

  const isWeekendDay = isWeekend(date);
  const isFutureDay = isFuture(date);
  const hasCheckIn = !!selectedDateRecords.checkIn;
  const hasCheckOut = !!selectedDateRecords.checkOut;

  const dateStr = format(date, 'yyyy-MM-dd');
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

  // 上班未打卡
  if (!isFutureDay && !isWeekendDay && !hasCheckIn) {
    const approvedCheckIn = approvedMissedRecords.find(
      r => r.missed_type === 'check_in' || r.missed_type === 'both'
    );
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
              {record.missed_type === 'check_in'
                ? '上班'
                : record.missed_type === 'check_out'
                  ? '下班'
                  : '上下班'}
              ）
            </div>
          </div>
        </div>
      );
    });
  }

  // 下班未打卡
  if (!isFutureDay && !isWeekendDay && !hasCheckOut) {
    const approvedCheckOut = approvedMissedRecords.find(
      r => r.missed_type === 'check_out' || r.missed_type === 'both'
    );
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
  if (!isFutureDay && !isWeekendDay) {
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
  }

  // 下班卡片
  if (!isFutureDay && !isWeekendDay) {
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
  }

  // 無下班卡片但有已核准的下班忘打卡
  if (!isFutureDay && !isWeekendDay && !hasCheckOut) {
    const approvedCheckOut = approvedMissedRecords.find(
      r => r.missed_type === 'check_out' || r.missed_type === 'both'
    );
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
  if (!isFutureDay && !isWeekendDay && !hasCheckIn) {
    const approvedCheckIn = approvedMissedRecords.find(
      r => r.missed_type === 'check_in' || r.missed_type === 'both'
    );
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

  // 未來或週末
  if (isFutureDay) {
    cards.push(
      <div
        key="future"
        className="bg-white/20 backdrop-blur-2xl rounded-2xl border border-white/30 shadow-lg p-6"
      >
        <span className="font-medium text-gray-900">未來日期</span>
      </div>
    );
  } else if (isWeekendDay) {
    cards.push(
      <div
        key="weekend"
        className="bg-white/20 backdrop-blur-2xl rounded-2xl border border-white/30 shadow-lg p-6"
      >
        <span className="font-medium text-gray-900">週末（非工作日）</span>
      </div>
    );
  }

  // 彈窗開啟時自動帶入日期與未打卡範圍
  const handleOpenMissedDialog = () => {
    const dateStr = format(date, 'yyyy-MM-dd');
    let missed_type: 'check_in' | 'check_out' | 'both' = 'check_in';
    let requested_check_in_time = '';
    let requested_check_out_time = '';
    if (!selectedDateRecords.checkIn && !selectedDateRecords.checkOut) {
      missed_type = 'both';
      requested_check_in_time = '09:30';
      requested_check_out_time = '17:30';
    } else if (!selectedDateRecords.checkIn) {
      missed_type = 'check_in';
      requested_check_in_time = '09:30';
    } else if (!selectedDateRecords.checkOut) {
      missed_type = 'check_out';
      requested_check_out_time = '17:30';
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

  return (
    <div>
      <div className="flex flex-col gap-6">{cards}</div>
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
                handleOpenMissedDialog();
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
              setMissedLoading(true);
              try {
                // 送出資料到 supabase
                const user = JSON.parse(localStorage.getItem('user') || '{}');
                const submitData: {
                  staff_id: string;
                  request_date: string;
                  missed_type: 'check_in' | 'check_out' | 'both';
                  reason: string;
                  requested_check_in_time?: string;
                  requested_check_out_time?: string;
                } = {
                  staff_id: user.id,
                  request_date: missedFormData.request_date,
                  missed_type: missedFormData.missed_type,
                  reason: missedFormData.reason,
                };
                if (
                  missedFormData.missed_type === 'check_in' ||
                  missedFormData.missed_type === 'both'
                ) {
                  if (missedFormData.requested_check_in_time) {
                    submitData.requested_check_in_time = `${missedFormData.request_date}T${missedFormData.requested_check_in_time}:00`;
                  }
                }
                if (
                  missedFormData.missed_type === 'check_out' ||
                  missedFormData.missed_type === 'both'
                ) {
                  if (missedFormData.requested_check_out_time) {
                    submitData.requested_check_out_time = `${missedFormData.request_date}T${missedFormData.requested_check_out_time}:00`;
                  }
                }
                await supabase.from('missed_checkin_requests').insert(submitData);
                setShowMissedDialog(false);
              } finally {
                setMissedLoading(false);
              }
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
