
import React from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, Grid } from 'lucide-react';
import ViewModeSelector from './ViewModeSelector';

interface ScheduleHeaderProps {
  viewMode: 'self' | 'subordinates' | 'all';
  onViewModeChange: (value: 'self' | 'subordinates' | 'all') => void;
  hasSubordinates: boolean;
  viewType: 'daily' | 'monthly';
  onViewTypeChange: (value: 'daily' | 'monthly') => void;
}

const ScheduleHeader = ({
  viewMode,
  onViewModeChange,
  hasSubordinates,
  viewType,
  onViewTypeChange,
}: ScheduleHeaderProps) => {
  return (
    <div className="space-y-6">
      {/* 查看模式選擇器 */}
      <ViewModeSelector 
        viewMode={viewMode}
        onViewModeChange={onViewModeChange}
        hasSubordinates={hasSubordinates}
      />

      {/* 視圖類型切換 */}
      <TabsList className="grid w-full grid-cols-2 bg-white/30 backdrop-blur-xl rounded-2xl border border-white/40 p-1 shadow-lg h-14">
        <TabsTrigger 
          value="calendar" 
          className="text-white/90 data-[state=active]:bg-white/50 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-xl font-semibold transition-all duration-300 py-3 px-6 text-base data-[state=active]:backdrop-blur-xl flex items-center gap-2"
        >
          <Grid className="h-4 w-4" />
          日曆視圖
        </TabsTrigger>
        <TabsTrigger 
          value="list"
          className="text-white/90 data-[state=active]:bg-white/50 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-xl font-semibold transition-all duration-300 py-3 px-6 text-base data-[state=active]:backdrop-blur-xl flex items-center gap-2"
        >
          <Calendar className="h-4 w-4" />
          列表視圖
        </TabsTrigger>
      </TabsList>
    </div>
  );
};

export default ScheduleHeader;
