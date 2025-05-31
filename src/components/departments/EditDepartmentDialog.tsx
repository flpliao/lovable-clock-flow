
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useDepartmentManagementContext } from './DepartmentManagementContext';
import { toast } from '@/hooks/use-toast';

const EditDepartmentDialog = () => {
  const { 
    isEditDialogOpen, 
    setIsEditDialogOpen, 
    currentDepartment, 
    setCurrentDepartment, 
    handleEditDepartment
  } = useDepartmentManagementContext();
  
  if (!currentDepartment) return null;

  const handleSave = async () => {
    console.log('💾 開始儲存部門編輯:', currentDepartment);
    
    // 驗證必填欄位
    if (!currentDepartment.name.trim()) {
      toast({
        title: "驗證錯誤",
        description: "部門名稱為必填欄位",
        variant: "destructive",
      });
      return;
    }

    if (!currentDepartment.type) {
      toast({
        title: "驗證錯誤", 
        description: "部門類型為必填欄位",
        variant: "destructive",
      });
      return;
    }

    try {
      console.log('🔄 呼叫 handleEditDepartment...');
      await handleEditDepartment();
      console.log('✅ 編輯完成，準備關閉對話框');
    } catch (error) {
      console.error('💥 編輯部門失敗:', error);
      toast({
        title: "編輯失敗",
        description: "無法更新部門資料，請稍後再試",
        variant: "destructive",
      });
    }
  };

  const handleCancel = () => {
    console.log('❌ 取消編輯部門');
    setIsEditDialogOpen(false);
    setCurrentDepartment(null);
  };
  
  return (
    <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
      <DialogContent className="sm:max-w-[320px]">
        <DialogHeader>
          <DialogTitle className="text-sm">編輯部門</DialogTitle>
          <DialogDescription className="text-xs">
            修改部門資訊
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-2 py-2">
          <div className="grid grid-cols-4 items-center gap-2">
            <Label htmlFor="edit-name" className="text-right text-xs">
              名稱 <span className="text-red-500">*</span>
            </Label>
            <Input
              id="edit-name"
              value={currentDepartment.name}
              onChange={(e) => setCurrentDepartment({...currentDepartment, name: e.target.value})}
              className="col-span-3 h-6 text-xs"
              placeholder="請輸入部門名稱"
              required
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-2">
            <Label htmlFor="edit-type" className="text-right text-xs">
              類型 <span className="text-red-500">*</span>
            </Label>
            <Select 
              value={currentDepartment.type} 
              onValueChange={(value: 'headquarters' | 'branch' | 'store') => setCurrentDepartment({...currentDepartment, type: value})}
            >
              <SelectTrigger className="col-span-3 h-6 text-xs" id="edit-type">
                <SelectValue placeholder="選擇類型" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="headquarters" className="text-xs">總部</SelectItem>
                <SelectItem value="branch" className="text-xs">分部</SelectItem>
                <SelectItem value="store" className="text-xs">門市</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid grid-cols-4 items-center gap-2">
            <Label htmlFor="edit-location" className="text-right text-xs">
              地點
            </Label>
            <Input
              id="edit-location"
              value={currentDepartment.location || ''}
              onChange={(e) => setCurrentDepartment({...currentDepartment, location: e.target.value})}
              className="col-span-3 h-6 text-xs"
              placeholder="請輸入地點"
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-2">
            <Label htmlFor="edit-manager_name" className="text-right text-xs">
              負責人
            </Label>
            <Input
              id="edit-manager_name"
              value={currentDepartment.manager_name || ''}
              onChange={(e) => setCurrentDepartment({...currentDepartment, manager_name: e.target.value})}
              className="col-span-3 h-6 text-xs"
              placeholder="請輸入負責人姓名"
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-2">
            <Label htmlFor="edit-manager_contact" className="text-right text-xs">
              聯絡方式
            </Label>
            <Input
              id="edit-manager_contact"
              value={currentDepartment.manager_contact || ''}
              onChange={(e) => setCurrentDepartment({...currentDepartment, manager_contact: e.target.value})}
              className="col-span-3 h-6 text-xs"
              placeholder="請輸入聯絡方式"
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={handleCancel} className="h-6 text-xs">
            取消
          </Button>
          <Button onClick={handleSave} className="h-6 text-xs">
            儲存
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditDepartmentDialog;
