
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
    <div className="space-y-4">
      {/* 查看模式選擇器 */}
      <ViewModeSelector 
        viewMode={viewMode}
        onViewModeChange={onViewModeChange}
        hasSubordinates={hasSubordinates}
      />

      {/* 視圖類型切換 */}
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="monthly" className="flex items-center gap-2">
          <Grid className="h-4 w-4" />
          月視圖
        </TabsTrigger>
        <TabsTrigger value="daily" className="flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          日視圖
        </TabsTrigger>
      </TabsList>
    </div>
  );
};

export default ScheduleHeader;
