import { Button } from '@/components/ui/button';
import { CHECK_IN, CheckInType } from '@/constants/checkInTypes';
import { LogIn, LogOut } from 'lucide-react';
import React from 'react';

interface CheckInButtonProps {
  type: CheckInType;
  isLoading: boolean;
  onCheckIn: () => void;
  disabled?: boolean;
}

const CheckInButton: React.FC<CheckInButtonProps> = ({
  type,
  isLoading,
  onCheckIn,
  disabled = false,
}) => {
  return (
    <div className="text-center">
      <Button
        onClick={onCheckIn}
        disabled={isLoading || disabled}
        size="lg"
        className={`w-full h-16 text-lg font-semibold rounded-xl transition-all duration-200 ${
          type === CHECK_IN ? 'bg-green-500 hover:bg-green-600' : 'bg-blue-500 hover:bg-blue-600'
        }`}
      >
        {isLoading ? (
          <div className="flex items-center space-x-2">
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            <span>處理中...</span>
          </div>
        ) : (
          <div className="flex items-center space-x-2">
            {type === CHECK_IN ? <LogIn className="h-6 w-6" /> : <LogOut className="h-6 w-6" />}
            <span>{type === CHECK_IN ? '上班打卡' : '下班打卡'}</span>
          </div>
        )}
      </Button>
    </div>
  );
};

export default CheckInButton;
