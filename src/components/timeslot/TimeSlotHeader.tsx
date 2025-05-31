
import React from 'react';
import { CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Clock } from 'lucide-react';

interface TimeSlotHeaderProps {
  onAddTimeSlot: () => void;
}

const TimeSlotHeader = ({ onAddTimeSlot }: TimeSlotHeaderProps) => {
  return (
    <CardHeader className="pb-3">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
        <CardTitle className="flex items-center space-x-2 text-base sm:text-lg">
          <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600" />
          <span>時間段管理</span>
        </CardTitle>
        <Button 
          onClick={onAddTimeSlot}
          className="bg-purple-500 hover:bg-purple-600 text-white h-9 sm:h-10 px-3 sm:px-4 text-sm"
        >
          <Plus className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
          <span className="hidden xs:inline">新增時間段</span>
          <span className="xs:hidden">新增</span>
        </Button>
      </div>
    </CardHeader>
  );
};

export default TimeSlotHeader;
