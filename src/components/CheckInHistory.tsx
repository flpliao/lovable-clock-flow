import React, { useEffect, useState } from 'react';
import { MapPin, Wifi, RefreshCw, AlertCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useUser } from '@/contexts/UserContext';
import { CheckInRecord } from '@/types';
import { formatDate, formatTime } from '@/utils/checkInUtils';
import { useSupabaseCheckIn } from '@/hooks/useSupabaseCheckIn';

const CheckInHistory: React.FC = () => {
  const { currentUser } = useUser();
  const { checkInRecords, loadCheckInRecords, loading } = useSupabaseCheckIn();
  const [refreshing, setRefreshing] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { toast } = useToast();
  
  // 確保組件已掛載後才載入數據
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && currentUser?.id && !loading) {
      console.log('CheckInHistory - 初次載入打卡記錄，使用者ID:', currentUser.id);
      loadCheckInRecords();
    }
  }, [mounted, currentUser?.id]);

  const handleRefresh = async () => {
    if (currentUser?.id && !refreshing && !loading) {
      console.log('CheckInHistory - 手動重新載入打卡記錄');
      setRefreshing(true);
      try {
        await loadCheckInRecords();
        toast({
          title: "重新載入成功",
          description: `載入了 ${checkInRecords.length} 筆打卡記錄`,
        });
      } catch (error) {
        console.error('重新載入失敗:', error);
        toast({
          title: "重新載入失敗",
          description: "無法重新載入打卡記錄",
          variant: "destructive"
        });
      } finally {
        setRefreshing(false);
      }
    }
  };

  const isLoading = loading || refreshing;

  console.log('CheckInHistory - 渲染狀態:', {
    mounted,
    currentUser: currentUser?.id,
    recordsCount: checkInRecords.length,
    isLoading,
    records: checkInRecords
  });
  
  if (!currentUser) {
    return (
      <div className="bg-red-100/60 backdrop-blur-xl rounded-xl p-4 border border-red-200/40">
        <div className="flex items-center space-x-2 text-red-600">
          <AlertCircle className="h-4 w-4" />
          <span>請先登入才能查看打卡記錄</span>
        </div>
      </div>
    );
  }

  if (!mounted) {
    return (
      <div className="text-center py-8">
        <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-white/60" />
        <p className="text-white/80 font-medium drop-shadow-md">初始化中...</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h4 className="text-white font-medium drop-shadow-md">打卡記錄列表</h4>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleRefresh}
          disabled={isLoading}
          className="bg-white/20 backdrop-blur-xl border-white/30 text-white hover:bg-white/30 rounded-xl"
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          {isLoading ? '載入中...' : '重新載入'}
        </Button>
      </div>

      {isLoading ? (
        <div className="text-center py-12">
          <RefreshCw className="h-12 w-12 animate-spin mx-auto mb-4 text-white/60" />
          <p className="text-white/80 font-medium drop-shadow-md text-lg">正在載入打卡記錄...</p>
        </div>
      ) : checkInRecords.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6 backdrop-blur-xl border border-white/30 shadow-lg">
            <svg className="w-10 h-10 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-white/80 font-semibold text-lg drop-shadow-md">沒有找到任何打卡記錄</p>
          <p className="text-white/60 mt-2 drop-shadow-md">請確認您已經完成打卡，或嘗試重新載入</p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="text-sm text-white/80 font-medium drop-shadow-md">
            總共 {checkInRecords.length} 筆記錄
          </div>
          
          <div className="bg-white/10 backdrop-blur-xl rounded-xl border border-white/20 shadow-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="border-white/20 hover:bg-white/5">
                  <TableHead className="text-white/90 font-semibold">日期</TableHead>
                  <TableHead className="text-white/90 font-semibold">時間</TableHead>
                  <TableHead className="text-white/90 font-semibold">動作</TableHead>
                  <TableHead className="text-white/90 font-semibold">類型</TableHead>
                  <TableHead className="text-white/90 font-semibold">狀態</TableHead>
                  <TableHead className="text-white/90 font-semibold">詳情</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {checkInRecords.map((record: CheckInRecord) => (
                  <TableRow key={record.id} className="border-white/20 hover:bg-white/5 transition-colors duration-200">
                    <TableCell className="text-white/90 font-medium">{formatDate(record.timestamp)}</TableCell>
                    <TableCell className="text-white/90 font-medium">{formatTime(record.timestamp)}</TableCell>
                    <TableCell>
                      <span className={`font-semibold ${record.action === 'check-in' ? 'text-green-300' : 'text-blue-300'}`}>
                        {record.action === 'check-in' ? '上班打卡' : '下班打卡'}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center text-white/90">
                        {record.type === 'location' ? (
                          <MapPin className="h-3.5 w-3.5 mr-1" />
                        ) : (
                          <Wifi className="h-3.5 w-3.5 mr-1" />
                        )}
                        <span>
                          {record.type === 'location' ? '位置打卡' : 'IP打卡'}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {record.status === 'success' ? (
                        <Badge className="bg-green-500/80 text-white border-green-400/50 backdrop-blur-xl">成功</Badge>
                      ) : (
                        <Badge className="bg-red-500/80 text-white border-red-400/50 backdrop-blur-xl">失敗</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-white/80">
                      {record.type === 'location' ? (
                        <span>
                          {record.details.locationName} 
                          {record.details.distance && ` (${Math.round(record.details.distance)}公尺)`}
                        </span>
                      ) : (
                        <span>IP: {record.details.ip}</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      )}
    </div>
  );
};

export default CheckInHistory;
