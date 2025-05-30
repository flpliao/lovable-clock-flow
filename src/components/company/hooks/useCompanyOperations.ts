
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useUser } from '@/contexts/UserContext';
import { supabase } from '@/integrations/supabase/client';
import { Company } from '@/types/company';

export const useCompanyOperations = () => {
  const [company, setCompany] = useState<Company | null>(null);
  const { toast } = useToast();
  const { isAdmin, currentUser } = useUser();

  // 載入公司資料
  const loadCompany = async () => {
    try {
      console.log('正在載入公司資料，當前用戶:', currentUser?.name, '管理員狀態:', isAdmin());
      
      // 檢查用戶是否已登入且為管理員
      if (!currentUser?.id) {
        console.log('用戶未登入，跳過載入公司資料');
        setCompany(null);
        return;
      }

      console.log('開始查詢公司資料...');
      const { data, error } = await supabase
        .from('companies')
        .select('*')
        .limit(1)
        .maybeSingle();

      if (error) {
        console.error('載入公司資料錯誤:', error);
        // 由於我們已經設置了正確的 RLS 政策，這裡應該不會有權限問題
        throw error;
      }
      
      console.log('載入的公司資料:', data);
      setCompany(data);
    } catch (error) {
      console.error('載入公司資料失敗:', error);
      toast({
        title: "載入失敗",
        description: "無法載入公司資料，請檢查您的權限",
        variant: "destructive"
      });
      setCompany(null);
    }
  };

  // 更新或新建公司資料
  const updateCompany = async (updatedCompany: Company): Promise<boolean> => {
    console.log('🔄 開始更新公司資料');
    console.log('📋 當前用戶:', currentUser?.name, '管理員狀態:', isAdmin());
    console.log('📋 提交的資料:', updatedCompany);
    
    if (!isAdmin()) {
      toast({
        title: "權限不足",
        description: "只有管理員可以編輯公司資料",
        variant: "destructive"
      });
      return false;
    }

    if (!currentUser?.id) {
      toast({
        title: "未登入",
        description: "請先登入後再操作",
        variant: "destructive"
      });
      return false;
    }

    try {
      console.log('🔍 開始資料驗證和處理...');
      
      // 驗證必填欄位
      const requiredFields = ['name', 'registration_number', 'address', 'phone', 'email', 'business_type', 'legal_representative'];
      const missingFields = requiredFields.filter(field => {
        const value = updatedCompany[field as keyof Company];
        return !value || (typeof value === 'string' && value.trim() === '');
      });

      if (missingFields.length > 0) {
        const fieldNames = {
          name: '公司名稱',
          registration_number: '統一編號',
          address: '公司地址',
          phone: '公司電話',
          email: '公司Email',
          business_type: '營業項目',
          legal_representative: '法定代表人'
        };
        const missingFieldNames = missingFields.map(field => fieldNames[field as keyof typeof fieldNames]).join('、');
        throw new Error(`缺少必填欄位: ${missingFieldNames}`);
      }

      // 驗證統一編號格式
      const registrationNumber = updatedCompany.registration_number.toString().trim();
      if (!/^\d{8}$/.test(registrationNumber)) {
        throw new Error('統一編號必須為8位數字');
      }

      // 驗證電子郵件格式
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(updatedCompany.email.trim())) {
        throw new Error('電子郵件格式不正確');
      }

      // 準備資料
      const companyData = {
        name: updatedCompany.name.trim(),
        registration_number: registrationNumber,
        address: updatedCompany.address.trim(),
        phone: updatedCompany.phone.trim(),
        email: updatedCompany.email.trim().toLowerCase(),
        website: updatedCompany.website?.trim() || null,
        established_date: updatedCompany.established_date || null,
        capital: updatedCompany.capital ? Number(updatedCompany.capital) : null,
        business_type: updatedCompany.business_type.trim(),
        legal_representative: updatedCompany.legal_representative.trim(),
        updated_at: new Date().toISOString()
      };
      
      console.log('📄 準備處理的資料:', companyData);

      let result;

      // 檢查是否已存在公司資料
      if (company && company.id) {
        // 更新現有公司資料
        console.log('🔄 更新現有公司資料，ID:', company.id);
        const { data, error } = await supabase
          .from('companies')
          .update(companyData)
          .eq('id', company.id)
          .select()
          .single();

        if (error) {
          console.error('❌ Supabase 更新錯誤:', error);
          throw new Error(`更新失敗: ${error.message}`);
        }
        result = data;
      } else {
        // 新增公司資料
        console.log('➕ 新增公司資料');
        const { data, error } = await supabase
          .from('companies')
          .insert({
            ...companyData,
            created_at: new Date().toISOString()
          })
          .select()
          .single();

        if (error) {
          console.error('❌ Supabase 新增錯誤:', error);
          throw new Error(`新增失敗: ${error.message}`);
        }
        result = data;
      }

      console.log('✅ 操作成功，返回的資料:', result);
      
      // 更新本地狀態
      setCompany(result);
      
      toast({
        title: company ? "更新成功" : "建立成功",
        description: company ? "已成功更新公司基本資料" : "已成功建立公司基本資料"
      });
      return true;
    } catch (error) {
      console.error('❌ 處理公司資料失敗:', error);
      
      let errorMessage = "無法處理公司資料";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      toast({
        title: "處理失敗",
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
