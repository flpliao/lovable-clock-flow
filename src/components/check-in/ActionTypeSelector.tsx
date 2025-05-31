
import React from 'react';
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
      <div className="w-full max-w-sm mx-auto mb-6 px-4">
        <div className="bg-green-50 rounded-2xl p-1">
          <button
            className="w-full bg-white rounded-xl py-3 px-4 font-medium text-gray-800 shadow-sm flex items-center justify-center"
          >
            <LogIn className="h-4 w-4 mr-2 text-green-600" />
            上班打卡
          </button>
        </div>
      </div>
    );
  }
  
  // If already checked in but not checked out, show both options
  if (checkIn && !checkOut) {
    return (
      <div className="w-full max-w-sm mx-auto mb-6 px-4">
        <div className="bg-gray-100 rounded-2xl p-1 flex">
          <button
            className="flex-1 bg-green-100 rounded-xl py-3 px-4 font-medium text-green-700 flex items-center justify-center"
            disabled
          >
            <CheckCircle className="h-4 w-4 mr-2" />
            已上班
          </button>
          <button
            onClick={() => setActionType('check-out')}
            className={`flex-1 rounded-xl py-3 px-4 font-medium flex items-center justify-center transition-colors ${
              actionType === 'check-out' 
                ? 'bg-white text-gray-800 shadow-sm' 
                : 'text-gray-600'
            }`}
          >
            <LogOut className="h-4 w-4 mr-2" />
            下班打卡
          </button>
        </div>
      </div>
    );
  }
  
  // If both completed, show completion status
  return (
    <div className="w-full max-w-sm mx-auto mb-6 px-4">
      <div className="bg-green-50 rounded-2xl p-4 text-center">
        <div className="flex items-center justify-center mb-2">
          <CheckCircle className="h-6 w-6 text-green-600 mr-2" />
          <span className="font-medium text-green-800">今日打卡已完成</span>
        </div>
        <div className="flex justify-center space-x-4 text-sm">
          <span className="text-green-600">✓ 已上班</span>
          <span className="text-green-600">✓ 已下班</span>
        </div>
      </div>
    </div>
  );
};

export default ActionTypeSelector;
