
import React from 'react';
import { Gift, Coins, RotateCcw } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface OvertimeCompensationSectionProps {
  compensationType: string;
  onCompensationTypeChange: (value: string) => void;
}

const OvertimeCompensationSection: React.FC<OvertimeCompensationSectionProps> = ({
  compensationType,
  onCompensationTypeChange
}) => {
  return (
    <div className="backdrop-blur-2xl bg-white/15 border border-white/25 rounded-3xl shadow-2xl p-8">
      <div className="flex items-center gap-3 mb-6">
        <Gift className="h-5 w-5 text-black" />
        <h4 className="text-lg font-medium text-black">補償方式</h4>
      </div>
      
      <div className="space-y-3">
        <Label htmlFor="compensationType" className="flex items-center gap-2 text-black font-medium">
          <Gift className="h-4 w-4" />
          補償類型
        </Label>
        <Select value={compensationType} onValueChange={onCompensationTypeChange}>
          <SelectTrigger className="h-12 bg-white/40 backdrop-blur-xl border-white/50 text-black rounded-xl font-medium">
            <SelectValue placeholder="選擇補償方式" className="text-black" />
          </SelectTrigger>
          <SelectContent className="bg-white border-2 border-gray-200 rounded-lg shadow-lg">
            <SelectItem value="pay" className="text-black font-medium flex items-center">
              <Coins className="h-4 w-4 mr-2" />
              加班費
            </SelectItem>
            <SelectItem value="time_off" className="text-black font-medium flex items-center">
              <RotateCcw className="h-4 w-4 mr-2" />
              補休
            </SelectItem>
            <SelectItem value="both" className="text-black font-medium">混合補償</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default OvertimeCompensationSection;
