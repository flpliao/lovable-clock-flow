
import React from 'react';
import { Calendar, MapPin } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface OvertimeBasicInfoSectionProps {
  overtimeDate: string;
  overtimeType: string;
  onDateChange: (value: string) => void;
  onTypeChange: (value: string) => void;
}

const OvertimeBasicInfoSection: React.FC<OvertimeBasicInfoSectionProps> = ({
  overtimeDate,
  overtimeType,
  onDateChange,
  onTypeChange
}) => {
  return (
    <div className="backdrop-blur-2xl bg-white/20 border border-white/30 rounded-3xl shadow-2xl p-8 mb-8">
      <div className="flex items-center gap-3 mb-6">
        <Calendar className="h-5 w-5 text-white/80" />
        <h4 className="text-lg font-medium text-white">基本資訊</h4>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-3">
          <Label htmlFor="overtimeDate" className="flex items-center gap-2 text-white font-medium">
            <Calendar className="h-4 w-4" />
            加班日期
          </Label>
          <Input
            id="overtimeDate"
            type="date"
            value={overtimeDate}
            onChange={(e) => onDateChange(e.target.value)}
            className="h-12 bg-white/20 backdrop-blur-xl border-white/30 text-white placeholder-white/70 rounded-xl"
            required
          />
        </div>
        
        <div className="space-y-3">
          <Label htmlFor="overtimeType" className="flex items-center gap-2 text-white font-medium">
            <MapPin className="h-4 w-4" />
            加班類型
          </Label>
          <Select value={overtimeType} onValueChange={onTypeChange}>
            <SelectTrigger className="h-12 bg-white/20 backdrop-blur-xl border-white/30 text-white rounded-xl">
              <SelectValue placeholder="選擇加班類型" />
            </SelectTrigger>
            <SelectContent className="bg-white border-2 border-gray-200 rounded-lg shadow-lg">
              <SelectItem value="weekday">平日加班</SelectItem>
              <SelectItem value="weekend">假日加班</SelectItem>
              <SelectItem value="holiday">國定假日加班</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default OvertimeBasicInfoSection;
