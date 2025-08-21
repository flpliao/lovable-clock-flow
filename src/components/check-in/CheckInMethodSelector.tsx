import { Button } from '@/components/ui/button';
import { MapPin, Wifi } from 'lucide-react';
import React from 'react';

interface CheckInMethodSelectorProps {
  checkInMethod: 'location' | 'ip';
  setCheckInMethod: (method: 'location' | 'ip') => void;
  disabled: boolean;
}

const CheckInMethodSelector: React.FC<CheckInMethodSelectorProps> = ({
  checkInMethod,
  setCheckInMethod,
  disabled,
}) => {
  return (
    <div className="grid grid-cols-2 gap-2 bg-white/20 backdrop-blur-xl rounded-xl p-1 border border-white/20">
      <Button
        variant={checkInMethod === 'location' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => setCheckInMethod('location')}
        disabled={disabled}
        className={`flex items-center justify-center space-x-1 text-sm transition-all duration-200 ${
          checkInMethod === 'location'
            ? 'bg-white/40 text-gray-800 hover:bg-white/50'
            : 'bg-transparent text-white/80 hover:bg-white/20'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <MapPin className="h-4 w-4" />
        <span>位置打卡</span>
      </Button>
      <Button
        variant={checkInMethod === 'ip' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => setCheckInMethod('ip')}
        className={`flex items-center justify-center space-x-1 text-sm transition-all duration-200 ${
          checkInMethod === 'ip'
            ? 'bg-white/40 text-gray-800 hover:bg-white/50'
            : 'bg-transparent text-white/80 hover:bg-white/20'
        }`}
      >
        <Wifi className="h-4 w-4" />
        <span>IP打卡</span>
      </Button>
    </div>
  );
};

export default CheckInMethodSelector;
