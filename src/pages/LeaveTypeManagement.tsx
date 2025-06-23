
import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Edit, Trash2, FileText, AlertCircle, TrendingUp, CheckCircle } from 'lucide-react';
import { LeaveTypeService } from '@/services/payroll/leaveTypeService';
import { LeaveTypeDialog } from '@/components/leave/LeaveTypeDialog';
import { DeleteConfirmDialog } from '@/components/dialogs/DeleteConfirmDialog';

interface LeaveType {
  id: string;
  code: string;
  name_zh: string;
  name_en: string;
  is_paid: boolean;
  annual_reset: boolean;
  max_days_per_year?: number;
  requires_attachment: boolean;
  is_system_default: boolean;
  is_active: boolean;
  sort_order: number;
  description?: string;
}

export default function LeaveTypeManagement() {
  const [leaveTypes, setLeaveTypes] = useState<LeaveType[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedLeaveType, setSelectedLeaveType] = useState<LeaveType | null>(null);
  const [deleteLeaveType, setDeleteLeaveType] = useState<LeaveType | null>(null);
  const { toast } = useToast();

  // 統計數據
  const stats = {
    total: leaveTypes.length,
    active: leaveTypes.filter(type => type.is_active).length,
    paid: leaveTypes.filter(type => type.is_paid && type.is_active).length,
    systemDefault: leaveTypes.filter(type => type.is_system_default).length
  };

  useEffect(() => {
    loadLeaveTypes();
  }, []);

  const loadLeaveTypes = async () => {
    try {
      const data = await LeaveTypeService.getLeaveTypes();
      setLeaveTypes(data || []);
    } catch (error) {
      console.error('載入假別失敗:', error);
      toast({
        title: "載入失敗",
        description: "無法載入假別資料",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setSelectedLeaveType(null);
    setDialogOpen(true);
  };

  const handleEdit = (leaveType: LeaveType) => {
    setSelectedLeaveType(leaveType);
    setDialogOpen(true);
  };

  const handleDelete = (leaveType: LeaveType) => {
    if (leaveType.is_system_default) {
      toast({
        title: "無法刪除",
        description: "系統預設假別無法刪除，但可以停用",
        variant: "destructive"
      });
      return;
    }
    setDeleteLeaveType(leaveType);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!deleteLeaveType) return;
    try {
      await LeaveTypeService.deleteLeaveType(deleteLeaveType.id);
      toast({
        title: "刪除成功",
        description: "假別已刪除"
      });
      loadLeaveTypes();
    } catch (error) {
      console.error('刪除假別失敗:', error);
      toast({
        title: "刪除失敗",
        description: "無法刪除假別",
        variant: "destructive"
      });
    } finally {
      setDeleteDialogOpen(false);
      setDeleteLeaveType(null);
    }
  };

  const handleSave = async (data: any) => {
    try {
      if (selectedLeaveType) {
        await LeaveTypeService.updateLeaveType(selectedLeaveType.id, data);
        toast({
          title: "更新成功",
          description: "假別已更新"
        });
      } else {
        await LeaveTypeService.createLeaveType(data);
        toast({
          title: "新增成功",
          description: "假別已新增"
        });
      }
      setDialogOpen(false);
      loadLeaveTypes();
    } catch (error: any) {
      console.error('儲存假別失敗:', error);
      toast({
        title: "儲存失敗",
        description: error.message || "無法儲存假別資料",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="backdrop-blur-xl bg-white/30 rounded-3xl p-8 shadow-2xl border border-white/20">
          <div className="text-slate-700 text-lg font-medium">載入中...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative">
      {/* 裝飾性背景元素 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-blue-400/30 rounded-full animate-float"></div>
        <div className="absolute top-3/4 right-1/4 w-3 h-3 bg-indigo-400/20 rounded-full animate-float" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-1/2 left-3/4 w-1 h-1 bg-slate-400/40 rounded-full animate-float" style={{animationDelay: '4s'}}></div>
      </div>

      <div className="container mx-auto space-y-8 py-8 px-4 relative z-10">
        {/* 頁面標題 */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-800 mb-4 tracking-tight">請假假別管理</h1>
          <p className="text-slate-600 text-lg font-medium">管理系統中的請假類型設定</p>
        </div>

        {/* 統計卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
          <Card className="backdrop-blur-xl bg-white/40 border-0 shadow-xl rounded-3xl hover:bg-white/50 transition-all duration-300 hover:shadow-2xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-semibold text-slate-700">總假別數</CardTitle>
              <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-lg text-white">
                <FileText className="h-5 w-5" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-800 mb-1">{stats.total}</div>
              <p className="text-slate-600 text-sm">個假別類型</p>
            </CardContent>
          </Card>
          
          <Card className="backdrop-blur-xl bg-white/40 border-0 shadow-xl rounded-3xl hover:bg-white/50 transition-all duration-300 hover:shadow-2xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-semibold text-slate-700">已啟用</CardTitle>
              <div className="p-3 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl shadow-lg text-white">
                <CheckCircle className="h-5 w-5" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-emerald-700 mb-1">{stats.active}</div>
              <p className="text-slate-600 text-sm">可使用假別</p>
            </CardContent>
          </Card>
          
          <Card className="backdrop-blur-xl bg-white/40 border-0 shadow-xl rounded-3xl hover:bg-white/50 transition-all duration-300 hover:shadow-2xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-semibold text-slate-700">有薪假別</CardTitle>
              <div className="p-3 bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl shadow-lg text-white">
                <TrendingUp className="h-5 w-5" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-amber-700 mb-1">{stats.paid}</div>
              <p className="text-slate-600 text-sm">帶薪休假</p>
            </CardContent>
          </Card>
          
          <Card className="backdrop-blur-xl bg-white/40 border-0 shadow-xl rounded-3xl hover:bg-white/50 transition-all duration-300 hover:shadow-2xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-semibold text-slate-700">系統預設</CardTitle>
              <div className="p-3 bg-gradient-to-br from-violet-500 to-violet-600 rounded-2xl shadow-lg text-white">
                <AlertCircle className="h-5 w-5" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-violet-700 mb-1">{stats.systemDefault}</div>
              <p className="text-slate-600 text-sm">內建假別</p>
            </CardContent>
          </Card>
        </div>

        {/* 操作按鈕 */}
        <div className="flex justify-end mb-8">
          <Button 
            onClick={handleAdd} 
            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-xl hover:shadow-2xl transition-all duration-300 rounded-2xl px-8 py-3 font-semibold"
          >
            <Plus className="h-5 w-5 mr-2" />
            新增假別
          </Button>
        </div>

        {/* 假別列表 */}
        <Card className="backdrop-blur-xl bg-white/30 border-0 shadow-2xl rounded-3xl overflow-hidden">
          <CardHeader className="bg-white/20 border-b border-white/10 pb-6">
            <CardTitle className="text-slate-800 text-2xl font-bold">假別列表</CardTitle>
            <CardDescription className="text-slate-600 font-medium text-base">管理系統中的所有請假類型</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-white/10 hover:bg-white/10 transition-colors">
                    <TableHead className="text-slate-700 font-bold text-sm py-4 px-6">假別代碼</TableHead>
                    <TableHead className="text-slate-700 font-bold text-sm py-4 px-6">中文名稱</TableHead>
                    <TableHead className="text-slate-700 font-bold text-sm py-4 px-6">英文名稱</TableHead>
                    <TableHead className="text-slate-700 font-bold text-sm py-4 px-6">薪資</TableHead>
                    <TableHead className="text-slate-700 font-bold text-sm py-4 px-6">年度重置</TableHead>
                    <TableHead className="text-slate-700 font-bold text-sm py-4 px-6">最大天數</TableHead>
                    <TableHead className="text-slate-700 font-bold text-sm py-4 px-6">狀態</TableHead>
                    <TableHead className="text-slate-700 font-bold text-sm py-4 px-6">操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {leaveTypes.map((leaveType) => (
                    <TableRow 
                      key={leaveType.id} 
                      className="border-white/10 hover:bg-white/20 transition-all duration-200"
                    >
                      <TableCell className="py-4 px-6">
                        <code className="bg-slate-800/80 text-white px-3 py-2 rounded-xl text-sm font-mono shadow-lg">
                          {leaveType.code}
                        </code>
                      </TableCell>
                      <TableCell className="font-bold text-slate-800 py-4 px-6">{leaveType.name_zh}</TableCell>
                      <TableCell className="text-slate-600 font-medium py-4 px-6">{leaveType.name_en}</TableCell>
                      <TableCell className="py-4 px-6">
                        <Badge 
                          className={leaveType.is_paid 
                            ? "bg-emerald-100 text-emerald-800 border border-emerald-200 font-semibold px-3 py-1 rounded-xl" 
                            : "bg-slate-100 text-slate-700 border border-slate-200 font-semibold px-3 py-1 rounded-xl"
                          }
                        >
                          {leaveType.is_paid ? "有薪" : "無薪"}
                        </Badge>
                      </TableCell>
                      <TableCell className="py-4 px-6">
                        <Badge 
                          variant="outline" 
                          className={leaveType.annual_reset 
                            ? "border-blue-300 text-blue-800 bg-blue-50 font-semibold px-3 py-1 rounded-xl" 
                            : "border-slate-300 text-slate-700 bg-slate-50 font-semibold px-3 py-1 rounded-xl"
                          }
                        >
                          {leaveType.annual_reset ? "是" : "否"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-slate-800 font-semibold py-4 px-6">
                        {leaveType.max_days_per_year ? `${leaveType.max_days_per_year}天` : "無限制"}
                      </TableCell>
                      <TableCell className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <Badge 
                            className={leaveType.is_active 
                              ? "bg-emerald-100 text-emerald-800 border border-emerald-200 font-semibold px-3 py-1 rounded-xl" 
                              : "bg-slate-100 text-slate-700 border border-slate-200 font-semibold px-3 py-1 rounded-xl"
                            }
                          >
                            {leaveType.is_active ? "啟用" : "停用"}
                          </Badge>
                          {leaveType.is_system_default && (
                            <Badge 
                              variant="outline" 
                              className="text-violet-800 border-violet-300 bg-violet-50 font-semibold px-3 py-1 rounded-xl"
                            >
                              系統預設
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleEdit(leaveType)} 
                            className="hover:bg-blue-100 text-blue-700 hover:text-blue-800 rounded-xl border border-transparent hover:border-blue-200 transition-all duration-200"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleDelete(leaveType)} 
                            disabled={leaveType.is_system_default} 
                            className="hover:bg-red-100 text-red-600 hover:text-red-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl border border-transparent hover:border-red-200 transition-all duration-200"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* 對話框 */}
        <LeaveTypeDialog 
          open={dialogOpen} 
          onOpenChange={setDialogOpen} 
          leaveType={selectedLeaveType} 
          onSave={handleSave} 
        />

        <DeleteConfirmDialog 
          open={deleteDialogOpen} 
          onOpenChange={setDeleteDialogOpen} 
          onConfirm={confirmDelete} 
          title="確認刪除假別" 
          description={`確定要刪除「${deleteLeaveType?.name_zh}」嗎？此操作無法復原。`} 
        />
      </div>
    </div>
  );
}
