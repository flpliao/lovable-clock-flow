
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useUser } from '@/contexts/UserContext';
import { supabase } from '@/integrations/supabase/client';
import { Branch, NewBranch, Company } from '@/types/company';

export const useBranchOperations = (company: Company | null) => {
  const [branches, setBranches] = useState<Branch[]>([]);
  const { toast } = useToast();
  const { isAdmin } = useUser();

  // 載入營業處資料
  const loadBranches = async () => {
    try {
      const { data, error } = await supabase
        .from('branches')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) throw error;
      
      // 確保 type 欄位符合 TypeScript 類型
      const formattedBranches = data?.map(branch => ({
        ...branch,
        type: branch.type as 'headquarters' | 'branch' | 'store'
      })) || [];
      
      setBranches(formattedBranches);
    } catch (error) {
      console.error('載入營業處資料失敗:', error);
      toast({
        title: "載入失敗",
        description: "無法載入營業處資料",
        variant: "destructive"
      });
    }
  };

  // 新增營業處
  const addBranch = async (newBranch: NewBranch) => {
    if (!isAdmin()) {
      toast({
        title: "權限不足",
        description: "只有管理員可以新增營業處",
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

      const { data, error } = await supabase
        .from('branches')
        .insert({
          ...newBranch,
          company_id: company?.id || '550e8400-e29b-41d4-a716-446655440000'
        })
        .select()
        .single();

      if (error) throw error;

      // 確保新增的 branch 有正確的 type
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
      console.error('新增營業處失敗:', error);
      toast({
        title: "新增失敗",
        description: "無法新增營業處",
        variant: "destructive"
      });
      return false;
    }
  };

  // 更新營業處
  const updateBranch = async (updatedBranch: Branch) => {
    if (!isAdmin()) {
      toast({
        title: "權限不足",
        description: "只有管理員可以編輯營業處",
        variant: "destructive"
      });
      return false;
    }

    try {
      const { error } = await supabase
        .from('branches')
        .update(updatedBranch)
        .eq('id', updatedBranch.id);

      if (error) throw error;

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
        description: "無法更新營業處資料",
        variant: "destructive"
      });
      return false;
    }
  };

  // 刪除營業處
  const deleteBranch = async (id: string) => {
    if (!isAdmin()) {
      toast({
        title: "權限不足",
        description: "只有管理員可以刪除營業處",
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

      if (error) throw error;

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
        description: "無法刪除營業處",
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
