
import React from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LogIn, LogOut, CheckCircle } from 'lucide-react';
import { CheckInRecord } from '@/types';

interface ActionTypeSelectorProps {
  actionType: 'check-in' | 'check-out';
  setActionType: (value: 'check-in' | 'check-out') => void;
  todayRecords: {
    checkIn?: CheckInRecord;
    checkOut?: CheckInRecord;
  };
}

const ActionTypeSelector: React.FC<ActionTypeSelectorProps> = ({ 
  actionType, 
  setActionType, 
  todayRecords 
}) => {
  const { checkIn, checkOut } = todayRecords;
  
  // If no check-in yet, only show check-in option
  if (!checkIn) {
    return (
      <Tabs 
        value={actionType} 
        onValueChange={(value) => setActionType(value as 'check-in' | 'check-out')}
        className="w-full max-w-md mb-6"
      >
        <TabsList className="grid w-full grid-cols-1">
          <TabsTrigger value="check-in" className="text-center">
            <LogIn className="h-4 w-4 mr-2" />
            上班打卡
          </TabsTrigger>
        </TabsList>
      </Tabs>
    );
  }
  
  // If already checked in but not checked out, show both options
  if (checkIn && !checkOut) {
    return (
      <Tabs 
        value={actionType} 
        onValueChange={(value) => setActionType(value as 'check-in' | 'check-out')}
        className="w-full max-w-md mb-6"
      >
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="check-in" className="text-center" disabled>
            <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
            已上班
          </TabsTrigger>
          <TabsTrigger value="check-out" className="text-center">
            <LogOut className="h-4 w-4 mr-2" />
            下班打卡
          </TabsTrigger>
        </TabsList>
      </Tabs>
    );
  }
  
  // If both completed, show status but allow re-selection for viewing
  return (
    <div className="w-full max-w-md mb-6">
      <Tabs 
        value={actionType} 
        onValueChange={(value) => setActionType(value as 'check-in' | 'check-out')}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="check-in" className="text-center">
            <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
            已上班
          </TabsTrigger>
          <TabsTrigger value="check-out" className="text-center">
            <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
            已下班
          </TabsTrigger>
        </TabsList>
      </Tabs>
      <div className="mt-4 text-center text-sm text-green-600 font-medium">
        ✅ 今日打卡已完成
      </div>
    </div>
  );
};

export default ActionTypeSelector;
