
import React from 'react';
import { Users, Calendar, Eye } from 'lucide-react';

interface ViewModeSelectorProps {
  viewMode: 'self' | 'subordinates' | 'all';
  onViewModeChange: (value: 'self' | 'subordinates' | 'all') => void;
  hasSubordinates: boolean;
}

const ViewModeSelector = ({ viewMode, onViewModeChange, hasSubordinates }: ViewModeSelectorProps) => {
  return (
    <div className="grid grid-cols-1 gap-4">
      {/* 移除我的排班選項，只保留下屬排班和全部排班 */}
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
  );
};

export default ViewModeSelector;
