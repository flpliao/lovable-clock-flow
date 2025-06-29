
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { 
  Shield, Settings, Check, X, Users, Building, Workflow, 
  Clock, MessageSquare, RefreshCw, AlertTriangle, Info,
  Lock, Unlock, Database, Eye, Plus, Edit, Trash2
} from 'lucide-react';
import { RLSSettingsService, TableRLSStatus } from '@/components/company/services/rlsSettingsService';
import { useToast } from '@/hooks/use-toast';
import { visionProStyles } from '@/utils/visionProStyles';

interface CategoryData {
  key: string;
  name: string;
  icon: string;
  tables: TableRLSStatus[];
}

const RLSSecurityDashboard: React.FC = () => {
  const { toast } = useToast();
  const [isGlobalRLSEnabled, setIsGlobalRLSEnabled] = useState(false);
  const [tableRLSStatus, setTableRLSStatus] = useState<TableRLSStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

  // 載入所有 RLS 設定
  const loadAllRLSSettings = async () => {
    setLoading(true);
    try {
      const [globalStatus, tableStatuses] = await Promise.all([
        RLSSettingsService.getRLSStatus(),
        RLSSettingsService.getAllTableRLSStatus()
      ]);
      
      setIsGlobalRLSEnabled(globalStatus);
      setTableRLSStatus(tableStatuses);
    } catch (error) {
      console.error('載入 RLS 設定失敗:', error);
      toast({
        title: "載入失敗",
        description: "無法載入 RLS 安全設定",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // 切換全域 RLS 設定
  const toggleGlobalRLS = async () => {
    const newStatus = !isGlobalRLSEnabled;
    setUpdating('global');
    
    try {
      const result = await RLSSettingsService.applyGlobalRLSSettings(newStatus);
      
      if (result.success) {
        setIsGlobalRLSEnabled(newStatus);
        await loadAllRLSSettings(); // 重新載入以更新所有狀態
        toast({
          title: "全域設定更新成功",
          description: `全域 RLS 安全政策已${newStatus ? '開啟' : '關閉'}`,
        });
      } else {
        toast({
          title: "全域設定更新失敗",
          description: "無法更新全域 RLS 安全設定",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('切換全域 RLS 設定失敗:', error);
      toast({
        title: "操作失敗",
        description: "切換全域 RLS 設定時發生錯誤",
        variant: "destructive"
      });
    } finally {
      setUpdating(null);
    }
  };

  // 切換特定表格的 RLS 設定
  const toggleTableRLS = async (tableName: string) => {
    const currentTable = tableRLSStatus.find(t => t.tableName === tableName);
    if (!currentTable) return;

    const newStatus = !currentTable.enabled;
    setUpdating(tableName);
    
    try {
      const success = await RLSSettingsService.toggleTableRLS(tableName, newStatus);
      
      if (success) {
        setTableRLSStatus(prev => 
          prev.map(table => 
            table.tableName === tableName 
              ? { ...table, enabled: newStatus }
              : table
          )
        );
        
        toast({
          title: "表格設定更新成功",
          description: `${currentTable.displayName} RLS 政策已${newStatus ? '開啟' : '關閉'}`,
        });
      } else {
        toast({
          title: "表格設定更新失敗",
          description: `無法更新 ${currentTable.displayName} 的 RLS 設定`,
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error(`切換 ${tableName} RLS 設定失敗:`, error);
      toast({
        title: "操作失敗",
        description: `切換 ${currentTable.displayName} RLS 設定時發生錯誤`,
        variant: "destructive"
      });
    } finally {
      setUpdating(null);
    }
  };

  // 按分類組織表格資料
  const organizeTablesByCategory = (): CategoryData[] => {
    const categories = RLSSettingsService.getCategories();
    const categoryMap: Record<string, TableRLSStatus[]> = {};
    
    // 初始化分類
    categories.forEach(cat => {
      categoryMap[cat.key] = [];
    });
    
    // 按表格名稱分類（簡化版分類邏輯）
    tableRLSStatus.forEach(table => {
      if (table.tableName === 'staff') {
        categoryMap.core.push(table);
      } else if (['departments', 'positions', 'companies', 'branches'].includes(table.tableName)) {
        categoryMap.organization.push(table);
      } else if (['leave_requests', 'approval_records', 'annual_leave_balance', 'overtime_requests', 'overtime_approval_records'].includes(table.tableName)) {
        categoryMap.workflow.push(table);
      } else if (['check_in_records', 'missed_checkin_requests', 'missed_checkin_approval_records'].includes(table.tableName)) {
        categoryMap.attendance.push(table);
      } else if (['announcements', 'notifications', 'announcement_reads'].includes(table.tableName)) {
        categoryMap.communication.push(table);
      } else {
        categoryMap.system.push(table);
      }
    });
    
    return categories.map(cat => ({
      ...cat,
      tables: categoryMap[cat.key] || []
    }));
  };

  // 獲取圖示組件
  const getIconComponent = (iconName: string) => {
    const icons: Record<string, React.ReactNode> = {
      Users: <Users className="h-4 w-4" />,
      Building: <Building className="h-4 w-4" />,
      Workflow: <Workflow className="h-4 w-4" />,
      Clock: <Clock className="h-4 w-4" />,
      MessageSquare: <MessageSquare className="h-4 w-4" />,
      Settings: <Settings className="h-4 w-4" />
    };
    return icons[iconName] || <Database className="h-4 w-4" />;
  };

  // 渲染政策徽章
  const renderPolicyBadges = (table: TableRLSStatus) => {
    const policies = [
      { key: 'hasSelectPolicy', label: 'SELECT', color: 'bg-blue-100 text-blue-800' },
      { key: 'hasInsertPolicy', label: 'INSERT', color: 'bg-green-100 text-green-800' },
      { key: 'hasUpdatePolicy', label: 'UPDATE', color: 'bg-yellow-100 text-yellow-800' },
      { key: 'hasDeletePolicy', label: 'DELETE', color: 'bg-red-100 text-red-800' }
    ];

    return (
      <div className="flex flex-wrap gap-1 mt-2">
        {policies.map(policy => {
          const hasPolicy = table[policy.key as keyof TableRLSStatus] as boolean;
          return hasPolicy ? (
            <Badge key={policy.key} className={`text-xs ${policy.color} border-0`}>
              {policy.label}
            </Badge>
          ) : null;
        })}
        {table.policyCount && table.policyCount > 0 && (
          <Badge className="text-xs bg-gray-100 text-gray-800 border-0">
            {table.policyCount} 政策
          </Badge>
        )}
      </div>
    );
  };

  useEffect(() => {
    loadAllRLSSettings();
  }, []);

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin w-8 h-8 border-2 border-blue-500/30 border-t-blue-500 rounded-full mx-auto mb-4"></div>
        <p className="text-gray-600 font-medium">載入 RLS 安全設定中...</p>
      </div>
    );
  }

  const categorizedTables = organizeTablesByCategory();
  const totalTables = tableRLSStatus.length;
  const enabledTables = tableRLSStatus.filter(t => t.enabled).length;
  const totalPolicies = tableRLSStatus.reduce((sum, t) => sum + (t.policyCount || 0), 0);

  return (
    <div className="space-y-6">
      {/* 總覽儀表板 */}
      <Card className={visionProStyles.liquidGlassCard}>
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={visionProStyles.coloredIconContainer.purple}>
                <Shield className="h-5 w-5" />
              </div>
              <div>
                <CardTitle className="text-lg text-gray-900">RLS 安全政策總覽</CardTitle>
                <p className="text-sm text-gray-600 font-medium">資料庫行級安全性管理</p>
              </div>
            </div>
            <Button
              onClick={loadAllRLSSettings}
              disabled={loading}
              size="sm"
              className="bg-white/60 hover:bg-white/80 text-gray-900 border border-white/40 backdrop-blur-xl shadow-lg"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              重新載入
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* 統計摘要 */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white/30 rounded-xl p-4 backdrop-blur-xl border border-white/40">
              <div className="flex items-center gap-3">
                <div className={visionProStyles.coloredIconContainer.blue}>
                  <Database className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">{totalTables}</div>
                  <div className="text-xs text-gray-600 font-medium">資料表總數</div>
                </div>
              </div>
            </div>
            
            <div className="bg-white/30 rounded-xl p-4 backdrop-blur-xl border border-white/40">
              <div className="flex items-center gap-3">
                <div className={visionProStyles.coloredIconContainer.green}>
                  <Lock className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-600">{enabledTables}</div>
                  <div className="text-xs text-gray-600 font-medium">已啟用 RLS</div>
                </div>
              </div>
            </div>
            
            <div className="bg-white/30 rounded-xl p-4 backdrop-blur-xl border border-white/40">
              <div className="flex items-center gap-3">
                <div className={visionProStyles.coloredIconContainer.purple}>
                  <Shield className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-purple-600">{totalPolicies}</div>
                  <div className="text-xs text-gray-600 font-medium">安全政策數</div>
                </div>
              </div>
            </div>
            
            <div className="bg-white/30 rounded-xl p-4 backdrop-blur-xl border border-white/40">
              <div className="flex items-center gap-3">
                <div className={visionProStyles.coloredIconContainer.teal}>
                  <Eye className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-teal-600">
                    {totalTables > 0 ? Math.round((enabledTables / totalTables) * 100) : 0}%
                  </div>
                  <div className="text-xs text-gray-600 font-medium">覆蓋率</div>
                </div>
              </div>
            </div>
          </div>

          {/* 全域設定 */}
          <div className="flex items-center justify-between py-4 px-4 bg-white/20 rounded-xl border border-white/30">
            <div className="flex items-center gap-3">
              <div className={isGlobalRLSEnabled ? visionProStyles.coloredIconContainer.green : visionProStyles.coloredIconContainer.red}>
                {isGlobalRLSEnabled ? <Lock className="h-4 w-4" /> : <Unlock className="h-4 w-4" />}
              </div>
              <div>
                <span className="font-semibold text-gray-900">全域 RLS 安全政策</span>
                <div className="flex items-center mt-1">
                  {isGlobalRLSEnabled ? (
                    <div className="flex items-center">
                      <Check className="h-3 w-3 mr-1 text-green-600" />
                      <span className="text-xs text-green-700 font-medium">已啟用</span>
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <X className="h-3 w-3 mr-1 text-red-500" />
                      <span className="text-xs text-red-600 font-medium">已停用</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <Switch
              checked={isGlobalRLSEnabled}
              onCheckedChange={toggleGlobalRLS}
              disabled={updating === 'global'}
            />
          </div>

          {/* 狀態提示 */}
          {!isGlobalRLSEnabled && (
            <Alert className="bg-orange-100/60 border border-orange-200/60 backdrop-blur-sm">
              <AlertTriangle className="h-4 w-4 text-orange-600" />
              <AlertDescription className="text-sm text-orange-800 font-medium">
                開發模式：全域 RLS 安全政策已關閉，建議在生產環境中啟用以確保資料安全。
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* 分類表格管理 */}
      <Card className={visionProStyles.liquidGlassCard}>
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-lg text-gray-900">
            <div className={visionProStyles.coloredIconContainer.blue}>
              <Settings className="h-5 w-5" />
            </div>
            表格級別 RLS 設定
          </CardTitle>
        </CardHeader>
        
        <CardContent>
          <Accordion type="multiple" className="w-full space-y-2">
            {categorizedTables.map((category) => (
              <AccordionItem 
                key={category.key} 
                value={category.key}
                className="border border-white/30 rounded-lg"
              >
                <AccordionTrigger className="px-4 py-3 text-sm font-semibold text-gray-900 hover:no-underline hover:bg-white/10 rounded-t-lg">
                  <div className="flex items-center gap-3">
                    <div className={visionProStyles.coloredIconContainer.teal}>
                      {getIconComponent(category.icon)}
                    </div>
                    <div className="text-left">
                      <div>{category.name}</div>
                      <div className="text-xs text-gray-600 font-normal mt-1">
                        ({category.tables.filter(t => t.enabled).length}/{category.tables.length} 已啟用)
                      </div>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4">
                  <div className="space-y-3 pt-2">
                    {category.tables.map((table) => (
                      <div key={table.tableName} className="p-4 bg-white/20 border border-white/30 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-3 mb-2">
                              <div className={table.enabled ? visionProStyles.coloredIconContainer.green : visionProStyles.coloredIconContainer.gray}>
                                <Database className="h-3 w-3" />
                              </div>
                              <span className="font-medium text-gray-900">{table.displayName}</span>
                              <Badge className={`text-xs ${table.enabled ? 'bg-green-500/20 text-green-700 border-green-400/30' : 'bg-gray-500/20 text-gray-600 border-gray-400/30'}`}>
                                {table.enabled ? '安全' : '開放'}
                              </Badge>
                            </div>
                            {renderPolicyBadges(table)}
                          </div>
                          <Switch
                            checked={table.enabled}
                            onCheckedChange={() => toggleTableRLS(table.tableName)}
                            disabled={updating === table.tableName}
                            className="ml-3 flex-shrink-0"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>

      {/* 安全建議 */}
      <Card className={visionProStyles.liquidGlassCard}>
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-lg text-gray-900">
            <div className={visionProStyles.coloredIconContainer.blue}>
              <Info className="h-5 w-5" />
            </div>
            安全性建議
          </CardTitle>
        </CardHeader>
        
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-blue-50/60 border border-blue-200/60 rounded-lg">
              <h4 className="font-semibold text-blue-900 mb-3">✅ 最佳實務</h4>
              <ul className="text-sm space-y-2 text-blue-800">
                <li>• 生產環境必須啟用所有表格的 RLS</li>
                <li>• 定期檢查政策覆蓋率</li>
                <li>• 確保敏感資料表有完整的 CRUD 政策</li>
                <li>• 使用最小權限原則設計政策</li>
              </ul>
            </div>
            
            <div className="p-4 bg-amber-50/60 border border-amber-200/60 rounded-lg">
              <h4 className="font-semibold text-amber-900 mb-3">⚠️ 注意事項</h4>
              <ul className="text-sm space-y-2 text-amber-800">
                <li>• 關閉 RLS 將允許匿名訪問</li>
                <li>• 政策變更可能影響應用程式功能</li>
                <li>• 測試環境變更前先備份政策</li>
                <li>• 監控政策效能對查詢的影響</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RLSSecurityDashboard;
