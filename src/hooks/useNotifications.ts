
import { useState, useEffect } from 'react';
import { Notification } from '@/components/notifications/NotificationItem';
import { useUser } from '@/contexts/UserContext';
import { toast } from '@/hooks/use-toast';
import { v4 as uuidv4 } from 'uuid';

// Mock notifications for demo
const generateMockNotifications = (currentUserId: string): Notification[] => [
  {
    id: '1',
    title: '請假申請等待審核',
    message: '王小明的年假申請需要您的審核',
    type: 'leave_approval',
    createdAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(), // 15 minutes ago
    isRead: false,
    data: {
      leaveRequestId: '4',
      actionRequired: true
    }
  },
  {
    id: '2',
    title: '請假已核准',
    message: '您的請假申請已被主管核准',
    type: 'leave_status',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(), // 3 hours ago
    isRead: true,
    data: {
      leaveRequestId: '2'
    }
  },
  {
    id: '3',
    title: '系統公告',
    message: '系統將於本週末進行維護，請提前完成您的工作',
    type: 'system',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
    isRead: false
  }
];

export const useNotifications = () => {
  const { currentUser } = useUser();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // Load notifications
  useEffect(() => {
    if (currentUser) {
      // In a real app, we would fetch from API
      const savedNotifications = localStorage.getItem(`notifications-${currentUser.id}`);
      
      if (savedNotifications) {
        try {
          const parsed = JSON.parse(savedNotifications);
          setNotifications(parsed);
          setUnreadCount(parsed.filter((n: Notification) => !n.isRead).length);
        } catch (e) {
          console.error('Failed to parse saved notifications', e);
          
          // Fallback to mock data
          const mockData = generateMockNotifications(currentUser.id);
          setNotifications(mockData);
          setUnreadCount(mockData.filter(n => !n.isRead).length);
        }
      } else {
        // Use mock data for demo
        const mockData = generateMockNotifications(currentUser.id);
        setNotifications(mockData);
        setUnreadCount(mockData.filter(n => !n.isRead).length);
      }
    } else {
      setNotifications([]);
      setUnreadCount(0);
    }
  }, [currentUser]);

  // Save notifications to localStorage
  useEffect(() => {
    if (currentUser && notifications.length > 0) {
      localStorage.setItem(`notifications-${currentUser.id}`, JSON.stringify(notifications));
      setUnreadCount(notifications.filter(n => !n.isRead).length);
    }
  }, [notifications, currentUser]);

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id ? { ...notification, isRead: true } : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, isRead: true }))
    );
    toast({
      title: "已標記為已讀",
      description: "所有通知已標記為已讀"
    });
  };

  const clearNotifications = () => {
    setNotifications([]);
    if (currentUser) {
      localStorage.removeItem(`notifications-${currentUser.id}`);
    }
    toast({
      title: "通知已清空",
      description: "所有通知已被清空"
    });
  };

  const addNotification = (notification: Omit<Notification, 'id' | 'createdAt' | 'isRead'>) => {
    const newNotification: Notification = {
      ...notification,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      isRead: false
    };
    
    setNotifications(prev => [newNotification, ...prev]);
    
    // Also show a toast for real-time feedback
    toast({
      title: notification.title,
      description: notification.message,
      duration: 5000
    });
    
    return newNotification.id;
  };

  return { 
    notifications, 
    unreadCount, 
    markAsRead, 
    markAllAsRead, 
    clearNotifications,
    addNotification
  };
};
