
import { useToast } from '@/hooks/useToast';
import { supabase } from '@/integrations/supabase/client';
import { useEffect, useState } from 'react';

interface Holiday {
  id: string;
  country_id: string | null;
  name_zh: string;
  name_en: string;
  holiday_date: string;
  holiday_type: string;
  is_recurring: boolean;
  is_active: boolean;
}

export const useHolidaySettings = () => {
  const [holidays, setHolidays] = useState<Holiday[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingHoliday, setEditingHoliday] = useState<Holiday | null>(null);
  const [formData, setFormData] = useState({
    country_id: null as string | null,
    name_zh: '',
    name_en: '',
    holiday_date: '',
    holiday_type: 'national',
    is_recurring: false
  });
  const { toast } = useToast();

  const loadHolidays = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('holidays')
        .select('*')
        .order('holiday_date', { ascending: true });

      if (error) {
        console.error('載入假日設定失敗:', error);
        toast({
          title: "載入失敗",
          description: "無法載入假日設定",
          variant: "destructive"
        });
        return;
      }

      setHolidays(data || []);
    } catch (error) {
      console.error('載入假日設定異常:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const holidayData = {
        ...formData,
        is_active: true
      };

      if (editingHoliday) {
        const { error } = await supabase
          .from('holidays')
          .update(holidayData)
          .eq('id', editingHoliday.id);

        if (error) throw error;

        toast({
          title: "更新成功",
          description: "假日設定已更新",
        });
      } else {
        const { error } = await supabase
          .from('holidays')
          .insert([holidayData]);

        if (error) throw error;

        toast({
          title: "新增成功",
          description: "新假日已加入",
        });
      }

      resetForm();
      loadHolidays();
    } catch (error) {
      console.error('儲存假日設定失敗:', error);
      toast({
        title: "儲存失敗",
        description: "儲存假日設定時發生錯誤",
        variant: "destructive"
      });
    }
  };

  const handleEdit = (holiday: Holiday) => {
    setEditingHoliday(holiday);
    setFormData({
      country_id: holiday.country_id,
      name_zh: holiday.name_zh,
      name_en: holiday.name_en || '',
      holiday_date: holiday.holiday_date,
      holiday_type: holiday.holiday_type,
      is_recurring: holiday.is_recurring
    });
  };

  const handleDelete = async (id: string) => {
    if (!confirm('確定要刪除這個假日嗎？')) return;

    try {
      const { error } = await supabase
        .from('holidays')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "刪除成功",
        description: "假日已刪除",
      });
      loadHolidays();
    } catch (error) {
      console.error('刪除假日失敗:', error);
      toast({
        title: "刪除失敗",
        description: "刪除假日時發生錯誤",
        variant: "destructive"
      });
    }
  };

  const resetForm = () => {
    setFormData({
      country_id: null,
      name_zh: '',
      name_en: '',
      holiday_date: '',
      holiday_type: 'national',
      is_recurring: false
    });
    setEditingHoliday(null);
  };

  useEffect(() => {
    loadHolidays();
  }, []);

  return {
    holidays,
    loading,
    editingHoliday,
    formData,
    setFormData,
    handleSubmit,
    handleEdit,
    handleDelete,
    resetForm
  };
};
