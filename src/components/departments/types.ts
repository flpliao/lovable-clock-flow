import { FilterGroup } from '@/components/common/AdvancedFilter/types';

export interface Department {
  id: string;
  name: string;
  type: 'headquarters' | 'branch' | 'store' | 'department';
  location?: string;
  manager_name?: string;
  manager_contact?: string;
  staff_count: number;
  latitude?: number;
  longitude?: number;
  address_verified?: boolean;
  check_in_radius?: number;
  gps_status?: 'not_converted' | 'converted' | 'failed';
  created_at?: string;
  updated_at?: string;
}

export interface NewDepartment {
  name: string;
  type: 'headquarters' | 'branch' | 'store' | 'department';
  location?: string;
  manager_name?: string;
  manager_contact?: string;
  latitude?: number;
  longitude?: number;
  address_verified?: boolean;
  check_in_radius?: number;
  gps_status?: 'not_converted' | 'converted' | 'failed';
}

export interface DepartmentManagementContextType {
  departments: Department[];
  filteredDepartments: Department[];
  loading: boolean;
  searchFilter: string;
  setSearchFilter: (filter: string) => void;

  // 篩選相關
  conditionGroups: FilterGroup[];
  setConditionGroups: (groups: FilterGroup[]) => void;
  showAdvancedFilters: boolean;
  setShowAdvancedFilters: (show: boolean) => void;
  clearAllConditions: () => void;
  appliedConditionCount: number;

  isAddDialogOpen: boolean;
  setIsAddDialogOpen: (isOpen: boolean) => void;
  isEditDialogOpen: boolean;
  setIsEditDialogOpen: (isOpen: boolean) => void;
  currentDepartment: Department | null;
  setCurrentDepartment: (department: Department | null) => void;
  newDepartment: NewDepartment;
  setNewDepartment: (department: NewDepartment) => void;
  handleAddDepartment: () => Promise<boolean>;
  handleEditDepartment: () => Promise<boolean>;
  handleDeleteDepartment: (id: string) => void;
  openEditDialog: (department: Department) => void;
  refreshDepartments: () => Promise<void>;
  performFullSync: () => Promise<unknown>;
  canManage: boolean;
  currentUser: unknown;
  convertAddressToGPS: (departmentId: string, address: string) => Promise<boolean>;
}
