import { useEffect, useMemo, useState } from 'react';
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
import { Separator } from '@/components/ui/separator';
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
} from '@/components/ui/alert-dialog';
import { CalendarPlus, Edit, Plus, RefreshCcw, Trash2 } from 'lucide-react';
import { CalendarItem } from '@/types/calendar';
import { useCalendarData } from '@/hooks/useCalendarData';
import { useToast } from '@/components/ui/use-toast';
import { CalendarEditor } from './CalendarEditor';

export function CalendarList() {
  const { toast } = useToast();
  const currentYear = new Date().getFullYear();
  const [year, setYear] = useState<number | 'all'>(currentYear);
  const [keyword, setKeyword] = useState('');
  const [editing, setEditing] = useState<CalendarItem | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [newCalendar, setNewCalendar] = useState({
    year: currentYear,
    name: '',
    description: '',
  });

  // 使用行事曆 store
  const {
    calendars: items,
    isLoading: loading,
    loadCalendars,
    createCalendarItem,
    deleteCalendarItem,
    copyCalendarToYearData,
  } = useCalendarData();

  const load = async () => {
    try {
      const params = year === 'all' ? { filter: { all: true } } : { filter: { year } };
      await loadCalendars(params);
    } catch (e: unknown) {
      const errorMessage = e instanceof Error ? e.message : '讀取失敗';
      toast({ title: '讀取失敗', description: errorMessage, variant: 'destructive' });
    }
  };

  useEffect(() => {
    load();
  }, [year, load]);

  const filtered = useMemo(
    () => items.filter(i => i.name.toLowerCase().includes(keyword.toLowerCase())),
    [items, keyword]
  );

  const onCreate = async () => {
    if (!newCalendar.name.trim()) {
      toast({ title: '請輸入行事曆名稱', variant: 'destructive' });
      return;
    }

    try {
      await createCalendarItem({
        year: newCalendar.year,
        name: newCalendar.name.trim(),
        description: newCalendar.description.trim() || undefined,
      });
      toast({ title: '建立成功' });
      setCreateOpen(false);
      setNewCalendar({ year: currentYear, name: '', description: '' });
    } catch (e: unknown) {
      const errorMessage = e instanceof Error ? e.message : '建立失敗';
      toast({ title: '建立失敗', description: errorMessage, variant: 'destructive' });
    }
  };

  const onDelete = async (slug: string) => {
    try {
      await deleteCalendarItem(slug);
      toast({ title: '刪除成功' });
    } catch (e: unknown) {
      const errorMessage = e instanceof Error ? e.message : '刪除失敗';
      toast({ title: '刪除失敗', description: errorMessage, variant: 'destructive' });
    }
  };

  const onCopy = async (slug: string, newYear: number) => {
    try {
      await copyCalendarToYearData(slug, newYear);
      toast({ title: '複製成功' });
    } catch (e: unknown) {
      const errorMessage = e instanceof Error ? e.message : '複製失敗';
      toast({ title: '複製失敗', description: errorMessage, variant: 'destructive' });
    }
  };

  return (
    <div className="space-y-4">
      <Card className="bg-white/30 backdrop-blur-xl border-white/40">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-white">行事曆列表</CardTitle>
          <div className="flex gap-2">
            <Button variant="secondary" className="bg-white/60" onClick={() => setCreateOpen(true)}>
              <Plus className="mr-2 h-4 w-4" /> 新增行事曆
            </Button>
            <Button variant="ghost" className="text-white" onClick={load} disabled={loading}>
              <RefreshCcw className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="text-white/80 text-sm">篩選年份</label>
              <Select
                value={String(year)}
                onValueChange={v => setYear(v === 'all' ? 'all' : parseInt(v))}
              >
                <SelectTrigger className="h-9 bg-white/40 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={'all'}>全部</SelectItem>
                  {Array.from({ length: 6 }, (_, i) => currentYear - 2 + i).map(y => (
                    <SelectItem key={y} value={String(y)}>
                      {y}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="md:col-span-2">
              <label className="text-white/80 text-sm">搜尋名稱</label>
              <Input
                value={keyword}
                onChange={e => setKeyword(e.target.value)}
                className="bg-white/40 text-white placeholder:text-white/70"
                placeholder="輸入關鍵字"
              />
            </div>
          </div>
          <Separator className="bg-white/40" />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map(item => (
              <Card key={item.slug} className="bg-white/20 border-white/30">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-white text-lg">
                    {item.name}（{item.year}）
                  </CardTitle>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="secondary"
                      className="bg-white/70"
                      onClick={() => setEditing(item)}
                    >
                      <Edit className="h-4 w-4 mr-1" /> 編輯
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button size="sm" variant="destructive">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>確認刪除</AlertDialogTitle>
                          <AlertDialogDescription>
                            您確定要刪除行事曆「{item.name}（{item.year}
                            ）」嗎？此操作會同時刪除所有相關的日期設定，且無法復原。
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>取消</AlertDialogCancel>
                          <AlertDialogAction onClick={() => onDelete(item.slug)}>
                            確認刪除
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="bg-white"
                      onClick={() => onCopy(item.slug, item.year + 1)}
                    >
                      <CalendarPlus className="h-4 w-4 mr-1" /> 複製到 {item.year + 1}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 建立表單（最簡化內嵌版）*/}
      {createOpen && (
        <Card className="bg-white/30 border-white/40">
          <CardHeader>
            <CardTitle className="text-white">新增行事曆</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <Select
              value={String(newCalendar.year)}
              onValueChange={v => setNewCalendar(prev => ({ ...prev, year: parseInt(v) }))}
            >
              <SelectTrigger className="h-9 bg-white/60">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: 6 }, (_, i) => currentYear - 2 + i).map(y => (
                  <SelectItem key={y} value={String(y)}>
                    {y}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              placeholder="名稱"
              value={newCalendar.name}
              onChange={e => setNewCalendar(prev => ({ ...prev, name: e.target.value }))}
              className="bg-white/60"
            />
            <Input
              placeholder="描述（選填）"
              value={newCalendar.description}
              onChange={e => setNewCalendar(prev => ({ ...prev, description: e.target.value }))}
              className="bg-white/60"
            />
            <div className="md:col-span-3 flex gap-2">
              <Button onClick={onCreate} className="bg-green-500">
                <Plus className="h-4 w-4 mr-1" /> 建立
              </Button>
              <Button
                variant="ghost"
                className="text-white"
                onClick={() => {
                  setCreateOpen(false);
                  setNewCalendar({ year: currentYear, name: '', description: '' });
                }}
              >
                取消
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* 編輯器 */}
      {editing && <CalendarEditor calendar={editing} onClose={() => setEditing(null)} />}
    </div>
  );
}
