import { supabase } from '@/integrations/supabase/client';

/**
 * 部門篩選API服務 - 展示如何為其他欄位建立下拉選單
 */
export class DepartmentFilterApiService {
  /**
   * 取得所有部門選項（用於下拉選單）
   */
  async getDepartmentOptions(): Promise<Array<{ value: string; label: string }>> {
    try {
      const { data, error } = await supabase.from('departments').select('name').order('name');

      if (error) {
        console.error('載入部門選項失敗:', error);
        return [];
      }

      // 將部門名稱轉換為下拉選單選項
      const uniqueDepartments = [...new Set(data.map(dept => dept.name))];
      return uniqueDepartments.map(name => ({
        value: name,
        label: name,
      }));
    } catch (error) {
      console.error('取得部門選項時發生錯誤:', error);
      return [];
    }
  }

  /**
   * 取得員工的所有部門選項（從員工表中取得）
   */
  async getStaffDepartmentOptions(): Promise<Array<{ value: string; label: string }>> {
    try {
      const { data, error } = await supabase
        .from('staff')
        .select('department')
        .not('department', 'is', null)
        .order('department');

      if (error) {
        console.error('載入員工部門選項失敗:', error);
        return [];
      }

      // 去除重複的部門名稱
      const uniqueDepartments = [...new Set(data.map(staff => staff.department))];
      return uniqueDepartments.map(name => ({
        value: name,
        label: name,
      }));
    } catch (error) {
      console.error('取得員工部門選項時發生錯誤:', error);
      return [];
    }
  }

  /**
   * 取得職位選項（用於下拉選單）
   */
  async getPositionOptions(): Promise<Array<{ value: string; label: string }>> {
    try {
      const { data, error } = await supabase
        .from('staff')
        .select('position')
        .not('position', 'is', null)
        .order('position');

      if (error) {
        console.error('載入職位選項失敗:', error);
        return [];
      }

      // 去除重複的職位名稱
      const uniquePositions = [...new Set(data.map(staff => staff.position))];
      return uniquePositions.map(name => ({
        value: name,
        label: name,
      }));
    } catch (error) {
      console.error('取得職位選項時發生錯誤:', error);
      return [];
    }
  }

  /**
   * 取得營業處選項（用於下拉選單）
   */
  async getBranchOptions(): Promise<Array<{ value: string; label: string }>> {
    try {
      const { data, error } = await supabase.from('branches').select('id, name').order('name');

      if (error) {
        console.error('載入營業處選項失敗:', error);
        return [];
      }

      return data.map(branch => ({
        value: branch.id,
        label: branch.name,
      }));
    } catch (error) {
      console.error('取得營業處選項時發生錯誤:', error);
      return [];
    }
  }
}

// 匯出單例實例
export const departmentFilterApiService = new DepartmentFilterApiService();

// 使用範例：
/*
// 在 StaffManagement.tsx 中使用
const [departmentOptions, setDepartmentOptions] = useState<Array<{ value: string; label: string }>>([]);

// 載入部門選項
useEffect(() => {
  departmentFilterApiService.getStaffDepartmentOptions().then(setDepartmentOptions);
}, []);

// 在 SEARCH_FIELDS 中使用
const SEARCH_FIELDS: SearchField[] = [
  { 
    value: 'name', 
    label: '姓名',
    type: 'input',
    placeholder: '請輸入姓名'
  },
  { 
    value: 'role_id', 
    label: '角色',
    type: 'select',
    options: staffFilterApiService.getRoleOptions(),
    placeholder: '請選擇角色'
  },
  { 
    value: 'department', 
    label: '部門',
    type: 'select',
    options: departmentOptions,
    placeholder: '請選擇部門'
  },
  { 
    value: 'position', 
    label: '職位',
    type: 'select',
    options: positionOptions,
    placeholder: '請選擇職位'
  },
];
*/
