
import React, { useState, useEffect } from 'react';
import { LeaveRequest } from '@/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Calendar, CalendarIcon } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { formatDisplayDate, parseDateFromDatabase } from '@/utils/dateUtils';
import { cn } from '@/lib/utils';

interface EditLeaveRecordDialogProps {
  isOpen: boolean;
  onClose: () => void;
  leaveRecord: LeaveRequest | null;
  onSave: (leaveId: string, updateData: Partial<LeaveRequest>) => Promise<boolean>;
  loading: boolean;
}

export const EditLeaveRecordDialog: React.FC<EditLeaveRecordDialogProps> = ({
  isOpen,
  onClose,
  leaveRecord,
  onSave,
  loading
}) => {
  const [formData, setFormData] = useState({
    start_date: '',
    end_date: '',
    leave_type: '' as LeaveRequest['leave_type'],
    hours: 0,
    reason: '',
    status: 'pending' as 'pending' | 'approved' | 'rejected'
  });
  const [startDateObj, setStartDateObj] = useState<Date | undefined>();
  const [endDateObj, setEndDateObj] = useState<Date | undefined>();

  useEffect(() => {
    if (leaveRecord) {
      setFormData({
        start_date: leaveRecord.start_date,
        end_date: leaveRecord.end_date,
        leave_type: leaveRecord.leave_type,
        hours: leaveRecord.hours,
        reason: leaveRecord.reason,
        status: leaveRecord.status
      });
      
      // 設定日期物件
      setStartDateObj(parseDateFromDatabase(leaveRecord.start_date));
      setEndDateObj(parseDateFromDatabase(leaveRecord.end_date));
    }
  }, [leaveRecord]);

  const handleSave = async () => {
    if (!leaveRecord) return;
    
    const success = await onSave(leaveRecord.id, {
      ...formData,
      start_date: formData.start_date,
      end_date: formData.end_date
    });
    
    if (success) {
      onClose();
    }
  };

  const handleStartDateChange = (date: Date | undefined) => {
    if (date) {
      setStartDateObj(date);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      setFormData(prev => ({ ...prev, start_date: `${year}-${month}-${day}` }));
    }
  };

  const handleEndDateChange = (date: Date | undefined) => {
    if (date) {
      setEndDateObj(date);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      setFormData(prev => ({ ...prev, end_date: `${year}-${month}-${day}` }));
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>編輯請假記錄</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>開始日期</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !startDateObj && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {startDateObj ? formatDisplayDate(startDateObj) : "選擇日期"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={startDateObj}
                    onSelect={handleStartDateChange}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div className="space-y-2">
              <Label>結束日期</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !endDateObj && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {endDateObj ? formatDisplayDate(endDateObj) : "選擇日期"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={endDateObj}
                    onSelect={handleEndDateChange}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="space-y-2">
            <Label>請假類型</Label>
            <Select value={formData.leave_type} onValueChange={(value: LeaveRequest['leave_type']) => setFormData(prev => ({ ...prev, leave_type: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="選擇請假類型" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="annual">特別休假</SelectItem>
                <SelectItem value="sick">病假</SelectItem>
                <SelectItem value="personal">事假</SelectItem>
                <SelectItem value="marriage">婚假</SelectItem>
                <SelectItem value="bereavement">喪假</SelectItem>
                <SelectItem value="maternity">產假</SelectItem>
                <SelectItem value="paternity">陪產假</SelectItem>
                <SelectItem value="parental">育嬰假</SelectItem>
                <SelectItem value="occupational">公傷假</SelectItem>
                <SelectItem value="menstrual">生理假</SelectItem>
                <SelectItem value="other">其他</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>請假時數</Label>
            <Input
              type="number"
              value={formData.hours}
              onChange={(e) => setFormData(prev => ({ ...prev, hours: Number(e.target.value) }))}
              min="0"
              step="0.5"
            />
          </div>

          <div className="space-y-2">
            <Label>狀態</Label>
            <Select value={formData.status} onValueChange={(value: 'pending' | 'approved' | 'rejected') => setFormData(prev => ({ ...prev, status: value }))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">待審核</SelectItem>
                <SelectItem value="approved">已核准</SelectItem>
                <SelectItem value="rejected">已退回</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>請假原因</Label>
            <Textarea
              value={formData.reason}
              onChange={(e) => setFormData(prev => ({ ...prev, reason: e.target.value }))}
              placeholder="請輸入請假原因"
              rows={3}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={loading}>
            取消
          </Button>
          <Button onClick={handleSave} disabled={loading}>
            {loading ? '儲存中...' : '儲存'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
