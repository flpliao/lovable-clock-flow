
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
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());

  // Debug logging - 改善調試信息
  useEffect(() => {
    if (currentUser) {
      console.log(`NotificationCenter render - 用戶: ${currentUser.name}`);
      console.log(`  - 通知數量: ${notifications.length}`);
      console.log(`  - 未讀數量: ${unreadCount}`);
      console.log(`  - 載入狀態: ${isLoading}`);
      console.log(`  - 通知列表:`, notifications.map(n => ({ id: n.id, title: n.title, isRead: n.isRead })));
    }
  }, [notifications, unreadCount, isLoading, currentUser]);

  // 監聽公告相關的更新事件 - 改善事件處理
  useEffect(() => {
    if (!currentUser) return;

    const handleAnnouncementUpdate = (event: Event | CustomEvent) => {
      console.log(`收到公告更新事件 for ${currentUser.name}，刷新通知`);
      if (event instanceof CustomEvent && event.detail) {
        console.log('公告更新詳情:', event.detail);
      }
      refreshNotifications();
      setLastRefresh(new Date());
    };

    window.addEventListener('refreshAnnouncements', handleAnnouncementUpdate);
    window.addEventListener('announcementDataUpdated', handleAnnouncementUpdate);
    
    return () => {
      window.removeEventListener('refreshAnnouncements', handleAnnouncementUpdate);
      window.removeEventListener('announcementDataUpdated', handleAnnouncementUpdate);
    };
  }, [refreshNotifications, currentUser]);

  // Refresh notifications when location changes (但限制頻率)
  useEffect(() => {
    if (!currentUser) return;
    
    const now = new Date();
    if (now.getTime() - lastRefresh.getTime() > 3000) { // 3秒限制
      console.log(`NotificationCenter - 路由變更刷新通知 for ${currentUser.name}`);
      refreshNotifications();
      setLastRefresh(now);
    }
  }, [location.pathname, refreshNotifications, lastRefresh, currentUser]);
  
  const handleNotificationClick = (notification: Notification) => {
    console.log(`通知點擊 by ${currentUser?.name}:`, notification);
    markAsRead(notification.id);
    setOpen(false);
    
    // Handle different notification types with proper navigation
    if (notification.type === 'leave_approval' && notification.data?.leaveRequestId) {
      navigate(`/leave-approval/${notification.data.leaveRequestId}`);
    } else if (notification.type === 'leave_status' && notification.data?.leaveRequestId) {
      navigate('/leave-request');
    } else if (notification.type === 'announcement' || notification.type === 'system') {
      console.log(`公告通知點擊 by ${currentUser?.name}，觸發刷新`);
      
      // 觸發公告頁面刷新事件
      window.dispatchEvent(new CustomEvent('refreshAnnouncements'));
      window.dispatchEvent(new CustomEvent('announcementDataUpdated', { 
        detail: { type: 'refresh', source: 'notification_click', user: currentUser?.name }
      }));
      
      // Navigate to company announcements page
      if (location.pathname !== '/company-announcements') {
        console.log(`導航到公告頁面 for ${currentUser?.name}`);
        navigate('/company-announcements');
      }
    }
  };

  // Force refresh when popover opens (但限制頻率)
  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (newOpen && currentUser) {
      const now = new Date();
      if (now.getTime() - lastRefresh.getTime() > 2000) { // 2秒限制
        console.log(`NotificationCenter - popover 開啟刷新通知 for ${currentUser.name}`);
        refreshNotifications();
        setLastRefresh(now);
      }
    }
  };

  // 手動刷新功能
  const handleManualRefresh = () => {
    if (currentUser) {
      console.log(`手動刷新通知 by ${currentUser.name}`);
      refreshNotifications();
      setLastRefresh(new Date());
    }
  };
  
  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <button className="relative">
          <Bell className={`w-6 h-6 ${isLoading ? 'text-blue-400 animate-pulse' : unreadCount > 0 ? 'text-red-500' : 'text-gray-400'}`} />
          {unreadCount > 0 && (
            <Badge className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white text-xs px-1.5 py-0.5 min-w-[1.5rem] flex items-center justify-center rounded-full animate-pulse">
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
              用戶: {currentUser.name} | 
            </>
          )}
          最後更新: {lastRefresh.toLocaleTimeString()}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default NotificationCenter;
