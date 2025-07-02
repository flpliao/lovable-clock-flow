
import React, { useState, useEffect } from 'react';
import { Bell, Check, X, RefreshCw } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import NotificationItem, { Notification } from './NotificationItem';
import { useNavigate, useLocation } from 'react-router-dom';
import { useNotifications } from '@/hooks/useNotifications';
import { useUser } from '@/contexts/UserContext';

const NotificationCenter: React.FC = () => {
  const { 
    notifications, 
    unreadCount, 
    isLoading,
    markAsRead, 
    markAllAsRead,
    clearNotifications,
    refreshNotifications
  } = useNotifications();
  const { currentUser } = useUser();
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  // Debug logging - 減少 log 頻率
  useEffect(() => {
    if (currentUser && notifications.length > 0) {
      console.log(`NotificationCenter 狀態更新 - 用戶: ${currentUser.name} (${currentUser.role_id}), 通知數量: ${notifications.length}, 未讀: ${unreadCount}`);
    }
  }, [notifications.length, unreadCount, currentUser?.name]); // 減少依賴
  
  const handleNotificationClick = (notification: Notification) => {
    console.log(`通知點擊 by ${currentUser?.name} (${currentUser?.role_id}):`, notification);
    markAsRead(notification.id);// 在此處標記已讀
    setOpen(false);
    
    // Handle different notification types with proper navigation
    if (notification.type === 'leave_approval' && notification.data?.leaveRequestId) {
      navigate(`/leave-approval/${notification.data.leaveRequestId}`);
    } else if (notification.type === 'leave_status' && notification.data?.leaveRequestId) {
      navigate('/leave-request');
    } else if (notification.type === 'missed_checkin_approval' && notification.data?.missedCheckinRequestId) {
      navigate('/missed-checkin-management');
    } else if (notification.type === 'overtime_approval' || notification.type === 'overtime_status') {
      // 導航到核准中心，並設置為加班審核標籤
      navigate('/approval-center?tab=overtime');
    } else if (notification.type === 'announcement' || notification.type === 'system') {
      console.log(`公告通知點擊 by ${currentUser?.name} (${currentUser?.role_id})，觸發刷新`);
      
      // 觸發公告頁面刷新事件
      window.dispatchEvent(new CustomEvent('refreshAnnouncements'));
      window.dispatchEvent(new CustomEvent('announcementDataUpdated', { 
        detail: { type: 'refresh', source: 'notification_click', user: currentUser?.name, role: currentUser?.role_id }
      }));
      
      // Navigate to company announcements page
      if (location.pathname !== '/company-announcements') {
        console.log(`導航到公告頁面 for ${currentUser?.name} (${currentUser?.role_id})`);
        navigate('/company-announcements');
      }
    }
  };

  // 減少 popover 開啟時的刷新頻率
  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    // 移除開啟時的自動刷新 - 數據應該已經是最新的
  };

  // 手動刷新功能 - 保留
  const handleManualRefresh = () => {
    if (currentUser) {
      console.log(`手動刷新通知 by ${currentUser.name}`);
      refreshNotifications();
    }
  };
  
  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <button className="relative">
          <Bell className={`w-4 h-4 ${isLoading ? 'text-blue-400 animate-pulse' : unreadCount > 0 ? 'text-red-500' : 'text-white'}`} />
          {unreadCount > 0 && (
            <Badge className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white text-[8px] px-1 py-0.5 min-w-[1rem] h-[1rem] flex items-center justify-center rounded-full animate-pulse">
              {unreadCount}
            </Badge>
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 p-0">
        <div className="flex items-center justify-between border-b p-3">
          <h3 className="text-sm font-medium">通知 ({notifications.length})</h3>
          <div className="flex gap-1">
            {/* 手動刷新按鈕 */}
            <Button
              variant="ghost"
              size="sm"
              className="h-8 px-2 text-xs"
              onClick={handleManualRefresh}
              disabled={isLoading}
              title="手動刷新"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            </Button>
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                className="h-8 px-2 text-xs"
                onClick={markAllAsRead}
              >
                <Check className="h-3.5 w-3.5 mr-1" />
                全部已讀
              </Button>
            )}
            {notifications.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                className="h-8 px-2 text-xs text-red-500 hover:text-red-600"
                onClick={clearNotifications}
              >
                <X className="h-3.5 w-3.5 mr-1" />
                清空
              </Button>
            )}
          </div>
        </div>
        {isLoading ? (
          <div className="py-8 text-center text-sm text-gray-500">
            載入通知中...
          </div>
        ) : notifications.length === 0 ? (
          <div className="py-8 text-center text-sm text-gray-500">
            沒有新通知
          </div>
        ) : (
          <ScrollArea className="h-80">
            {notifications.map((notification) => (
              <NotificationItem
                key={notification.id}
                notification={notification}
                onClick={handleNotificationClick}
              />
            ))}
          </ScrollArea>
        )}
        <div className="border-t p-2 text-xs text-gray-500 text-center">
          {currentUser && (
            <>
              用戶: {currentUser.name} ({currentUser.role_id})
            </>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default NotificationCenter;
