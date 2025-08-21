
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { useFinalPermissions } from '@/hooks/useFinalPermissions';
import { permissionTestService, PermissionTestSuite, TestResult } from '@/services/permissionTestService';
import { migrationService, MigrationResult } from '@/services/migrationService';
import { Play, TestTube, RefreshCw, CheckCircle, XCircle, Clock, Database } from 'lucide-react';

const PermissionTestPanel: React.FC = () => {
  const { toast } = useToast();
  const { isAdmin } = useFinalPermissions();
  const [testSuite, setTestSuite] = useState<PermissionTestSuite | null>(null);
  const [migrationResult, setMigrationResult] = useState<MigrationResult | null>(null);
  const [testing, setTesting] = useState(false);
  const [migrating, setMigrating] = useState(false);

  // 執行權限測試
  const handleRunTests = async () => {
    if (!isAdmin()) {
      toast({
        title: "權限不足",
        description: "需要管理員權限才能執行測試",
        variant: "destructive"
      });
      return;
    }

    try {
      setTesting(true);
      const result = await permissionTestService.runFullPermissionTest();
      setTestSuite(result);
      
      toast({
        title: "測試完成",
        description: `共執行 ${result.totalTests} 個測試，${result.passedTests} 個通過`,
        variant: result.failedTests === 0 ? "default" : "destructive"
      });
    } catch (error) {
      console.error('❌ 測試執行失敗:', error);
      toast({
        title: "測試失敗",
        description: "無法執行權限測試",
        variant: "destructive"
      });
    } finally {
      setTesting(false);
    }
  };

  // 執行漸進式遷移
  const handleRunMigration = async () => {
    if (!isAdmin()) {
      toast({
        title: "權限不足",
        description: "需要管理員權限才能執行遷移",
        variant: "destructive"
      });
      return;
    }

    try {
      setMigrating(true);
      const result = await migrationService.startMigration();
      setMigrationResult(result);
      
      toast({
        title: result.success ? "遷移成功" : "遷移失敗",
        description: `漸進式遷移${result.success ? '成功完成' : '執行失敗'}`,
        variant: result.success ? "default" : "destructive"
      });
    } catch (error) {
      console.error('❌ 遷移執行失敗:', error);
      toast({
        title: "遷移失敗",
        description: "無法執行漸進式遷移",
        variant: "destructive"
      });
    } finally {
      setMigrating(false);
    }
  };

  // 獲取測試結果顏色
  const getTestResultColor = (result: TestResult) => {
    return result.passed ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
  };

  // 獲取測試類型標誌
  const getTestIcon = (testType: string) => {
    switch (testType) {
      case 'role_permission':
        return <TestTube className="h-4 w-4" />;
      case 'data_consistency':
        return <Database className="h-4 w-4" />;
      case 'performance':
        return <Clock className="h-4 w-4" />;
      case 'rls_policy':
        return <RefreshCw className="h-4 w-4" />;
      default:
        return <CheckCircle className="h-4 w-4" />;
    }
  };

  if (!isAdmin()) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TestTube className="h-5 w-5" />
            權限測試面板
          </CardTitle>
          <CardDescription>權限不足，無法存取測試功能</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* 測試控制面板 */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <TestTube className="h-5 w-5" />
                權限測試與遷移面板
              </CardTitle>
              <CardDescription>
                執行完整的權限測試和漸進式系統遷移
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={handleRunTests}
                disabled={testing}
                variant="outline"
              >
                <Play className={`h-4 w-4 mr-2 ${testing ? 'animate-spin' : ''}`} />
                {testing ? '測試中...' : '執行測試'}
              </Button>
              <Button
                onClick={handleRunMigration}
                disabled={migrating}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${migrating ? 'animate-spin' : ''}`} />
                {migrating ? '遷移中...' : '執行遷移'}
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* 測試結果 */}
      {testSuite && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5" />
              測試結果
            </CardTitle>
            <CardDescription>
              測試執行時間：{testSuite.endTime ? 
                `${testSuite.endTime.getTime() - testSuite.startTime.getTime()}ms` : 
                '執行中...'
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* 測試摘要 */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{testSuite.totalTests}</div>
                  <div className="text-sm text-gray-500">總測試數</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{testSuite.passedTests}</div>
                  <div className="text-sm text-gray-500">通過</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">{testSuite.failedTests}</div>
                  <div className="text-sm text-gray-500">失敗</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {testSuite.totalTests > 0 ? 
                      `${((testSuite.passedTests / testSuite.totalTests) * 100).toFixed(1)}%` : 
                      '0%'
                    }
                  </div>
                  <div className="text-sm text-gray-500">成功率</div>
                </div>
              </div>

              {/* 進度條 */}
              <Progress 
                value={testSuite.totalTests > 0 ? (testSuite.passedTests / testSuite.totalTests) * 100 : 0}
                className="w-full"
              />

              {/* 詳細測試結果 */}
              <div className="space-y-2">
                <h4 className="font-medium">詳細測試結果</h4>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {testSuite.testResults.map((result, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        {getTestIcon(result.testType)}
                        <div>
                          <div className="font-medium">{result.testName}</div>
                          <div className="text-sm text-gray-500">
                            執行時間: {result.executionTime}ms
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getTestResultColor(result)}>
                          {result.passed ? '通過' : '失敗'}
                        </Badge>
                        {result.passed ? 
                          <CheckCircle className="h-4 w-4 text-green-500" /> : 
                          <XCircle className="h-4 w-4 text-red-500" />
                        }
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 效能指標 */}
              <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">效能指標</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-blue-600">平均響應時間:</span>
                    <span className="ml-2 font-medium">{testSuite.performanceMetrics.avgResponseTime.toFixed(2)}ms</span>
                  </div>
                  <div>
                    <span className="text-blue-600">最大響應時間:</span>
                    <span className="ml-2 font-medium">{testSuite.performanceMetrics.maxResponseTime}ms</span>
                  </div>
                  <div>
                    <span className="text-blue-600">最小響應時間:</span>
                    <span className="ml-2 font-medium">{testSuite.performanceMetrics.minResponseTime}ms</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* 遷移結果 */}
      {migrationResult && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <RefreshCw className="h-5 w-5" />
              遷移結果
            </CardTitle>
            <CardDescription>
              遷移執行時間：{migrationResult.endTime ? 
                `${migrationResult.endTime.getTime() - migrationResult.startTime.getTime()}ms` : 
                '執行中...'
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* 遷移狀態 */}
              <div className="flex items-center gap-2">
                <Badge className={migrationResult.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                  {migrationResult.success ? '遷移成功' : '遷移失敗'}
                </Badge>
                {migrationResult.success ? 
                  <CheckCircle className="h-4 w-4 text-green-500" /> : 
                  <XCircle className="h-4 w-4 text-red-500" />
                }
              </div>

              {/* 遷移階段 */}
              <div className="space-y-3">
                <h4 className="font-medium">遷移階段</h4>
                {migrationResult.phases.map((phase, index) => (
                  <div key={index} className="border rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-medium">{phase.phaseName}</div>
                      <Badge className={phase.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                        {phase.success ? '成功' : '失敗'}
                      </Badge>
                    </div>
                    <div className="space-y-1">
                      {phase.steps.map((step, stepIndex) => (
                        <div key={stepIndex} className="flex items-center justify-between text-sm">
                          <span>{step.stepName}</span>
                          <div className="flex items-center gap-1">
                            <span className="text-gray-500">{step.message}</span>
                            {step.success ? 
                              <CheckCircle className="h-3 w-3 text-green-500" /> : 
                              <XCircle className="h-3 w-3 text-red-500" />
                            }
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PermissionTestPanel;
