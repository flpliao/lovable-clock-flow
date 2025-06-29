
import { supabase } from '@/integrations/supabase/client';
import { optimizedPermissionService } from './optimizedPermissionService';

/**
 * 權限測試服務 - 階段五
 * 提供完整的權限測試和驗證功能
 */
export class PermissionTestService {
  private static instance: PermissionTestService;
  private testResults: Map<string, TestResult> = new Map();

  static getInstance(): PermissionTestService {
    if (!PermissionTestService.instance) {
      PermissionTestService.instance = new PermissionTestService();
    }
    return PermissionTestService.instance;
  }

  /**
   * 執行完整的權限測試套件
   */
  async runFullPermissionTest(): Promise<PermissionTestSuite> {
    console.log('🧪 開始執行完整權限測試套件');
    
    const testSuite: PermissionTestSuite = {
      testId: `test_${Date.now()}`,
      startTime: new Date(),
      endTime: null,
      totalTests: 0,
      passedTests: 0,
      failedTests: 0,
      testResults: [],
      performanceMetrics: {
        avgResponseTime: 0,
        maxResponseTime: 0,
        minResponseTime: Infinity,
        cacheHitRate: 0
      }
    };

    try {
      // 1. 角色權限測試
      const roleTests = await this.testRolePermissions();
      testSuite.testResults.push(...roleTests);

      // 2. 資料一致性測試
      const consistencyTests = await this.testDataConsistency();
      testSuite.testResults.push(...consistencyTests);

      // 3. 效能測試
      const performanceTests = await this.testPerformance();
      testSuite.testResults.push(...performanceTests);

      // 4. RLS 政策測試
      const rlsTests = await this.testRLSPolicies();
      testSuite.testResults.push(...rlsTests);

      // 計算統計資料
      testSuite.totalTests = testSuite.testResults.length;
      testSuite.passedTests = testSuite.testResults.filter(t => t.passed).length;
      testSuite.failedTests = testSuite.totalTests - testSuite.passedTests;
      testSuite.endTime = new Date();

      // 計算效能指標
      const responseTimes = testSuite.testResults.map(t => t.executionTime);
      testSuite.performanceMetrics.avgResponseTime = responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length;
      testSuite.performanceMetrics.maxResponseTime = Math.max(...responseTimes);
      testSuite.performanceMetrics.minResponseTime = Math.min(...responseTimes);

      console.log('✅ 權限測試套件執行完成:', {
        總測試數: testSuite.totalTests,
        通過數: testSuite.passedTests,
        失敗數: testSuite.failedTests,
        成功率: `${((testSuite.passedTests / testSuite.totalTests) * 100).toFixed(2)}%`
      });

      return testSuite;
    } catch (error) {
      console.error('❌ 權限測試套件執行失敗:', error);
      testSuite.endTime = new Date();
      throw error;
    }
  }

  /**
   * 測試角色權限
   */
  private async testRolePermissions(): Promise<TestResult[]> {
    const results: TestResult[] = [];
    
    // 定義測試案例
    const testCases = [
      {
        name: '管理員權限測試',
        role: 'admin',
        permissions: ['staff:view_all', 'staff:create', 'staff:edit', 'staff:delete', 'system:admin'],
        expectedResults: [true, true, true, true, true]
      },
      {
        name: '主管權限測試',
        role: 'manager',
        permissions: ['staff:view_all', 'leave:approve', 'overtime:approve'],
        expectedResults: [true, true, true]
      },
      {
        name: '一般用戶權限測試',
        role: 'user',
        permissions: ['staff:view_own', 'leave:create', 'system:admin'],
        expectedResults: [true, true, false]
      }
    ];

    for (const testCase of testCases) {
      const startTime = Date.now();
      
      try {
        const actualResults = await Promise.all(
          testCase.permissions.map(permission => 
            optimizedPermissionService.hasPermission(permission)
          )
        );

        const passed = JSON.stringify(actualResults) === JSON.stringify(testCase.expectedResults);
        
        results.push({
          testName: testCase.name,
          testType: 'role_permission',
          passed,
          executionTime: Date.now() - startTime,
          details: passed ? null : {
            expected: testCase.expectedResults,
            actual: actualResults,
            permissions: testCase.permissions
          },
          timestamp: new Date()
        });

      } catch (error) {
        results.push({
          testName: testCase.name,
          testType: 'role_permission',
          passed: false,
          executionTime: Date.now() - startTime,
          details: { error: error.message },
          timestamp: new Date()
        });
      }
    }

    return results;
  }

  /**
   * 測試資料一致性
   */
  private async testDataConsistency(): Promise<TestResult[]> {
    const results: TestResult[] = [];
    
    try {
      const startTime = Date.now();
      
      // 檢查權限快取與實際資料庫的一致性
      const { data: cacheData, error: cacheError } = await supabase
        .from('user_permissions_cache')
        .select('*');

      const { data: staffData, error: staffError } = await supabase
        .from('staff')
        .select('*');

      if (cacheError || staffError) {
        throw new Error(`資料查詢錯誤: ${cacheError?.message || staffError?.message}`);
      }

      const cacheCount = cacheData?.length || 0;
      const staffCount = staffData?.length || 0;
      const consistencyCheck = Math.abs(cacheCount - staffCount) <= 1; // 允許1個差異

      results.push({
        testName: '權限快取一致性檢查',
        testType: 'data_consistency',
        passed: consistencyCheck,
        executionTime: Date.now() - startTime,
        details: consistencyCheck ? null : {
          cacheRecords: cacheCount,
          staffRecords: staffCount,
          difference: Math.abs(cacheCount - staffCount)
        },
        timestamp: new Date()
      });

    } catch (error) {
      results.push({
        testName: '權限快取一致性檢查',
        testType: 'data_consistency',
        passed: false,
        executionTime: 0,
        details: { error: error.message },
        timestamp: new Date()
      });
    }

    return results;
  }

  /**
   * 效能測試
   */
  private async testPerformance(): Promise<TestResult[]> {
    const results: TestResult[] = [];
    const testPermissions = ['staff:view_all', 'leave:create', 'system:admin'];
    
    // 測試快取效能
    for (let i = 0; i < 3; i++) {
      const startTime = Date.now();
      
      try {
        await Promise.all(
          testPermissions.map(permission => 
            optimizedPermissionService.hasPermission(permission)
          )
        );
        
        const executionTime = Date.now() - startTime;
        const performanceThreshold = i === 0 ? 1000 : 100; // 第一次調用允許較長時間
        
        results.push({
          testName: `效能測試 - 第${i + 1}次調用${i > 0 ? '(快取)' : ''}`,
          testType: 'performance',
          passed: executionTime < performanceThreshold,
          executionTime,
          details: executionTime >= performanceThreshold ? {
            executionTime,
            threshold: performanceThreshold,
            message: '執行時間超過預期'
          } : null,
          timestamp: new Date()
        });

      } catch (error) {
        results.push({
          testName: `效能測試 - 第${i + 1}次調用`,
          testType: 'performance',
          passed: false,
          executionTime: Date.now() - startTime,
          details: { error: error.message },
          timestamp: new Date()
        });
      }
    }

    return results;
  }

  /**
   * 測試 RLS 政策
   */
  private async testRLSPolicies(): Promise<TestResult[]> {
    const results: TestResult[] = [];
    
    try {
      const startTime = Date.now();
      
      // 測試 RLS 效能統計
      const stats = await optimizedPermissionService.getRLSPerformanceStats();
      
      results.push({
        testName: 'RLS 效能統計查詢',
        testType: 'rls_policy',
        passed: Array.isArray(stats) && stats.length > 0,
        executionTime: Date.now() - startTime,
        details: Array.isArray(stats) && stats.length > 0 ? null : {
          message: 'RLS 效能統計查詢失敗或無資料',
          statsLength: stats?.length || 0
        },
        timestamp: new Date()
      });

    } catch (error) {
      results.push({
        testName: 'RLS 效能統計查詢',
        testType: 'rls_policy',
        passed: false,
        executionTime: 0,
        details: { error: error.message },
        timestamp: new Date()
      });
    }

    return results;
  }

  /**
   * 獲取測試結果
   */
  getTestResults(): Map<string, TestResult> {
    return new Map(this.testResults);
  }

  /**
   * 清除測試結果
   */
  clearTestResults(): void {
    this.testResults.clear();
  }
}

// 類型定義
export interface TestResult {
  testName: string;
  testType: 'role_permission' | 'data_consistency' | 'performance' | 'rls_policy';
  passed: boolean;
  executionTime: number;
  details?: any;
  timestamp: Date;
}

export interface PermissionTestSuite {
  testId: string;
  startTime: Date;
  endTime: Date | null;
  totalTests: number;
  passedTests: number;
  failedTests: number;
  testResults: TestResult[];
  performanceMetrics: {
    avgResponseTime: number;
    maxResponseTime: number;
    minResponseTime: number;
    cacheHitRate: number;
  };
}

// 導出單例實例
export const permissionTestService = PermissionTestService.getInstance();
