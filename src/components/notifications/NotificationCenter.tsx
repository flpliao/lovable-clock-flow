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

  // Debug logging
  useEffect(() => {
    if (currentUser) {
      console.log(`NotificationCenter 狀態更新 - 用戶: ${currentUser.name} (${currentUser.role})`);
      console.log(`  - 通知數量: ${notifications.length}`);
      console.log(`  - 未讀數量: ${unreadCount}`);
      console.log(`  - 載入狀態: ${isLoading}`);
      console.log(`  - 通知詳情:`, notifications.map(n => ({ 
        id: n.id, 
        title: n.title, 
        isRead: n.isRead,
        type: n.type,
        createdAt: n.createdAt 
      })));
    }
  }, [notifications, unreadCount, isLoading, currentUser]);

  // 監聽各種通知更新事件
  useEffect(() => {
    if (!currentUser) return;

    const handleUserNotificationUpdate = (event: CustomEvent) => {
      console.log(`收到用戶專屬通知事件 for ${currentUser.name} (${currentUser.role}):`, event.detail);
      
      if (event.detail?.userId === currentUser.id) {
        console.log(`用戶專屬通知事件匹配，立即刷新 ${currentUser.name} 的通知`);
        refreshNotifications();
        setLastRefresh(new Date());
      }
    };

    const handleUserSpecificRefresh = (event: CustomEvent) => {
      console.log(`收到用戶專屬強制刷新事件 for ${currentUser.name} (${currentUser.role}):`, event.detail);
      refreshNotifications();
      setLastRefresh(new Date());
    };

    const handleNotificationUpdate = (event: CustomEvent) => {
      console.log(`收到通知更新事件 for ${currentUser.name} (${currentUser.role}):`, event.detail);
      
      // 檢查是否與當前用戶相關
      if (event.detail?.affectedUsers && Array.isArray(event.detail.affectedUsers)) {
        const isUserAffected = event.detail.affectedUsers.some((user: any) => user.id === currentUser.id);
        if (isUserAffected) {
          console.log(`通知事件包含當前用戶 ${currentUser.name} (${currentUser.role})，立即刷新`);
          refreshNotifications();
          setLastRefresh(new Date());
        } else {
          console.log(`通知事件不包含當前用戶 ${currentUser.name} (${currentUser.role})，但仍要刷新通知`);
          // 對於公告通知，所有用戶都應該刷新
          refreshNotifications();
          setLastRefresh(new Date());
        }
      } else {
        // 如果沒有特定用戶列表，則刷新所有用戶的通知
        console.log(`通用通知事件，為 ${currentUser.name} (${currentUser.role}) 刷新通知`);
        refreshNotifications();
        setLastRefresh(new Date());
      }
    };

    const handleForceRefresh = (event: CustomEvent) => {
      console.log(`收到強制刷新事件 for ${currentUser.name} (${currentUser.role}):`, event.detail);
      refreshNotifications();
      setLastRefresh(new Date());
    };

    const handleAnnouncementUpdate = (event: Event | CustomEvent) => {
      console.log(`收到公告更新事件 for ${currentUser.name} (${currentUser.role})`);
      if (event instanceof CustomEvent && event.detail) {
        console.log('公告更新詳情:', event.detail);
      }
      
      // 公告更新可能影響通知，立即刷新
      refreshNotifications();
      setLastRefresh(new Date());
    };

    // 註冊事件監聽器
    window.addEventListener('userNotificationUpdated', handleUserNotificationUpdate as EventListener);
    window.addEventListener(`forceNotificationRefresh-${currentUser.id}`, handleUserSpecificRefresh as EventListener);
    window.addEventListener('notificationUpdated', handleNotificationUpdate as EventListener);
    window.addEventListener('forceNotificationRefresh', handleForceRefresh as EventListener);
    window.addEventListener('refreshAnnouncements', handleAnnouncementUpdate);
    window.addEventListener('announcementDataUpdated', handleAnnouncementUpdate);
    
    return () => {
      window.removeEventListener('userNotificationUpdated', handleUserNotificationUpdate as EventListener);
      window.removeEventListener(`forceNotificationRefresh-${currentUser.id}`, handleUserSpecificRefresh as EventListener);
      window.removeEventListener('notificationUpdated', handleNotificationUpdate as EventListener);
      window.removeEventListener('forceNotificationRefresh', handleForceRefresh as EventListener);
      window.removeEventListener('refreshAnnouncements', handleAnnouncementUpdate);
      window.removeEventListener('announcementDataUpdated', handleAnnouncementUpdate);
    };
  }, [refreshNotifications, currentUser]);

  // 當路由變更時刷新通知（但限制頻率）
  useEffect(() => {
    if (!currentUser) return;
    
    const now = new Date();
    if (now.getTime() - lastRefresh.getTime() > 2000) { // 2秒限制
      console.log(`路由變更刷新通知 for ${currentUser.name}`);
      refreshNotifications();
      setLastRefresh(now);
    }
  }, [location.pathname, refreshNotifications, lastRefresh, currentUser]);
  
  const handleNotificationClick = (notification: Notification) => {
    console.log(`通知點擊 by ${currentUser?.name} (${currentUser?.role}):`, notification);
    markAsRead(notification.id);
    setOpen(false);
    
    // Handle different notification types with proper navigation
    if (notification.type === 'leave_approval' && notification.data?.leaveRequestId) {
      navigate(`/leave-approval/${notification.data.leaveRequestId}`);
    } else if (notification.type === 'leave_status' && notification.data?.leaveRequestId) {
      navigate('/leave-request');
    } else if (notification.type === 'announcement' || notification.type === 'system') {
      console.log(`公告通知點擊 by ${currentUser?.name} (${currentUser?.role})，觸發刷新`);
      
      // 觸發公告頁面刷新事件
      window.dispatchEvent(new CustomEvent('refreshAnnouncements'));
      window.dispatchEvent(new CustomEvent('announcementDataUpdated', { 
        detail: { type: 'refresh', source: 'notification_click', user: currentUser?.name, role: currentUser?.role }
      }));
      
      // Navigate to company announcements page
      if (location.pathname !== '/company-announcements') {
        console.log(`導航到公告頁面 for ${currentUser?.name} (${currentUser?.role})`);
        navigate('/company-announcements');
      }
    }
  };

  // Force refresh when popover opens（但限制頻率）
  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (newOpen && currentUser) {
      const now = new Date();
      if (now.getTime() - lastRefresh.getTime() > 1000) { // 1秒限制
        console.log(`popover 開啟刷新通知 for ${currentUser.name}`);
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
              用戶: {currentUser.name} ({currentUser.role}) | 
            </>
          )}
          最後更新: {lastRefresh.toLocaleTimeString()}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default NotificationCenter;
