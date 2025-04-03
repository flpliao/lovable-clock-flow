
import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { PlusCircle, Edit2, Trash2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

// 模擬的員工資料
const mockStaffList = [
  { id: '1', name: '王小明', position: '主管', department: '人資部', contact: '0912-345-678' },
  { id: '2', name: '李小華', position: '工程師', department: '技術部', contact: '0923-456-789' },
  { id: '3', name: '張小美', position: '設計師', department: '設計部', contact: '0934-567-890' },
  { id: '4', name: '廖俊雄', position: '資深工程師', department: '技術部', contact: '0945-678-901' },
];

const departments = ['人資部', '技術部', '設計部', '行銷部', '客服部'];
const positions = ['主管', '工程師', '設計師', '專員', '資深工程師', '行銷專員', '客服專員'];

const StaffManagement = () => {
  const [staffList, setStaffList] = useState(mockStaffList);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [currentStaff, setCurrentStaff] = useState<any>(null);
  const [newStaff, setNewStaff] = useState({
    name: '',
    position: '',
    department: '',
    contact: ''
  });
  const { toast } = useToast();

  const handleAddStaff = () => {
    if (!newStaff.name || !newStaff.position || !newStaff.department) {
      toast({
        title: "資料不完整",
        description: "請填寫所有必填欄位",
        variant: "destructive"
      });
      return;
    }

    const staffToAdd = {
      id: `${staffList.length + 1}`,
      ...newStaff
    };

    setStaffList([...staffList, staffToAdd]);
    setNewStaff({
      name: '',
      position: '',
      department: '',
      contact: ''
    });
    setIsAddDialogOpen(false);
    
    toast({
      title: "新增成功",
      description: `已成功新增 ${staffToAdd.name} 至人員列表`
    });
  };

  const handleEditStaff = () => {
    if (!currentStaff.name || !currentStaff.position || !currentStaff.department) {
      toast({
        title: "資料不完整",
        description: "請填寫所有必填欄位",
        variant: "destructive"
      });
      return;
    }

    setStaffList(staffList.map(staff => 
      staff.id === currentStaff.id ? currentStaff : staff
    ));
    setIsEditDialogOpen(false);
    
    toast({
      title: "編輯成功",
      description: `已成功更新 ${currentStaff.name} 的資料`
    });
  };

  const handleDeleteStaff = (id: string) => {
    setStaffList(staffList.filter(staff => staff.id !== id));
    
    toast({
      title: "刪除成功",
      description: "已成功從人員列表中移除該員工"
    });
  };

  const openEditDialog = (staff: any) => {
    setCurrentStaff({...staff});
    setIsEditDialogOpen(true);
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>人員管理</CardTitle>
            <CardDescription>管理排班系統中的員工資料</CardDescription>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                新增人員
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>新增人員</DialogTitle>
                <DialogDescription>
                  請填寫新員工的資料，帶 * 的欄位為必填。
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    姓名 *
                  </Label>
                  <Input
                    id="name"
                    value={newStaff.name}
                    onChange={(e) => setNewStaff({...newStaff, name: e.target.value})}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="position" className="text-right">
                    職位 *
                  </Label>
                  <Select 
                    onValueChange={(value) => setNewStaff({...newStaff, position: value})}
                    value={newStaff.position}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="選擇職位" />
                    </SelectTrigger>
                    <SelectContent>
                      {positions.map((pos) => (
                        <SelectItem key={pos} value={pos}>{pos}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="department" className="text-right">
                    部門 *
                  </Label>
                  <Select 
                    onValueChange={(value) => setNewStaff({...newStaff, department: value})}
                    value={newStaff.department}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="選擇部門" />
                    </SelectTrigger>
                    <SelectContent>
                      {departments.map((dep) => (
                        <SelectItem key={dep} value={dep}>{dep}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="contact" className="text-right">
                    聯絡電話
                  </Label>
                  <Input
                    id="contact"
                    value={newStaff.contact}
                    onChange={(e) => setNewStaff({...newStaff, contact: e.target.value})}
                    className="col-span-3"
                    placeholder="例：0912-345-678"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>取消</Button>
                <Button onClick={handleAddStaff}>新增</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>姓名</TableHead>
                <TableHead>職位</TableHead>
                <TableHead>部門</TableHead>
                <TableHead>聯絡電話</TableHead>
                <TableHead className="text-right">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {staffList.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center">
                    目前沒有人員資料
                  </TableCell>
                </TableRow>
              ) : (
                staffList.map((staff) => (
                  <TableRow key={staff.id}>
                    <TableCell className="font-medium">{staff.name}</TableCell>
                    <TableCell>{staff.position}</TableCell>
                    <TableCell>{staff.department}</TableCell>
                    <TableCell>{staff.contact || '未設定'}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openEditDialog(staff)}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteStaff(staff.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* 編輯人員對話框 */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>編輯人員資料</DialogTitle>
            <DialogDescription>
              修改員工的資料，帶 * 的欄位為必填。
            </DialogDescription>
          </DialogHeader>
          {currentStaff && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-name" className="text-right">
                  姓名 *
                </Label>
                <Input
                  id="edit-name"
                  value={currentStaff.name}
                  onChange={(e) => setCurrentStaff({...currentStaff, name: e.target.value})}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-position" className="text-right">
                  職位 *
                </Label>
                <Select 
                  onValueChange={(value) => setCurrentStaff({...currentStaff, position: value})}
                  value={currentStaff.position}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="選擇職位" />
                  </SelectTrigger>
                  <SelectContent>
                    {positions.map((pos) => (
                      <SelectItem key={pos} value={pos}>{pos}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-department" className="text-right">
                  部門 *
                </Label>
                <Select 
                  onValueChange={(value) => setCurrentStaff({...currentStaff, department: value})}
                  value={currentStaff.department}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="選擇部門" />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map((dep) => (
                      <SelectItem key={dep} value={dep}>{dep}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-contact" className="text-right">
                  聯絡電話
                </Label>
                <Input
                  id="edit-contact"
                  value={currentStaff.contact}
                  onChange={(e) => setCurrentStaff({...currentStaff, contact: e.target.value})}
                  className="col-span-3"
                  placeholder="例：0912-345-678"
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>取消</Button>
            <Button onClick={handleEditStaff}>儲存</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default StaffManagement;
