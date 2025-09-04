import { batchUpdateCalendarDays, getCalendar, getCalendarDays } from '@/services/calendarService';
import { CalendarDayItem, CalendarItem } from '@/types/calendar';
import { formatDate } from '@/utils/dateUtils';
import { showError, showSuccess } from '@/utils/toast';
import dayjs from 'dayjs';
import { useCallback, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

interface EditDialogState {
  open: boolean;
  day: CalendarDayItem | null;
  isNew: boolean;
}

interface ConfirmDialogState {
  open: boolean;
  day: CalendarDayItem | null;
}

// 擴展 CalendarDayItem 以支援暫存狀態
interface StagedCalendarDayItem extends CalendarDayItem {
  _isNew?: boolean; // 標記為新增
  _isModified?: boolean; // 標記為修改
  _isDeleted?: boolean; // 標記為刪除
  _originalData?: CalendarDayItem; // 原始資料（用於比較）
}

export const useCalendarEditor = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  // 本地狀態
  const [calendar, setCalendar] = useState<CalendarItem | null>(null);
  const [days, setDays] = useState<StagedCalendarDayItem[]>([]);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  // 使用 ref 來保存原始資料，避免重新渲染時丟失
  const originalDaysRef = useRef<CalendarDayItem[]>([]);
  const [editDialog, setEditDialog] = useState<EditDialogState>({
    open: false,
    day: null,
    isNew: false,
  });
  const [confirmDialog, setConfirmDialog] = useState<ConfirmDialogState>({
    open: false,
    day: null,
  });

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
      const daysArray = Array.isArray(daysData) ? daysData : [];

      // 保存原始資料
      originalDaysRef.current = daysArray;

      // 轉換為暫存格式
      const stagedDays: StagedCalendarDayItem[] = daysArray.map(day => ({
        ...day,
        _isNew: false,
        _isModified: false,
        _isDeleted: false,
        _originalData: { ...day },
      }));

      setDays(stagedDays);
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
    const currentYear = calendar?.year || dayjs().year();
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

  // 刪除日期（暫存模式）
  const handleDelete = useCallback((date: string) => {
    setDays(prev => prev.map(day => (day.date === date ? { ...day, _isDeleted: true } : day)));
    showSuccess(`日期 ${formatDate(date)} 已標記為刪除`, '已標記刪除');
  }, []);

  // 保存日期資料（暫存模式）
  const saveDayData = useCallback((day: CalendarDayItem, isNew: boolean) => {
    setDays(prev => {
      if (isNew) {
        // 新增時，如果已存在則覆蓋，否則新增
        const existingIndex = prev.findIndex(d => d.date === day.date && !d._isDeleted);
        if (existingIndex >= 0) {
          // 覆蓋現有資料
          const newDays = [...prev];
          newDays[existingIndex] = {
            ...day,
            _isNew: true,
            _isModified: false,
            _isDeleted: false,
            _originalData: newDays[existingIndex]._originalData,
          };
          return newDays;
        } else {
          // 新增資料
          const newDay: StagedCalendarDayItem = {
            ...day,
            _isNew: true,
            _isModified: false,
            _isDeleted: false,
            _originalData: undefined,
          };
          return [...prev, newDay];
        }
      } else {
        // 編輯時，標記為修改
        return prev.map(d =>
          d.date === day.date
            ? {
                ...day,
                _isNew: false,
                _isModified: true,
                _isDeleted: false,
                _originalData: d._originalData || d,
              }
            : d
        );
      }
    });

    setEditDialog({ open: false, day: null, isNew: false });
  }, []);

  // 保存編輯
  const handleSaveEdit = useCallback(() => {
    const { day, isNew } = editDialog;
    if (!day) return;

    // 檢查是否已存在相同日期的資料（排除已標記刪除的）
    const existingDay = days.find(d => d.date === day.date && !d._isDeleted);

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

  // 檢查是否有未儲存的變更
  const hasUnsavedChanges = useCallback(() => {
    return days.some(day => day._isNew || day._isModified || day._isDeleted);
  }, [days]);

  // 取得變更統計
  const getChangeStats = useCallback(() => {
    const stats = {
      new: 0,
      modified: 0,
      deleted: 0,
      total: 0,
    };

    days.forEach(day => {
      if (day._isNew) stats.new++;
      if (day._isModified) stats.modified++;
      if (day._isDeleted) stats.deleted++;
    });

    stats.total = stats.new + stats.modified + stats.deleted;
    return stats;
  }, [days]);

  // 儲存到後端（批次更新）
  const onSave = useCallback(async () => {
    if (!slug) return;

    const changeStats = getChangeStats();
    if (changeStats.total === 0) {
      showSuccess('沒有變更需要儲存', '已儲存');
      return;
    }

    setSaving(true);
    try {
      // 準備要更新的資料（排除已刪除的）
      const updatesToSave = days
        .filter(day => !day._isDeleted && (day._isNew || day._isModified))
        .map(day => {
          // 移除暫存標記，只保留原始資料
          const { _isNew, _isModified, _isDeleted, _originalData, ...cleanDay } = day;
          return cleanDay;
        });

      // 執行批次更新
      const result = await batchUpdateCalendarDays(slug, { updates: updatesToSave });

      // 更新本地狀態，移除暫存標記
      setDays(prev =>
        prev
          .filter(day => !day._isDeleted) // 移除已刪除的項目
          .map(day => {
            const { _isNew, _isModified, _isDeleted, _originalData, ...cleanDay } = day;
            return {
              ...cleanDay,
              _isNew: false,
              _isModified: false,
              _isDeleted: false,
              _originalData: cleanDay,
            };
          })
      );

      // 更新原始資料參考
      originalDaysRef.current = days
        .filter(day => !day._isDeleted)
        .map(day => {
          const { _isNew, _isModified, _isDeleted, _originalData, ...cleanDay } = day;
          return cleanDay;
        });

      showSuccess(
        `成功儲存：新增 ${result.created_count} 筆，更新 ${result.updated_count} 筆`,
        '已儲存'
      );
    } catch (e: unknown) {
      const errorMessage = e instanceof Error ? e.message : '儲存失敗';
      showError(errorMessage, '儲存失敗');
    } finally {
      setSaving(false);
    }
  }, [slug, days, getChangeStats]);

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

    // 變更狀態檢查
    hasUnsavedChanges,
    getChangeStats,

    // 對話框控制
    setEditDialog,
    setConfirmDialog,
  };
};
