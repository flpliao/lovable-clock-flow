
import { Staff } from '@/components/staff/types';
import { Department } from '@/components/departments/types';
import { Company, Branch } from '@/types/company';
import { supabase } from '@/integrations/supabase/client';

export class DataSyncManager {
  // 檢查後台連線狀態
  static async checkBackendConnection(): Promise<boolean> {
    try {
      console.log('🔍 檢查後台連線狀態...');
      const { error } = await supabase.from('staff').select('count').limit(1);
      
      if (error) {
        console.error('❌ 後台連線失敗:', error);
        return false;
      }
      
      console.log('✅ 後台連線正常');
      return true;
    } catch (error) {
      console.error('💥 後台連線檢查系統錯誤:', error);
      return false;
    }
  }

  // 同步所有員工資料
  static async syncStaffData(): Promise<Staff[]> {
    try {
      console.log('🔄 開始同步員工資料...');
      
      const { data, error } = await supabase
        .from('staff')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('❌ 員工資料同步失敗:', error);
        return [];
      }

      const staffData = (data || []).map(item => ({
        id: item.id,
        name: item.name,
        position: item.position,
        department: item.department,
        branch_id: item.branch_id || '',
        branch_name: item.branch_name || '',
        contact: item.contact || '',
        role: item.role as 'admin' | 'user' | string,
        role_id: item.role_id || 'user',
        supervisor_id: item.supervisor_id,
        username: item.username,
        email: item.email,
        permissions: []
      }));

      console.log('✅ 員工資料同步完成，共', staffData.length, '筆資料');
      return staffData;
    } catch (error) {
      console.error('💥 員工資料同步系統錯誤:', error);
      return [];
    }
  }

  // 同步所有部門資料
  static async syncDepartmentData(): Promise<Department[]> {
    try {
      console.log('🔄 開始同步部門資料...');
      
      const { data, error } = await supabase
        .from('departments')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('❌ 部門資料同步失敗:', error);
        return [];
      }

      const departmentData = (data || []).map(item => ({
        id: item.id,
        name: item.name,
        type: item.type as 'headquarters' | 'branch' | 'store' | 'department',
        location: item.location || '',
        manager_name: item.manager_name || '',
        manager_contact: item.manager_contact || '',
        staff_count: item.staff_count || 0,
        created_at: item.created_at,
        updated_at: item.updated_at
      }));

      console.log('✅ 部門資料同步完成，共', departmentData.length, '個部門');
      return departmentData;
    } catch (error) {
      console.error('💥 部門資料同步系統錯誤:', error);
      return [];
    }
  }

  // 同步公司和營業處資料
  static async syncCompanyData(): Promise<{ company: Company | null; branches: Branch[] }> {
    try {
      console.log('🔄 開始同步公司和營業處資料...');
      
      // 載入公司資料
      const { data: companyData, error: companyError } = await supabase
        .from('companies')
        .select('*')
        .limit(1)
        .single();

      if (companyError && companyError.code !== 'PGRST116') {
        console.error('❌ 公司資料同步失敗:', companyError);
      }

      // 載入營業處資料
      const { data: branchData, error: branchError } = await supabase
        .from('branches')
        .select('*')
        .order('created_at', { ascending: false });

      if (branchError) {
        console.error('❌ 營業處資料同步失敗:', branchError);
      }

      const branches = (branchData || []).map(item => ({
        id: item.id,
        company_id: item.company_id,
        name: item.name,
        code: item.code,
        type: item.type as 'headquarters' | 'branch' | 'store',
        address: item.address,
        phone: item.phone,
        email: item.email,
        manager_name: item.manager_name,
        manager_contact: item.manager_contact,
        business_license: item.business_license,
        is_active: item.is_active,
        staff_count: item.staff_count,
        created_at: item.created_at,
        updated_at: item.updated_at
      }));

      console.log('✅ 公司和營業處資料同步完成');
      console.log('📊 公司資料:', companyData ? '已載入' : '未設定');
      console.log('📊 營業處數量:', branches.length);

      return {
        company: companyData as Company | null,
        branches
      };
    } catch (error) {
      console.error('💥 公司和營業處資料同步系統錯誤:', error);
      return { company: null, branches: [] };
    }
  }

  // 執行完整的系統資料同步
  static async performFullSync(): Promise<{
    connectionStatus: boolean;
    staffData: Staff[];
    departmentData: Department[];
    companyData: { company: Company | null; branches: Branch[] };
  }> {
    console.log('🚀 開始執行完整系統資料同步...');
    
    // 檢查連線狀態
    const connectionStatus = await this.checkBackendConnection();
    
    if (!connectionStatus) {
      console.error('❌ 後台連線失敗，無法進行資料同步');
      return {
        connectionStatus: false,
        staffData: [],
        departmentData: [],
        companyData: { company: null, branches: [] }
      };
    }

    // 並行同步所有資料
    const [staffData, departmentData, companyData] = await Promise.all([
      this.syncStaffData(),
      this.syncDepartmentData(),
      this.syncCompanyData()
    ]);

    console.log('🎉 完整系統資料同步完成！');
    console.log('📊 同步結果統計:');
    console.log(`   - 員工資料: ${staffData.length} 筆`);
    console.log(`   - 部門資料: ${departmentData.length} 個`);
    console.log(`   - 公司資料: ${companyData.company ? '已同步' : '未設定'}`);
    console.log(`   - 營業處資料: ${companyData.branches.length} 個`);

    return {
      connectionStatus: true,
      staffData,
      departmentData,
      companyData
    };
  }
}
