
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
        <Button className="bg-teal-500 hover:bg-teal-600 text-white font-semibold px-4 py-2 rounded-lg shadow-md transition-colors">
          <Plus className="h-4 w-4 mr-2" /> 新增職位
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] bg-white/95 backdrop-blur-xl border border-white/40">
        <DialogHeader>
          <DialogTitle className="text-gray-900 text-lg font-semibold">新增職位</DialogTitle>
          <DialogDescription className="text-gray-600">
            新增職位至系統，建立組織職級架構
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right text-gray-900 font-medium">
              名稱 <span className="text-red-500">*</span>
            </Label>
            <Input
              id="name"
              value={newPosition.name}
              onChange={(e) => setNewPosition({...newPosition, name: e.target.value})}
              className="col-span-3 bg-white/60 border-white/40 text-gray-900"
              placeholder="請輸入職位名稱"
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="level" className="text-right text-gray-900 font-medium">
              職級 <span className="text-red-500">*</span>
            </Label>
            <Input
              id="level"
              type="number"
              min="1"
              max="10"
              value={newPosition.level}
              onChange={(e) => setNewPosition({...newPosition, level: parseInt(e.target.value) || 1})}
              className="col-span-3 bg-white/60 border-white/40 text-gray-900"
              placeholder="1-10"
            />
          </div>
          
          <div className="grid grid-cols-4 items-start gap-4">
            <Label htmlFor="description" className="text-right text-gray-900 font-medium pt-2">
              說明
            </Label>
            <Textarea
              id="description"
              value={newPosition.description || ''}
              onChange={(e) => setNewPosition({...newPosition, description: e.target.value})}
              className="col-span-3 bg-white/60 border-white/40 text-gray-900 min-h-[80px]"
              placeholder="請輸入職位說明"
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => setIsAddDialogOpen(false)} 
            className="bg-white/60 border-white/40 text-gray-900 hover:bg-white/70"
          >
            取消
          </Button>
          <Button 
            onClick={handleSave} 
            className="bg-teal-500 hover:bg-teal-600 text-white"
          >
            新增
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddPositionDialog;
