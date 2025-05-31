
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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { usePositionManagementContext } from './PositionManagementContext';

const EditPositionDialog = () => {
  const { 
    isEditDialogOpen, 
    setIsEditDialogOpen, 
    currentPosition, 
    setCurrentPosition, 
    handleEditPosition
  } = usePositionManagementContext();
  
  if (!currentPosition) return null;

  const handleSave = async () => {
    const success = await handleEditPosition();
    // Dialog will be closed automatically if successful
  };

  const handleCancel = () => {
    setIsEditDialogOpen(false);
    setCurrentPosition(null);
  };
  
  return (
    <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
      <DialogContent className="sm:max-w-[320px]">
        <DialogHeader>
          <DialogTitle className="text-sm">編輯職位</DialogTitle>
          <DialogDescription className="text-xs">
            修改職位資訊
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-2 py-2">
          <div className="grid grid-cols-4 items-center gap-2">
            <Label htmlFor="edit-name" className="text-right text-xs">
              名稱 <span className="text-red-500">*</span>
            </Label>
            <Input
              id="edit-name"
              value={currentPosition.name}
              onChange={(e) => setCurrentPosition({...currentPosition, name: e.target.value})}
              className="col-span-3 h-6 text-xs"
              placeholder="請輸入職位名稱"
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-2">
            <Label htmlFor="edit-level" className="text-right text-xs">
              職級 <span className="text-red-500">*</span>
            </Label>
            <Input
              id="edit-level"
              type="number"
              min="1"
              max="10"
              value={currentPosition.level}
              onChange={(e) => setCurrentPosition({...currentPosition, level: parseInt(e.target.value) || 1})}
              className="col-span-3 h-6 text-xs"
              placeholder="1-10"
            />
          </div>
          
          <div className="grid grid-cols-4 items-start gap-2">
            <Label htmlFor="edit-description" className="text-right text-xs pt-1">
              說明
            </Label>
            <Textarea
              id="edit-description"
              value={currentPosition.description || ''}
              onChange={(e) => setCurrentPosition({...currentPosition, description: e.target.value})}
              className="col-span-3 text-xs min-h-[60px]"
              placeholder="請輸入職位說明"
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

export default EditPositionDialog;
