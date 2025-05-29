
import React, { useEffect, useState } from 'react';
import { MapPin, Wifi, RefreshCw, AlertCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
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
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          請先登入才能查看打卡記錄
        </AlertDescription>
      </Alert>
    );
  }

  if (!mounted) {
    return (
      <div className="text-center py-8">
        <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-gray-400" />
        <p className="text-gray-500">初始化中...</p>
      </div>
    );
  }
  
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium">打卡記錄</h3>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleRefresh}
          disabled={isLoading}
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          {isLoading ? '載入中...' : '重新載入'}
        </Button>
      </div>

      {isLoading ? (
        <div className="text-center py-8">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-gray-400" />
          <p className="text-gray-500">正在載入打卡記錄...</p>
        </div>
      ) : checkInRecords.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p className="text-lg">沒有找到任何打卡記錄</p>
          <p className="text-sm mt-2">請確認您已經完成打卡，或嘗試重新載入</p>
        </div>
      ) : (
        <div>
          <div className="mb-4 text-sm text-gray-600">
            總共 {checkInRecords.length} 筆記錄
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>日期</TableHead>
                <TableHead>時間</TableHead>
                <TableHead>動作</TableHead>
                <TableHead>類型</TableHead>
                <TableHead>狀態</TableHead>
                <TableHead>詳情</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {checkInRecords.map((record: CheckInRecord) => (
                <TableRow key={record.id}>
                  <TableCell>{formatDate(record.timestamp)}</TableCell>
                  <TableCell>{formatTime(record.timestamp)}</TableCell>
                  <TableCell>
                    <span className={record.action === 'check-in' ? 'text-green-600' : 'text-blue-600'}>
                      {record.action === 'check-in' ? '上班打卡' : '下班打卡'}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
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
                      <Badge className="bg-green-500">成功</Badge>
                    ) : (
                      <Badge className="bg-red-500">失敗</Badge>
                    )}
                  </TableCell>
                  <TableCell>
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
      )}
    </div>
  );
};

export default CheckInHistory;
