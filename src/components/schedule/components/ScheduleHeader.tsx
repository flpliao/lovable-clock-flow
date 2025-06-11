
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
    <div className="backdrop-blur-2xl bg-white/15 border border-white/20 rounded-3xl shadow-2xl p-8 space-y-8">
      {/* 查看模式選擇器 */}
      <div>
        <div className="flex items-center gap-4 mb-6">
          <div className="p-4 bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl shadow-lg border border-white/20">
            <Users className="h-6 w-6 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-white drop-shadow-lg">查看範圍</h3>
        </div>
        <ViewModeSelector 
          viewMode={viewMode}
          onViewModeChange={onViewModeChange}
          hasSubordinates={hasSubordinates}
        />
      </div>

      {/* 視圖類型切換 */}
      <div>
        <div className="flex items-center gap-4 mb-6">
          <div className="p-4 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-lg border border-white/20">
            <Settings className="h-6 w-6 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-white drop-shadow-lg">視圖模式</h3>
        </div>
        <TabsList className="grid w-full grid-cols-2 backdrop-blur-xl bg-white/10 rounded-2xl border border-white/20 p-1 shadow-lg h-16">
          <TabsTrigger 
            value="calendar" 
            className="text-white/80 data-[state=active]:bg-white/25 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-xl font-semibold transition-all duration-300 py-4 px-6 text-base flex items-center gap-2 backdrop-blur-xl"
          >
            <Grid className="h-5 w-5" />
            日曆視圖
          </TabsTrigger>
          <TabsTrigger 
            value="list"
            className="text-white/80 data-[state=active]:bg-white/25 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-xl font-semibold transition-all duration-300 py-4 px-6 text-base flex items-center gap-2 backdrop-blur-xl"
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
