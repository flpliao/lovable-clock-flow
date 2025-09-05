import { useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useHolidayManagement } from '@/hooks/useHolidayManagement';
import { useToast } from '@/components/ui/use-toast';
import { AddButton, CancelButton } from '@/components/common/buttons';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export function CalendarCreateDialog({ isOpen, onClose }: Props) {
  const { toast } = useToast();
  const currentYear = new Date().getFullYear();
  const [newCalendar, setNewCalendar] = useState({
    year: currentYear,
    name: '',
    description: '',
  });
  const [creating, setCreating] = useState(false);

  const { createCalendarItem } = useHolidayManagement();

  const onCreate = async () => {
    if (!newCalendar.name.trim()) {
      toast({ title: '請輸入行事曆名稱', variant: 'destructive' });
      return;
    }

    setCreating(true);
    try {
      await createCalendarItem({
        year: newCalendar.year,
        name: newCalendar.name.trim(),
        description: newCalendar.description.trim() || undefined,
      });
      toast({ title: '建立成功' });
      handleClose();
    } catch (e: unknown) {
      const errorMessage = e instanceof Error ? e.message : '建立失敗';
      toast({ title: '建立失敗', description: errorMessage, variant: 'destructive' });
    } finally {
      setCreating(false);
    }
  };

  const handleClose = () => {
    setNewCalendar({ year: currentYear, name: '', description: '' });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>新增行事曆</DialogTitle>
          <DialogDescription>
            建立一個新的行事曆，用於管理特定年份的工作日和假日設定。
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">年份</label>
            <Select
              value={String(newCalendar.year)}
              onValueChange={v => setNewCalendar(prev => ({ ...prev, year: parseInt(v) }))}
              disabled={creating}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: 6 }, (_, i) => currentYear - 2 + i).map(y => (
                  <SelectItem key={y} value={String(y)}>
                    {y}年
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">行事曆名稱 *</label>
            <Input
              placeholder="請輸入行事曆名稱"
              value={newCalendar.name}
              onChange={e => setNewCalendar(prev => ({ ...prev, name: e.target.value }))}
              disabled={creating}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">描述（選填）</label>
            <Textarea
              placeholder="請輸入行事曆描述"
              value={newCalendar.description}
              onChange={e => setNewCalendar(prev => ({ ...prev, description: e.target.value }))}
              disabled={creating}
              className="min-h-[80px]"
            />
          </div>
        </div>

        <DialogFooter>
          <CancelButton onClick={handleClose} disabled={creating} />
          <AddButton onClick={onCreate} disabled={creating} isLoading={creating}>
            建立行事曆
          </AddButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
