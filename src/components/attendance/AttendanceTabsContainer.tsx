
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, History } from 'lucide-react';
import CheckInHistory from '@/components/CheckInHistory';
import AttendanceCalendarView from '@/components/attendance/AttendanceCalendarView';
import { CheckInRecord } from '@/types';

interface AttendanceTabsContainerProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
  selectedDateRecords: {
    checkIn?: CheckInRecord;
    checkOut?: CheckInRecord;
  };
  checkInRecords: CheckInRecord[];
}

const AttendanceTabsContainer: React.FC<AttendanceTabsContainerProps> = ({
  activeTab,
  setActiveTab,
  date,
  setDate,
  selectedDateRecords,
  checkInRecords
}) => {
  return (
    <div className="space-y-6">
      {/* 標題 */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-blue-500/80 rounded-xl flex items-center justify-center shadow-lg">
          <Calendar className="h-5 w-5 text-white" />
        </div>
        <h2 className="text-xl font-semibold text-white drop-shadow-md">考勤記錄</h2>
      </div>
      
      {/* 標籤和內容 */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-white/30 backdrop-blur-xl rounded-2xl border border-white/40 p-1 shadow-lg h-14">
          <TabsTrigger 
            value="history" 
            className="text-gray-800 data-[state=active]:bg-white/50 data-[state=active]:text-gray-900 data-[state=active]:shadow-lg rounded-xl font-semibold transition-all duration-300 py-3 px-6 text-base data-[state=active]:backdrop-blur-xl flex items-center gap-2"
          >
            <History className="h-4 w-4" />
            打卡歷史
          </TabsTrigger>
          <TabsTrigger 
            value="calendar" 
            className="text-gray-800 data-[state=active]:bg-white/50 data-[state=active]:text-gray-900 data-[state=active]:shadow-lg rounded-xl font-semibold transition-all duration-300 py-3 px-6 text-base data-[state=active]:backdrop-blur-xl flex items-center gap-2"
          >
            <Calendar className="h-4 w-4" />
            月曆視圖
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="history" className="mt-6">
          <CheckInHistory />
        </TabsContent>
        
        <TabsContent value="calendar" className="mt-6">
          <AttendanceCalendarView
            date={date}
            setDate={setDate}
            selectedDateRecords={selectedDateRecords}
            checkInRecords={checkInRecords}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AttendanceTabsContainer;
