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
import { RequestType } from '@/constants/checkInTypes';
import { format, isFuture } from 'date-fns';
import { ChevronRight } from 'lucide-react';
import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import MissedCheckInDialog from '@/components/check-in/MissedCheckInDialog';
import dayjs from 'dayjs';

interface DateRecordDetailsProps {
  date: Date;
  selectedDateRecords: {
    checkIn?: CheckInRecord;
    checkOut?: CheckInRecord;
  };
  recordsCount: number;
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
  hasScheduleForDate,
  getScheduleForDate,
  onDataRefresh,
}) => {
  const isFutureDay = isFuture(date);
  const dateStr = format(date, 'yyyy-MM-dd');
  const hasSchedule = hasScheduleForDate(dateStr);
  const schedule = getScheduleForDate(dateStr);
  const { checkIn: checkInRecord, checkOut: checkOutRecord } = selectedDateRecords;
  const hasCheckIn = !!checkInRecord;
  const hasCheckOut = !!checkOutRecord;

  const [openDialog, setOpenDialog] = useState<null | 'checkin' | 'checkout'>(null);
  const navigate = useNavigate();
  const [showMissedFormDialog, setShowMissedFormDialog] = useState(false);
  const [missedType, setMissedType] = useState<RequestType>(RequestType.CHECK_IN);

  // 提取時間判斷邏輯
  const timeValidation = useMemo(() => {
    const today = new Date();
    const isToday = today.toDateString() === date.toDateString();
    const now = new Date();

    const shouldCheckTime = (timeStr: string | undefined) => {
      if (!timeStr) return false;
      if (isToday) {
        const [hour, minute] = timeStr.split(':').map(Number);
        const workTime = new Date();
        workTime.setHours(hour, minute, 0, 0);
        return now > workTime;
      }
      return true; // 過去日期一定要檢查
    };

    return {
      shouldCheckIn: shouldCheckTime(schedule?.start_time),
      shouldCheckOut: shouldCheckTime(schedule?.end_time),
    };
  }, [date, schedule]);

  // 提取打卡狀態判斷邏輯
  const checkStatus = useMemo(() => {
    const isApprovedMissedCheckIn =
      checkInRecord?.source === 'missed_check_in' && checkInRecord?.approval_status === 'approved';
    const isApprovedMissedCheckOut =
      checkOutRecord?.source === 'missed_check_in' &&
      checkOutRecord?.approval_status === 'approved';
    const isPendingMissedCheckIn =
      checkInRecord?.source === 'missed_check_in' && checkInRecord?.approval_status === 'pending';
    const isPendingMissedCheckOut =
      checkOutRecord?.source === 'missed_check_in' && checkOutRecord?.approval_status === 'pending';

    return {
      isApprovedMissedCheckIn,
      isApprovedMissedCheckOut,
      isPendingMissedCheckIn,
      isPendingMissedCheckOut,
      hasValidCheckIn: hasCheckIn && checkInRecord?.status === 'success',
      hasValidCheckOut: hasCheckOut && checkOutRecord?.status === 'success',
    };
  }, [checkInRecord, checkOutRecord, hasCheckIn, hasCheckOut]);

  // 共用卡片生成函數
  const createCard = (
    key: string,
    content: React.ReactNode,
    onClick?: () => void,
    className?: string
  ) => (
    <div
      key={key}
      className={`bg-white/20 backdrop-blur-2xl rounded-2xl border border-white/30 shadow-lg p-6 ${
        onClick ? 'cursor-pointer hover:bg-blue-100/40 transition' : ''
      } ${className || ''}`}
      onClick={onClick}
    >
      {content}
    </div>
  );

  const createStatusCard = (title: string, subtitle?: string, color = '#ef4444') => (
    <div className="flex items-center">
      <Dot color={color} />
      <span className="font-medium text-gray-900">{title}</span>
      {subtitle && <div className="text-xs text-gray-500 mt-1 ml-2">{subtitle}</div>}
    </div>
  );

  const createCheckRecordCard = (
    record: CheckInRecord,
    type: 'checkin' | 'checkout',
    isApprovedMissed: boolean
  ) => (
    <div className="flex items-center">
      <Dot color="#2563eb" />
      <span className="font-medium text-gray-900">
        {isApprovedMissed
          ? `${type === 'checkin' ? '上班' : '下班'}（忘打卡已核准）`
          : type === 'checkin'
            ? '上班'
            : '下班'}
      </span>
      <span className="ml-auto text-gray-700 font-bold">
        {dayjs(record.checked_at).format('HH:mm:ss')}
      </span>
    </div>
  );

  const createCheckRecordSubtitle = (record: CheckInRecord) => (
    <div className="text-xs text-gray-500 mt-1">
      {record.method === 'location'
        ? `定位打卡-${record.location_name || '未知位置'}`
        : `IP打卡 - ${record.ip_address}`}
    </div>
  );

  // 生成卡片陣列
  const cards = useMemo(() => {
    const cardList: React.ReactNode[] = [];

    // 未來日期
    if (isFutureDay) {
      cardList.push(createCard('future', createStatusCard('未來日期')));
      return cardList;
    }

    // 休假日
    if (!hasSchedule) {
      cardList.push(createCard('holiday', createStatusCard('休假日（無排班）')));
      return cardList;
    }

    // 有排班的工作日
    const {
      isApprovedMissedCheckIn,
      isApprovedMissedCheckOut,
      isPendingMissedCheckIn,
      isPendingMissedCheckOut,
      hasValidCheckIn,
      hasValidCheckOut,
    } = checkStatus;

    // 上班未打卡
    if (!hasValidCheckIn && !isApprovedMissedCheckIn && timeValidation.shouldCheckIn) {
      cardList.push(
        createCard(
          'no-checkin',
          <div className="flex items-center justify-between w-full">
            {createStatusCard('上班未打卡')}
            <ChevronRight className="h-5 w-5 text-gray-900" />
          </div>,
          () => setOpenDialog('checkin')
        )
      );
    }

    // 下班未打卡
    if (!hasValidCheckOut && !isApprovedMissedCheckOut && timeValidation.shouldCheckOut) {
      cardList.push(
        createCard(
          'no-checkout',
          <div className="flex items-center justify-between w-full">
            {createStatusCard('下班未打卡')}
            <ChevronRight className="h-5 w-5 text-gray-900" />
          </div>,
          () => setOpenDialog('checkout')
        )
      );
    }

    // 忘打卡申請（簽核中）
    if (isPendingMissedCheckIn) {
      cardList.push(
        createCard(
          'pending-missed-checkin',
          <div>
            {createStatusCard('簽核中')}
            <div className="text-xs text-gray-500 mt-1">忘打卡申請（上班）</div>
          </div>
        )
      );
    }

    if (isPendingMissedCheckOut) {
      cardList.push(
        createCard(
          'pending-missed-checkout',
          <div>
            {createStatusCard('簽核中')}
            <div className="text-xs text-gray-500 mt-1">忘打卡申請（下班）</div>
          </div>
        )
      );
    }

    // 上班記錄
    if (
      hasValidCheckIn &&
      checkInRecord &&
      (checkInRecord.source === 'normal' || isApprovedMissedCheckIn)
    ) {
      cardList.push(
        createCard(
          'checkin',
          <div>
            {createCheckRecordCard(checkInRecord, 'checkin', isApprovedMissedCheckIn)}
            {createCheckRecordSubtitle(checkInRecord)}
          </div>
        )
      );
    }

    // 下班記錄
    if (
      hasValidCheckOut &&
      checkOutRecord &&
      (checkOutRecord.source === 'normal' || isApprovedMissedCheckOut)
    ) {
      cardList.push(
        createCard(
          'checkout',
          <div>
            {createCheckRecordCard(checkOutRecord, 'checkout', isApprovedMissedCheckOut)}
            {createCheckRecordSubtitle(checkOutRecord)}
          </div>
        )
      );
    }

    return cardList.length > 0
      ? cardList
      : [createCard('no-records', createStatusCard('無相關記錄'))];
  }, [isFutureDay, hasSchedule, checkStatus, timeValidation, checkInRecord, checkOutRecord]);

  // 處理忘打卡申請
  const handleMissedCheckinRequest = (type: RequestType) => {
    setMissedType(type);
    setShowMissedFormDialog(true);
  };

  return (
    <div className="space-y-3">
      {cards.map((card, index) => (
        <div key={index}>{card}</div>
      ))}

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
                const missedType =
                  openDialog === 'checkin' ? RequestType.CHECK_IN : RequestType.CHECK_OUT;
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
      <MissedCheckInDialog
        type={missedType}
        defaultDate={date}
        scheduleStartTime={schedule?.start_time}
        scheduleEndTime={schedule?.end_time}
        open={showMissedFormDialog}
        onOpenChange={setShowMissedFormDialog}
        showTrigger={false}
        onSubmit={() => {
          setShowMissedFormDialog(false);
          onDataRefresh();
        }}
      />
    </div>
  );
};

export default DateRecordDetails;
