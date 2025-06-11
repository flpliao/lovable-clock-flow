
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
    <div className="space-y-6">
      {/* 查看模式選擇器 */}
      <div className="backdrop-blur-2xl bg-white/80 border border-white/50 rounded-3xl shadow-xl p-8">
        <div className="flex items-center gap-4 mb-6">
          <div className="p-4 bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl shadow-lg border border-white/30">
            <Users className="h-6 w-6 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-gray-800 drop-shadow-sm">查看範圍</h3>
        </div>
        <ViewModeSelector 
          viewMode={viewMode}
          onViewModeChange={onViewModeChange}
          hasSubordinates={hasSubordinates}
        />
      </div>

      {/* 視圖類型切換 */}
      <div className="backdrop-blur-2xl bg-white/80 border border-white/50 rounded-3xl shadow-xl p-8">
        <div className="flex items-center gap-4 mb-6">
          <div className="p-4 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-lg border border-white/30">
            <Settings className="h-6 w-6 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-gray-800 drop-shadow-sm">視圖模式</h3>
        </div>
        <TabsList className="grid w-full grid-cols-2 bg-white/40 rounded-2xl border border-white/50 p-1 shadow-lg h-16">
          <TabsTrigger 
            value="calendar" 
            className="text-gray-700 data-[state=active]:bg-white/80 data-[state=active]:text-gray-900 data-[state=active]:shadow-lg rounded-xl font-semibold transition-all duration-300 py-4 px-6 text-base flex items-center gap-2"
          >
            <Grid className="h-5 w-5" />
            日曆視圖
          </TabsTrigger>
          <TabsTrigger 
            value="list"
            className="text-gray-700 data-[state=active]:bg-white/80 data-[state=active]:text-gray-900 data-[state=active]:shadow-lg rounded-xl font-semibold transition-all duration-300 py-4 px-6 text-base flex items-center gap-2"
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
