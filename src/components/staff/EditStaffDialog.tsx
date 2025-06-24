
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from '@/components/ui/button';
import { useStaffManagementContext } from '@/contexts/StaffManagementContext';
import { EditStaffFormContent } from './forms/EditStaffFormContent';
import { useToast } from '@/hooks/use-toast';

const EditStaffDialog = () => {
  const { 
    isEditDialogOpen, 
    setIsEditDialogOpen, 
    currentStaff, 
    setCurrentStaff, 
    handleEditStaff,
    staffList,
    roles
  } = useStaffManagementContext();
  
  const { toast } = useToast();
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [hireDateChangeInfo, setHireDateChangeInfo] = useState<{
    hasHireDate: boolean;
    entitledDays?: number;
  }>({ hasHireDate: false });

  if (!currentStaff) return null;

  // Filter out the current staff from potential supervisors to prevent self-supervision
  const potentialSupervisors = staffList.filter(staff => 
    staff.id !== currentStaff.id && 
    (currentStaff.branch_id ? staff.branch_id === currentStaff.branch_id || staff.branch_id === '1' : true)
  );

  const handleHireDateChange = (hasHireDate: boolean, entitledDays?: number) => {
    setHireDateChangeInfo({ hasHireDate, entitledDays });
  };

  const handleSaveClick = async () => {
    // 如果有設定入職日期且計算出特休天數，詢問是否確認切換為自動計算模式
    if (hireDateChangeInfo.hasHireDate && hireDateChangeInfo.entitledDays !== undefined) {
      setShowConfirmDialog(true);
    } else {
      await performSave();
    }
  };

  const performSave = async () => {
    const success = await handleEditStaff();
    if (success && hireDateChangeInfo.hasHireDate) {
      toast({
        title: "儲存成功",
        description: `特休天數已根據入職日重新計算（${hireDateChangeInfo.entitledDays} 天）`,
        duration: 4000,
      });
    }
    setShowConfirmDialog(false);
  };

  const handleConfirmAutoCalculation = async () => {
    await performSave();
  };

  return (
    <>
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px] max-h-[95vh] flex flex-col">
          <DialogHeader className="flex-shrink-0">
            <DialogTitle>編輯人員資料</DialogTitle>
            <DialogDescription>
              更新員工資料，完成後請點擊儲存
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex-1 overflow-y-auto px-1">
            <EditStaffFormContent 
              currentStaff={currentStaff}
              setCurrentStaff={setCurrentStaff}
              potentialSupervisors={potentialSupervisors}
              roles={roles}
              onHireDateChange={handleHireDateChange}
            />
          </div>
          
          <DialogFooter className="flex-shrink-0 border-t pt-4 mt-4">
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>取消</Button>
            <Button onClick={handleSaveClick}>儲存變更</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 確認對話框 */}
      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>切換為自動年資換算模式</AlertDialogTitle>
            <AlertDialogDescription className="space-y-2">
              <p>已輸入入職日期，系統將切換為自動年資換算模式。</p>
              <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                <p className="text-sm text-blue-800">
                  <strong>計算結果：</strong>根據入職日期，該員工特休天數將設定為 <strong>{hireDateChangeInfo.entitledDays} 天</strong>
                </p>
              </div>
              <p className="text-sm text-gray-600">
                未來特休天數將自動依據年資計算，是否確認進行此變更？
              </p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmAutoCalculation}>
              確認切換
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default EditStaffDialog;
