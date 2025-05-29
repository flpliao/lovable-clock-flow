
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useUser } from '@/contexts/UserContext';
import { supabase } from '@/integrations/supabase/client';
import { Company } from '@/types/company';

export const useCompanyOperations = () => {
  const [company, setCompany] = useState<Company | null>(null);
  const { toast } = useToast();
  const { isAdmin } = useUser();

  // 載入公司資料
  const loadCompany = async () => {
    try {
      console.log('正在載入公司資料...');
      const { data, error } = await supabase
        .from('companies')
        .select('*')
        .limit(1)
        .maybeSingle();

      if (error) {
        console.error('載入公司資料錯誤:', error);
        throw error;
      }
      
      console.log('載入的公司資料:', data);
      setCompany(data);
    } catch (error) {
      console.error('載入公司資料失敗:', error);
      toast({
        title: "載入失敗",
        description: "無法載入公司資料",
        variant: "destructive"
      });
    }
  };

  // 更新公司資料
  const updateCompany = async (updatedCompany: Company) => {
    if (!isAdmin()) {
      toast({
        title: "權限不足",
        description: "只有管理員可以編輯公司資料",
        variant: "destructive"
      });
      return false;
    }

    try {
      console.log('正在更新公司資料:', updatedCompany);
      
      // 準備更新資料，確保欄位類型正確
      const updateData = {
        name: updatedCompany.name,
        registration_number: updatedCompany.registration_number,
        address: updatedCompany.address,
        phone: updatedCompany.phone,
        email: updatedCompany.email,
        website: updatedCompany.website || null,
        established_date: updatedCompany.established_date || null,
        capital: updatedCompany.capital ? Number(updatedCompany.capital) : null,
        business_type: updatedCompany.business_type,
        legal_representative: updatedCompany.legal_representative,
        updated_at: new Date().toISOString()
      };
      
      console.log('準備更新的資料:', updateData);

      const { data, error } = await supabase
        .from('companies')
        .update(updateData)
        .eq('id', updatedCompany.id)
        .select()
        .single();

      if (error) {
        console.error('Supabase 更新錯誤:', error);
        throw error;
      }

      console.log('更新成功，返回的資料:', data);
      
      // 更新本地狀態
      setCompany(data);
      
      toast({
        title: "更新成功",
        description: "已成功更新公司基本資料"
      });
      return true;
    } catch (error) {
      console.error('更新公司資料失敗:', error);
      
      // 提供更詳細的錯誤訊息
      let errorMessage = "無法更新公司資料";
      if (error instanceof Error) {
        errorMessage = `更新失敗: ${error.message}`;
      }
      
      toast({
        title: "更新失敗",
        description: errorMessage,
        variant: "destructive"
      });
      return false;
    }
  };

  return {
    company,
    setCompany,
    loadCompany,
    updateCompany
  };
};
