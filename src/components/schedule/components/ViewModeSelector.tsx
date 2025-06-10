
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Users, Eye } from 'lucide-react';

interface ViewModeSelectorProps {
  viewMode: 'self' | 'subordinates' | 'all';
  onViewModeChange: (value: 'self' | 'subordinates' | 'all') => void;
  hasSubordinates: boolean;
}

const ViewModeSelector = ({ viewMode, onViewModeChange, hasSubordinates }: ViewModeSelectorProps) => {
  if (!hasSubordinates) return null;

  return (
    <div>
      <div className="flex items-center gap-3 mb-4">
        <div className="p-3 bg-indigo-500/80 rounded-xl shadow-lg">
          <Eye className="h-5 w-5 text-white" />
        </div>
        <h3 className="text-lg font-semibold text-white drop-shadow-md">查看範圍</h3>
      </div>
      <Select value={viewMode} onValueChange={onViewModeChange}>
        <SelectTrigger className="h-12 text-sm border-2 border-white/30 rounded-xl bg-white/20 text-white backdrop-blur-xl">
          <SelectValue />
        </SelectTrigger>
        <SelectContent className="bg-white border-2 border-gray-200 rounded-lg shadow-lg z-50">
          <SelectItem value="self" className="py-3 px-4 text-sm hover:bg-gray-50">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              僅自己的排班
            </div>
          </SelectItem>
          <SelectItem value="subordinates" className="py-3 px-4 text-sm hover:bg-gray-50">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              僅下屬的排班
            </div>
          </SelectItem>
          <SelectItem value="all" className="py-3 px-4 text-sm hover:bg-gray-50">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              自己和下屬的排班
            </div>
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default ViewModeSelector;
