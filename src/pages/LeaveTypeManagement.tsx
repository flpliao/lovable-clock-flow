
import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, FileText } from 'lucide-react';
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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <div className="container mx-auto">
          <div className="text-center py-8">載入中...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="container mx-auto space-y-6">
        {/* 頁面標題 */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">請假假別管理</h1>
          <p className="text-gray-600">管理系統中的請假類型設定</p>
        </div>

        {/* 統計卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">總假別數</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">已啟用</CardTitle>
              <div className="h-2 w-2 bg-green-500 rounded-full"></div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.active}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">有薪假別</CardTitle>
              <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{stats.paid}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">系統預設</CardTitle>
              <div className="h-2 w-2 bg-purple-500 rounded-full"></div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">{stats.systemDefault}</div>
            </CardContent>
          </Card>
        </div>

        {/* 操作按鈕 */}
        <div className="flex justify-end mb-4">
          <Button onClick={handleAdd} className="bg-blue-600 hover:bg-blue-700">
            <Plus className="h-4 w-4 mr-2" />
            新增假別
          </Button>
        </div>

        {/* 假別列表 */}
        <Card>
          <CardHeader>
            <CardTitle>假別列表</CardTitle>
            <CardDescription>管理系統中的所有請假類型</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4">假別代碼</th>
                    <th className="text-left py-3 px-4">中文名稱</th>
                    <th className="text-left py-3 px-4">英文名稱</th>
                    <th className="text-left py-3 px-4">薪資</th>
                    <th className="text-left py-3 px-4">年度重置</th>
                    <th className="text-left py-3 px-4">最大天數</th>
                    <th className="text-left py-3 px-4">狀態</th>
                    <th className="text-left py-3 px-4">操作</th>
                  </tr>
                </thead>
                <tbody>
                  {leaveTypes.map((leaveType) => (
                    <tr key={leaveType.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <code className="bg-gray-100 px-2 py-1 rounded text-sm">
                          {leaveType.code}
                        </code>
                      </td>
                      <td className="py-3 px-4 font-medium">{leaveType.name_zh}</td>
                      <td className="py-3 px-4 text-gray-600">{leaveType.name_en}</td>
                      <td className="py-3 px-4">
                        <Badge variant={leaveType.is_paid ? "default" : "secondary"}>
                          {leaveType.is_paid ? "有薪" : "無薪"}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant={leaveType.annual_reset ? "outline" : "secondary"}>
                          {leaveType.annual_reset ? "是" : "否"}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        {leaveType.max_days_per_year ? `${leaveType.max_days_per_year}天` : "無限制"}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <Badge variant={leaveType.is_active ? "default" : "secondary"}>
                            {leaveType.is_active ? "啟用" : "停用"}
                          </Badge>
                          {leaveType.is_system_default && (
                            <Badge variant="outline" className="text-purple-600 border-purple-600">
                              系統預設
                            </Badge>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(leaveType)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(leaveType)}
                            disabled={leaveType.is_system_default}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
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
