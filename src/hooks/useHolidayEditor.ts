import { batchUpdateCalendarDays, getCalendar, getCalendars } from '@/services/calendarService';
import { useCalendarStore } from '@/stores/calendarStore';
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
  originalDate?: string; // 保存原始日期，用於編輯時找到正確的項目
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

export const useHolidayEditor = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  // 使用 calendar store
  const {
    getCalendar: getCalendarFromStore,
    getCalendarDays: getCalendarDaysFromStore,
    updateCalendarDays: updateCalendarDaysInStore,
    setCalendars,
    setError,
  } = useCalendarStore();

  // 本地狀態
  const [days, setDays] = useState<StagedCalendarDayItem[]>([]);
  const [saving, setSaving] = useState(false);
  const [loading, setLoadingState] = useState(true);

  // 使用 ref 來保存原始資料，避免重新渲染時丟失
  const originalDaysRef = useRef<CalendarDayItem[]>([]);
  const [editDialog, setEditDialog] = useState<EditDialogState>({
    open: false,
    day: null,
    isNew: false,
    originalDate: undefined,
  });
  const [confirmDialog, setConfirmDialog] = useState<ConfirmDialogState>({
    open: false,
    day: null,
  });

  // 載入行事曆資料 - 優先從 store 取得，沒有才打 API
  const loadCalendarData = useCallback(async () => {
    if (!slug) return;

    try {
      setLoadingState(true);
      setError(null);

      // 先嘗試從 store 取得行事曆資料
      let calendarData = getCalendarFromStore(slug);

      // 如果 store 中沒有，才打 API 載入所有行事曆
      if (!calendarData) {
        const result = await getCalendars();
        // 更新 store 中的行事曆資料
        setCalendars(result.items, result.pagination);
        // 重新從 store 取得資料
        calendarData = getCalendarFromStore(slug);
      }

      // 載入行事曆日期 - 優先從 store 取得，沒有才重新載入 calendar
      let allDays: CalendarDayItem[] = [];

      // 先嘗試從 store 取得資料
      allDays = getCalendarDaysFromStore(slug);

      // 如果 store 中沒有資料，則重新載入 calendar 來獲取所有資料
      if (allDays.length === 0) {
        // 重新載入 calendar 資料，這會包含所有 calendar_days
        const fullCalendarData = await getCalendar(slug);
        allDays = fullCalendarData.calendar_days || [];

        // 將載入的資料存入 store
        if (allDays.length > 0) {
          updateCalendarDaysInStore(slug, allDays);
        }
      }

      // 保存原始資料
      originalDaysRef.current = allDays;

      // 轉換為暫存格式
      const stagedDays: StagedCalendarDayItem[] = allDays.map(day => ({
        ...day,
        _isNew: false,
        _isModified: false,
        _isDeleted: false,
        _originalData: { ...day },
      }));

      setDays(stagedDays);
    } catch (e: unknown) {
      const errorMessage = e instanceof Error ? e.message : '載入失敗';
      setError(errorMessage);
      showError(errorMessage, '載入失敗');
      navigate('/holiday-management');
    } finally {
      setLoadingState(false);
    }
  }, [
    slug,
    navigate,
    getCalendarFromStore,
    getCalendarDaysFromStore,
    updateCalendarDaysInStore,
    setCalendars,
    setError,
  ]);

  // 新增日期
  const handleAddNew = useCallback((calendar: CalendarItem) => {
    const currentYear = calendar.year || dayjs().year();
    setEditDialog({
      open: true,
      day: {
        date: `${currentYear}-01-01`,
        type: 'holiday',
        note: null,
      },
      isNew: true,
      originalDate: undefined,
    });
  }, []);

  // 編輯日期
  const handleEdit = useCallback((day: CalendarDayItem) => {
    setEditDialog({
      open: true,
      day: { ...day },
      isNew: false,
      originalDate: day.date, // 保存原始日期
    });
  }, []);

  // 刪除日期（暫存模式）
  const handleDelete = useCallback((date: string) => {
    setDays(prev =>
      prev.flatMap(day => {
        if (day.date === date) {
          if (day._isNew) {
            return [];
          }
          return { ...day, _isDeleted: true };
        }
        return day;
      })
    );
    showSuccess(`日期 ${formatDate(date)} 已標記為刪除`, '已標記刪除');
  }, []);

  // 保存日期資料（暫存模式）
  const saveDayData = useCallback(
    (day: CalendarDayItem, isNew: boolean) => {
      let hasConflict = false;

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
          // 編輯時，需要找到原始項目（可能日期已經改變）
          // 使用 editDialog 中保存的原始日期
          const originalDate = editDialog.originalDate;
          if (!originalDate) return prev;

          // 檢查新日期是否與其他項目衝突
          const conflictingDay = prev.find(
            d => d.date === day.date && d.date !== originalDate && !d._isDeleted
          );

          if (conflictingDay) {
            // 如果有衝突，顯示確認對話框
            hasConflict = true;
            setConfirmDialog({ open: true, day });
            return prev;
          }

          // 更新項目
          return prev.map(d => {
            if (d.date === originalDate) {
              // 找到原始項目，更新為新資料
              return {
                ...day,
                _isNew: false,
                _isModified: true,
                _isDeleted: false,
                _originalData: d._originalData || d,
              };
            }
            return d;
          });
        }
      });

      // 只有在沒有衝突時才關閉編輯對話框
      if (!hasConflict) {
        setEditDialog({ open: false, day: null, isNew: false, originalDate: undefined });
      }
    },
    [editDialog.originalDate]
  );

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

    const originalDate = editDialog.originalDate;
    const isNew = editDialog.isNew;

    // 覆蓋現有資料
    setDays(prev => {
      if (isNew) {
        // 新增時覆蓋：直接替換現有項目
        return prev.map(d => {
          if (d.date === day.date && !d._isDeleted) {
            return {
              ...day,
              _isNew: true,
              _isModified: false,
              _isDeleted: false,
              _originalData: d._originalData,
            };
          }
          return d;
        });
      } else {
        // 編輯時覆蓋：移除衝突項目，更新原始項目
        if (!originalDate) return prev;

        return prev
          .filter(d => !(d.date === day.date && d.date !== originalDate && !d._isDeleted))
          .map(d => {
            if (d.date === originalDate) {
              const isOriginalNew = d._isNew;
              const isOriginalModified = d._isModified;

              return {
                ...day,
                _isNew: isOriginalNew,
                _isModified: isOriginalNew ? false : isOriginalModified || true,
                _isDeleted: false,
                _originalData: d._originalData || d,
              };
            }
            return d;
          });
      }
    });

    setConfirmDialog({ open: false, day: null });
    setEditDialog({ open: false, day: null, isNew: false, originalDate: undefined });
  }, [confirmDialog, editDialog.originalDate, editDialog.isNew]);

  // 檢查是否有未儲存的變更
  const hasUnsavedChanges = useCallback(() => {
    return days.some(day => day._isNew || day._isModified || day._isDeleted);
  }, [days]);

  // 取得變更統計 - 直接計算標記數量
  const getChangeStats = useCallback(() => {
    const newCount = days.filter(day => day._isNew).length;
    const modifiedCount = days.filter(day => day._isModified).length;
    const deletedCount = days.filter(day => day._isDeleted).length;

    return {
      new: newCount,
      modified: modifiedCount,
      deleted: deletedCount,
      total: newCount + modifiedCount + deletedCount,
    };
  }, [days]);

  // 儲存到後端（批次更新）並同步更新 store
  const onSave = useCallback(async () => {
    if (!slug) return;

    const changeStats = getChangeStats();
    if (changeStats.total === 0) {
      showSuccess('沒有變更需要儲存', '已儲存');
      return;
    }

    setSaving(true);
    try {
      // 準備要傳給後端的資料：所有非刪除的項目
      const updatesToSave = days
        .filter(day => !day._isDeleted) // 排除已刪除的項目
        .map(day => {
          // 移除暫存標記，只保留原始資料
          const { _isNew, _isModified, _isDeleted, _originalData, ...cleanDay } = day;
          return cleanDay;
        });

      // 執行批次更新 API - 後端會自動處理新增和更新
      await batchUpdateCalendarDays(slug, { updates: updatesToSave });

      // 同步更新 store 中的資料
      if (updatesToSave.length > 0) {
        // 直接更新 store 中的資料
        updateCalendarDaysInStore(slug, updatesToSave);
      }

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

      showSuccess('儲存成功', '已儲存');
    } catch (e: unknown) {
      const errorMessage = e instanceof Error ? e.message : '儲存失敗';
      setError(errorMessage);
      showError(errorMessage, '儲存失敗');
    } finally {
      setSaving(false);
    }
  }, [slug, days, getChangeStats, updateCalendarDaysInStore, setError]);

  return {
    // 狀態
    slug,
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
