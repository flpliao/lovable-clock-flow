import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Plus, Edit, Settings } from 'lucide-react';
import { LeaveTypeService } from '@/services/payroll/leaveTypeService';
import { LeaveTypeFormDialog } from '@/components/leave/LeaveTypeFormDialog';
import { LeaveType } from '@/types/hr';
import { toast } from '@/components/ui/use-toast';

const LeaveTypeManagement = () => {
  const [leaveTypes, setLeaveTypes] = useState<LeaveType[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDialog, setShowDialog] = useState(false);
  const [editingLeaveType, setEditingLeaveType] = useState<LeaveType | null>(null);

  useEffect(() => {
    loadLeaveTypes();
  }, []);

  const loadLeaveTypes = async () => {
    try {
      const data = await LeaveTypeService.getAllLeaveTypes();
      setLeaveTypes(data as LeaveType[] || []);
    } catch (error) {
      console.error('載入請假類型失敗:', error);
      toast({
        title: "載入失敗",
        description: "無法載入請假類型資料",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = () => {
    setEditingLeaveType(null);
    setShowDialog(true);
  };

  const handleEditLeaveType = (leaveType: LeaveType) => {
    setEditingLeaveType(leaveType);
    setShowDialog(true);
  };

  const handleCloseDialog = () => {
    setShowDialog(false);
    setEditingLeaveType(null);
  };

  const handleSaveLeaveType = async (leaveTypeData: LeaveType) => {
    try {
      if (editingLeaveType) {
        // 更新現有假別
        await LeaveTypeService.updateLeaveType(editingLeaveType.id, leaveTypeData);
        toast({
          title: "更新成功",
          description: "請假類型已成功更新",
        });
      } else {
        // 創建新假別
        await LeaveTypeService.createLeaveType(leaveTypeData);
        toast({
          title: "創建成功",
          description: "請假類型已成功創建",
        });
      }
      loadLeaveTypes(); // 重新載入假別
    } catch (error: any) {
      console.error('儲存請假類型失敗:', error);
      toast({
        title: "儲存失敗",
        description: error.message || "無法儲存請假類型",
        variant: "destructive"
      });
    } finally {
      handleCloseDialog();
    }
  };

  const handleDeleteLeaveType = async (id: string) => {
    try {
      await LeaveTypeService.deleteLeaveType(id);
      loadLeaveTypes();
      toast({
        title: "刪除成功",
        description: "請假類型已成功刪除",
      });
    } catch (error: any) {
      console.error('刪除請假類型失敗:', error);
      toast({
        title: "刪除失敗",
        description: error.message || "無法刪除請假類型",
        variant: "destructive"
      });
    }
  };

  const handleToggleActive = async (id: string, is_active: boolean) => {
    try {
      await LeaveTypeService.updateLeaveType(id, { is_active: !is_active });
      loadLeaveTypes();
      toast({
        title: "更新成功",
        description: `請假類型已${is_active ? '停用' : '啟用'}`,
      });
    } catch (error: any) {
      console.error('更新請假類型狀態失敗:', error);
      toast({
        title: "更新失敗",
        description: "無法更新請假類型狀態",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-400 via-purple-500 to-purple-600 pt-32 md:pt-36">
        <div className="w-full px-4 sm:px-6 lg:px-8 pb-6">
          <div className="max-w-5xl mx-auto">
            <Card className="backdrop-blur-xl bg-white/20 border border-white/30 rounded-3xl shadow-xl">
              <CardHeader className="text-center">
                <div className="mx-auto w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mb-4">
                  <Settings className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-2xl font-bold text-white drop-shadow-md">
                  請假假別管理
                </CardTitle>
                <CardDescription className="text-white/80 font-medium drop-shadow-sm">
                  管理公司可用的請假假別
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center text-white">
                <p>載入中...</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-purple-500 to-purple-600 pt-32 md:pt-36">
      <div className="w-full px-4 sm:px-6 lg:px-8 pb-6">
        <div className="max-w-5xl mx-auto">
          <Card className="backdrop-blur-xl bg-white/20 border border-white/30 rounded-3xl shadow-xl">
            <CardHeader className="flex items-center justify-between">
              <div>
                <div className="mx-auto w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mb-4">
                  <Settings className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-2xl font-bold text-white drop-shadow-md">
                  請假假別管理
                </CardTitle>
                <CardDescription className="text-white/80 font-medium drop-shadow-sm">
                  管理公司可用的請假假別
                </CardDescription>
              </div>
              <Button onClick={handleOpenDialog}>
                <Plus className="h-4 w-4 mr-2" />
                新增假別
              </Button>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {leaveTypes.map((leaveType) => (
                  <div
                    key={leaveType.id}
                    className="flex items-center justify-between rounded-lg border border-gray-200 bg-white/10 p-4 shadow-sm"
                  >
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-white">{leaveType.name_zh}</p>
                      <p className="text-sm text-gray-400">{leaveType.name_en}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant={leaveType.is_paid ? 'default' : 'secondary'}>
                        {leaveType.is_paid ? '有薪' : '無薪'}
                      </Badge>
                      <Switch
                        checked={leaveType.is_active}
                        onCheckedChange={(checked) => handleToggleActive(leaveType.id, leaveType.is_active)}
                        id={`active-${leaveType.id}`}
                      />
                      <Button variant="outline" size="icon" onClick={() => handleEditLeaveType(leaveType)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <LeaveTypeFormDialog
        open={showDialog}
        onClose={handleCloseDialog}
        onSave={handleSaveLeaveType}
        leaveType={editingLeaveType}
      />
    </div>
  );
};

export default LeaveTypeManagement;
