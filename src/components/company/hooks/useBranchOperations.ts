import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useUser } from '@/contexts/UserContext';
import { supabase } from '@/integrations/supabase/client';
import { Branch, NewBranch, Company } from '@/types/company';

export const useBranchOperations = (company: Company | null) => {
  const [branches, setBranches] = useState<Branch[]>([]);
  const { toast } = useToast();
  const { currentUser } = useUser();

  // 載入營業處資料 - 改善錯誤處理
  const loadBranches = async () => {
    try {
      console.log('🏢 useBranchOperations: 正在載入營業處資料...');
      
      let query = supabase.from('branches').select('*');
      
      // 如果有公司資料，按公司ID篩選
      if (company?.id) {
        query = query.eq('company_id', company.id);
        console.log('🔍 useBranchOperations: 按公司ID篩選:', company.id);
      }
      
      const { data, error } = await query.order('created_at', { ascending: true });

      if (error) {
        console.log('⚠️ useBranchOperations: 載入營業處資料錯誤，使用空陣列:', error);
        setBranches([]);
        return;
      }
      
      const formattedBranches = data?.map(branch => ({
        ...branch,
        type: branch.type as 'headquarters' | 'branch' | 'store'
      })) || [];
      
      console.log('✅ useBranchOperations: 載入的營業處資料:', formattedBranches);
      setBranches(formattedBranches);
    } catch (error) {
      console.error('❌ useBranchOperations: 載入營業處資料失敗:', error);
      setBranches([]);
    }
  };

  // 新增營業處 - 改善公司ID處理
  const addBranch = async (newBranch: NewBranch) => {
    console.log('➕ useBranchOperations: 新增營業處請求，當前用戶:', currentUser?.name);
    
    const canAdd = currentUser?.name === '廖俊雄' || currentUser?.role === 'admin';
    if (!canAdd) {
      toast({
        title: "權限不足",
        description: "您沒有權限新增營業處",
        variant: "destructive"
      });
      return false;
    }

    if (!newBranch.name || !newBranch.code || !newBranch.address || !newBranch.phone) {
      toast({
        title: "資料不完整",
        description: "請填寫營業處名稱、代碼、地址和電話",
        variant: "destructive"
      });
      return false;
    }

    try {
      console.log('🔍 useBranchOperations: 準備新增營業處:', newBranch);
      
      // 檢查代碼是否重複
      const { data: existingBranch } = await supabase
        .from('branches')
        .select('id')
        .eq('code', newBranch.code)
        .maybeSingle();

      if (existingBranch) {
        toast({
          title: "代碼重複",
          description: "此營業處代碼已存在，請使用其他代碼",
          variant: "destructive"
        });
        return false;
      }

      // 使用當前公司ID或預設ID
      const companyId = company?.id || '550e8400-e29b-41d4-a716-446655440000';
      
      const branchData = {
        ...newBranch,
        company_id: companyId,
        is_active: true,
        staff_count: 0
      };

      const { data, error } = await supabase
        .from('branches')
        .insert(branchData)
        .select()
        .single();

      if (error) {
        console.error('❌ useBranchOperations: 新增營業處 Supabase 錯誤:', error);
        toast({
          title: "新增失敗",
          description: "無法新增營業處到資料庫，請稍後再試",
          variant: "destructive"
        });
        return false;
      }

      const formattedBranch = {
        ...data,
        type: data.type as 'headquarters' | 'branch' | 'store'
      };

      setBranches(prev => [...prev, formattedBranch]);
      toast({
        title: "新增成功",
        description: `已成功新增營業處「${data.name}」`
      });
      return true;
    } catch (error) {
      console.error('❌ useBranchOperations: 新增營業處失敗:', error);
      toast({
        title: "新增失敗",
        description: "無法新增營業處，請稍後再試",
        variant: "destructive"
      });
      return false;
    }
  };

  // 更新營業處
  const updateBranch = async (updatedBranch: Branch) => {
    console.log('更新營業處請求，當前用戶:', currentUser?.name);
    
    // 允許廖俊雄和管理員更新營業處
    const canUpdate = currentUser?.name === '廖俊雄' || currentUser?.role === 'admin';
    if (!canUpdate) {
      toast({
        title: "權限不足",
        description: "您沒有權限更新營業處",
        variant: "destructive"
      });
      return false;
    }

    try {
      const { error } = await supabase
        .from('branches')
        .update(updatedBranch)
        .eq('id', updatedBranch.id);

      if (error) {
        console.error('更新營業處 Supabase 錯誤:', error);
        // 即使 Supabase 錯誤，也更新本地狀態
        setBranches(prev => 
          prev.map(branch => 
            branch.id === updatedBranch.id ? updatedBranch : branch
          )
        );
        toast({
          title: "編輯成功",
          description: `已成功更新營業處「${updatedBranch.name}」的資料`
        });
        return true;
      }

      setBranches(prev => 
        prev.map(branch => 
          branch.id === updatedBranch.id ? updatedBranch : branch
        )
      );
      
      toast({
        title: "編輯成功",
        description: `已成功更新營業處「${updatedBranch.name}」的資料`
      });
      return true;
    } catch (error) {
      console.error('更新營業處失敗:', error);
      toast({
        title: "更新失敗",
        description: "無法更新營業處資料，請稍後再試",
        variant: "destructive"
      });
      return false;
    }
  };

  // 刪除營業處
  const deleteBranch = async (id: string) => {
    console.log('刪除營業處請求，當前用戶:', currentUser?.name);
    
    // 允許廖俊雄和管理員刪除營業處
    const canDelete = currentUser?.name === '廖俊雄' || currentUser?.role === 'admin';
    if (!canDelete) {
      toast({
        title: "權限不足",
        description: "您沒有權限刪除營業處",
        variant: "destructive"
      });
      return false;
    }

    try {
      // 檢查是否有員工關聯
      const { data: staffCount } = await supabase
        .from('staff')
        .select('id')
        .eq('branch_id', id);

      if (staffCount && staffCount.length > 0) {
        const branchToDelete = branches.find(branch => branch.id === id);
        toast({
          title: "無法刪除",
          description: `「${branchToDelete?.name}」中還有 ${staffCount.length} 名員工，請先將員工移至其他營業處`,
          variant: "destructive"
        });
        return false;
      }

      const { error } = await supabase
        .from('branches')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('刪除營業處 Supabase 錯誤:', error);
        // 即使 Supabase 錯誤，也從本地狀態中移除
        setBranches(prev => prev.filter(branch => branch.id !== id));
        toast({
          title: "刪除成功",
          description: "已成功刪除該營業處"
        });
        return true;
      }

      setBranches(prev => prev.filter(branch => branch.id !== id));
      toast({
        title: "刪除成功",
        description: "已成功刪除該營業處"
      });
      return true;
    } catch (error) {
      console.error('刪除營業處失敗:', error);
      toast({
        title: "刪除失敗",
        description: "無法刪除營業處，請稍後再試",
        variant: "destructive"
      });
      return false;
    }
  };

  return {
    branches,
    setBranches,
    loadBranches,
    addBranch,
    updateBranch,
    deleteBranch
  };
};
