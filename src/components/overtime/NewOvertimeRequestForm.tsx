
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, Calendar, FileText, Send } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { useUser } from '@/contexts/UserContext';
import { useOvertimeManagementContext } from '@/contexts/OvertimeManagementContext';

interface NewOvertimeRequestFormProps {
  onSubmit: () => void;
}

const NewOvertimeRequestForm: React.FC<NewOvertimeRequestFormProps> = ({ onSubmit }) => {
  const { currentUser } = useUser();
  const { createOvertimeRequest } = useOvertimeManagementContext();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    overtime_date: '',
    start_time: '',
    end_time: '',
    reason: ''
  });

  const calculateHours = (startTime: string, endTime: string) => {
    if (!startTime || !endTime) return 0;
    
    const start = new Date(`2000-01-01T${startTime}`);
    const end = new Date(`2000-01-01T${endTime}`);
    
    if (end <= start) return 0;
    
    const diffMs = end.getTime() - start.getTime();
    return Math.round((diffMs / (1000 * 60 * 60)) * 100) / 100;
  };

  const hours = calculateHours(formData.start_time, formData.end_time);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentUser) {
      toast({
        title: "請先登入",
        description: "您需要登入才能提交加班申請",
        variant: "destructive",
      });
      return;
    }

    if (hours <= 0) {
      toast({
        title: "時間錯誤",
        description: "結束時間必須晚於開始時間",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      const newRequest = {
        id: Date.now().toString(),
        user_id: currentUser.id,
        staff_id: currentUser.id,
        overtime_date: formData.overtime_date,
        start_time: formData.start_time,
        end_time: formData.end_time,
        hours: hours,
        reason: formData.reason,
        status: 'pending' as const,
        approval_level: 1,
        current_approver: '2', // Mock approver
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        approvals: [
          {
            id: '1',
            overtime_request_id: Date.now().toString(),
            approver_id: '2',
            approver_name: '主管',
            status: 'pending' as const,
            level: 1
          }
        ]
      };

      createOvertimeRequest(newRequest);
      
      // Reset form
      setFormData({
        overtime_date: '',
        start_time: '',
        end_time: '',
        reason: ''
      });

      onSubmit();
      
    } catch (error) {
      console.error('提交加班申請失敗:', error);
      toast({
        title: "提交失敗",
        description: "無法提交加班申請，請稍後再試",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="backdrop-blur-xl bg-white/10 border border-white/20">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-3">
          <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
            <Clock className="h-4 w-4 text-white" />
          </div>
          提交加班申請
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Date Selection */}
          <div className="space-y-2">
            <Label htmlFor="overtime_date" className="text-white font-medium">
              <Calendar className="h-4 w-4 inline mr-2" />
              加班日期
            </Label>
            <Input
              id="overtime_date"
              type="date"
              value={formData.overtime_date}
              onChange={(e) => setFormData({ ...formData, overtime_date: e.target.value })}
              className="bg-white/10 border-white/30 text-white"
              required
            />
          </div>

          {/* Time Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="start_time" className="text-white font-medium">
                開始時間
              </Label>
              <Input
                id="start_time"
                type="time"
                value={formData.start_time}
                onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
                className="bg-white/10 border-white/30 text-white"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="end_time" className="text-white font-medium">
                結束時間
              </Label>
              <Input
                id="end_time"
                type="time"
                value={formData.end_time}
                onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
                className="bg-white/10 border-white/30 text-white"
                required
              />
            </div>
          </div>

          {/* Hours Display */}
          {hours > 0 && (
            <div className="bg-white/10 rounded-lg p-3">
              <p className="text-white font-medium">
                預計加班時數: <span className="text-orange-300">{hours} 小時</span>
              </p>
            </div>
          )}

          {/* Reason */}
          <div className="space-y-2">
            <Label htmlFor="reason" className="text-white font-medium">
              <FileText className="h-4 w-4 inline mr-2" />
              加班原因
            </Label>
            <Textarea
              id="reason"
              placeholder="請說明加班原因..."
              value={formData.reason}
              onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
              className="bg-white/10 border-white/30 text-white placeholder:text-white/50 min-h-[100px]"
              required
            />
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isSubmitting || hours <= 0}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium py-3"
          >
            {isSubmitting ? (
              <>
                <Clock className="h-4 w-4 mr-2 animate-spin" />
                提交中...
              </>
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                提交加班申請
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default NewOvertimeRequestForm;
