import { useEffect, useMemo, useState, useCallback } from 'react';
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
import { RefreshCcw } from 'lucide-react';
import { CalendarItem } from '@/types/calendar';
import { useCalendarData } from '@/hooks/useCalendarData';
import { useToast } from '@/components/ui/use-toast';
import { CalendarEditor } from './CalendarEditor';
import { AddButton, EditButton, DeleteButton } from '@/components/common/buttons';

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
  const [creating, setCreating] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

  // 使用行事曆 store
  const {
    calendars: items,
    isLoading: loading,
    loadCalendars,
    createCalendarItem,
    deleteCalendarItem,
  } = useCalendarData();

  const load = useCallback(async () => {
    try {
      const params = year === 'all' ? { filter: { all: true } } : { filter: { year } };
      await loadCalendars(params);
    } catch (e: unknown) {
      const errorMessage = e instanceof Error ? e.message : '讀取失敗';
      toast({ title: '讀取失敗', description: errorMessage, variant: 'destructive' });
    }
  }, [year, loadCalendars, toast]);

  useEffect(() => {
    load();
  }, [load]);

  const filtered = useMemo(
    () => items.filter(i => i.name.toLowerCase().includes(keyword.toLowerCase())),
    [items, keyword]
  );

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
      setCreateOpen(false);
      setNewCalendar({ year: currentYear, name: '', description: '' });
    } catch (e: unknown) {
      const errorMessage = e instanceof Error ? e.message : '建立失敗';
      toast({ title: '建立失敗', description: errorMessage, variant: 'destructive' });
    } finally {
      setCreating(false);
    }
  };

  const onDelete = async (slug: string) => {
    setDeleting(slug);
    try {
      await deleteCalendarItem(slug);
      toast({ title: '刪除成功' });
    } catch (e: unknown) {
      const errorMessage = e instanceof Error ? e.message : '刪除失敗';
      toast({ title: '刪除失敗', description: errorMessage, variant: 'destructive' });
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div className="space-y-4">
      <Card className="bg-white/30 backdrop-blur-xl border-white/40">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-white">行事曆列表</CardTitle>
          <div className="flex gap-2">
            <AddButton
              className="bg-white/60"
              onClick={() => setCreateOpen(true)}
              disabled={loading}
              isLoading={false}
            >
              新增行事曆
            </AddButton>
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
                disabled={loading}
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
                disabled={loading}
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
                    <EditButton
                      size="sm"
                      className="bg-white/70"
                      onClick={() => setEditing(item)}
                      disabled={loading}
                    >
                      編輯
                    </EditButton>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <DeleteButton size="sm" disabled={loading || deleting === item.slug} />
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
                <CardContent></CardContent>
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
              disabled={loading}
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
              disabled={loading}
            />
            <Input
              placeholder="描述（選填）"
              value={newCalendar.description}
              onChange={e => setNewCalendar(prev => ({ ...prev, description: e.target.value }))}
              className="bg-white/60"
              disabled={loading}
            />
            <div className="md:col-span-3 flex gap-2">
              <AddButton
                onClick={onCreate}
                className="bg-green-500"
                disabled={loading}
                isLoading={creating}
              >
                建立
              </AddButton>
              <Button
                variant="ghost"
                className="text-white"
                onClick={() => {
                  setCreateOpen(false);
                  setNewCalendar({ year: currentYear, name: '', description: '' });
                }}
                disabled={loading}
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
