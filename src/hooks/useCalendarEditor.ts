import { useCallback, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getCalendar, getCalendarDays, batchUpdateCalendarDays } from '@/services/calendarService';
import { CalendarItem, CalendarDayItem } from '@/types/calendar';
import { showError, showSuccess } from '@/utils/toast';

interface EditDialogState {
  open: boolean;
  day: CalendarDayItem | null;
  isNew: boolean;
}

interface ConfirmDialogState {
  open: boolean;
  day: CalendarDayItem | null;
}

export const useCalendarEditor = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  // 本地狀態
  const [calendar, setCalendar] = useState<CalendarItem | null>(null);
  const [days, setDays] = useState<CalendarDayItem[]>([]);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [editDialog, setEditDialog] = useState<EditDialogState>({
    open: false,
    day: null,
    isNew: false,
  });
  const [confirmDialog, setConfirmDialog] = useState<ConfirmDialogState>({
    open: false,
    day: null,
  });

  // 格式化日期
  const formatDate = useCallback((dateStr: string) => {
    const date = new Date(dateStr);
    return date
      .toLocaleDateString('zh-TW', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      })
      .replace(/\//g, '/');
  }, []);

  // 載入行事曆資料
  const loadCalendarData = useCallback(async () => {
    if (!slug) return;

    try {
      setLoading(true);

      // 載入行事曆資料
      const calendarData = await getCalendar(slug);
      setCalendar(calendarData);

      // 載入行事曆日期
      const daysData = await getCalendarDays(slug);
      setDays(Array.isArray(daysData) ? daysData : []);
    } catch (e: unknown) {
      const errorMessage = e instanceof Error ? e.message : '載入失敗';
      showError(errorMessage, '載入失敗');
      navigate('/holiday-management');
    } finally {
      setLoading(false);
    }
  }, [slug, navigate]);

  // 新增日期
  const handleAddNew = useCallback(() => {
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
  }, [calendar?.year]);

  // 編輯日期
  const handleEdit = useCallback((day: CalendarDayItem) => {
    setEditDialog({
      open: true,
      day: { ...day },
      isNew: false,
    });
  }, []);

  // 刪除日期
  const handleDelete = useCallback(
    (date: string) => {
      setDays(prev => prev.filter(day => day.date !== date));
      showSuccess(`日期 ${formatDate(date)} 已刪除`, '刪除成功');
    },
    [formatDate]
  );

  // 保存日期資料
  const saveDayData = useCallback(
    (day: CalendarDayItem, isNew: boolean) => {
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
      showSuccess(
        `日期 ${formatDate(day.date)} 已${isNew ? '新增' : '更新'}`,
        isNew ? '新增成功' : '編輯成功'
      );

      setEditDialog({ open: false, day: null, isNew: false });
    },
    [formatDate]
  );

  // 保存編輯
  const handleSaveEdit = useCallback(() => {
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
  }, [editDialog, days, saveDayData]);

  // 確認覆蓋
  const handleConfirmOverwrite = useCallback(() => {
    const { day } = confirmDialog;
    if (!day) return;

    // 覆蓋現有資料
    saveDayData(day, true);
    setConfirmDialog({ open: false, day: null });
  }, [confirmDialog, saveDayData]);

  // 儲存到後端
  const onSave = useCallback(async () => {
    if (!slug) return;

    setSaving(true);
    try {
      await batchUpdateCalendarDays(slug, { updates: days });
      showSuccess('行事曆日期已成功更新', '已儲存');
    } catch (e: unknown) {
      const errorMessage = e instanceof Error ? e.message : '儲存失敗';
      showError(errorMessage, '儲存失敗');
    } finally {
      setSaving(false);
    }
  }, [slug, days]);

  return {
    // 狀態
    slug,
    calendar,
    days,
    saving,
    loading,
    editDialog,
    confirmDialog,

    // 操作方法
    loadCalendarData,
    handleAddNew,
    handleEdit,
    handleDelete,
    handleSaveEdit,
    handleConfirmOverwrite,
    onSave,
    formatDate,

    // 對話框控制
    setEditDialog,
    setConfirmDialog,
  };
};
