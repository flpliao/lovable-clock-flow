
import React, { useState, useEffect } from 'react';
import { Settings, Plus, Edit, Trash2, Check, X, Users, Calendar, Clock, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { LeaveTypeService } from '@/services/payroll/leaveTypeService';
import { LeaveTypeFormDialog } from '@/components/leave/LeaveTypeFormDialog';
import { LeaveType } from '@/types/hr';

const LeaveTypeManagement = () => {
  const [leaveTypes, setLeaveTypes] = useState<LeaveType[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState<LeaveType | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const { toast } = useToast();

  const loadLeaveTypes = async () => {
    try {
      setLoading(true);
      const data = await LeaveTypeService.getLeaveTypes();
      setLeaveTypes(data || []);
    } catch (error) {
      console.error('載入假別失敗:', error);
      toast({
        title: "載入失敗",
        description: "無法載入假別設定",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLeaveTypes();
  }, []);

  const handleToggleActive = async (leaveType: LeaveType) => {
    try {
      await LeaveTypeService.updateLeaveType(leaveType.id, {
        is_active: !leaveType.is_active
      });
      
      toast({
        title: leaveType.is_active ? "已停用" : "已啟用",
        description: `假別「${leaveType.name_zh}」已${leaveType.is_active ? '停用' : '啟用'}`,
      });
      
      await loadLeaveTypes();
    } catch (error) {
      toast({
        title: "操作失敗",
        description: "無法更新假別狀態",
        variant: "destructive"
      });
    }
  };

  const handleEdit = (leaveType: LeaveType) => {
    setSelectedType(leaveType);
    setIsEditing(true);
    setIsFormOpen(true);
  };

  const handleCreate = () => {
    setSelectedType(null);
    setIsEditing(false);
    setIsFormOpen(true);
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setSelectedType(null);
    setIsEditing(false);
    loadLeaveTypes();
  };

  const getPayStatusBadge = (leaveType: LeaveType) => {
    if (leaveType.is_paid) {
      const specialRules = leaveType.special_rules as any;
      if (specialRules?.pay_rate && specialRules.pay_rate < 1) {
        return <Badge variant="secondary">半薪</Badge>;
      }
      return <Badge variant="default">有薪</Badge>;
    }
    return <Badge variant="destructive">無薪</Badge>;
  };

  const getGenderRestriction = (leaveType: LeaveType) => {
    if (leaveType.gender_restriction === 'female') {
      return <Badge variant="secondary">限女性</Badge>;
    }
    if (leaveType.gender_restriction === 'male') {
      return <Badge variant="secondary">限男性</Badge>;
    }
    return null;
  };

  const getLimitInfo = (leaveType: LeaveType) => {
    const limits = [];
    if (leaveType.max_days_per_year) {
      limits.push(`年限 ${leaveType.max_days_per_year} 天`);
    }
    if (leaveType.max_days_per_month) {
      limits.push(`月限 ${leaveType.max_days_per_month} 天`);
    }
    return limits.join(' | ') || '無限制';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-400 via-purple-500 to-purple-600 pt-32 md:pt-36">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4"></div>
              <p className="text-white/80">載入中...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-purple-500 to-purple-600 pt-32 md:pt-36">
      <div className="w-full px-4 sm:px-6 lg:px-8 pb-6">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* 頁面標題 */}
          <div className="backdrop-blur-xl bg-white/20 border border-white/30 rounded-3xl shadow-xl p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <Settings className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white drop-shadow-md">請假假別管理</h1>
                  <p className="text-white/80 font-medium drop-shadow-sm">管理請假類型、規則與權限設定</p>
                </div>
              </div>
              <Button 
                onClick={handleCreate}
                className="bg-white/20 hover:bg-white/30 text-white border border-white/30"
              >
                <Plus className="h-4 w-4 mr-2" />
                新增假別
              </Button>
            </div>
          </div>

          {/* 統計卡片 */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="backdrop-blur-xl bg-white/20 border border-white/30">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-white mb-1">
                  {leaveTypes.length}
                </div>
                <div className="text-white/80 text-sm">總假別數</div>
              </CardContent>
            </Card>
            <Card className="backdrop-blur-xl bg-white/20 border border-white/30">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-green-300 mb-1">
                  {leaveTypes.filter(t => t.is_active).length}
                </div>
                <div className="text-white/80 text-sm">已啟用</div>
              </CardContent>
            </Card>
            <Card className="backdrop-blur-xl bg-white/20 border border-white/30">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-blue-300 mb-1">
                  {leaveTypes.filter(t => t.is_paid).length}
                </div>
                <div className="text-white/80 text-sm">有薪假別</div>
              </CardContent>
            </Card>
            <Card className="backdrop-blur-xl bg-white/20 border border-white/30">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-yellow-300 mb-1">
                  {leaveTypes.filter(t => t.is_system_default).length}
                </div>
                <div className="text-white/80 text-sm">系統預設</div>
              </CardContent>
            </Card>
          </div>

          {/* 假別列表 */}
          <div className="backdrop-blur-xl bg-white/20 border border-white/30 rounded-3xl shadow-xl p-6">
            <h2 className="text-xl font-semibold text-white drop-shadow-md mb-6">假別設定</h2>
            
            <div className="space-y-4">
              {leaveTypes.sort((a, b) => a.sort_order - b.sort_order).map((leaveType) => (
                <div 
                  key={leaveType.id}
                  className="bg-white/10 rounded-2xl p-6 border border-white/20"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-white">
                          {leaveType.name_zh}
                        </h3>
                        <div className="flex items-center gap-2">
                          {getPayStatusBadge(leaveType)}
                          {getGenderRestriction(leaveType)}
                          {leaveType.requires_approval && (
                            <Badge variant="outline" className="text-white border-white/30">
                              需核准
                            </Badge>
                          )}
                          {leaveType.requires_attachment && (
                            <Badge variant="outline" className="text-white border-white/30">
                              需附件
                            </Badge>
                          )}
                          {leaveType.is_system_default && (
                            <Badge variant="outline" className="text-yellow-300 border-yellow-300/50">
                              系統預設
                            </Badge>
                          )}
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-white/90 mb-3">
                        <div>
                          <span className="text-white/70">英文名稱：</span>
                          <span>{leaveType.name_en}</span>
                        </div>
                        <div>
                          <span className="text-white/70">使用限制：</span>
                          <span>{getLimitInfo(leaveType)}</span>
                        </div>
                        <div>
                          <span className="text-white/70">年度重置：</span>
                          <span>{leaveType.annual_reset ? '是' : '否'}</span>
                        </div>
                      </div>
                      
                      {leaveType.description && (
                        <div className="text-sm text-white/80 mb-3">
                          <span className="text-white/70">說明：</span>
                          {leaveType.description}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-3 ml-6">
                      <div className="flex items-center gap-2">
                        <span className="text-white/70 text-sm">啟用</span>
                        <Switch
                          checked={leaveType.is_active}
                          onCheckedChange={() => handleToggleActive(leaveType)}
                        />
                      </div>
                      <Button
                        onClick={() => handleEdit(leaveType)}
                        variant="outline"
                        size="sm"
                        className="text-white border-white/30 hover:bg-white/20"
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        編輯
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 表單對話框 */}
      <LeaveTypeFormDialog
        open={isFormOpen}
        onClose={handleFormClose}
        leaveType={selectedType}
        isEditing={isEditing}
      />
    </div>
  );
};

export default LeaveTypeManagement;
