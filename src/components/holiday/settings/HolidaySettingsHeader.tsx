
import React from 'react';
import { Settings, Plus, Save } from 'lucide-react';

interface HolidaySettingsHeaderProps {
  isEditing: boolean;
}

const HolidaySettingsHeader: React.FC<HolidaySettingsHeaderProps> = ({ isEditing }) => {
  return (
    <div className="backdrop-blur-xl bg-white/25 border border-white/30 rounded-2xl shadow-lg p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-gray-500/80 rounded-xl shadow-lg backdrop-blur-xl border border-gray-400/50">
            <Settings className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-white drop-shadow-md">
              {isEditing ? '編輯假日' : '新增假日'}
            </h3>
            <p className="text-white/80 text-sm mt-1">管理系統假日設定</p>
          </div>
        </div>
        <div className="hidden md:flex items-center gap-3">
          <div className="p-2 bg-blue-500/60 rounded-lg shadow-md backdrop-blur-xl border border-blue-400/40">
            <Plus className="h-4 w-4 text-white" />
          </div>
          <div className="p-2 bg-green-500/60 rounded-lg shadow-md backdrop-blur-xl border border-green-400/40">
            <Save className="h-4 w-4 text-white" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HolidaySettingsHeader;
