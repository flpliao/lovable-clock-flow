
import React from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, Grid, Users, Eye } from 'lucide-react';
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
    <div className="space-y-8 px-4">
      {/* 查看模式選擇 */}
      <div>
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-white/20 rounded-2xl">
            <Eye className="h-7 w-7 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-white drop-shadow-lg">查看範圍</h3>
        </div>
        <ViewModeSelector 
          viewMode={viewMode}
          onViewModeChange={onViewModeChange}
          hasSubordinates={hasSubordinates}
        />
      </div>

      {/* 視圖類型切換 - 僅顯示列表視圖 */}
      <div>
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-white/20 rounded-2xl">
            <Grid className="h-7 w-7 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-white drop-shadow-lg">視圖模式</h3>
        </div>
        
        <TabsList className="grid w-full grid-cols-1 bg-white/20 backdrop-blur-xl rounded-2xl p-2 h-16 border border-white/30">
          <TabsTrigger 
            value="list"
            className="text-white/90 data-[state=active]:bg-white/30 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-xl font-semibold flex items-center gap-2 h-12"
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
