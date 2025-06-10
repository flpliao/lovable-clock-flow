
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
    <div className="bg-white/20 backdrop-blur-2xl rounded-3xl border border-white/30 shadow-2xl overflow-hidden">
      {/* 標題區域 */}
      <div className="p-6 border-b border-white/20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-500/80 rounded-xl flex items-center justify-center shadow-lg">
            <Calendar className="h-5 w-5 text-white" />
          </div>
          <h2 className="text-xl font-semibold text-white drop-shadow-md">考勤記錄</h2>
        </div>
      </div>
      
      {/* 標籤區域 */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="p-6 pb-0">
          <TabsList className="grid w-full grid-cols-2 bg-white/30 backdrop-blur-xl rounded-2xl border border-white/40 p-1 shadow-lg h-14">
            <TabsTrigger 
              value="history" 
              className="text-white/90 data-[state=active]:bg-white/50 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-xl font-semibold transition-all duration-300 py-3 px-6 text-base data-[state=active]:backdrop-blur-xl flex items-center gap-2"
            >
              <History className="h-4 w-4" />
              打卡歷史
            </TabsTrigger>
            <TabsTrigger 
              value="calendar" 
              className="text-white/90 data-[state=active]:bg-white/50 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-xl font-semibold transition-all duration-300 py-3 px-6 text-base data-[state=active]:backdrop-blur-xl flex items-center gap-2"
            >
              <Calendar className="h-4 w-4" />
              月曆視圖
            </TabsTrigger>
          </TabsList>
        </div>
        
        {/* 內容區域 - 直接顯示內容，不再使用內嵌卡片 */}
        <div className="p-6">
          <TabsContent value="history" className="mt-0">
            <CheckInHistory />
          </TabsContent>
          
          <TabsContent value="calendar" className="mt-0">
            <AttendanceCalendarView
              date={date}
              setDate={setDate}
              selectedDateRecords={selectedDateRecords}
              checkInRecords={checkInRecords}
            />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

export default AttendanceTabsContainer;
