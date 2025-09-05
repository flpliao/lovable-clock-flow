import { AddButton, DeleteButton, EditButton, SaveButton } from '@/components/common/buttons';
import { ConfirmDialog } from '@/components/common/dialogs';
import PageHeader from '@/components/layouts/PageHeader';
import PageLayout from '@/components/layouts/PageLayout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useHolidayEditor } from '@/hooks/useHolidayEditor';
import { cn } from '@/lib/utils';
import { CalendarDayType } from '@/types/calendar';
import { formatDate } from '@/utils/dateUtils';
import { ArrowLeft, Calendar, Edit, Plus, Save, Trash2 } from 'lucide-react';
import { useEffect } from 'react';

const DAY_TYPES: { value: CalendarDayType; label: string; className: string }[] = [
  { value: 'workday', label: '工作日', className: 'bg-green-100 text-green-800' },
  { value: 'holiday', label: '假日', className: 'bg-red-100 text-red-800' },
];

function CalendarEditor() {
  const {
    slug,
    calendar,
    days,
    saving,
    loading,
    editDialog,
    confirmDialog,
    loadCalendarData,
    handleAddNew,
    handleEdit,
    handleDelete,
    handleSaveEdit,
    handleConfirmOverwrite,
    onSave,
    hasUnsavedChanges,
    getChangeStats,
    setEditDialog,
    setConfirmDialog,
  } = useHolidayEditor();

  useEffect(() => {
    loadCalendarData();
  }, [loadCalendarData]);

  // 如果沒有 slug，直接返回錯誤
  if (!slug) {
    return (
      <PageLayout>
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-white text-xl">無效的行事曆 ID</div>
        </div>
      </PageLayout>
    );
  }

  const getDayTypeInfo = (type: CalendarDayType) => {
    return DAY_TYPES.find(dt => dt.value === type) || DAY_TYPES[0];
  };

  // 取得變更統計
  const changeStats = getChangeStats();
  const hasChanges = hasUnsavedChanges();

  if (loading) {
    return (
      <PageLayout>
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-white text-xl">載入中...</div>
        </div>
      </PageLayout>
    );
  }

  if (!calendar) {
    return (
      <PageLayout>
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-white text-xl">找不到行事曆</div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      {/* 頁面標題區域 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            className="text-white hover:bg-white/20"
            onClick={() => window.history.back()}
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            返回
          </Button>
          <PageHeader
            icon={Calendar}
            title={`編輯行事曆 - ${calendar.name}`}
            description={`年份：${calendar.year} | 管理所有日期設定`}
            iconBgColor="bg-white/20"
          />
        </div>
        {hasChanges && (
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
            <span className="text-yellow-200 text-sm font-medium">
              有未儲存的變更：新增 {changeStats.new} 筆，修改 {changeStats.modified} 筆，刪除{' '}
              {changeStats.deleted} 筆
            </span>
          </div>
        )}
      </div>

      {/* 主要內容 */}
      <Card className="bg-transparent backdrop-blur-xl border-white/40">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-white">行事曆日期列表</CardTitle>
          <div className="flex gap-2">
            <AddButton className="bg-white/60" onClick={handleAddNew} disabled={saving}>
              <Plus className="h-4 w-4 mr-2" />
              新增日期
            </AddButton>
            <SaveButton
              className={`${hasChanges ? 'bg-green-500/80 hover:bg-green-500' : 'bg-white/60'} ${hasChanges ? 'animate-pulse' : ''}`}
              onClick={onSave}
              disabled={saving || !hasChanges}
              isLoading={saving}
            >
              <Save className="h-4 w-4 mr-2" />
              {hasChanges ? '儲存變更' : '已儲存'}
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
                    .filter(day => !day._isDeleted) // 過濾掉已標記刪除的項目
                    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                    .map(day => {
                      const dayTypeInfo = getDayTypeInfo(day.type);
                      const isModified = day._isNew || day._isModified;

                      return (
                        <TableRow
                          key={day.date}
                          className={cn(
                            'border-white/10 hover:bg-white/5',
                            isModified && 'bg-yellow-500/10'
                          )}
                        >
                          <TableCell className="text-white font-medium">
                            <div className="flex items-center space-x-2">
                              {formatDate(day.date)}
                              {day._isNew && (
                                <Badge className="bg-green-500/80 text-white text-xs">新增</Badge>
                              )}
                              {day._isModified && !day._isNew && (
                                <Badge className="bg-blue-500/80 text-white text-xs">修改</Badge>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge className={dayTypeInfo.className}>{dayTypeInfo.label}</Badge>
                          </TableCell>
                          <TableCell className="text-white/80">{day.note || '-'}</TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <EditButton size="sm" onClick={() => handleEdit(day)}>
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
    </PageLayout>
  );
}

export default CalendarEditor;
