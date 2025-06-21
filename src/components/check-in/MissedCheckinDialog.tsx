
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useUser } from '@/contexts/UserContext';

interface MissedCheckinDialogProps {
  onSuccess: () => void;
}

const MissedCheckinDialog: React.FC<MissedCheckinDialogProps> = ({ onSuccess }) => {
  const { currentUser } = useUser();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    request_date: new Date().toISOString().split('T')[0],
    missed_type: 'check_in' as 'check_in' | 'check_out' | 'both',
    requested_check_in_time: '',
    requested_check_out_time: '',
    reason: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    setLoading(true);
    try {
      const submitData: any = {
        staff_id: currentUser.id,
        request_date: formData.request_date,
        missed_type: formData.missed_type,
        reason: formData.reason
      };

      // 根據申請類型添加時間
      if (formData.missed_type === 'check_in' || formData.missed_type === 'both') {
        if (formData.requested_check_in_time) {
          submitData.requested_check_in_time = `${formData.request_date}T${formData.requested_check_in_time}:00`;
        }
      }

      if (formData.missed_type === 'check_out' || formData.missed_type === 'both') {
        if (formData.requested_check_out_time) {
          submitData.requested_check_out_time = `${formData.request_date}T${formData.requested_check_out_time}:00`;
        }
      }

      const { error } = await supabase
        .from('missed_checkin_requests')
        .insert(submitData);

      if (error) throw error;

      toast({
        title: "申請已提交",
        description: "忘記打卡申請已成功提交，等待主管審核",
      });

      setOpen(false);
      setFormData({
        request_date: new Date().toISOString().split('T')[0],
        missed_type: 'check_in',
        requested_check_in_time: '',
        requested_check_out_time: '',
        reason: ''
      });
      onSuccess();
    } catch (error) {
      console.error('提交申請失敗:', error);
      toast({
        title: "提交失敗",
        description: "無法提交忘記打卡申請，請稍後重試",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getMissedTypeText = (type: string) => {
    switch (type) {
      case 'check_in': return '忘記上班打卡';
      case 'check_out': return '忘記下班打卡';
      case 'both': return '忘記上下班打卡';
      default: return '';
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          size="sm"
          className="bg-orange-50 hover:bg-orange-100 text-orange-700 border-orange-200 whitespace-nowrap"
        >
          <Clock className="h-4 w-4 mr-1" />
          忘記打卡
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            忘記打卡申請
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="request_date">申請日期</Label>
            <Input
              id="request_date"
              type="date"
              value={formData.request_date}
              onChange={(e) => setFormData({ ...formData, request_date: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="missed_type">申請類型</Label>
            <Select
              value={formData.missed_type}
              onValueChange={(value: 'check_in' | 'check_out' | 'both') => 
                setFormData({ ...formData, missed_type: value })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="check_in">忘記上班打卡</SelectItem>
                <SelectItem value="check_out">忘記下班打卡</SelectItem>
                <SelectItem value="both">忘記上下班打卡</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {(formData.missed_type === 'check_in' || formData.missed_type === 'both') && (
            <div className="space-y-2">
              <Label htmlFor="check_in_time">預計上班時間</Label>
              <div className="relative">
                <Input
                  id="check_in_time"
                  type="time"
                  value={formData.requested_check_in_time}
                  onChange={(e) => setFormData({ ...formData, requested_check_in_time: e.target.value })}
                  required={formData.missed_type === 'check_in' || formData.missed_type === 'both'}
                  className="pl-10"
                />
                <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
              </div>
            </div>
          )}

          {(formData.missed_type === 'check_out' || formData.missed_type === 'both') && (
            <div className="space-y-2">
              <Label htmlFor="check_out_time">預計下班時間</Label>
              <div className="relative">
                <Input
                  id="check_out_time"
                  type="time"
                  value={formData.requested_check_out_time}
                  onChange={(e) => setFormData({ ...formData, requested_check_out_time: e.target.value })}
                  required={formData.missed_type === 'check_out' || formData.missed_type === 'both'}
                  className="pl-10"
                />
                <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="reason">申請原因</Label>
            <Textarea
              id="reason"
              placeholder="請說明忘記打卡的原因..."
              value={formData.reason}
              onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
              required
              rows={3}
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={loading}
            >
              取消
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? '提交中...' : '提交申請'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default MissedCheckinDialog;
