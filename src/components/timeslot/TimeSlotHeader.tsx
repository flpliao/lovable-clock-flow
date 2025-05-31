
import React from 'react';
import { CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Clock } from 'lucide-react';

interface TimeSlotHeaderProps {
  onAddTimeSlot: () => void;
}

const TimeSlotHeader = ({ onAddTimeSlot }: TimeSlotHeaderProps) => {
  return (
    <CardHeader>
      <div className="flex items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          時間段管理
        </CardTitle>
        <Button onClick={onAddTimeSlot}>
          <Plus className="h-4 w-4 mr-2" />
          新增時間段
        </Button>
      </div>
    </CardHeader>
  );
};

export default TimeSlotHeader;
