
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
      {/* 查看模式選擇 - 移除我的排班選項 */}
      <div>
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-white/20 rounded-2xl">
            <Eye className="h-7 w-7 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-white drop-shadow-lg">查看範圍</h3>
        </div>
        {/* 只顯示下屬排班和全部排班選項 */}
        <div className="grid grid-cols-1 gap-4">
          {hasSubordinates && (
            <div 
              onClick={() => onViewModeChange('subordinates')}
              className={`p-6 rounded-2xl border-2 cursor-pointer transition-all duration-300 backdrop-blur-xl ${
                viewMode === 'subordinates'
                  ? 'bg-white/40 border-white/60 shadow-2xl' 
                  : 'bg-white/20 border-white/30 hover:bg-white/30'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-xl ${
                    viewMode === 'subordinates' ? 'bg-white/30' : 'bg-white/20'
                  }`}>
                    <Users className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-1">下屬排班（快速查看）</h4>
                    <p className="text-white/80 text-sm">查看下屬的排班記錄</p>
                  </div>
                </div>
                <Eye className="h-5 w-5 text-white/70" />
              </div>
            </div>
          )}
          
          <div 
            onClick={() => onViewModeChange('all')}
            className={`p-6 rounded-2xl border-2 cursor-pointer transition-all duration-300 backdrop-blur-xl ${
              viewMode === 'all'
                ? 'bg-white/40 border-white/60 shadow-2xl' 
                : 'bg-white/20 border-white/30 hover:bg-white/30'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-xl ${
                  viewMode === 'all' ? 'bg-white/30' : 'bg-white/20'
                }`}>
                  <Calendar className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-white mb-1">全部排班</h4>
                  <p className="text-white/80 text-sm">查看所有排班記錄</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 視圖類型切換 */}
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
