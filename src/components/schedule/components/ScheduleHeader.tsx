
import React from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, Grid, Users, Settings } from 'lucide-react';
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
    <div className="space-y-8">
      {/* 查看模式選擇器 */}
      <div className="backdrop-blur-xl bg-white/40 border border-white/30 rounded-2xl shadow-lg p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="p-3 bg-green-500/90 rounded-xl shadow-lg backdrop-blur-xl border border-green-400/50 text-white">
            <Users className="h-6 w-6" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 drop-shadow-sm">查看範圍</h3>
        </div>
        <ViewModeSelector 
          viewMode={viewMode}
          onViewModeChange={onViewModeChange}
          hasSubordinates={hasSubordinates}
        />
      </div>

      {/* 視圖類型切換 */}
      <div className="backdrop-blur-xl bg-white/40 border border-white/30 rounded-2xl shadow-lg p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="p-3 bg-blue-500/90 rounded-xl shadow-lg backdrop-blur-xl border border-blue-400/50 text-white">
            <Settings className="h-6 w-6" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 drop-shadow-sm">視圖模式</h3>
        </div>
        <TabsList className="grid w-full grid-cols-2 bg-white/60 rounded-2xl border border-white/50 p-1 shadow-lg h-16">
          <TabsTrigger 
            value="calendar" 
            className="text-gray-700 data-[state=active]:bg-white/90 data-[state=active]:text-gray-800 data-[state=active]:shadow-lg rounded-xl font-semibold transition-all duration-300 py-4 px-6 text-base flex items-center gap-2"
          >
            <Grid className="h-5 w-5" />
            日曆視圖
          </TabsTrigger>
          <TabsTrigger 
            value="list"
            className="text-gray-700 data-[state=active]:bg-white/90 data-[state=active]:text-gray-800 data-[state=active]:shadow-lg rounded-xl font-semibold transition-all duration-300 py-4 px-6 text-base flex items-center gap-2"
          >
            <Calendar className="h-5 w-5" />
            列表視圖
          </TabsTrigger>
        </TabsList>
      </div>
    </div>
  );
};

export default ScheduleHeader;
