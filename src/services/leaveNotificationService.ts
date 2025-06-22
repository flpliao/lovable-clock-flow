
import { supabase } from '@/integrations/supabase/client';
import { NotificationDatabaseOperations } from '@/services/notifications';

export interface LeaveNotificationData {
  applicantId: string;
  applicantName: string;
  leaveRequestId: string;
  leaveType: string;
  startDate: string;
  endDate: string;
  reason: string;
  approverId: string;
}

// 發送請假申請通知給主管
export const sendLeaveApprovalNotification = async (data: LeaveNotificationData): Promise<boolean> => {
  try {
    console.log('🔔 發送請假審核通知:', data);

    // 獲取主管資訊
    const { data: approverData, error: approverError } = await supabase
      .from('staff')
      .select('name')
      .eq('id', data.approverId)
      .maybeSingle();

    if (approverError || !approverData) {
      console.error('❌ 獲取主管資訊失敗:', approverError);
      return false;
    }

    // 建立通知
    const notificationId = await NotificationDatabaseOperations.addNotification(data.approverId, {
      title: `請假申請待審核`,
      message: `${data.applicantName} 申請 ${getLeaveTypeText(data.leaveType)} (${data.startDate} 至 ${data.endDate})，請進行審核`,
      type: 'leave_approval',
      data: {
        leaveRequestId: data.leaveRequestId,
        applicantName: data.applicantName,
        actionRequired: true
      }
    });

    if (notificationId) {
      console.log('✅ 請假審核通知發送成功:', notificationId);
      
      // 觸發通知更新事件
      window.dispatchEvent(new CustomEvent('notificationUpdated', {
        detail: { 
          type: 'leave_approval',
          userId: data.approverId,
          leaveRequestId: data.leaveRequestId 
        }
      }));
      
      return true;
    }

    return false;
  } catch (error) {
    console.error('❌ 發送請假審核通知失敗:', error);
    return false;
  }
};

// 發送請假狀態更新通知給申請人
export const sendLeaveStatusNotification = async (
  applicantId: string,
  applicantName: string,
  leaveRequestId: string,
  status: 'approved' | 'rejected',
  approverName: string,
  comment?: string
): Promise<boolean> => {
  try {
    console.log('🔔 發送請假狀態通知:', { applicantId, status, approverName });

    const statusText = status === 'approved' ? '已核准' : '已退回';
    const message = comment 
      ? `您的請假申請${statusText}。審核人：${approverName}，備註：${comment}`
      : `您的請假申請${statusText}。審核人：${approverName}`;

    const notificationId = await NotificationDatabaseOperations.addNotification(applicantId, {
      title: `請假申請${statusText}`,
      message,
      type: 'leave_status',
      data: {
        leaveRequestId,
        approverName
      }
    });

    if (notificationId) {
      console.log('✅ 請假狀態通知發送成功:', notificationId);
      
      // 觸發通知更新事件
      window.dispatchEvent(new CustomEvent('notificationUpdated', {
        detail: { 
          type: 'leave_status',
          userId: applicantId,
          leaveRequestId 
        }
      }));
      
      return true;
    }

    return false;
  } catch (error) {
    console.error('❌ 發送請假狀態通知失敗:', error);
    return false;
  }
};

// 輔助函數：獲取請假類型文字
const getLeaveTypeText = (leaveType: string): string => {
  const leaveTypeMap: Record<string, string> = {
    'annual': '特休',
    'sick': '病假',
    'personal': '事假',
    'marriage': '婚假',
    'bereavement': '喪假',
    'maternity': '產假',
    'paternity': '陪產假',
    'parental': '育嬰假',
    'occupational': '公傷假',
    'menstrual': '生理假',
    'other': '其他'
  };
  
  return leaveTypeMap[leaveType] || leaveType;
};
