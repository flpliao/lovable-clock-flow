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
import { useHolidayManagement } from '@/hooks/useHolidayManagement';
import { CalendarItem } from '@/types/calendar';
import { Calendar, Edit3, RefreshCcw, Trash2 } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { CalendarCreateDialog } from '@/components/calendar/CalendarCreateDialog';
import { AddButton, DeleteButton, EditButton } from '@/components/common/buttons';
import DeleteConfirmDialog from '@/components/common/dialogs/DeleteConfirmDialog';
import PaginationControl from '@/components/PaginationControl';
import { showError, showSuccess } from '@/utils/toast';

export function CalendarList() {
  const navigate = useNavigate();
  const currentYear = new Date().getFullYear();
  const [year, setYear] = useState<number | 'all'>(currentYear);
  const [keyword, setKeyword] = useState('');

  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<CalendarItem | null>(null);

  // 分頁狀態
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // 使用假日管理 hook
  const {
    calendars: items,
    pagination,
    isLoading: loading,
    loadCalendars,
    deleteCalendarItem,
  } = useHolidayManagement();

  const load = useCallback(async () => {
    try {
      const params = {
        page: currentPage,
        per_page: pageSize,
        ...(year === 'all' ? { filter: { all: true } } : { filter: { year } }),
        ...(keyword && { filter: { ...(year === 'all' ? {} : { year }), name: keyword } }),
      };
      await loadCalendars(params);
    } catch (e: unknown) {
      const errorMessage = e instanceof Error ? e.message : '讀取失敗';
      showError(errorMessage);
    }
  }, [year, keyword, currentPage, pageSize, loadCalendars]);

  useEffect(() => {
    load();
  }, [load]);

  // 當篩選條件改變時，重置到第一頁
  useEffect(() => {
    setCurrentPage(1);
  }, [year, keyword]);

  const handleDeleteClick = (item: CalendarItem) => {
    setDeleteTarget(item);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async (): Promise<boolean> => {
    if (!deleteTarget) return false;

    setDeleting(deleteTarget.slug);
    try {
      await deleteCalendarItem(deleteTarget.slug);
      showSuccess('刪除成功');
      return true;
    } catch (e: unknown) {
      const errorMessage = e instanceof Error ? e.message : '刪除失敗';
      showError(errorMessage);
      return false;
    } finally {
      setDeleting(null);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleEdit = (calendar: CalendarItem) => {
    navigate(`/calendar/edit/${calendar.slug}`);
  };

  return (
    <div className="space-y-4">
      <Card className="bg-transparent backdrop-blur-xl border-white/40">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-white">行事曆列表</CardTitle>
          <div className="flex gap-2">
            <AddButton
              className="bg-white/60"
              onClick={() => setCreateDialogOpen(true)}
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

          {items.length === 0 ? (
            <div className="text-center py-8">
              <Calendar className="h-12 w-12 text-white/40 mx-auto mb-4" />
              <p className="text-white/60">
                {keyword ? '找不到符合條件的行事曆' : '尚無行事曆資料'}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {items.map(item => (
                <div key={item.slug} className="space-y-2">
                  {/* 行事曆主項目 */}
                  <div className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-colors gap-4">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 bg-blue-500">
                        <Calendar className="h-5 w-5 text-white" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="text-white font-medium truncate">{item.name}</h3>
                        <p className="text-white/60 text-sm">年份：{item.year}</p>
                        {item.description && (
                          <p className="text-white/50 text-xs mt-1 truncate">{item.description}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-6">
                      <div className="flex items-center space-x-2 text-white/60 text-sm">
                        <span>年份：{item.year}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <EditButton size="sm" onClick={() => handleEdit(item)} disabled={loading}>
                          <Edit3 className="h-4 w-4" />
                        </EditButton>
                        <DeleteButton
                          size="sm"
                          disabled={loading || deleting === item.slug}
                          className="bg-red-500/20 hover:bg-red-500/30"
                          onClick={() => handleDeleteClick(item)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </DeleteButton>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* 分頁控制 */}
          {pagination && pagination.last_page > 1 && (
            <div className="flex justify-center mt-4">
              <PaginationControl
                currentPage={pagination.current_page}
                totalPages={pagination.last_page}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* 新增行事曆彈出視窗 */}
      <CalendarCreateDialog isOpen={createDialogOpen} onClose={() => setCreateDialogOpen(false)} />

      {/* 刪除確認對話框 */}
      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDeleteConfirm}
        title="確認刪除"
        description={
          deleteTarget
            ? `您確定要刪除行事曆「${deleteTarget.name}（${deleteTarget.year}）」嗎？此操作會同時刪除所有相關的日期設定，且無法復原。`
            : '確定要刪除此項目嗎？此操作無法復原。'
        }
      />
    </div>
  );
}
