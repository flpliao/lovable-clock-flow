import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useCheckInRecordManager } from '@/hooks/useCheckInRecordManager';
import { useCurrentUser } from '@/hooks/useStores';
import { useSupabaseCheckIn } from '@/hooks/useSupabaseCheckIn';
import { useToast } from '@/hooks/useToast';
import { permissionService } from '@/services/simplifiedPermissionService';
import { CheckInRecord } from '@/types';
import { formatDate, formatTime } from '@/utils/checkInUtils';
import {
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Globe,
  MapPin,
  RefreshCw,
  Trash2,
  User,
  Users,
  Wifi,
} from 'lucide-react';
import React, { useCallback, useEffect, useState } from 'react';

const ITEMS_PER_PAGE = 10;

type RecordViewType = 'my' | 'subordinates' | 'all';

// 擴展 CheckInRecord 類型以包含員工姓名
interface ExtendedCheckInRecord extends CheckInRecord {
  staff_name?: string;
}

const CheckInHistory: React.FC = () => {
  // 使用新的 Zustand hooks
  const currentUser = useCurrentUser();
  const isAdmin = permissionService.isAdmin();

  const { checkInRecords, loadCheckInRecords, loading } = useSupabaseCheckIn();
  const { deleteCheckInRecord, loadAllRecords, loadSubordinateRecords } = useCheckInRecordManager();
  const [refreshing, setRefreshing] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [activeView, setActiveView] = useState<RecordViewType>('my');
  const [viewRecords, setViewRecords] = useState<ExtendedCheckInRecord[]>([]);
  const [deleting, setDeleting] = useState<string | null>(null);
  const { toast } = useToast();

  // 確保組件已掛載後才載入數據
  useEffect(() => {
    setMounted(true);
  }, []);

  // 穩定化 loadRecordsByView 函數
  const loadRecordsByView = useCallback(
    async (view: RecordViewType) => {
      if (!currentUser?.id) return;

      try {
        let records: ExtendedCheckInRecord[] = [];

        switch (view) {
          case 'my':
            await loadCheckInRecords();
            // 不直接使用 checkInRecords，而是等待 loadCheckInRecords 完成後再更新
            break;
          case 'subordinates':
            if (isAdmin) {
              records = await loadSubordinateRecords(currentUser.id);
              setViewRecords(records);
            }
            break;
          case 'all':
            if (isAdmin) {
              records = await loadAllRecords();
              setViewRecords(records);
            }
            break;
          default:
            break;
        }
      } catch (error) {
        console.error('載入記錄失敗:', error);
        toast({
          title: '載入失敗',
          description: '無法載入打卡記錄',
          variant: 'destructive',
        });
      }
    },
    [currentUser?.id, loadCheckInRecords, isAdmin, loadSubordinateRecords, loadAllRecords, toast]
  );

  // 初始載入
  useEffect(() => {
    if (mounted && currentUser?.id && !loading) {
      console.log('CheckInHistory - 初次載入打卡記錄');
      loadRecordsByView(activeView);
    }
  }, [mounted, currentUser?.id, activeView, loadRecordsByView, loading]);

  // 當 checkInRecords 更新時，同步更新 viewRecords（僅限 'my' 視圖）
  useEffect(() => {
    if (activeView === 'my') {
      setViewRecords(checkInRecords);
    }
  }, [checkInRecords, activeView]);

  const handleRefresh = useCallback(async () => {
    if (currentUser?.id && !refreshing && !loading) {
      console.log('CheckInHistory - 手動重新載入打卡記錄');
      setRefreshing(true);
      try {
        await loadRecordsByView(activeView);
        toast({
          title: '重新載入成功',
          description: `載入了 ${viewRecords.length} 筆打卡記錄`,
        });
      } catch (error) {
        console.error('重新載入失敗:', error);
        toast({
          title: '重新載入失敗',
          description: '無法重新載入打卡記錄',
          variant: 'destructive',
        });
      } finally {
        setRefreshing(false);
      }
    }
  }, [
    currentUser?.id,
    refreshing,
    loading,
    loadRecordsByView,
    activeView,
    viewRecords.length,
    toast,
  ]);

  const handleDeleteRecord = useCallback(
    async (recordId: string) => {
      if (!isAdmin) {
        toast({
          title: '權限不足',
          description: '只有系統管理員可以刪除打卡記錄',
          variant: 'destructive',
        });
        return;
      }

      setDeleting(recordId);
      try {
        const success = await deleteCheckInRecord(recordId);
        if (success) {
          toast({
            title: '記錄已刪除',
            description: '記錄已刪除，請通知該員工重新補打卡',
          });
          // 重新載入記錄
          await loadRecordsByView(activeView);
        }
      } catch (error) {
        console.error('刪除記錄失敗:', error);
        toast({
          title: '刪除失敗',
          description: '無法刪除打卡記錄，請稍後重試',
          variant: 'destructive',
        });
      } finally {
        setDeleting(null);
      }
    },
    [isAdmin, deleteCheckInRecord, loadRecordsByView, activeView, toast]
  );

  const handleViewChange = useCallback((view: RecordViewType) => {
    setActiveView(view);
    setCurrentPage(1); // 重置頁碼
  }, []);

  const isLoading = loading || refreshing;

  // 分頁邏輯
  const totalPages = Math.ceil(viewRecords.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentRecords = viewRecords.slice(startIndex, endIndex);

  const handlePreviousPage = () => {
    setCurrentPage(prev => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages));
  };

  const getViewTitle = (view: RecordViewType) => {
    switch (view) {
      case 'my':
        return '我的打卡記錄';
      case 'subordinates':
        return '下屬打卡記錄';
      case 'all':
        return '全部打卡記錄';
      default:
        return '打卡記錄';
    }
  };

  const getViewIcon = (view: RecordViewType) => {
    switch (view) {
      case 'my':
        return <User className="h-4 w-4" />;
      case 'subordinates':
        return <Users className="h-4 w-4" />;
      case 'all':
        return <Globe className="h-4 w-4" />;
      default:
        return <User className="h-4 w-4" />;
    }
  };

  console.log('CheckInHistory - 渲染狀態:', {
    mounted,
    currentUser: currentUser?.id,
    recordsCount: viewRecords.length,
    isLoading,
    currentPage,
    totalPages,
    activeView,
    isAdmin,
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
      {/* 系統管理員才顯示切換標籤 */}
      {isAdmin ? (
        <Tabs
          value={activeView}
          onValueChange={value => handleViewChange(value as RecordViewType)}
          className="w-full"
        >
          <div className="flex items-center justify-between mb-4">
            <TabsList className="bg-white/20 backdrop-blur-xl border-white/30">
              <TabsTrigger value="my" className="flex items-center gap-2">
                {getViewIcon('my')}
                我的記錄
              </TabsTrigger>
              <TabsTrigger value="subordinates" className="flex items-center gap-2">
                {getViewIcon('subordinates')}
                下屬記錄
              </TabsTrigger>
              <TabsTrigger value="all" className="flex items-center gap-2">
                {getViewIcon('all')}
                全部記錄
              </TabsTrigger>
            </TabsList>
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

          <TabsContent value={activeView} className="space-y-4">
            {/* 記錄內容 */}
            {isLoading ? (
              <div className="text-center py-12">
                <RefreshCw className="h-12 w-12 animate-spin mx-auto mb-4 text-white/60" />
                <p className="text-white/80 font-medium drop-shadow-md text-lg">
                  正在載入{getViewTitle(activeView)}...
                </p>
              </div>
            ) : viewRecords.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6 backdrop-blur-xl border border-white/30 shadow-lg">
                  <svg
                    className="w-10 h-10 text-white/60"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <p className="text-white/80 font-semibold text-lg drop-shadow-md">
                  沒有找到任何{getViewTitle(activeView)}
                </p>
                <p className="text-white/60 mt-2 drop-shadow-md">
                  請確認已經完成打卡，或嘗試重新載入
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <h4 className="text-white font-medium drop-shadow-md flex items-center gap-2">
                      {getViewIcon(activeView)}
                      {getViewTitle(activeView)}
                    </h4>
                    <div className="text-sm text-white/80 font-medium drop-shadow-md">
                      總共 {viewRecords.length} 筆記錄
                    </div>
                  </div>
                </div>

                {/* 分頁資訊 */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-white/80 font-medium drop-shadow-md">
                      第 {currentPage} 頁，共 {totalPages} 頁
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handlePreviousPage}
                        disabled={currentPage === 1}
                        className="bg-white/20 backdrop-blur-xl border-white/30 text-white hover:bg-white/30 rounded-lg"
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <span className="text-white/80 text-sm font-medium px-3">
                        {currentPage} / {totalPages}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleNextPage}
                        disabled={currentPage === totalPages}
                        className="bg-white/20 backdrop-blur-xl border-white/30 text-white hover:bg-white/30 rounded-lg"
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}

                {/* 表格容器 - 添加水平滾動 */}
                <div className="bg-white/10 backdrop-blur-xl rounded-xl border border-white/20 shadow-lg overflow-hidden">
                  <div className="w-full overflow-x-auto">
                    <div className="min-w-full">
                      <ScrollArea className="h-[500px]">
                        <Table>
                          <TableHeader className="sticky top-0 bg-white/20 backdrop-blur-xl">
                            <TableRow className="border-white/20 hover:bg-white/5">
                              <TableHead className="text-white/90 font-semibold min-w-[80px] whitespace-nowrap">
                                日期
                              </TableHead>
                              <TableHead className="text-white/90 font-semibold min-w-[80px] whitespace-nowrap">
                                時間
                              </TableHead>
                              <TableHead className="text-white/90 font-semibold min-w-[80px] whitespace-nowrap">
                                動作
                              </TableHead>
                              <TableHead className="text-white/90 font-semibold min-w-[80px] whitespace-nowrap">
                                類型
                              </TableHead>
                              <TableHead className="text-white/90 font-semibold min-w-[60px] whitespace-nowrap">
                                狀態
                              </TableHead>
                              <TableHead className="text-white/90 font-semibold min-w-[120px] whitespace-nowrap">
                                詳情
                              </TableHead>
                              {activeView !== 'my' && (
                                <TableHead className="text-white/90 font-semibold min-w-[80px] whitespace-nowrap">
                                  員工
                                </TableHead>
                              )}
                              {isAdmin && (
                                <TableHead className="text-white/90 font-semibold min-w-[60px] whitespace-nowrap">
                                  操作
                                </TableHead>
                              )}
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {currentRecords.map((record: ExtendedCheckInRecord) => (
                              <TableRow
                                key={record.id}
                                className="border-white/20 hover:bg-white/5 transition-colors duration-200"
                              >
                                <TableCell className="text-white/90 font-medium whitespace-nowrap">
                                  {formatDate(record.timestamp)}
                                </TableCell>
                                <TableCell className="text-white/90 font-medium whitespace-nowrap">
                                  {formatTime(record.timestamp)}
                                </TableCell>
                                <TableCell className="whitespace-nowrap">
                                  <span
                                    className={`font-semibold ${record.action === 'check-in' ? 'text-green-300' : 'text-blue-300'}`}
                                  >
                                    {record.action === 'check-in' ? '上班打卡' : '下班打卡'}
                                  </span>
                                </TableCell>
                                <TableCell className="whitespace-nowrap">
                                  <div className="flex items-center text-white/90">
                                    {record.type === 'location' ? (
                                      <MapPin className="h-3.5 w-3.5 mr-1 flex-shrink-0" />
                                    ) : (
                                      <Wifi className="h-3.5 w-3.5 mr-1 flex-shrink-0" />
                                    )}
                                    <span>
                                      {record.type === 'location' ? '位置打卡' : 'IP打卡'}
                                    </span>
                                  </div>
                                </TableCell>
                                <TableCell className="whitespace-nowrap">
                                  {record.status === 'success' ? (
                                    <Badge className="bg-green-500/80 text-white border-green-400/50 backdrop-blur-xl">
                                      成功
                                    </Badge>
                                  ) : (
                                    <Badge className="bg-red-500/80 text-white border-red-400/50 backdrop-blur-xl">
                                      失敗
                                    </Badge>
                                  )}
                                </TableCell>
                                <TableCell className="text-white/80 whitespace-nowrap">
                                  {record.type === 'location' ? (
                                    <span>
                                      {record.details.locationName}
                                      {record.details.distance &&
                                        ` (${Math.round(record.details.distance)}公尺)`}
                                    </span>
                                  ) : (
                                    <span>IP: {record.details.ip}</span>
                                  )}
                                </TableCell>
                                {activeView !== 'my' && (
                                  <TableCell className="text-white/80 whitespace-nowrap">
                                    {record.staff_name || '未知員工'}
                                  </TableCell>
                                )}
                                {isAdmin && (
                                  <TableCell className="whitespace-nowrap">
                                    <AlertDialog>
                                      <AlertDialogTrigger asChild>
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          className="text-red-400 hover:text-red-300 hover:bg-red-500/20"
                                          disabled={deleting === record.id}
                                        >
                                          <Trash2 className="h-4 w-4" />
                                        </Button>
                                      </AlertDialogTrigger>
                                      <AlertDialogContent>
                                        <AlertDialogHeader>
                                          <AlertDialogTitle>確認刪除打卡記錄</AlertDialogTitle>
                                          <AlertDialogDescription>
                                            您確定要刪除這筆打卡記錄嗎？刪除後將無法復原，請通知該員工重新補打卡。
                                          </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                          <AlertDialogCancel>取消</AlertDialogCancel>
                                          <AlertDialogAction
                                            onClick={() => handleDeleteRecord(record.id)}
                                            className="bg-red-500 hover:bg-red-600"
                                          >
                                            確認刪除
                                          </AlertDialogAction>
                                        </AlertDialogFooter>
                                      </AlertDialogContent>
                                    </AlertDialog>
                                  </TableCell>
                                )}
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </ScrollArea>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      ) : (
        // 一般員工只顯示自己的記錄
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h4 className="text-white font-medium drop-shadow-md flex items-center gap-2">
                <User className="h-4 w-4" />
                我的打卡記錄
              </h4>
              {checkInRecords.length > 0 && (
                <div className="text-sm text-white/80 font-medium drop-shadow-md">
                  總共 {checkInRecords.length} 筆記錄
                </div>
              )}
            </div>
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
              <p className="text-white/80 font-medium drop-shadow-md text-lg">
                正在載入打卡記錄...
              </p>
            </div>
          ) : checkInRecords.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6 backdrop-blur-xl border border-white/30 shadow-lg">
                <svg
                  className="w-10 h-10 text-white/60"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <p className="text-white/80 font-semibold text-lg drop-shadow-md">
                沒有找到任何打卡記錄
              </p>
              <p className="text-white/60 mt-2 drop-shadow-md">
                請確認您已經完成打卡，或嘗試重新載入
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* 分頁資訊 */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between">
                  <div className="text-sm text-white/80 font-medium drop-shadow-md">
                    第 {currentPage} 頁，共 {totalPages} 頁
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handlePreviousPage}
                      disabled={currentPage === 1}
                      className="bg-white/20 backdrop-blur-xl border-white/30 text-white hover:bg-white/30 rounded-lg"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <span className="text-white/80 text-sm font-medium px-3">
                      {currentPage} / {totalPages}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleNextPage}
                      disabled={currentPage === totalPages}
                      className="bg-white/20 backdrop-blur-xl border-white/30 text-white hover:bg-white/30 rounded-lg"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}

              {/* 表格容器 - 添加水平滾動 */}
              <div className="bg-white/10 backdrop-blur-xl rounded-xl border border-white/20 shadow-lg overflow-hidden">
                <div className="w-full overflow-x-auto">
                  <div className="min-w-full">
                    <ScrollArea className="h-[500px]">
                      <Table>
                        <TableHeader className="sticky top-0 bg-white/20 backdrop-blur-xl">
                          <TableRow className="border-white/20 hover:bg-white/5">
                            <TableHead className="text-white/90 font-semibold min-w-[80px] whitespace-nowrap">
                              日期
                            </TableHead>
                            <TableHead className="text-white/90 font-semibold min-w-[80px] whitespace-nowrap">
                              時間
                            </TableHead>
                            <TableHead className="text-white/90 font-semibold min-w-[80px] whitespace-nowrap">
                              動作
                            </TableHead>
                            <TableHead className="text-white/90 font-semibold min-w-[80px] whitespace-nowrap">
                              類型
                            </TableHead>
                            <TableHead className="text-white/90 font-semibold min-w-[60px] whitespace-nowrap">
                              狀態
                            </TableHead>
                            <TableHead className="text-white/90 font-semibold min-w-[120px] whitespace-nowrap">
                              詳情
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {currentRecords.map((record: ExtendedCheckInRecord) => (
                            <TableRow
                              key={record.id}
                              className="border-white/20 hover:bg-white/5 transition-colors duration-200"
                            >
                              <TableCell className="text-white/90 font-medium whitespace-nowrap">
                                {formatDate(record.timestamp)}
                              </TableCell>
                              <TableCell className="text-white/90 font-medium whitespace-nowrap">
                                {formatTime(record.timestamp)}
                              </TableCell>
                              <TableCell className="whitespace-nowrap">
                                <span
                                  className={`font-semibold ${record.action === 'check-in' ? 'text-green-300' : 'text-blue-300'}`}
                                >
                                  {record.action === 'check-in' ? '上班打卡' : '下班打卡'}
                                </span>
                              </TableCell>
                              <TableCell className="whitespace-nowrap">
                                <div className="flex items-center text-white/90">
                                  {record.type === 'location' ? (
                                    <MapPin className="h-3.5 w-3.5 mr-1 flex-shrink-0" />
                                  ) : (
                                    <Wifi className="h-3.5 w-3.5 mr-1 flex-shrink-0" />
                                  )}
                                  <span>{record.type === 'location' ? '位置打卡' : 'IP打卡'}</span>
                                </div>
                              </TableCell>
                              <TableCell className="whitespace-nowrap">
                                {record.status === 'success' ? (
                                  <Badge className="bg-green-500/80 text-white border-green-400/50 backdrop-blur-xl">
                                    成功
                                  </Badge>
                                ) : (
                                  <Badge className="bg-red-500/80 text-white border-red-400/50 backdrop-blur-xl">
                                    失敗
                                  </Badge>
                                )}
                              </TableCell>
                              <TableCell className="text-white/80 whitespace-nowrap">
                                {record.type === 'location' ? (
                                  <span>
                                    {record.details.locationName}
                                    {record.details.distance &&
                                      ` (${Math.round(record.details.distance)}公尺)`}
                                  </span>
                                ) : (
                                  <span>IP: {record.details.ip}</span>
                                )}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </ScrollArea>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CheckInHistory;
