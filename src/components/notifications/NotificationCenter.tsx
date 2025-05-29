
import React, { useState, useEffect } from 'react';
import { Bell, Check, X, TestTube } from 'lucide-react';
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
import { AnnouncementNotificationService } from '@/services/announcementNotificationService';
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

  // Debug logging with more details
  useEffect(() => {
    console.log('NotificationCenter render - notifications count:', notifications.length);
    console.log('NotificationCenter render - unreadCount:', unreadCount);
    console.log('NotificationCenter render - isLoading:', isLoading);
    console.log('NotificationCenter render - notifications:', notifications);
  }, [notifications, unreadCount, isLoading]);

  // Refresh notifications when component mounts or when returning from other pages
  useEffect(() => {
    console.log('NotificationCenter - refreshing notifications due to location change');
    refreshNotifications();
  }, [location.pathname, refreshNotifications]);

  // Set up an interval to periodically refresh notifications
  useEffect(() => {
    const interval = setInterval(() => {
      console.log('NotificationCenter - periodic refresh (every 15 seconds)');
      refreshNotifications();
    }, 15000); // Refresh every 15 seconds

    return () => clearInterval(interval);
  }, [refreshNotifications]);
  
  const handleNotificationClick = (notification: Notification) => {
    console.log('Notification clicked:', notification);
    markAsRead(notification.id);
    setOpen(false);
    
    // Handle different notification types with proper navigation
    if (notification.type === 'leave_approval' && notification.data?.leaveRequestId) {
      navigate(`/leave-approval/${notification.data.leaveRequestId}`);
    } else if (notification.type === 'leave_status' && notification.data?.leaveRequestId) {
      // Navigate to leave request page to view status
      navigate('/leave-request');
    } else if (notification.type === 'announcement' || notification.type === 'system') {
      console.log('Announcement notification clicked, forcing immediate refresh');
      
      // Immediately dispatch refresh events
      window.dispatchEvent(new CustomEvent('refreshAnnouncements'));
      window.dispatchEvent(new CustomEvent('announcementDataUpdated', { 
        detail: { type: 'refresh', source: 'notification_click' }
      }));
      
      // Navigate to company announcements page and ensure refresh
      if (location.pathname === '/company-announcements') {
        console.log('Already on announcements page, forcing immediate refresh');
        // Force multiple refresh events to ensure data is updated
        setTimeout(() => {
          window.dispatchEvent(new CustomEvent('refreshAnnouncements'));
          window.dispatchEvent(new CustomEvent('announcementDataUpdated', { 
            detail: { type: 'refresh', source: 'notification_refresh' }
          }));
        }, 50);
      } else {
        console.log('Navigating to announcements page');
        navigate('/company-announcements');
      }
    }
  };

  // Force refresh when popover opens
  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (newOpen) {
      console.log('NotificationCenter - popover opened, refreshing notifications');
      refreshNotifications();
    }
  };

  // 測試通知創建功能
  const handleTestNotification = async () => {
    if (!currentUser) {
      console.log('No current user for test notification');
      return;
    }

    console.log('開始測試通知創建...');
    const success = await AnnouncementNotificationService.testNotificationCreation(currentUser.id);
    
    if (success) {
      console.log('測試通知創建成功');
      // 重新載入通知
      setTimeout(() => {
        refreshNotifications();
      }, 1000);
    } else {
      console.log('測試通知創建失敗');
    }
  };
  
  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <button className="relative">
          <Bell className={`w-6 h-6 ${isLoading ? 'text-blue-400 animate-pulse' : 'text-gray-400'}`} />
          {unreadCount > 0 && (
            <Badge className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white text-xs px-1.5 py-0.5 min-w-[1.5rem] flex items-center justify-center rounded-full">
              {unreadCount}
            </Badge>
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 p-0">
        <div className="flex items-center justify-between border-b p-3">
          <h3 className="text-sm font-medium">通知 ({notifications.length})</h3>
          <div className="flex gap-1">
            {/* 測試按鈕 */}
            <Button
              variant="ghost"
              size="sm"
              className="h-8 px-2 text-xs"
              onClick={handleTestNotification}
              title="測試通知創建"
            >
              <TestTube className="h-3.5 w-3.5" />
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
          最後更新: {new Date().toLocaleTimeString()}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default NotificationCenter;
