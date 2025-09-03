import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
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
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';
import { CalendarItem, CalendarDayItem, CalendarDayType } from '@/types/calendar';
import { useCalendarData } from '@/hooks/useCalendarData';
import { ArrowLeft, Save, Calendar, Plus, Edit, Trash2 } from 'lucide-react';
import { SaveButton, AddButton, EditButton, DeleteButton } from '@/components/common/buttons';
import { ConfirmDialog } from '@/components/common/dialogs';

const DAY_TYPES: { value: CalendarDayType; label: string; className: string }[] = [
  { value: 'workday', label: '工作日', className: 'bg-green-100 text-green-800' },
  { value: 'holiday', label: '假日', className: 'bg-red-100 text-red-800' },
];

export function CalendarEditor() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [calendar, setCalendar] = useState<CalendarItem | null>(null);
  const [days, setDays] = useState<CalendarDayItem[]>([]);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [editDialog, setEditDialog] = useState<{
    open: boolean;
    day: CalendarDayItem | null;
    isNew: boolean;
  }>({
    open: false,
    day: null,
    isNew: false,
  });
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    day: CalendarDayItem | null;
  }>({
    open: false,
    day: null,
  });

  // 使用行事曆 store
  const { loadCalendar, loadCalendarDays, batchUpdateCalendarDaysData } = useCalendarData();

  useEffect(() => {
    // 如果沒有 slug，直接返回
    if (!slug) return;

    const loadData = async () => {
      try {
        setLoading(true);
        // 載入行事曆資料
        const calendarData = await loadCalendar(slug);
        setCalendar(calendarData);

        // 載入行事曆日期
        const daysData = await loadCalendarDays(slug);
        setDays(Array.isArray(daysData) ? daysData : []);
      } catch (e: unknown) {
        const errorMessage = e instanceof Error ? e.message : '載入失敗';
        toast({ title: '載入失敗', description: errorMessage, variant: 'destructive' });
        navigate('/holiday-management');
      } finally {
        setLoading(false);
      }
    };

    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]); // 只依賴 slug，避免無限循環

  // 如果沒有 slug，直接返回錯誤
  if (!slug) {
    return (
      <div className="w-full min-h-screen bg-gradient-to-br from-blue-400 via-blue-500 to-purple-600 flex items-center justify-center">
        <div className="text-white text-xl">無效的行事曆 ID</div>
      </div>
    );
  }

  const handleAddNew = () => {
    const currentYear = calendar?.year || new Date().getFullYear();
    setEditDialog({
      open: true,
      day: {
        date: `${currentYear}-01-01`,
        type: 'holiday',
        note: null,
      },
      isNew: true,
    });
  };

  const handleEdit = (day: CalendarDayItem) => {
    setEditDialog({
      open: true,
      day: { ...day },
      isNew: false,
    });
  };

  const handleDelete = (date: string) => {
    setDays(prev => prev.filter(day => day.date !== date));
  };

  const handleSaveEdit = () => {
    const { day, isNew } = editDialog;
    if (!day) return;

    // 檢查是否已存在相同日期的資料
    const existingDay = days.find(d => d.date === day.date);

    if (existingDay && isNew) {
      // 如果是新增且已存在相同日期，顯示確認對話框
      setConfirmDialog({ open: true, day });
      return;
    }

    // 直接保存（編輯或新增不重複的日期）
    saveDayData(day, isNew);
  };

  const saveDayData = (day: CalendarDayItem, isNew: boolean) => {
    setDays(prev => {
      if (isNew) {
        // 新增時，如果已存在則覆蓋，否則新增
        const existingIndex = prev.findIndex(d => d.date === day.date);
        if (existingIndex >= 0) {
          // 覆蓋現有資料
          const newDays = [...prev];
          newDays[existingIndex] = day;
          return newDays;
        } else {
          // 新增資料
          return [...prev, day];
        }
      } else {
        // 編輯時，直接更新
        return prev.map(d => (d.date === day.date ? day : d));
      }
    });

    // 顯示成功提醒
    toast({
      title: isNew ? '新增成功' : '編輯成功',
      description: `日期 ${formatDate(day.date)} 已${isNew ? '新增' : '更新'}`,
    });

    setEditDialog({ open: false, day: null, isNew: false });
  };

  const handleConfirmOverwrite = () => {
    const { day } = confirmDialog;
    if (!day) return;

    // 覆蓋現有資料
    saveDayData(day, true);
    setConfirmDialog({ open: false, day: null });
  };

  const onSave = async () => {
    if (!slug) return;

    setSaving(true);
    try {
      await batchUpdateCalendarDaysData(slug, { updates: days });
      toast({
        title: '已儲存',
        description: '行事曆日期已成功更新',
      });
    } catch (e: unknown) {
      const errorMessage = e instanceof Error ? e.message : '儲存失敗';
      toast({ title: '儲存失敗', description: errorMessage, variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date
      .toLocaleDateString('zh-TW', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      })
      .replace(/\//g, '/');
  };

  const getDayTypeInfo = (type: CalendarDayType) => {
    return DAY_TYPES.find(dt => dt.value === type) || DAY_TYPES[0];
  };

  if (loading) {
    return (
      <div className="w-full min-h-screen bg-gradient-to-br from-blue-400 via-blue-500 to-purple-600 flex items-center justify-center">
        <div className="text-white text-xl">載入中...</div>
      </div>
    );
  }

  if (!calendar) {
    return (
      <div className="w-full min-h-screen bg-gradient-to-br from-blue-400 via-blue-500 to-purple-600 flex items-center justify-center">
        <div className="text-white text-xl">找不到行事曆</div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-blue-400 via-blue-500 to-purple-600 relative overflow-hidden">
      {/* 動態背景漸層 */}
      <div className="absolute inset-0 bg-gradient-to-tr from-blue-400/80 via-blue-500/60 to-purple-600/80"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-white/20 via-transparent to-transparent"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-purple-400/20 via-transparent to-transparent"></div>

      <div className="relative z-10 w-full">
        {/* 頁面標題區域 */}
        <div className="w-full px-4 lg:px-8 pt-32 md:pt-36 pb-8">
          <div className="flex items-center space-x-4 mb-6">
            <Button
              variant="ghost"
              className="text-white hover:bg-white/20"
              onClick={() => navigate('/holiday-management')}
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              返回
            </Button>
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-xl border border-white/30 shadow-lg">
              <Calendar className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-white mb-2 drop-shadow-lg">
                編輯行事曆 - {calendar.name}
              </h1>
              <p className="text-white/80 text-lg font-medium drop-shadow-md">
                年份：{calendar.year} | 管理所有日期設定
              </p>
            </div>
          </div>
        </div>

        {/* 主要內容 */}
        <div className="w-full px-4 lg:px-8 pb-8">
          <Card className="bg-white/30 backdrop-blur-xl border-white/40">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-white">行事曆日期列表</CardTitle>
              <div className="flex gap-2">
                <AddButton className="bg-white/60" onClick={handleAddNew} disabled={saving}>
                  <Plus className="h-4 w-4 mr-2" />
                  新增日期
                </AddButton>
                <SaveButton
                  className="bg-white/60"
                  onClick={onSave}
                  disabled={saving}
                  isLoading={saving}
                >
                  <Save className="h-4 w-4 mr-2" />
                  儲存變更
                </SaveButton>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-white/20 bg-white/10">
                      <TableHead className="text-white font-semibold">日期</TableHead>
                      <TableHead className="text-white font-semibold">類型</TableHead>
                      <TableHead className="text-white font-semibold">備註</TableHead>
                      <TableHead className="text-white font-semibold">操作</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {days.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center text-white/60 py-8">
                          尚無日期資料
                        </TableCell>
                      </TableRow>
                    ) : (
                      days
                        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                        .map(day => {
                          const dayTypeInfo = getDayTypeInfo(day.type);

                          return (
                            <TableRow key={day.date} className="border-white/10 hover:bg-white/5">
                              <TableCell className="text-white font-medium">
                                {formatDate(day.date)}
                              </TableCell>
                              <TableCell>
                                <Badge className={dayTypeInfo.className}>{dayTypeInfo.label}</Badge>
                              </TableCell>
                              <TableCell className="text-white/80">{day.note || '-'}</TableCell>
                              <TableCell>
                                <div className="flex items-center space-x-2">
                                  <EditButton
                                    size="sm"
                                    className="bg-white/70"
                                    onClick={() => handleEdit(day)}
                                  >
                                    <Edit className="h-4 w-4" />
                                  </EditButton>
                                  <DeleteButton
                                    size="sm"
                                    className="bg-red-500/20 hover:bg-red-500/30"
                                    onClick={() => handleDelete(day.date)}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </DeleteButton>
                                </div>
                              </TableCell>
                            </TableRow>
                          );
                        })
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* 編輯對話框 */}
      <Dialog
        open={editDialog.open}
        onOpenChange={open => setEditDialog(prev => ({ ...prev, open }))}
      >
        <DialogContent className="bg-white/95 backdrop-blur-xl">
          <DialogHeader>
            <DialogTitle>{editDialog.isNew ? '新增日期' : '編輯日期'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">日期</label>
              <Input
                type="date"
                value={editDialog.day?.date || ''}
                min={`${calendar?.year || new Date().getFullYear()}-01-01`}
                max={`${calendar?.year || new Date().getFullYear()}-12-31`}
                onChange={e =>
                  setEditDialog(prev => ({
                    ...prev,
                    day: prev.day ? { ...prev.day, date: e.target.value } : null,
                  }))
                }
                className="mt-1"
              />
              <p className="text-xs text-gray-500 mt-1">
                年份固定為 {calendar?.year || new Date().getFullYear()}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium">類型</label>
              <Select
                value={editDialog.day?.type || 'holiday'}
                onValueChange={(value: CalendarDayType) =>
                  setEditDialog(prev => ({
                    ...prev,
                    day: prev.day ? { ...prev.day, type: value } : null,
                  }))
                }
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {DAY_TYPES.map(type => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium">備註</label>
              <Input
                value={editDialog.day?.note || ''}
                onChange={e =>
                  setEditDialog(prev => ({
                    ...prev,
                    day: prev.day ? { ...prev.day, note: e.target.value } : null,
                  }))
                }
                placeholder="輸入備註..."
                className="mt-1"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setEditDialog({ open: false, day: null, isNew: false })}
            >
              取消
            </Button>
            <SaveButton onClick={handleSaveEdit}>{editDialog.isNew ? '新增' : '儲存'}</SaveButton>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 覆蓋確認對話框 */}
      <ConfirmDialog
        open={confirmDialog.open}
        onOpenChange={open => setConfirmDialog(prev => ({ ...prev, open }))}
        onConfirm={handleConfirmOverwrite}
        title="日期已存在"
        description={`日期 ${confirmDialog.day ? formatDate(confirmDialog.day.date) : ''} 已存在，是否要覆蓋現有資料？`}
        confirmText="覆蓋"
        cancelText="取消"
        variant="warning"
      />
    </div>
  );
}
