
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
      <div className="min-h-screen bg-gradient-to-br from-blue-300/30 via-blue-200/20 to-blue-100/15 p-4">
        <div className="container mx-auto">
          <div className="text-center py-8">
            <div className="text-gray-700 text-lg">載入中...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-300/30 via-blue-200/20 to-blue-100/15 p-4">
      <div className="container mx-auto space-y-6 py-8">
        {/* 頁面標題 */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-3 drop-shadow-sm">請假假別管理</h1>
          <p className="text-gray-700 text-lg font-medium">管理系統中的請假類型設定</p>
        </div>

        {/* 統計卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="backdrop-blur-2xl bg-gradient-to-br from-white/80 to-white/60 border border-white/50 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-700">總假別數</CardTitle>
              <div className="p-3 bg-blue-500/90 rounded-xl shadow-lg backdrop-blur-xl border border-blue-400/50 text-white">
                <FileText className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">{stats.total}</div>
            </CardContent>
          </Card>
          
          <Card className="backdrop-blur-2xl bg-gradient-to-br from-white/80 to-white/60 border border-white/50 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-700">已啟用</CardTitle>
              <div className="p-3 bg-green-500/90 rounded-xl shadow-lg backdrop-blur-xl border border-green-400/50 text-white">
                <CheckCircle className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-700">{stats.active}</div>
            </CardContent>
          </Card>
          
          <Card className="backdrop-blur-2xl bg-gradient-to-br from-white/80 to-white/60 border border-white/50 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-700">有薪假別</CardTitle>
              <div className="p-3 bg-teal-500/90 rounded-xl shadow-lg backdrop-blur-xl border border-teal-400/50 text-white">
                <TrendingUp className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-teal-700">{stats.paid}</div>
            </CardContent>
          </Card>
          
          <Card className="backdrop-blur-2xl bg-gradient-to-br from-white/80 to-white/60 border border-white/50 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-700">系統預設</CardTitle>
              <div className="p-3 bg-purple-500/90 rounded-xl shadow-lg backdrop-blur-xl border border-purple-400/50 text-white">
                <AlertCircle className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-700">{stats.systemDefault}</div>
            </CardContent>
          </Card>
        </div>

        {/* 操作按鈕 */}
        <div className="flex justify-end mb-6">
          <Button 
            onClick={handleAdd} 
            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl px-6 py-3"
          >
            <Plus className="h-5 w-5 mr-2" />
            新增假別
          </Button>
        </div>

        {/* 假別列表 */}
        <Card className="backdrop-blur-2xl bg-gradient-to-br from-white/80 to-white/60 border border-white/50 rounded-2xl shadow-lg">
          <CardHeader className="pb-4">
            <CardTitle className="text-gray-900 text-xl font-bold">假別列表</CardTitle>
            <CardDescription className="text-gray-700 font-medium">管理系統中的所有請假類型</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-gray-300/50 hover:bg-white/30">
                    <TableHead className="text-gray-800 font-semibold text-sm">假別代碼</TableHead>
                    <TableHead className="text-gray-800 font-semibold text-sm">中文名稱</TableHead>
                    <TableHead className="text-gray-800 font-semibold text-sm">英文名稱</TableHead>
                    <TableHead className="text-gray-800 font-semibold text-sm">薪資</TableHead>
                    <TableHead className="text-gray-800 font-semibold text-sm">年度重置</TableHead>
                    <TableHead className="text-gray-800 font-semibold text-sm">最大天數</TableHead>
                    <TableHead className="text-gray-800 font-semibold text-sm">狀態</TableHead>
                    <TableHead className="text-gray-800 font-semibold text-sm">操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {leaveTypes.map((leaveType) => (
                    <TableRow 
                      key={leaveType.id} 
                      className="border-gray-300/30 hover:bg-blue-50/60 transition-colors duration-200"
                    >
                      <TableCell>
                        <code className="bg-gray-200/80 px-3 py-1 rounded-lg text-sm font-mono text-gray-800 border border-gray-300/50">
                          {leaveType.code}
                        </code>
                      </TableCell>
                      <TableCell className="font-semibold text-gray-900">{leaveType.name_zh}</TableCell>
                      <TableCell className="text-gray-700 font-medium">{leaveType.name_en}</TableCell>
                      <TableCell>
                        <Badge 
                          variant={leaveType.is_paid ? "default" : "secondary"} 
                          className={leaveType.is_paid 
                            ? "bg-green-200/80 text-green-800 border border-green-300/50 font-medium" 
                            : "bg-gray-200/80 text-gray-700 border border-gray-300/50 font-medium"
                          }
                        >
                          {leaveType.is_paid ? "有薪" : "無薪"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant="outline" 
                          className={leaveType.annual_reset 
                            ? "border-blue-400/60 text-blue-800 bg-blue-50/60 font-medium" 
                            : "border-gray-400/60 text-gray-700 bg-gray-50/60 font-medium"
                          }
                        >
                          {leaveType.annual_reset ? "是" : "否"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-gray-800 font-medium">
                        {leaveType.max_days_per_year ? `${leaveType.max_days_per_year}天` : "無限制"}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Badge 
                            variant={leaveType.is_active ? "default" : "secondary"} 
                            className={leaveType.is_active 
                              ? "bg-green-200/80 text-green-800 border border-green-300/50 font-medium" 
                              : "bg-gray-200/80 text-gray-700 border border-gray-300/50 font-medium"
                            }
                          >
                            {leaveType.is_active ? "啟用" : "停用"}
                          </Badge>
                          {leaveType.is_system_default && (
                            <Badge 
                              variant="outline" 
                              className="text-purple-800 border-purple-400/60 bg-purple-50/60 font-medium"
                            >
                              系統預設
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleEdit(leaveType)} 
                            className="hover:bg-blue-100/80 text-blue-700 hover:text-blue-800 rounded-lg border border-transparent hover:border-blue-200/50"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleDelete(leaveType)} 
                            disabled={leaveType.is_system_default} 
                            className="hover:bg-red-100/80 text-red-600 hover:text-red-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg border border-transparent hover:border-red-200/50"
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
