
import React from 'react';
import { Timer, Clock } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface OvertimeTimeSectionProps {
  startTime: string;
  endTime: string;
  onStartTimeChange: (value: string) => void;
  onEndTimeChange: (value: string) => void;
}

const OvertimeTimeSection: React.FC<OvertimeTimeSectionProps> = ({
  startTime,
  endTime,
  onStartTimeChange,
  onEndTimeChange
}) => {
  return (
    <div className="backdrop-blur-2xl bg-white/20 border border-white/30 rounded-3xl shadow-2xl p-8 mb-8">
      <div className="flex items-center gap-3 mb-6">
        <Timer className="h-5 w-5 text-white/80" />
        <h4 className="text-lg font-medium text-white">時間設定</h4>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-3">
          <Label htmlFor="startTime" className="flex items-center gap-2 text-white font-medium">
            <Timer className="h-4 w-4" />
            開始時間
          </Label>
          <Input
            id="startTime"
            type="time"
            value={startTime}
            onChange={(e) => onStartTimeChange(e.target.value)}
            className="h-12 bg-white/20 backdrop-blur-xl border-white/30 text-white placeholder-white/70 rounded-xl"
            required
          />
        </div>
        
        <div className="space-y-3">
          <Label htmlFor="endTime" className="flex items-center gap-2 text-white font-medium">
            <Clock className="h-4 w-4" />
            結束時間
          </Label>
          <Input
            id="endTime"
            type="time"
            value={endTime}
            onChange={(e) => onEndTimeChange(e.target.value)}
            className="h-12 bg-white/20 backdrop-blur-xl border-white/30 text-white placeholder-white/70 rounded-xl"
            required
          />
        </div>
      </div>
    </div>
  );
};

export default OvertimeTimeSection;
