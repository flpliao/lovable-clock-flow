import { useEffect } from 'react';
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
import { CalendarDayType } from '@/types/calendar';
import { ArrowLeft, Save, Calendar, Plus, Edit, Trash2 } from 'lucide-react';
import { SaveButton, AddButton, EditButton, DeleteButton } from '@/components/common/buttons';
import { ConfirmDialog } from '@/components/common/dialogs';
import { useCalendarEditor } from '@/hooks/useCalendarEditor';

const DAY_TYPES: { value: CalendarDayType; label: string; className: string }[] = [
  { value: 'workday', label: '工作日', className: 'bg-green-100 text-green-800' },
  { value: 'holiday', label: '假日', className: 'bg-red-100 text-red-800' },
];

export function CalendarEditor() {
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
    formatDate,
    setEditDialog,
    setConfirmDialog,
  } = useCalendarEditor();

  useEffect(() => {
    loadCalendarData();
  }, [loadCalendarData]);

  // 如果沒有 slug，直接返回錯誤
  if (!slug) {
    return (
      <div className="w-full min-h-screen bg-gradient-to-br from-blue-400 via-blue-500 to-purple-600 flex items-center justify-center">
        <div className="text-white text-xl">無效的行事曆 ID</div>
      </div>
    );
  }

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
              onClick={() => window.history.back()}
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
