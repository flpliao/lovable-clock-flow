
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye } from 'lucide-react';

interface StaffMonthSelectorProps {
  availableStaff: any[];
  selectedStaffId?: string;
  selectedDate: Date;
  onStaffChange: (staffId: string | undefined) => void;
  onDateChange: (date: Date) => void;
  getUserRelation: (userId: string) => string;
}

const StaffMonthSelector = ({
  availableStaff,
  selectedStaffId,
  selectedDate,
  onStaffChange,
  onDateChange,
  getUserRelation
}: StaffMonthSelectorProps) => {
  return (
    <Card className="bg-cyan-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Eye className="h-5 w-5" />
          快速查看設定
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-gray-600 text-center py-8">
          功能已移除
        </div>
      </CardContent>
    </Card>
  );
};

export default StaffMonthSelector;
