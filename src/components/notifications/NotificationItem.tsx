
import React from 'react';
import { Calendar, Clock, FileText, AlertCircle, Timer } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { zhTW } from 'date-fns/locale';
import { cn } from '@/lib/utils';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'leave_approval' | 'leave_status' | 'system' | 'announcement' | 'missed_checkin_approval' | 'overtime_approval' | 'overtime_status';
  createdAt: string;
  isRead: boolean;
  data?: {
    leaveRequestId?: string;
    missedCheckinRequestId?: string;
    overtimeRequestId?: string;
    userId?: string;
    actionRequired?: boolean;
    announcementId?: string;
    applicantName?: string;
    requestDate?: string;
    missedType?: string;
    overtimeDate?: string;
    overtimeType?: string;
  };
}

interface NotificationItemProps {
  notification: Notification;
  onClick: (notification: Notification) => void;
}

const NotificationItem: React.FC<NotificationItemProps> = ({ notification, onClick }) => {
  const timeAgo = formatDistanceToNow(new Date(notification.createdAt), { 
    addSuffix: true,
    locale: zhTW
  });
  
  const getIcon = () => {
    switch (notification.type) {
      case 'leave_approval':
        return <Calendar className="h-5 w-5 text-blue-500" />;
      case 'leave_status':
        return <Clock className="h-5 w-5 text-green-500" />;
      case 'announcement':
        return <FileText className="h-5 w-5 text-purple-500" />;
      case 'missed_checkin_approval':
        return <AlertCircle className="h-5 w-5 text-orange-500" />;
      case 'overtime_approval':
        return <Timer className="h-5 w-5 text-red-500" />;
      case 'overtime_status':
        return <Timer className="h-5 w-5 text-indigo-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-500" />;
    }
  };
  
  return (
    <div 
      className={cn(
        "flex items-start p-3 hover:bg-gray-50 cursor-pointer border-b",
        notification.isRead ? "opacity-70" : "bg-blue-50"
      )}
      onClick={() => onClick(notification)}
    >
      <div className="flex-shrink-0 mt-1">
        {getIcon()}
      </div>
      <div className="ml-3 flex-1">
        <div className="flex justify-between">
          <p className={cn("text-sm font-medium", !notification.isRead && "font-semibold")}>
            {notification.title}
          </p>
          <span className="text-xs text-gray-500">{timeAgo}</span>
        </div>
        <p className="text-xs text-gray-600 mt-1">{notification.message}</p>
        {notification.data?.actionRequired && (
          <span className="inline-block mt-1 px-2 py-0.5 text-xs bg-red-100 text-red-800 rounded-full">
            需要處理
          </span>
        )}
      </div>
    </div>
  );
};

export default NotificationItem;
