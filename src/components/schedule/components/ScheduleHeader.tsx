
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
    <div className="bg-white/95 backdrop-blur-xl rounded-2xl border border-white/40 shadow-lg p-6 space-y-6">
      {/* 查看模式選擇器 */}
      <ViewModeSelector 
        viewMode={viewMode}
        onViewModeChange={onViewModeChange}
        hasSubordinates={hasSubordinates}
      />

      {/* 視圖類型切換 */}
      <TabsList className="grid w-full grid-cols-2 bg-slate-100 rounded-2xl border border-slate-200 p-1 shadow-lg h-14">
        <TabsTrigger 
          value="calendar" 
          className="text-slate-700 data-[state=active]:bg-white data-[state=active]:text-slate-800 data-[state=active]:shadow-md rounded-xl font-semibold transition-all duration-300 py-3 px-6 text-base flex items-center gap-2"
        >
          <Grid className="h-4 w-4" />
          日曆視圖
        </TabsTrigger>
        <TabsTrigger 
          value="list"
          className="text-slate-700 data-[state=active]:bg-white data-[state=active]:text-slate-800 data-[state=active]:shadow-md rounded-xl font-semibold transition-all duration-300 py-3 px-6 text-base flex items-center gap-2"
        >
          <Calendar className="h-4 w-4" />
          列表視圖
        </TabsTrigger>
      </TabsList>
    </div>
  );
};

export default ScheduleHeader;
