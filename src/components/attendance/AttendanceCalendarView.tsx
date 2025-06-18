
import React from 'react';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { CheckInRecord } from '@/types';
import DateRecordDetails from './DateRecordDetails';

interface AttendanceCalendarViewProps {
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
  selectedDateRecords: {
    checkIn?: CheckInRecord;
    checkOut?: CheckInRecord;
  };
  checkInRecords: CheckInRecord[];
}

const AttendanceCalendarView: React.FC<AttendanceCalendarViewProps> = ({
  date,
  setDate,
  selectedDateRecords,
  checkInRecords
}) => {
  const getDayRecordsCount = () => {
    if (!date) return 0;
    const selectedDateStr = format(date, 'yyyy-MM-dd');
    return checkInRecords.filter(record => {
      const recordDate = format(new Date(record.timestamp), 'yyyy-MM-dd');
      return recordDate === selectedDateStr && record.status === 'success';
    }).length;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-white/20 backdrop-blur-2xl rounded-2xl border border-white/30 shadow-lg p-6">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          className="mx-auto"
          captionLayout="buttons"
          formatters={{
            formatCaption: (date, options) => {
              return format(date, 'MMMM yyyy');
            },
          }}
        />
      </div>
      
      {date && (
        <div className="bg-white/20 backdrop-blur-2xl rounded-2xl border border-white/30 shadow-lg p-6">
          <DateRecordDetails
            date={date}
            selectedDateRecords={selectedDateRecords}
            recordsCount={getDayRecordsCount()}
          />
        </div>
      )}
    </div>
  );
};

export default AttendanceCalendarView;
