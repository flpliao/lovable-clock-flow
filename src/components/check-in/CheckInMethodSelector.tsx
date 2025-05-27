
import React from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
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
    <Tabs 
      value={checkInMethod} 
      onValueChange={(value) => setCheckInMethod(value as 'location' | 'ip')}
      className="w-full max-w-md z-10"
    >
      <TabsList className="grid w-full grid-cols-2 mb-6">
        <TabsTrigger value="location" className="text-center">
          <MapPin className="h-4 w-4 mr-2" />
          位置打卡
        </TabsTrigger>
        <TabsTrigger value="ip" className="text-center">
          <Wifi className="h-4 w-4 mr-2" />
          IP打卡
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="location" className="mt-0">
        <button
          onClick={onLocationCheckIn}
          disabled={loading}
          className={`relative h-40 w-40 mx-auto rounded-full bg-white border-8 border-[#E6F4F9] flex items-center justify-center z-10 focus:outline-none transition-all duration-300 hover:border-[#0091D0]/50 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
        >
          <div className="location-ring bg-[#0091D0]/20 h-32 w-32"></div>
          <div className="location-ring bg-[#0091D0]/10 h-36 w-36" style={{ animationDelay: "0.5s" }}></div>
          
          <div className="h-24 w-24 rounded-full bg-[#0091D0] flex items-center justify-center">
            {actionType === 'check-in' ? (
              <LogIn className="h-12 w-12 text-white" />
            ) : (
              <LogOut className="h-12 w-12 text-white" />
            )}
          </div>
        </button>
        
        <div className="mt-8 mb-12 text-center px-6">
          <p className="text-xl font-bold">
            {actionType === 'check-in' ? '上班了！' : '下班了！'}
            <span className="text-[#0091D0]">定位打卡</span>
          </p>
          {loading && (
            <p className="text-sm text-blue-600 animate-pulse mt-2">
              處理中...請稍候
            </p>
          )}
          {distance !== null && !error && !loading && (
            <p className="text-sm text-gray-600 mt-3">
              距離公司: <span className="font-medium">{Math.round(distance)} 公尺</span>
            </p>
          )}
        </div>
      </TabsContent>
      
      <TabsContent value="ip" className="mt-0">
        <button
          onClick={onIpCheckIn}
          disabled={loading}
          className={`relative h-40 w-40 mx-auto rounded-full bg-white border-8 border-[#E6F4F9] flex items-center justify-center z-10 focus:outline-none transition-all duration-300 hover:border-[#0091D0]/50 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
        >
          <div className="location-ring bg-[#0091D0]/20 h-32 w-32"></div>
          <div className="location-ring bg-[#0091D0]/10 h-36 w-36" style={{ animationDelay: "0.5s" }}></div>
          
          <div className="h-24 w-24 rounded-full bg-[#0091D0] flex items-center justify-center">
            {actionType === 'check-in' ? (
              <LogIn className="h-12 w-12 text-white" />
            ) : (
              <LogOut className="h-12 w-12 text-white" />
            )}
          </div>
        </button>
        
        <div className="mt-8 mb-12 text-center px-6">
          <p className="text-xl font-bold">
            {actionType === 'check-in' ? '上班了！' : '下班了！'}
            <span className="text-[#0091D0]">IP打卡</span>
          </p>
          {loading && (
            <p className="text-sm text-blue-600 animate-pulse mt-2">
              處理中...請稍候
            </p>
          )}
          {!loading && (
            <p className="text-sm text-gray-600 mt-3">
              使用公司網路自動打卡
            </p>
          )}
        </div>
      </TabsContent>
    </Tabs>
  );
};

export default CheckInMethodSelector;
