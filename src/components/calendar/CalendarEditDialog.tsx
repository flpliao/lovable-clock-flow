import { useEffect, useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
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
import { Textarea } from '@/components/ui/textarea';
import { CalendarItem, CalendarDayItem, CalendarDayType } from '@/types/calendar';
import { useCalendarData } from '@/hooks/useCalendarData';
import { useToast } from '@/components/ui/use-toast';
import { RefreshCcw } from 'lucide-react';
import { AddButton, CancelButton, DeleteButton, SaveButton } from '@/components/common/buttons';

interface Props {
  calendar: CalendarItem | null;
  isOpen: boolean;
  onClose: () => void;
}

const DAY_TYPES: { value: CalendarDayType; label: string; className: string }[] = [
  { value: 'workday', label: '工作日', className: 'bg-green-500' },
  { value: 'holiday', label: '假日', className: 'bg-red-500' },
];

function MonthGrid({
  year,
  month,
  days,
  onChange,
  onEditNote,
  disabled = false,
}: {
  year: number;
  month: number; // 1-12
  days: Record<string, CalendarDayItem>;
  onChange: (date: string, nextType: CalendarDayType) => void;
  onEditNote: (date: string, currentNote?: string) => void;
  disabled?: boolean;
}) {
  const firstDay = new Date(year, month - 1, 1).getDay();
  const daysInMonth = new Date(year, month, 0).getDate();
  const dayNumbers = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  return (
    <div className="grid grid-cols-7 gap-1 text-sm">
      {/* 星期標題 */}
      {['日', '一', '二', '三', '四', '五', '六'].map(day => (
        <div
          key={day}
          className="p-2 text-center font-medium text-muted-foreground bg-muted rounded"
        >
          {day}
        </div>
      ))}

      {/* 空白格子 */}
      {Array.from({ length: firstDay }, (_, i) => (
        <div key={`empty-${i}`} className="p-2" />
      ))}

      {/* 日期格子 */}
      {dayNumbers.map(day => {
        const date = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        const dayData = days[date];
        const dayType = dayData?.type || 'workday';
        const typeConfig = DAY_TYPES.find(t => t.value === dayType) || DAY_TYPES[0];

        return (
          <div
            key={day}
            className={`
              p-2 text-center cursor-pointer rounded transition-all relative group
              ${disabled ? 'cursor-not-allowed opacity-50' : 'hover:bg-muted'}
              ${typeConfig.className}/70 border border-border
            `}
            onClick={() => !disabled && onChange(date, getNextDayType(dayType))}
            title={dayData?.note || ''}
          >
            <div className="flex items-center justify-center space-x-1 flex-col">
              <span className="text-foreground font-medium">{day}</span>
              {dayData?.note && (
                <span className="text-foreground font-medium">{dayData?.note}</span>
              )}
            </div>

            {/* 右鍵選單觸發區域 */}
            {!disabled && (
              <div
                className="absolute inset-0"
                onContextMenu={e => {
                  e.preventDefault();
                  onEditNote(date, dayData?.note);
                }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

function getNextDayType(currentType: CalendarDayType): CalendarDayType {
  const types: CalendarDayType[] = ['workday', 'holiday'];
  const currentIndex = types.indexOf(currentType);
  return types[(currentIndex + 1) % types.length];
}

export function CalendarEditDialog({ calendar, isOpen, onClose }: Props) {
  const { toast } = useToast();
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth() + 1);
  const [daysMap, setDaysMap] = useState<Record<string, CalendarDayItem>>({});
  const [saving, setSaving] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [noteDialog, setNoteDialog] = useState<{ open: boolean; date: string; note: string }>({
    open: false,
    date: '',
    note: '',
  });

  // 使用行事曆 store
  const { loadCalendarDays, saveMonthDaysData, generateYearDaysData, clearAllDaysData, isLoading } =
    useCalendarData();

  // 當行事曆改變時，初始化資料
  useEffect(() => {
    if (calendar) {
      setSelectedMonth(new Date().getMonth() + 1);
    }
  }, [calendar]);

  const loadMonth = useCallback(async () => {
    if (!calendar) return;

    try {
      const daysData = await loadCalendarDays(calendar.slug, {
        month: selectedMonth,
        year: calendar.year,
      });
      // 將 CalendarDayItem[] 轉換為 Record<string, CalendarDayItem>
      const daysMap: Record<string, CalendarDayItem> = {};
      if (Array.isArray(daysData)) {
        daysData.forEach(day => {
          daysMap[day.date] = day;
        });
      } else {
        // 如果已經是 Record 格式，直接使用
        Object.assign(daysMap, daysData);
      }
      setDaysMap(daysMap);
    } catch (e: unknown) {
      const errorMessage = e instanceof Error ? e.message : '載入失敗';
      toast({ title: '載入失敗', description: errorMessage, variant: 'destructive' });
    }
  }, [calendar, selectedMonth, loadCalendarDays, toast]);

  useEffect(() => {
    if (calendar) {
      loadMonth();
    }
  }, [calendar, loadMonth]);

  const onCellChange = (date: string, nextType: CalendarDayType) => {
    setDaysMap(prev => {
      const newMap = { ...prev };
      if (nextType === 'workday') {
        // 如果是工作日且沒有備註，則移除該項目
        if (!prev[date]?.note) {
          delete newMap[date];
        } else {
          newMap[date] = { ...prev[date], type: nextType };
        }
      } else {
        newMap[date] = {
          ...(prev[date] || { date, type: 'workday' }),
          type: nextType,
        };
      }
      return newMap;
    });
  };

  const onEditNote = (date: string, currentNote: string) => {
    setNoteDialog({
      open: true,
      date,
      note: currentNote,
    });
  };

  const onSaveNote = () => {
    const { date, note } = noteDialog;
    setDaysMap(prev => {
      const newMap = { ...prev };
      if (note.trim()) {
        // 有備註時保存
        newMap[date] = {
          ...(prev[date] || { date, type: 'workday' }),
          note: note.trim(),
        };
      } else {
        // 備註為空時，如果是workday則移除，holiday則保留但清空note
        if (prev[date]?.type === 'workday') {
          delete newMap[date];
        } else {
          newMap[date] = { ...prev[date], note: null };
        }
      }
      return newMap;
    });
    setNoteDialog({ open: false, date: '', note: '' });
  };

  const onSave = async () => {
    if (!calendar) return;

    setSaving(true);
    try {
      const yearMonth = `${calendar.year}-${String(selectedMonth).padStart(2, '0')}`;
      const result = await saveMonthDaysData(calendar.slug, daysMap, yearMonth);
      toast({
        title: '已儲存',
        description: result.message,
      });
    } catch (e: unknown) {
      const errorMessage = e instanceof Error ? e.message : '儲存失敗';
      toast({ title: '儲存失敗', description: errorMessage, variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  const onGenerateYear = async () => {
    if (!calendar) return;

    setGenerating(true);
    try {
      await generateYearDaysData(calendar.slug, { year: calendar.year });
      toast({ title: '已生成整年資料' });
      loadMonth(); // 重新載入當前月份
    } catch (e: unknown) {
      const errorMessage = e instanceof Error ? e.message : '生成失敗';
      toast({ title: '生成失敗', description: errorMessage, variant: 'destructive' });
    } finally {
      setGenerating(false);
    }
  };

  const onClearAll = async () => {
    if (!calendar) return;

    try {
      await clearAllDaysData(calendar.slug);
      toast({ title: '已清空所有資料' });
      loadMonth(); // 重新載入當前月份
    } catch (e: unknown) {
      const errorMessage = e instanceof Error ? e.message : '清空失敗';
      toast({ title: '清空失敗', description: errorMessage, variant: 'destructive' });
    }
  };

  if (!calendar) return null;

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-7xl w-full max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>編輯行事曆</DialogTitle>
            <DialogDescription>
              編輯 {calendar.name}（{calendar.year}）的日期設定
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* 月份選擇和操作 */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold leading-none tracking-tight">月份編輯</h3>
                <div className="flex gap-2">
                  <AddButton
                    variant="outline"
                    size="sm"
                    onClick={onGenerateYear}
                    disabled={generating}
                    className="text-white border-white/40"
                  >
                    {generating ? '生成中...' : '生成整年'}
                  </AddButton>
                  <DeleteButton
                    variant="outline"
                    size="sm"
                    onClick={onClearAll}
                    className=" border-white/0 bg-red-500/70 text-black"
                  >
                    清空所有
                  </DeleteButton>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <label className="text-sm text-muted-foreground">選擇月份：</label>
                <Select
                  value={String(selectedMonth)}
                  onValueChange={v => setSelectedMonth(parseInt(v))}
                >
                  <SelectTrigger className="w-32 text-muted-foreground">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 12 }, (_, i) => i + 1).map(month => (
                      <SelectItem key={month} value={String(month)}>
                        {month}月
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={loadMonth}
                  disabled={isLoading}
                  className="text-muted-foreground"
                >
                  <RefreshCcw className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* 月份網格 */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-lg font-semibold leading-none tracking-tight">
                  {calendar.year}年{selectedMonth}月
                </h4>
                <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-500/70 border border-border rounded"></div>
                    <span>工作日</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-red-500/70 border border-border rounded"></div>
                    <span>假日</span>
                  </div>
                </div>
              </div>

              <MonthGrid
                year={calendar.year}
                month={selectedMonth}
                days={daysMap}
                onChange={onCellChange}
                onEditNote={onEditNote}
                disabled={isLoading}
              />

              <div className="text-sm text-muted-foreground">
                <p>• 點擊日期切換類型（工作日 → 假日 → 工作日）</p>
                <p>• 右鍵點擊日期可編輯備註</p>
              </div>
            </div>
          </div>

          <DialogFooter className="flex justify-between">
            <CancelButton onClick={onClose} disabled={isLoading} />
            <SaveButton onClick={onSave} disabled={saving} isLoading={saving}>
              儲存變更
            </SaveButton>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 備註編輯對話框 */}
      <Dialog
        open={noteDialog.open}
        onOpenChange={() => setNoteDialog({ open: false, date: '', note: '' })}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>編輯備註</DialogTitle>
            <DialogDescription>為 {noteDialog.date} 添加或修改備註</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm text-muted-foreground">備註</label>
              <Textarea
                value={noteDialog.note}
                onChange={e => setNoteDialog(prev => ({ ...prev, note: e.target.value }))}
                placeholder="輸入備註..."
                className="min-h-[100px]"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setNoteDialog({ open: false, date: '', note: '' })}
            >
              取消
            </Button>
            <Button onClick={onSaveNote}>儲存</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
