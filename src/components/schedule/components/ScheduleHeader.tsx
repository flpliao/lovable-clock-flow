
import React from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, Grid, Users } from 'lucide-react';
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
      {/* 查看模式選擇 */}
      <div className="bg-white/60 backdrop-blur-sm border border-white/40 rounded-xl shadow-sm p-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-green-500 rounded-lg text-white">
            <Users className="h-5 w-5" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">查看範圍</h3>
        </div>
        <ViewModeSelector 
          viewMode={viewMode}
          onViewModeChange={onViewModeChange}
          hasSubordinates={hasSubordinates}
        />
      </div>

      {/* 視圖類型切換 */}
      <div className="bg-white/60 backdrop-blur-sm border border-white/40 rounded-xl shadow-sm p-4">
        <TabsList className="grid w-full grid-cols-2 bg-white/50 rounded-lg p-1 h-12">
          <TabsTrigger 
            value="calendar" 
            className="text-gray-700 data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md font-medium flex items-center gap-2"
          >
            <Grid className="h-4 w-4" />
            日曆視圖
          </TabsTrigger>
          <TabsTrigger 
            value="list"
            className="text-gray-700 data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md font-medium flex items-center gap-2"
          >
            <Calendar className="h-4 w-4" />
            列表視圖
          </TabsTrigger>
        </TabsList>
      </div>
    </div>
  );
};

export default ScheduleHeader;
