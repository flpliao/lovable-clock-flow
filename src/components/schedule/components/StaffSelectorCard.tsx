
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LucideIcon } from 'lucide-react';

interface StaffSelectorCardProps {
  availableStaff: any[];
  selectedStaffId?: string;
  onStaffChange: (staffId: string | undefined) => void;
  getUserRelation: (userId: string) => string;
  icon: LucideIcon;
  title: string;
}

const StaffSelectorCard = ({
  availableStaff,
  selectedStaffId,
  onStaffChange,
  getUserRelation,
  icon: Icon,
  title
}: StaffSelectorCardProps) => {
  return (
    <Card className="bg-white/90 backdrop-blur-xl border border-white/30 shadow-xl">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center space-x-2 text-base sm:text-lg text-gray-800">
          <Icon className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
          <span>{title}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Select 
          value={selectedStaffId || "all"} 
          onValueChange={(value) => onStaffChange(value === "all" ? undefined : value)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="選擇員工" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">所有員工</SelectItem>
            {availableStaff.map((staff) => (
              <SelectItem key={staff.id} value={staff.id}>
                {staff.name} {getUserRelation(staff.id)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardContent>
    </Card>
  );
};

export default StaffSelectorCard;
