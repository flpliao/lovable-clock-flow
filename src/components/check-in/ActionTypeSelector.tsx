
import React from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LogIn, LogOut } from 'lucide-react';
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
            <LogIn className="h-4 w-4 mr-2" />
            上班打卡
          </TabsTrigger>
          <TabsTrigger value="check-out" className="text-center">
            <LogOut className="h-4 w-4 mr-2" />
            下班打卡
          </TabsTrigger>
        </TabsList>
      </Tabs>
    );
  }
  
  // If already checked in and out, all options disabled
  return (
    <Tabs 
      value={actionType} 
      onValueChange={(value) => setActionType(value as 'check-in' | 'check-out')}
      className="w-full max-w-md mb-6"
    >
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="check-in" className="text-center" disabled>
          <LogIn className="h-4 w-4 mr-2" />
          上班打卡
        </TabsTrigger>
        <TabsTrigger value="check-out" className="text-center" disabled>
          <LogOut className="h-4 w-4 mr-2" />
          下班打卡
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
};

export default ActionTypeSelector;
