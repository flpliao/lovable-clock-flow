import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
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
    handleEditPosition,
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
      <DialogContent className="sm:max-w-[500px] bg-white/95 backdrop-blur-xl border border-white/40">
        <DialogHeader>
          <DialogTitle className="text-gray-900 text-lg font-semibold">編輯職位</DialogTitle>
          <DialogDescription className="text-gray-600">修改職位資訊與設定</DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="edit-name" className="text-right text-gray-900 font-medium">
              名稱 <span className="text-red-500">*</span>
            </Label>
            <Input
              id="edit-name"
              value={currentPosition.name}
              onChange={e => setCurrentPosition({ ...currentPosition, name: e.target.value })}
              className="col-span-3 bg-white/60 border-white/40 text-gray-900"
              placeholder="請輸入職位名稱"
            />
          </div>

          <div className="grid grid-cols-4 items-start gap-4">
            <Label htmlFor="edit-description" className="text-right text-gray-900 font-medium pt-2">
              說明
            </Label>
            <Textarea
              id="edit-description"
              value={currentPosition.description || ''}
              onChange={e =>
                setCurrentPosition({ ...currentPosition, description: e.target.value })
              }
              className="col-span-3 bg-white/60 border-white/40 text-gray-900 min-h-[80px]"
              placeholder="請輸入職位說明"
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={handleCancel}
            className="bg-white/60 border-white/40 text-gray-900 hover:bg-white/70"
          >
            取消
          </Button>
          <Button onClick={handleSave} className="bg-blue-500 hover:bg-blue-600 text-white">
            儲存
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditPositionDialog;
