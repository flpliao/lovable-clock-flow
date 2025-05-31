import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  MapPin, 
  Wifi, 
  LogIn, 
  LogOut, 
  AlertCircle,
  CheckCircle2,
  Clock
} from 'lucide-react';
import { useCheckIn } from '@/hooks/useCheckIn';
import { useTodayCheckInRecords } from '@/hooks/useTodayCheckInRecords';
import { useToast } from '@/hooks/use-toast';
import { formatTime } from '@/utils/checkInUtils';

const LocationCheckIn = () => {
  const [checkInMethod, setCheckInMethod] = useState<'location' | 'ip'>('location');
  const [actionType, setActionType] = useState<'check-in' | 'check-out'>('check-in');
  const [loading, setLoading] = useState(false);

  const { onLocationCheckIn, onIpCheckIn, distance, error } = useCheckIn();
  const { todayRecords, refreshRecords } = useTodayCheckInRecords();
  const { toast } = useToast();

  // 根據今日記錄決定顯示狀態
  useEffect(() => {
    if (todayRecords.checkIn && !todayRecords.checkOut) {
      setActionType('check-out');
    } else if (!todayRecords.checkIn) {
      setActionType('check-in');
    }
  }, [todayRecords]);

  const handleCheckIn = async () => {
    setLoading(true);
    try {
      if (checkInMethod === 'location') {
        await onLocationCheckIn();
      } else {
        await onIpCheckIn();
      }
      
      toast({
        title: actionType === 'check-in' ? '上班打卡成功' : '下班打卡成功',
        description: `${checkInMethod === 'location' ? '位置' : 'IP'}打卡已完成`,
      });
      
      await refreshRecords();
    } catch (error) {
      console.error('Check-in error:', error);
      toast({
        title: '打卡失敗',
        description: '請稍後再試或聯繫系統管理員',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  // 如果已完成今日打卡，顯示完成狀態
  if (todayRecords.checkIn && todayRecords.checkOut) {
    return (
      <Card className="bg-green-50 border-green-200">
        <CardContent className="p-4">
          <div className="text-center space-y-3">
            <div className="flex items-center justify-center">
              <CheckCircle2 className="h-8 w-8 text-green-600 mr-2" />
              <span className="text-lg font-semibold text-green-800">今日打卡已完成</span>
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="bg-white rounded-lg p-3 border border-green-200">
                <div className="flex items-center justify-center mb-1">
                  <LogIn className="h-4 w-4 text-green-600 mr-1" />
                  <span className="font-medium">上班</span>
                </div>
                <div className="text-center">
                  <div className="font-mono text-lg text-green-800">
                    {formatTime(todayRecords.checkIn.timestamp)}
                  </div>
                  <div className="text-green-600 text-xs mt-1">
                    {todayRecords.checkIn.type === 'location' ? '位置打卡' : 'IP打卡'}
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg p-3 border border-green-200">
                <div className="flex items-center justify-center mb-1">
                  <LogOut className="h-4 w-4 text-green-600 mr-1" />
                  <span className="font-medium">下班</span>
                </div>
                <div className="text-center">
                  <div className="font-mono text-lg text-green-800">
                    {formatTime(todayRecords.checkOut.timestamp)}
                  </div>
                  <div className="text-green-600 text-xs mt-1">
                    {todayRecords.checkOut.type === 'location' ? '位置打卡' : 'IP打卡'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-center space-x-2 text-lg">
          <Clock className="h-5 w-5" />
          <span>員工打卡</span>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* 如果已上班但未下班，顯示狀態 */}
        {todayRecords.checkIn && !todayRecords.checkOut && (
          <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
            <div className="flex items-center justify-center space-x-2 text-blue-800">
              <CheckCircle2 className="h-4 w-4" />
              <span className="font-medium">已上班打卡</span>
              <Badge variant="secondary" className="text-xs">
                {formatTime(todayRecords.checkIn.timestamp)}
              </Badge>
            </div>
          </div>
        )}

        {/* 打卡方式選擇 - 手機優化 */}
        <div className="grid grid-cols-2 gap-2 bg-gray-100 rounded-lg p-1">
          <Button
            variant={checkInMethod === 'location' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setCheckInMethod('location')}
            className="flex items-center justify-center space-x-1 text-sm"
          >
            <MapPin className="h-4 w-4" />
            <span>位置打卡</span>
          </Button>
          <Button
            variant={checkInMethod === 'ip' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setCheckInMethod('ip')}
            className="flex items-center justify-center space-x-1 text-sm"
          >
            <Wifi className="h-4 w-4" />
            <span>IP打卡</span>
          </Button>
        </div>

        {/* 打卡按鈕 - 手機優化大按鈕 */}
        <div className="text-center">
          <Button
            onClick={handleCheckIn}
            disabled={loading}
            size="lg"
            className={`w-full h-16 text-lg font-semibold rounded-xl transition-all duration-200 ${
              actionType === 'check-in' 
                ? 'bg-green-500 hover:bg-green-600' 
                : 'bg-blue-500 hover:bg-blue-600'
            }`}
          >
            {loading ? (
              <div className="flex items-center space-x-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>處理中...</span>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                {actionType === 'check-in' ? (
                  <LogIn className="h-6 w-6" />
                ) : (
                  <LogOut className="h-6 w-6" />
                )}
                <span>
                  {actionType === 'check-in' ? '上班打卡' : '下班打卡'}
                </span>
              </div>
            )}
          </Button>
        </div>

        {/* 狀態資訊 */}
        {distance !== null && !error && checkInMethod === 'location' && (
          <div className="text-center text-sm text-gray-600">
            <MapPin className="inline h-4 w-4 mr-1" />
            距離公司: <span className="font-medium">{Math.round(distance)} 公尺</span>
          </div>
        )}

        {error && (
          <div className="flex items-center justify-center space-x-2 text-red-600 text-sm bg-red-50 rounded-lg p-3">
            <AlertCircle className="h-4 w-4" />
            <span>{error}</span>
          </div>
        )}

        {!loading && checkInMethod === 'ip' && (
          <div className="text-center text-sm text-gray-600">
            <Wifi className="inline h-4 w-4 mr-1" />
            使用公司網路自動打卡
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default LocationCheckIn;
