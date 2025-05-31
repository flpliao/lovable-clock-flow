
import React from 'react';
import { MapPin, Wifi, LogIn, LogOut } from 'lucide-react';

interface CheckInMethodSelectorProps {
  checkInMethod: 'location' | 'ip';
  setCheckInMethod: (value: 'location' | 'ip') => void;
  onLocationCheckIn: () => void;
  onIpCheckIn: () => void;
  loading: boolean;
  actionType: 'check-in' | 'check-out';
  distance: number | null;
  error: string | null;
}

const CheckInMethodSelector: React.FC<CheckInMethodSelectorProps> = ({
  checkInMethod,
  setCheckInMethod,
  onLocationCheckIn,
  onIpCheckIn,
  loading,
  actionType,
  distance,
  error
}) => {
  return (
    <div className="w-full max-w-sm mx-auto px-4">
      {/* Method selection tabs */}
      <div className="bg-gray-100 rounded-2xl p-1 mb-8 flex">
        <button
          onClick={() => setCheckInMethod('location')}
          className={`flex-1 rounded-xl py-3 px-4 font-medium flex items-center justify-center transition-colors ${
            checkInMethod === 'location' 
              ? 'bg-white text-gray-800 shadow-sm' 
              : 'text-gray-600'
          }`}
        >
          <MapPin className="h-4 w-4 mr-2" />
          位置打卡
        </button>
        <button
          onClick={() => setCheckInMethod('ip')}
          className={`flex-1 rounded-xl py-3 px-4 font-medium flex items-center justify-center transition-colors ${
            checkInMethod === 'ip' 
              ? 'bg-white text-gray-800 shadow-sm' 
              : 'text-gray-600'
          }`}
        >
          <Wifi className="h-4 w-4 mr-2" />
          IP打卡
        </button>
      </div>
      
      {/* Check-in button */}
      <div className="text-center mb-8">
        <button
          onClick={checkInMethod === 'location' ? onLocationCheckIn : onIpCheckIn}
          disabled={loading}
          className={`relative h-32 w-32 mx-auto rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
        >
          {loading && (
            <div className="absolute inset-0 rounded-full border-4 border-blue-200 border-t-white animate-spin"></div>
          )}
          
          {actionType === 'check-in' ? (
            <LogIn className="h-12 w-12 text-white" />
          ) : (
            <LogOut className="h-12 w-12 text-white" />
          )}
        </button>
      </div>
      
      {/* Status text */}
      <div className="text-center">
        <p className="text-lg font-medium text-gray-800 mb-2">
          {actionType === 'check-in' ? '上班了！' : '下班了！'}
          <span className="text-blue-600 ml-1">
            {checkInMethod === 'location' ? '定位打卡' : 'IP打卡'}
          </span>
        </p>
        
        {loading && (
          <p className="text-sm text-blue-600 animate-pulse">
            處理中...請稍候
          </p>
        )}
        
        {distance !== null && !error && !loading && checkInMethod === 'location' && (
          <p className="text-sm text-gray-600">
            距離公司: <span className="font-medium">{Math.round(distance)} 公尺</span>
          </p>
        )}
        
        {!loading && checkInMethod === 'ip' && (
          <p className="text-sm text-gray-600">
            使用公司網路自動打卡
          </p>
        )}
      </div>
    </div>
  );
};

export default CheckInMethodSelector;
