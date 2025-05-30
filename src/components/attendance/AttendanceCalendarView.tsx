
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
    <div className="flex flex-col md:flex-row gap-6">
      <div className="md:w-1/2">
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
      
      <div className="md:w-1/2">
        {date && (
          <DateRecordDetails
            date={date}
            selectedDateRecords={selectedDateRecords}
            recordsCount={getDayRecordsCount()}
          />
        )}
      </div>
    </div>
  );
};

export default AttendanceCalendarView;
