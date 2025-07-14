import { CheckInRecord } from '@/types';
import { MissedCheckinRequest } from '@/types/missedCheckin';
import { formatTime } from '@/utils/checkInUtils';
import { format, isFuture, isWeekend } from 'date-fns';
import React from 'react';

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

  // 卡片陣列
  const cards: React.ReactNode[] = [];

  // 上班未打卡
  if (!isFutureDay && !isWeekendDay && !hasCheckIn) {
    // 檢查是否有已核准的上班忘打卡
    const approvedCheckIn = approvedMissedRecords.find(
      r => r.missed_type === 'check_in' || r.missed_type === 'both'
    );
    if (!approvedCheckIn) {
      cards.push(
        <div
          key="no-checkin"
          className="bg-white/20 backdrop-blur-2xl rounded-2xl border border-white/30 shadow-lg p-6"
        >
          <Dot color="#ef4444" />
          <span className="font-medium text-gray-900">上班未打卡</span>
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
    // 檢查是否有已核准的下班忘打卡
    const approvedCheckOut = approvedMissedRecords.find(
      r => r.missed_type === 'check_out' || r.missed_type === 'both'
    );
    if (!approvedCheckOut) {
      cards.push(
        <div
          key="no-checkout"
          className="bg-white/20 backdrop-blur-2xl rounded-2xl border border-white/30 shadow-lg p-6"
        >
          <Dot color="#ef4444" />
          <span className="font-medium text-gray-900">下班未打卡</span>
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

  return (
    <div>
      <div className="flex flex-col gap-6">{cards}</div>
    </div>
  );
};

export default DateRecordDetails;
