
import React, { useState, useEffect } from 'react';
import { MapPin, Clock, Edit, Trash2, RefreshCw, AlertCircle, ChevronLeft, ChevronRight, User, Users, Globe } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { useUser } from '@/contexts/UserContext';
import { useScheduling } from '@/contexts/SchedulingContext';
import { useScheduleOperationsHandlers } from '../hooks/useScheduleOperationsHandlers';

const ITEMS_PER_PAGE = 10;

type ScheduleViewType = 'my' | 'subordinates' | 'all';

interface ScheduleListViewProps {
  schedules: any[];
  getUserName: (userId: string) => string;
  canDeleteSchedule: (schedule: any) => boolean;
  onRemoveSchedule: (scheduleId: string) => Promise<void>;
}

const ScheduleListView: React.FC<ScheduleListViewProps> = ({
  schedules,
  getUserName,
  canDeleteSchedule,
  onRemoveSchedule
}) => {
  const { currentUser, isAdmin, hasPermission } = useUser();
  const { handleUpdateSchedule, handleDeleteSchedule } = useScheduleOperationsHandlers();
  const [refreshing, setRefreshing] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [activeView, setActiveView] = useState<ScheduleViewType>('my');
  const [viewSchedules, setViewSchedules] = useState<any[]>([]);
  const [deleting, setDeleting] = useState<string | null>(null);
  const { toast } = useToast();

  // 確保組件已掛載後才載入數據
  useEffect(() => {
    setMounted(true);
  }, []);

  // 根據選擇的視圖過濾排班記錄
  const filterSchedulesByView = (view: ScheduleViewType) => {
    if (!currentUser?.id) return [];
    
    switch (view) {
      case 'my':
        return schedules.filter(schedule => schedule.userId === currentUser.id);
      case 'subordinates':
        // 這裡應該根據實際的上下級關係來過濾
        // 暫時返回空陣列，需要後續實作上下級關係邏輯
        return [];
      case 'all':
        return isAdmin() ? schedules : schedules.filter(schedule => schedule.userId === currentUser.id);
      default:
        return schedules.filter(schedule => schedule.userId === currentUser.id);
    }
  };

  // 當視圖改變時更新顯示的排班記錄
  useEffect(() => {
    if (mounted && currentUser?.id) {
      const filtered = filterSchedulesByView(activeView);
      setViewSchedules(filtered);
    }
  }, [mounted, currentUser?.id, activeView, schedules]);

  const handleRefresh = async () => {
    if (currentUser?.id && !refreshing) {
      setRefreshing(true);
      try {
        // 重新載入排班數據的邏輯
        const filtered = filterSchedulesByView(activeView);
        setViewSchedules(filtered);
        toast({
          title: "重新載入成功",
          description: `載入了 ${filtered.length} 筆排班記錄`,
        });
      } catch (error) {
        console.error('重新載入失敗:', error);
        toast({
          title: "重新載入失敗",
          description: "無法重新載入排班記錄",
          variant: "destructive"
        });
      } finally {
        setRefreshing(false);
      }
    }
  };

  const handleDeleteSchedule = async (scheduleId: string) => {
    if (!isAdmin()) {
      toast({
        title: "權限不足",
        description: "只有系統管理員可以刪除排班記錄",
        variant: "destructive"
      });
      return;
    }

    setDeleting(scheduleId);
    try {
      await onRemoveSchedule(scheduleId);
      toast({
        title: "排班已刪除",
        description: "排班記錄已成功刪除",
      });
      // 重新載入記錄
      const filtered = filterSchedulesByView(activeView);
      setViewSchedules(filtered);
    } catch (error) {
      console.error('刪除排班失敗:', error);
      toast({
        title: "刪除失敗",
        description: "無法刪除排班記錄，請稍後重試",
        variant: "destructive"
      });
    } finally {
      setDeleting(null);
    }
  };

  const handleViewChange = (view: ScheduleViewType) => {
    setActiveView(view);
    setCurrentPage(1); // 重置頁碼
  };

  const isLoading = refreshing;

  // 分頁邏輯
  const totalPages = Math.ceil(viewSchedules.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentSchedules = viewSchedules.slice(startIndex, endIndex);

  const handlePreviousPage = () => {
    setCurrentPage(prev => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages));
  };

  const getViewTitle = (view: ScheduleViewType) => {
    switch (view) {
      case 'my': return '我的排班記錄';
      case 'subordinates': return '下屬排班記錄';
      case 'all': return '全部排班記錄';
      default: return '排班記錄';
    }
  };

  const getViewIcon = (view: ScheduleViewType) => {
    switch (view) {
      case 'my': return <User className="h-4 w-4" />;
      case 'subordinates': return <Users className="h-4 w-4" />;
      case 'all': return <Globe className="h-4 w-4" />;
      default: return <User className="h-4 w-4" />;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-TW', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  const formatDayOfWeek = (dateString: string) => {
    const date = new Date(dateString);
    const days = ['日', '一', '二', '三', '四', '五', '六'];
    return `星期${days[date.getDay()]}`;
  };

  const formatTimeRange = (startTime: string, endTime: string) => {
    return `${startTime} - ${endTime}`;
  };

  if (!currentUser) {
    return (
      <div className="bg-red-100/60 backdrop-blur-xl rounded-xl p-4 border border-red-200/40">
        <div className="flex items-center space-x-2 text-red-600">
          <AlertCircle className="h-4 w-4" />
          <span>請先登入才能查看排班記錄</span>
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
      {isAdmin() ? (
        <Tabs value={activeView} onValueChange={(value) => handleViewChange(value as ScheduleViewType)} className="w-full">
          <div className="flex items-center justify-between mb-4">
            <TabsList className="bg-white/20 backdrop-blur-xl border-white/30">
              <TabsTrigger value="my" className="flex items-center gap-2">
                {getViewIcon('my')}
                我的排班
              </TabsTrigger>
              <TabsTrigger value="subordinates" className="flex items-center gap-2">
                {getViewIcon('subordinates')}
                下屬排班
              </TabsTrigger>
              <TabsTrigger value="all" className="flex items-center gap-2">
                {getViewIcon('all')}
                全部排班
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
            {/* 排班內容 */}
            {isLoading ? (
              <div className="text-center py-12">
                <RefreshCw className="h-12 w-12 animate-spin mx-auto mb-4 text-white/60" />
                <p className="text-white/80 font-medium drop-shadow-md text-lg">正在載入{getViewTitle(activeView)}...</p>
              </div>
            ) : viewSchedules.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6 backdrop-blur-xl border border-white/30 shadow-lg">
                  <Clock className="w-10 h-10 text-white/60" />
                </div>
                <p className="text-white/80 font-semibold text-lg drop-shadow-md">沒有找到任何{getViewTitle(activeView)}</p>
                <p className="text-white/60 mt-2 drop-shadow-md">請確認已經完成排班，或嘗試重新載入</p>
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
                      總共 {viewSchedules.length} 筆記錄
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
                
                {/* 表格容器 */}
                <div className="bg-white/10 backdrop-blur-xl rounded-xl border border-white/20 shadow-lg overflow-hidden">
                  <ScrollArea className="h-[500px]">
                    <Table>
                      <TableHeader className="sticky top-0 bg-white/20 backdrop-blur-xl">
                        <TableRow className="border-white/20 hover:bg-white/5">
                          <TableHead className="text-white/90 font-semibold">日期</TableHead>
                          <TableHead className="text-white/90 font-semibold">星期</TableHead>
                          {activeView !== 'my' && <TableHead className="text-white/90 font-semibold">員工姓名</TableHead>}
                          <TableHead className="text-white/90 font-semibold">班別名稱</TableHead>
                          <TableHead className="text-white/90 font-semibold">時間</TableHead>
                          <TableHead className="text-white/90 font-semibold">備註</TableHead>
                          {isAdmin() && <TableHead className="text-white/90 font-semibold">操作</TableHead>}
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {currentSchedules.map((schedule: any) => (
                          <TableRow key={schedule.id} className="border-white/20 hover:bg-white/5 transition-colors duration-200">
                            <TableCell className="text-white/90 font-medium">{formatDate(schedule.workDate)}</TableCell>
                            <TableCell className="text-white/90 font-medium">{formatDayOfWeek(schedule.workDate)}</TableCell>
                            {activeView !== 'my' && (
                              <TableCell className="text-white/80">
                                {getUserName(schedule.userId) || '未知員工'}
                              </TableCell>
                            )}
                            <TableCell className="text-white/90 font-medium">{schedule.timeSlot}</TableCell>
                            <TableCell className="text-white/80">
                              {formatTimeRange(schedule.startTime, schedule.endTime)}
                            </TableCell>
                            <TableCell className="text-white/80">
                              {schedule.notes || '-'}
                            </TableCell>
                            {isAdmin() && (
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-blue-400 hover:text-blue-300 hover:bg-blue-500/20"
                                    onClick={() => {
                                      // 編輯功能將在後續實作
                                      toast({
                                        title: "編輯功能",
                                        description: "編輯功能將在後續版本中實作",
                                      });
                                    }}
                                  >
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        className="text-red-400 hover:text-red-300 hover:bg-red-500/20"
                                        disabled={deleting === schedule.id}
                                      >
                                        <Trash2 className="h-4 w-4" />
                                      </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                      <AlertDialogHeader>
                                        <AlertDialogTitle>確認刪除排班記錄</AlertDialogTitle>
                                        <AlertDialogDescription>
                                          您確定要刪除這筆排班記錄嗎？刪除後將無法復原。
                                        </AlertDialogDescription>
                                      </AlertDialogHeader>
                                      <AlertDialogFooter>
                                        <AlertDialogCancel>取消</AlertDialogCancel>
                                        <AlertDialogAction 
                                          onClick={() => handleDeleteSchedule(schedule.id)}
                                          className="bg-red-500 hover:bg-red-600"
                                        >
                                          確認刪除
                                        </AlertDialogAction>
                                      </AlertDialogFooter>
                                    </AlertDialogContent>
                                  </AlertDialog>
                                </div>
                              </TableCell>
                            )}
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </ScrollArea>
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
                我的排班記錄
              </h4>
              {viewSchedules.length > 0 && (
                <div className="text-sm text-white/80 font-medium drop-shadow-md">
                  總共 {viewSchedules.length} 筆記錄
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
              <p className="text-white/80 font-medium drop-shadow-md text-lg">正在載入排班記錄...</p>
            </div>
          ) : viewSchedules.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6 backdrop-blur-xl border border-white/30 shadow-lg">
                <Clock className="w-10 h-10 text-white/60" />
              </div>
              <p className="text-white/80 font-semibold text-lg drop-shadow-md">沒有找到任何排班記錄</p>
              <p className="text-white/60 mt-2 drop-shadow-md">請確認您已經完成排班，或嘗試重新載入</p>
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
              
              {/* 表格容器 */}
              <div className="bg-white/10 backdrop-blur-xl rounded-xl border border-white/20 shadow-lg overflow-hidden">
                <ScrollArea className="h-[500px]">
                  <Table>
                    <TableHeader className="sticky top-0 bg-white/20 backdrop-blur-xl">
                      <TableRow className="border-white/20 hover:bg-white/5">
                        <TableHead className="text-white/90 font-semibold">日期</TableHead>
                        <TableHead className="text-white/90 font-semibold">星期</TableHead>
                        <TableHead className="text-white/90 font-semibold">班別名稱</TableHead>
                        <TableHead className="text-white/90 font-semibold">時間</TableHead>
                        <TableHead className="text-white/90 font-semibold">備註</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {currentSchedules.map((schedule: any) => (
                        <TableRow key={schedule.id} className="border-white/20 hover:bg-white/5 transition-colors duration-200">
                          <TableCell className="text-white/90 font-medium">{formatDate(schedule.workDate)}</TableCell>
                          <TableCell className="text-white/90 font-medium">{formatDayOfWeek(schedule.workDate)}</TableCell>
                          <TableCell className="text-white/90 font-medium">{schedule.timeSlot}</TableCell>
                          <TableCell className="text-white/80">
                            {formatTimeRange(schedule.startTime, schedule.endTime)}
                          </TableCell>
                          <TableCell className="text-white/80">
                            {schedule.notes || '-'}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </ScrollArea>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ScheduleListView;
