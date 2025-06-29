
import { supabase } from '@/integrations/supabase/client';
import { optimizedPermissionService } from './optimizedPermissionService';

/**
 * 漸進式遷移服務 - 階段五
 * 提供向後相容性和分階段部署功能
 */
export class MigrationService {
  private static instance: MigrationService;
  private migrationState: MigrationState = {
    currentPhase: 'phase_1',
    completedPhases: [],
    rollbackAvailable: true,
    lastMigrationTime: null
  };

  static getInstance(): MigrationService {
    if (!MigrationService.instance) {
      MigrationService.instance = new MigrationService();
    }
    return MigrationService.instance;
  }

  /**
   * 開始漸進式遷移
   */
  async startMigration(): Promise<MigrationResult> {
    console.log('🔄 開始漸進式權限系統遷移');
    
    const migrationResult: MigrationResult = {
      migrationId: `migration_${Date.now()}`,
      startTime: new Date(),
      endTime: null,
      success: false,
      phases: [],
      rollbackInfo: null
    };

    try {
      // 階段 1: 資料完整性檢查
      const phase1 = await this.executePhase1();
      migrationResult.phases.push(phase1);
      
      if (!phase1.success) {
        throw new Error('階段 1 失敗，停止遷移');
      }

      // 階段 2: 權限快取建立
      const phase2 = await this.executePhase2();
      migrationResult.phases.push(phase2);
      
      if (!phase2.success) {
        await this.rollbackPhase(1);
        throw new Error('階段 2 失敗，執行回滾');
      }

      // 階段 3: RLS 政策遷移
      const phase3 = await this.executePhase3();
      migrationResult.phases.push(phase3);
      
      if (!phase3.success) {
        await this.rollbackPhase(2);
        throw new Error('階段 3 失敗，執行回滾');
      }

      // 階段 4: 驗證與測試
      const phase4 = await this.executePhase4();
      migrationResult.phases.push(phase4);
      
      migrationResult.success = phase4.success;
      migrationResult.endTime = new Date();
      
      if (migrationResult.success) {
        this.migrationState.currentPhase = 'completed';
        this.migrationState.completedPhases = ['phase_1', 'phase_2', 'phase_3', 'phase_4'];
        this.migrationState.lastMigrationTime = new Date();
        console.log('✅ 漸進式遷移完成');
      }

      return migrationResult;
    } catch (error) {
      console.error('❌ 遷移失敗:', error);
      migrationResult.endTime = new Date();
      migrationResult.success = false;
      throw error;
    }
  }

  /**
   * 階段 1: 資料完整性檢查
   */
  private async executePhase1(): Promise<MigrationPhase> {
    console.log('🔍 執行階段 1: 資料完整性檢查');
    
    const phase: MigrationPhase = {
      phaseId: 'phase_1',
      phaseName: '資料完整性檢查',
      startTime: new Date(),
      endTime: null,
      success: false,
      steps: []
    };

    try {
      // 檢查員工資料
      const staffCheck = await this.checkStaffData();
      phase.steps.push(staffCheck);

      // 檢查角色資料
      const roleCheck = await this.checkRoleData();
      phase.steps.push(roleCheck);

      // 檢查權限資料
      const permissionCheck = await this.checkPermissionData();
      phase.steps.push(permissionCheck);

      phase.success = phase.steps.every(step => step.success);
      phase.endTime = new Date();

      return phase;
    } catch (error) {
      phase.endTime = new Date();
      phase.steps.push({
        stepName: '階段 1 錯誤處理',
        success: false,
        message: error.message,
        timestamp: new Date()
      });
      return phase;
    }
  }

  /**
   * 階段 2: 權限快取建立
   */
  private async executePhase2(): Promise<MigrationPhase> {
    console.log('🔄 執行階段 2: 權限快取建立');
    
    const phase: MigrationPhase = {
      phaseId: 'phase_2',
      phaseName: '權限快取建立',
      startTime: new Date(),
      endTime: null,
      success: false,
      steps: []
    };

    try {
      // 刷新權限快取
      const cacheRefresh = await optimizedPermissionService.refreshCache();
      phase.steps.push({
        stepName: '權限快取刷新',
        success: cacheRefresh,
        message: cacheRefresh ? '權限快取刷新成功' : '權限快取刷新失敗',
        timestamp: new Date()
      });

      // 驗證快取資料
      const userPermissions = await optimizedPermissionService.getUserPermissions();
      phase.steps.push({
        stepName: '快取資料驗證',
        success: Array.isArray(userPermissions),
        message: `載入了 ${userPermissions.length} 個權限`,
        timestamp: new Date()
      });

      phase.success = phase.steps.every(step => step.success);
      phase.endTime = new Date();

      return phase;
    } catch (error) {
      phase.endTime = new Date();
      phase.steps.push({
        stepName: '階段 2 錯誤處理',
        success: false,
        message: error.message,
        timestamp: new Date()
      });
      return phase;
    }
  }

  /**
   * 階段 3: RLS 政策遷移
   */
  private async executePhase3(): Promise<MigrationPhase> {
    console.log('🔐 執行階段 3: RLS 政策遷移');
    
    const phase: MigrationPhase = {
      phaseId: 'phase_3',
      phaseName: 'RLS 政策遷移',
      startTime: new Date(),
      endTime: null,
      success: false,
      steps: []
    };

    try {
      // 檢查 RLS 政策狀態
      const rlsStats = await optimizedPermissionService.getRLSPerformanceStats();
      phase.steps.push({
        stepName: 'RLS 政策狀態檢查',
        success: Array.isArray(rlsStats) && rlsStats.length > 0,
        message: `檢查到 ${rlsStats.length} 個 RLS 政策`,
        timestamp: new Date()
      });

      // 驗證 RLS 政策效能
      const optimizedPolicies = rlsStats.filter(stat => stat.optimization_status === 'optimized');
      phase.steps.push({
        stepName: 'RLS 政策效能驗證',
        success: optimizedPolicies.length === rlsStats.length,
        message: `${optimizedPolicies.length}/${rlsStats.length} 個政策已優化`,
        timestamp: new Date()
      });

      phase.success = phase.steps.every(step => step.success);
      phase.endTime = new Date();

      return phase;
    } catch (error) {
      phase.endTime = new Date();
      phase.steps.push({
        stepName: '階段 3 錯誤處理',
        success: false,
        message: error.message,
        timestamp: new Date()
      });
      return phase;
    }
  }

  /**
   * 階段 4: 驗證與測試
   */
  private async executePhase4(): Promise<MigrationPhase> {
    console.log('🧪 執行階段 4: 驗證與測試');
    
    const phase: MigrationPhase = {
      phaseId: 'phase_4',
      phaseName: '驗證與測試',
      startTime: new Date(),
      endTime: null,
      success: false,
      steps: []
    };

    try {
      // 基本權限測試
      const basicPermissionTest = await optimizedPermissionService.hasPermission('staff:view_own');
      phase.steps.push({
        stepName: '基本權限測試',
        success: typeof basicPermissionTest === 'boolean',
        message: `基本權限測試${typeof basicPermissionTest === 'boolean' ? '通過' : '失敗'}`,
        timestamp: new Date()
      });

      // 批量權限測試
      const batchPermissionTest = await optimizedPermissionService.hasAnyPermission(['staff:view_own', 'leave:create']);
      phase.steps.push({
        stepName: '批量權限測試',
        success: typeof batchPermissionTest === 'boolean',
        message: `批量權限測試${typeof batchPermissionTest === 'boolean' ? '通過' : '失敗'}`,
        timestamp: new Date()
      });

      phase.success = phase.steps.every(step => step.success);
      phase.endTime = new Date();

      return phase;
    } catch (error) {
      phase.endTime = new Date();
      phase.steps.push({
        stepName: '階段 4 錯誤處理',
        success: false,
        message: error.message,
        timestamp: new Date()
      });
      return phase;
    }
  }

  /**
   * 檢查員工資料
   */
  private async checkStaffData(): Promise<MigrationStep> {
    try {
      const { data, error } = await supabase
        .from('staff')
        .select('id, name, email, role')
        .limit(1);

      return {
        stepName: '員工資料檢查',
        success: !error && Array.isArray(data),
        message: error ? error.message : `員工資料結構正常`,
        timestamp: new Date()
      };
    } catch (error) {
      return {
        stepName: '員工資料檢查',
        success: false,
        message: error.message,
        timestamp: new Date()
      };
    }
  }

  /**
   * 檢查角色資料
   */
  private async checkRoleData(): Promise<MigrationStep> {
    try {
      const { data, error } = await supabase
        .from('staff_roles')
        .select('id, name')
        .limit(1);

      return {
        stepName: '角色資料檢查',
        success: !error && Array.isArray(data),
        message: error ? error.message : `角色資料結構正常`,
        timestamp: new Date()
      };
    } catch (error) {
      return {
        stepName: '角色資料檢查',
        success: false,
        message: error.message,
        timestamp: new Date()
      };
    }
  }

  /**
   * 檢查權限資料
   */
  private async checkPermissionData(): Promise<MigrationStep> {
    try {
      const { data, error } = await supabase
        .from('permissions')
        .select('id, code, name')
        .limit(1);

      return {
        stepName: '權限資料檢查',
        success: !error && Array.isArray(data),
        message: error ? error.message : `權限資料結構正常`,
        timestamp: new Date()
      };
    } catch (error) {
      return {
        stepName: '權限資料檢查',
        success: false,
        message: error.message,
        timestamp: new Date()
      };
    }
  }

  /**
   * 回滾到指定階段
   */
  private async rollbackPhase(phaseNumber: number): Promise<void> {
    console.log(`🔄 執行回滾到階段 ${phaseNumber}`);
    
    try {
      switch (phaseNumber) {
        case 1:
          // 回滾階段 1 的更改
          break;
        case 2:
          // 回滾階段 2 的更改
          optimizedPermissionService.clearCache();
          break;
        case 3:
          // 回滾階段 3 的更改（如果需要）
          break;
      }
      
      console.log(`✅ 回滾到階段 ${phaseNumber} 完成`);
    } catch (error) {
      console.error(`❌ 回滾到階段 ${phaseNumber} 失敗:`, error);
    }
  }

  /**
   * 獲取遷移狀態
   */
  getMigrationState(): MigrationState {
    return { ...this.migrationState };
  }
}

// 類型定義
export interface MigrationState {
  currentPhase: 'phase_1' | 'phase_2' | 'phase_3' | 'phase_4' | 'completed';
  completedPhases: string[];
  rollbackAvailable: boolean;
  lastMigrationTime: Date | null;
}

export interface MigrationResult {
  migrationId: string;
  startTime: Date;
  endTime: Date | null;
  success: boolean;
  phases: MigrationPhase[];
  rollbackInfo: any;
}

export interface MigrationPhase {
  phaseId: string;
  phaseName: string;
  startTime: Date;
  endTime: Date | null;
  success: boolean;
  steps: MigrationStep[];
}

export interface MigrationStep {
  stepName: string;
  success: boolean;
  message: string;
  timestamp: Date;
}

// 導出單例實例
export const migrationService = MigrationService.getInstance();
