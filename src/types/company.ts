
export interface Company {
  id: string;
  name: string;
  registration_number: string; // 統一編號
  address: string;
  phone: string;
  email: string;
  website?: string;
  established_date: string;
  capital?: number; // 資本額
  business_type: string; // 營業項目
  legal_representative: string; // 法定代表人
  created_at: string;
  updated_at: string;
}

export interface Branch {
  id: string;
  company_id: string;
  name: string;
  code: string; // 營業處代碼
  type: 'headquarters' | 'branch' | 'store'; // 總公司 | 分公司 | 門市
  address: string;
  phone: string;
  email?: string;
  manager_name?: string;
  manager_contact?: string;
  business_license?: string; // 營業執照號碼
  is_active: boolean;
  staff_count: number;
  created_at: string;
  updated_at: string;
}

export interface NewBranch {
  name: string;
  code: string;
  type: 'headquarters' | 'branch' | 'store';
  address: string;
  phone: string;
  email?: string;
  manager_name?: string;
  manager_contact?: string;
  business_license?: string;
}

export interface CompanyManagementContextType {
  company: Company | null;
  branches: Branch[];
  filteredBranches: Branch[];
  selectedBranch: Branch | null;
  isAddBranchDialogOpen: boolean;
  setIsAddBranchDialogOpen: (isOpen: boolean) => void;
  isEditBranchDialogOpen: boolean;
  setIsEditBranchDialogOpen: (isOpen: boolean) => void;
  isEditCompanyDialogOpen: boolean;
  setIsEditCompanyDialogOpen: (isOpen: boolean) => void;
  currentBranch: Branch | null;
  setCurrentBranch: (branch: Branch | null) => void;
  newBranch: NewBranch;
  setNewBranch: (branch: NewBranch) => void;
  handleAddBranch: () => void;
  handleEditBranch: () => void;
  handleDeleteBranch: (id: string) => void;
  handleUpdateCompany: (company: Company) => void;
  openEditBranchDialog: (branch: Branch) => void;
  getBranchByCode: (code: string) => Branch | undefined;
  getActiveBranches: () => Branch[];
}
