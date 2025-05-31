
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Plus } from 'lucide-react';
import { usePositionManagementContext } from './PositionManagementContext';
import { useUser } from '@/contexts/UserContext';

const AddPositionDialog = () => {
  const { 
    isAddDialogOpen, 
    setIsAddDialogOpen, 
    newPosition, 
    setNewPosition, 
    handleAddPosition
  } = usePositionManagementContext();
  
  const { isAdmin } = useUser();
  
  if (!isAdmin()) return null;

  const handleSave = async () => {
    const success = await handleAddPosition();
    // Dialog will be closed automatically if successful
  };
  
  return (
    <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="h-7 px-2 text-xs">
          <Plus className="h-3 w-3 mr-1" /> 新增職位
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[320px]">
        <DialogHeader>
          <DialogTitle className="text-sm">新增職位</DialogTitle>
          <DialogDescription className="text-xs">
            新增職位至系統
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-2 py-2">
          <div className="grid grid-cols-4 items-center gap-2">
            <Label htmlFor="name" className="text-right text-xs">
              名稱 <span className="text-red-500">*</span>
            </Label>
            <Input
              id="name"
              value={newPosition.name}
              onChange={(e) => setNewPosition({...newPosition, name: e.target.value})}
              className="col-span-3 h-6 text-xs"
              placeholder="請輸入職位名稱"
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-2">
            <Label htmlFor="level" className="text-right text-xs">
              職級 <span className="text-red-500">*</span>
            </Label>
            <Input
              id="level"
              type="number"
              min="1"
              max="10"
              value={newPosition.level}
              onChange={(e) => setNewPosition({...newPosition, level: parseInt(e.target.value) || 1})}
              className="col-span-3 h-6 text-xs"
              placeholder="1-10"
            />
          </div>
          
          <div className="grid grid-cols-4 items-start gap-2">
            <Label htmlFor="description" className="text-right text-xs pt-1">
              說明
            </Label>
            <Textarea
              id="description"
              value={newPosition.description || ''}
              onChange={(e) => setNewPosition({...newPosition, description: e.target.value})}
              className="col-span-3 text-xs min-h-[60px]"
              placeholder="請輸入職位說明"
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsAddDialogOpen(false)} className="h-6 text-xs">
            取消
          </Button>
          <Button onClick={handleSave} className="h-6 text-xs">
            新增
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddPositionDialog;
