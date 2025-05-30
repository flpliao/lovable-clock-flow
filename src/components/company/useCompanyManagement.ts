
import { useState, useEffect, useCallback } from 'react';
import { Company, Branch, NewBranch, CompanyManagementContextType } from '@/types/company';
import { useToast } from '@/hooks/use-toast';
import { useBranchOperations } from './hooks/useBranchOperations';
import { useCompanySyncManager } from './hooks/useCompanySyncManager';

export const useCompanyManagement = (): CompanyManagementContextType => {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [filteredBranches, setFilteredBranches] = useState<Branch[]>([]);
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);
  const [isAddBranchDialogOpen, setIsAddBranchDialogOpen] = useState(false);
  const [isEditBranchDialogOpen, setIsEditBranchDialogOpen] = useState(false);
  const [isEditCompanyDialogOpen, setIsEditCompanyDialogOpen] = useState(false);
  const [currentBranch, setCurrentBranch] = useState<Branch | null>(null);
  const [newBranch, setNewBranch] = useState<NewBranch>({
    name: '',
    code: '',
    type: 'branch',
    address: '',
    phone: '',
    email: '',
    manager_name: '',
    manager_contact: '',
    business_license: ''
  });

  const { toast } = useToast();
  const { company, updateCompany } = useCompanySyncManager();
  
  const {
    branches: branchList,
    loadBranches,
    addBranch,
    updateBranch,
    deleteBranch
  } = useBranchOperations(company?.id || '');

  // 同步分支列表
  useEffect(() => {
    setBranches(branchList);
    setFilteredBranches(branchList);
  }, [branchList]);

  useEffect(() => {
    if (company?.id) {
      loadBranches();
    }
  }, [company?.id, loadBranches]);

  const handleAddBranch = useCallback(async () => {
    if (!company?.id) {
      toast({
        title: "錯誤",
        description: "請先設定公司資料",
        variant: "destructive"
      });
      return;
    }

    const success = await addBranch(newBranch);
    if (success) {
      setIsAddBranchDialogOpen(false);
      setNewBranch({
        name: '',
        code: '',
        type: 'branch',
        address: '',
        phone: '',
        email: '',
        manager_name: '',
        manager_contact: '',
        business_license: ''
      });
    }
  }, [company?.id, newBranch, addBranch, toast]);

  const handleEditBranch = useCallback(async () => {
    if (!currentBranch) return;

    const success = await updateBranch(currentBranch.id, currentBranch);
    if (success) {
      setIsEditBranchDialogOpen(false);
      setCurrentBranch(null);
    }
  }, [currentBranch, updateBranch]);

  const handleDeleteBranch = useCallback(async (id: string) => {
    await deleteBranch(id);
  }, [deleteBranch]);

  const handleUpdateCompany = useCallback(async (updatedCompany: Company): Promise<boolean> => {
    console.log('🔄 useCompanyManagement: 處理公司更新:', updatedCompany);
    
    try {
      const success = await updateCompany(updatedCompany);
      
      if (success) {
        console.log('✅ useCompanyManagement: 公司資料更新成功');
        toast({
          title: "更新成功",
          description: "公司資料已成功更新",
        });
        return true;
      } else {
        console.log('❌ useCompanyManagement: 公司資料更新失敗');
        return false;
      }
    } catch (error) {
      console.error('❌ useCompanyManagement: 更新公司時發生錯誤:', error);
      toast({
        title: "更新失敗",
        description: `更新公司資料時發生錯誤: ${error instanceof Error ? error.message : '未知錯誤'}`,
        variant: "destructive"
      });
      return false;
    }
  }, [updateCompany, toast]);

  const openEditBranchDialog = useCallback((branch: Branch) => {
    setCurrentBranch(branch);
    setIsEditBranchDialogOpen(true);
  }, []);

  const getBranchByCode = useCallback((code: string) => {
    return branches.find(branch => branch.code === code);
  }, [branches]);

  const getActiveBranches = useCallback(() => {
    return branches.filter(branch => branch.is_active);
  }, [branches]);

  return {
    company,
    branches,
    filteredBranches,
    selectedBranch,
    isAddBranchDialogOpen,
    setIsAddBranchDialogOpen,
    isEditBranchDialogOpen,
    setIsEditBranchDialogOpen,
    isEditCompanyDialogOpen,
    setIsEditCompanyDialogOpen,
    currentBranch,
    setCurrentBranch,
    newBranch,
    setNewBranch,
    handleAddBranch,
    handleEditBranch,
    handleDeleteBranch,
    handleUpdateCompany,
    openEditBranchDialog,
    getBranchByCode,
    getActiveBranches
  };
};
