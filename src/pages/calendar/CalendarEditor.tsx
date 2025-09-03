import { useEffect, useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { useToast } from '@/components/ui/use-toast';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from '@/components/ui/context-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { CalendarItem, CalendarDayItem, CalendarDayType } from '@/types/calendar';
import { useCalendarData } from '@/hooks/useCalendarData';
import { Calendar, X, Edit3, MessageSquare, RefreshCcw } from 'lucide-react';
import { SaveButton, UpdateButton, DeleteConfirmButton } from '@/components/common/buttons';

interface Props {
  calendar: CalendarItem;
  onClose: () => void;
}

const DAY_TYPES: { value: CalendarDayType; label: string; className: string }[] = [
  { value: 'workday', label: '工作日', className: 'bg-emerald-400 text-emerald-800' },
  { value: 'holiday', label: '假日', className: 'bg-red-300 text-red-800' },
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
  const first = new Date(year, month - 1, 1);
  const last = new Date(year, month, 0);
  const cells: (Date | null)[] = [];
  const startOffset = first.getDay(); // 以週日為首，週日=0，週一=1...週六=6
  for (let i = 0; i < startOffset; i++) cells.push(null);
  for (let d = 1; d <= last.getDate(); d++) cells.push(new Date(year, month - 1, d));

  const nextType = (current?: CalendarDayType): CalendarDayType => {
    // 只在 workday 和 holiday 之間切換
    return current === 'holiday' ? 'workday' : 'holiday';
  };

  return (
    <div className="grid grid-cols-7 gap-1">
      {['日', '一', '二', '三', '四', '五', '六'].map(d => (
        <div key={d} className="text-center text-white/80 text-xs py-1">
          {d}
        </div>
      ))}
      {cells.map((date, i) => {
        if (!date) return <div key={i} className="h-10" />;
        const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
        const item = days[key];
        const type = item?.type || 'workday';
        const typeConf = DAY_TYPES.find(t => t.value === type)!;
        return (
          <ContextMenu key={key}>
            <ContextMenuTrigger asChild>
              <button
                onClick={() => onChange(key, nextType(type))}
                disabled={disabled}
                className={`h-10 rounded-md border border-white/30 text-xs text-white flex flex-col items-center justify-center hover:opacity-90 transition ${typeConf?.className} ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-90'}`}
                title={`${key} ${typeConf.label}`}
              >
                <span>{date.getDate()}</span>
                {item?.note && (
                  <span className="text-xs text-white/80 leading-tight truncate max-w-full">
                    {item.note}
                  </span>
                )}
              </button>
            </ContextMenuTrigger>
            <ContextMenuContent>
              <ContextMenuItem onClick={() => onChange(key, nextType(type))}>
                <Edit3 className="h-4 w-4 mr-2" />
                切換為{nextType(type) === 'holiday' ? '假日' : '工作日'}
              </ContextMenuItem>
              <ContextMenuItem onClick={() => onEditNote(key, item?.note || '')}>
                <MessageSquare className="h-4 w-4 mr-2" />
                {item?.note ? '編輯備註' : '添加備註'}
              </ContextMenuItem>
            </ContextMenuContent>
          </ContextMenu>
        );
      })}
    </div>
  );
}

export function CalendarEditor({ calendar, onClose }: Props) {
  const { toast } = useToast();
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth() + 1);
  const [daysMap, setDaysMap] = useState<Record<string, CalendarDayItem>>({});
  const [saving, setSaving] = useState(false);
  const [meta, setMeta] = useState({
    name: calendar.name,
    description: calendar.description || '',
  });
  const [noteDialog, setNoteDialog] = useState<{ open: boolean; date: string; note: string }>({
    open: false,
    date: '',
    note: '',
  });
  const year = calendar.year;

  // 使用行事曆 store
  const {
    loadCalendarDays,
    saveMonthDaysData,
    updateCalendarItem,
    generateYearDaysData,
    clearAllDaysData,
    getCalendarDaysFromStoreData,
    isLoading,
  } = useCalendarData();

  const loadMonth = useCallback(
    async (forceReload: boolean = false) => {
      const yearMonth = `${year}-${String(selectedMonth).padStart(2, '0')}`;

      // 1. 先檢查 store 中是否有該月份的資料
      const cachedDays = getCalendarDaysFromStoreData(calendar.slug, yearMonth);

      // 2. 如果有快取資料且不強制重新載入，先顯示快取資料
      if (cachedDays.length > 0 && !forceReload) {
        const map: Record<string, CalendarDayItem> = {};
        cachedDays.forEach(d => (map[d.date] = d));
        setDaysMap(map);

        // 如果已經有快取資料，不需要再載入
        return;
      }

      // 3. 如果沒有快取資料或需要重新載入，則從 API 載入
      try {
        const list = await loadCalendarDays(
          calendar.slug,
          { month: selectedMonth, year },
          forceReload
        );

        // 更新本地狀態
        const map: Record<string, CalendarDayItem> = {};
        list.forEach(d => (map[d.date] = d));
        setDaysMap(map);
      } catch (e: unknown) {
        const errorMessage = e instanceof Error ? e.message : '載入月份資料失敗';
        toast({ title: '載入月份資料失敗', description: errorMessage, variant: 'destructive' });
      }
    },
    [year, selectedMonth, calendar.slug, getCalendarDaysFromStoreData, loadCalendarDays, toast]
  );

  useEffect(() => {
    loadMonth();
  }, [loadMonth]);

  const onCellChange = (date: string, next: CalendarDayType) => {
    setDaysMap(prev => {
      const newMap = { ...prev };
      if (next === 'workday') {
        // workday 不需要儲存，從 map 中移除
        delete newMap[date];
      } else {
        // holiday 需要儲存
        newMap[date] = { ...(prev[date] || { date }), type: next };
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
    setSaving(true);
    try {
      const yearMonth = `${year}-${String(selectedMonth).padStart(2, '0')}`;
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

  const onSaveMeta = async () => {
    setUpdating(true);
    try {
      await updateCalendarItem(calendar.slug, { name: meta.name, description: meta.description });
      toast({ title: '基本資料已更新' });
    } catch (e: unknown) {
      const errorMessage = e instanceof Error ? e.message : '更新失敗';
      toast({ title: '更新失敗', description: errorMessage, variant: 'destructive' });
    } finally {
      setUpdating(false);
    }
  };

  const onGenerateYear = async () => {
    setGenerating(true);
    try {
      await generateYearDaysData(calendar.slug, { year });
      toast({ title: '已生成全年工作日/假日' });
      loadMonth();
    } catch (e: unknown) {
      const errorMessage = e instanceof Error ? e.message : '生成失敗';
      toast({ title: '生成失敗', description: errorMessage, variant: 'destructive' });
    } finally {
      setGenerating(false);
    }
  };

  const [clearDialogOpen, setClearDialogOpen] = useState(false);
  const [clearing, setClearing] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [updating, setUpdating] = useState(false);

  const onClearAll = async () => {
    setClearing(true);
    try {
      await clearAllDaysData(calendar.slug);
      setDaysMap({});
      toast({ title: '已清除所有日期' });
      setClearDialogOpen(false); // 清除成功後才關閉對話框
    } catch (e: unknown) {
      const errorMessage = e instanceof Error ? e.message : '清除失敗';
      toast({ title: '清除失敗', description: errorMessage, variant: 'destructive' });
      // 清除失敗時不關閉對話框，讓用戶重試
    } finally {
      setClearing(false);
    }
  };

  return (
    <Card className="bg-white/30 border-white/40">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-white text-xl flex items-center gap-2">
          <Calendar className="h-5 w-5" /> 編輯：{calendar.name}（{year}）
        </CardTitle>
        <div className="flex gap-2">
          <Button
            variant="secondary"
            className="bg-white/70"
            onClick={onGenerateYear}
            disabled={isLoading}
          >
            {generating ? '生成中...' : '生成全年'}
          </Button>
          <AlertDialog open={clearDialogOpen} onOpenChange={setClearDialogOpen}>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" disabled={isLoading}>
                清除全部
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>確認清除</AlertDialogTitle>
                <AlertDialogDescription>
                  您確定要清除「{calendar.name}」的所有日期設定嗎？此操作無法復原。
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel disabled={clearing}>取消</AlertDialogCancel>
                <DeleteConfirmButton onClick={onClearAll} disabled={clearing} isLoading={clearing}>
                  確認清除
                </DeleteConfirmButton>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          <Button
            variant="ghost"
            className="text-white"
            onClick={() => loadMonth(true)}
            title="重新載入月份資料"
            disabled={isLoading}
          >
            <RefreshCcw className="h-4 w-4" />
          </Button>
          <Button variant="ghost" className="text-white" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-3 flex-wrap">
          <Input
            value={meta.name}
            onChange={e => setMeta(v => ({ ...v, name: e.target.value }))}
            className="bg-white/60 w-56"
            placeholder="名稱"
            disabled={updating || isLoading}
          />
          <Input
            value={meta.description}
            onChange={e => setMeta(v => ({ ...v, description: e.target.value }))}
            className="bg-white/60 w-72"
            placeholder="描述（選填）"
            disabled={updating || isLoading}
          />
          <UpdateButton className="" onClick={onSaveMeta} disabled={isLoading} isLoading={updating}>
            更新資料
          </UpdateButton>
          <div className="flex-1" />
          <Select
            value={String(selectedMonth)}
            onValueChange={v => setSelectedMonth(parseInt(v))}
            disabled={generating || isLoading}
          >
            <SelectTrigger className="h-9 bg-white/60 w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Array.from({ length: 12 }, (_, i) => i + 1).map(m => (
                <SelectItem key={m} value={String(m)}>
                  {m} 月
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {/* <div className="flex gap-2">
            {DAY_TYPES.map(t => (
              <Badge key={t.value} className={t.className}>{t.label}</Badge>
            ))}
          </div> */}
          <SaveButton
            onClick={onSave}
            disabled={isLoading}
            isLoading={saving}
            className="bg-green-500"
          >
            儲存當月
          </SaveButton>
        </div>

        <MonthGrid
          year={year}
          month={selectedMonth}
          days={daysMap}
          onChange={onCellChange}
          onEditNote={onEditNote}
          disabled={generating || isLoading}
        />
      </CardContent>

      {/* 備註編輯對話框 */}
      <Dialog
        open={noteDialog.open}
        onOpenChange={open => setNoteDialog(prev => ({ ...prev, open }))}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>編輯備註 - {noteDialog.date}</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Textarea
              value={noteDialog.note}
              onChange={e => setNoteDialog(prev => ({ ...prev, note: e.target.value }))}
              placeholder="輸入備註..."
              className="min-h-[100px]"
              disabled={isLoading}
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setNoteDialog({ open: false, date: '', note: '' })}
              disabled={isLoading}
            >
              取消
            </Button>
            <Button onClick={onSaveNote} disabled={isLoading}>
              確定
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
