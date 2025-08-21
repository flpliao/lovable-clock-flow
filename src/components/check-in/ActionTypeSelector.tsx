import React from 'react';
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
  todayRecords,
}) => {
  const { checkIn, checkOut } = todayRecords;

  // 若已經上下班都打卡完成，不顯示選擇器
  if (checkIn && checkOut) return null;

  return (
    <div className="grid grid-cols-2 gap-2 bg-white/20 backdrop-blur-xl rounded-xl p-1 border border-white/20 my-2">
      <button
        type="button"
        onClick={() => setActionType('check-in')}
        disabled={!!checkIn}
        className={`flex items-center justify-center space-x-1 text-sm transition-all duration-200 py-2 rounded-lg font-medium
          ${actionType === 'check-in' ? 'bg-white/40 text-gray-800 hover:bg-white/50' : 'bg-transparent text-white/80 hover:bg-white/20'}
          ${checkIn ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <LogIn className="h-4 w-4" />
        <span>上班打卡</span>
      </button>
      <button
        type="button"
        onClick={() => setActionType('check-out')}
        disabled={!checkIn || !!checkOut}
        className={`flex items-center justify-center space-x-1 text-sm transition-all duration-200 py-2 rounded-lg font-medium
          ${actionType === 'check-out' ? 'bg-white/40 text-gray-800 hover:bg-white/50' : 'bg-transparent text-white/80 hover:bg-white/20'}
          ${!checkIn || checkOut ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <LogOut className="h-4 w-4" />
        <span>下班打卡</span>
      </button>
    </div>
  );
};

export default ActionTypeSelector;
