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
} from "@/components/ui/alert-dialog";
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useLeaveRecordCrud } from '@/hooks/useLeaveRecordCrud';
import { useIsAdmin } from '@/hooks/useStores';
import { LeaveRequest } from '@/types';
import { formatLeaveRecordDate } from '@/utils/dateUtils';
import { getLeaveTypeText, getStatusBadgeVariant, getStatusText } from '@/utils/leaveUtils';
import { AlertCircle, Calendar, CheckCircle, Clock, Edit, FileText, Trash2, XCircle } from 'lucide-react';
import React, { useState } from 'react';
import { EditLeaveRecordDialog } from './EditLeaveRecordDialog';

interface LeaveHistoryItemProps {
  leave: LeaveRequest;
  onClick?: (leave: LeaveRequest) => void;
}

export const LeaveHistoryItem: React.FC<LeaveHistoryItemProps> = ({
  leave,
  onClick
}) => {
  const isAdmin = useIsAdmin();
  const { deleteLeaveRecord, updateLeaveRecord, loading } = useLeaveRecordCrud();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const handleClick = () => {
    if (onClick) {
      onClick(leave);
    }
  };

  const handleDelete = async () => {
    await deleteLeaveRecord(leave.id);
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditDialogOpen(true);
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  // 獲取審核狀態詳細資訊
  const getApprovalStatusInfo = () => {
    if (leave.status === 'approved') {
      // 檢查是否為系統自動核准
      if (leave.approved_by === 'system') {
        return {
          icon: <CheckCircle className="h-4 w-4 text-green-500" />,
          text: '✅ 無需核准（系統自動核准）',
          description: '因無直屬主管，系統自動核准'
        };
      }

      // 一般核准情況
      if (leave.approvals && leave.approvals.length > 0) {
        const approvedRecords = leave.approvals.filter(approval => approval.status === 'approved');
        if (approvedRecords.length === 1) {
          return {
            icon: <CheckCircle className="h-4 w-4 text-green-500" />,
            text: '✅ 已核准',
            description: `由 ${approvedRecords[0].approver_name} 核准`
          };
        } else if (approvedRecords.length > 1) {
          return {
            icon: <CheckCircle className="h-4 w-4 text-green-500" />,
            text: '✅ 已核准',
            description: `經 ${approvedRecords.length} 層主管核准`
          };
        }
      }
      return {
        icon: <CheckCircle className="h-4 w-4 text-green-500" />,
        text: '✅ 已核准',
        description: '已通過審核'
      };
    } else if (leave.status === 'rejected') {
      const rejectedRecord = leave.approvals?.find(approval => approval.status === 'rejected');
      return {
        icon: <XCircle className="h-4 w-4 text-red-500" />,
        text: '❌ 已退回',
        description: rejectedRecord ? `由 ${rejectedRecord.approver_name} 退回` : '已被退回'
      };
    } else if (leave.status === 'pending') {
      // 判斷審核進度
      if (leave.approval_level === 1) {
        return {
          icon: <AlertCircle className="h-4 w-4 text-yellow-500" />,
          text: '⏳ 審核中',
          description: '等待主管審核'
        };
      } else if (leave.approval_level && leave.approval_level > 1) {
        const approvedCount = leave.approvals?.filter(a => a.status === 'approved').length || 0;
        return {
          icon: <AlertCircle className="h-4 w-4 text-yellow-500" />,
          text: `⏳ 第${approvedCount}層已通過，等待第${leave.approval_level}層核准`,
          description: '多層主管審核進行中'
        };
      } else {
        return {
          icon: <AlertCircle className="h-4 w-4 text-yellow-500" />,
          text: '⏳ 審核中',
          description: '等待主管審核'
        };
      }
    }
    return {
      icon: <AlertCircle className="h-4 w-4 text-gray-500" />,
      text: '狀態未知',
      description: ''
    };
  };
  const statusInfo = getApprovalStatusInfo();

  // 使用台灣時區格式化請假記錄日期
  const startDateDisplay = formatLeaveRecordDate(leave.start_date);
  const endDateDisplay = formatLeaveRecordDate(leave.end_date);

  console.log('LeaveHistoryItem - 台灣時區日期顯示:', {
    leaveId: leave.id,
    rawStartDate: leave.start_date,
    rawEndDate: leave.end_date,
    displayStartDate: startDateDisplay,
    displayEndDate: endDateDisplay,
    timezone: 'Asia/Taipei (UTC+8)'
  });

  // 計算天數顯示
  const days = Math.floor(leave.hours / 8);
  const remainingHours = leave.hours % 8;
  const timeDisplay = days > 0 ? remainingHours > 0 ? `${days}天${remainingHours}小時` : `${days}天` : `${leave.hours}小時`;
  
  return (
    <>
      <div onClick={handleClick} className="backdrop-blur-xl border border-white/30 rounded-2xl p-4 transition-all duration-200 cursor-pointer bg-violet-400 relative">
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-white/80" />
            <span className="font-medium text-white drop-shadow-sm">
              {getLeaveTypeText(leave.leave_type)}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={getStatusBadgeVariant(leave.status)}>
              {getStatusText(leave.status)}
            </Badge>
            {/* 管理員操作按鈕 */}
            {isAdmin && (
              <div className="flex gap-1 ml-2">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleEdit}
                  className="h-6 w-6 p-0 text-white/80 hover:text-white hover:bg-white/20"
                  disabled={loading}
                >
                  <Edit className="h-3 w-3" />
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={handleDeleteClick}
                      className="h-6 w-6 p-0 text-white/80 hover:text-red-300 hover:bg-red-500/20"
                      disabled={loading}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>確認刪除</AlertDialogTitle>
                      <AlertDialogDescription>
                        您確定要刪除這筆請假記錄嗎？此操作無法復原。
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>取消</AlertDialogCancel>
                      <AlertDialogAction onClick={handleDelete}>
                        確認刪除
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            )}
          </div>
        </div>
        
        <div className="space-y-2 text-sm text-white/90">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>
              {startDateDisplay} - {endDateDisplay}
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span>{timeDisplay} ({leave.hours} 小時)</span>
          </div>

          {/* 審核狀態詳細資訊 */}
          <div className="flex items-center gap-2 mt-3 p-2 bg-white/10 rounded-lg">
            {statusInfo.icon}
            <div>
              <div className="text-white font-medium text-xs">{statusInfo.text}</div>
              {statusInfo.description && <div className="text-white/70 text-xs mt-1">{statusInfo.description}</div>}
            </div>
          </div>
          
          {leave.reason && (
            <div className="mt-2 p-2 bg-white/10 rounded-lg">
              <p className="text-xs text-white/80">原因：{leave.reason}</p>
            </div>
          )}
        </div>
      </div>

      {/* 編輯對話框 */}
      <EditLeaveRecordDialog
        isOpen={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
        leaveRecord={leave}
        onSave={updateLeaveRecord}
        loading={loading}
      />
    </>
  );
};
