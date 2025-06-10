
import React from 'react';
import { DollarSign } from 'lucide-react';
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
        <DollarSign className="h-5 w-5 text-white/80" />
        <h4 className="text-lg font-medium text-white">補償設定</h4>
      </div>
      
      <div className="space-y-3">
        <Label htmlFor="compensationType" className="flex items-center gap-2 text-white font-medium">
          <DollarSign className="h-4 w-4" />
          補償方式
        </Label>
        <Select value={compensationType} onValueChange={onCompensationTypeChange}>
          <SelectTrigger className="h-12 bg-white/25 backdrop-blur-xl border-white/30 text-white rounded-xl">
            <SelectValue placeholder="選擇補償方式" />
          </SelectTrigger>
          <SelectContent className="bg-white border-2 border-gray-200 rounded-lg shadow-lg">
            <SelectItem value="pay">加班費</SelectItem>
            <SelectItem value="time_off">補休</SelectItem>
            <SelectItem value="both">加班費+補休</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default OvertimeCompensationSection;
