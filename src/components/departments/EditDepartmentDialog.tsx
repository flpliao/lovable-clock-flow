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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { Building, ExternalLink, MapPin, Phone, User } from 'lucide-react';
import DepartmentGPSConverter from './DepartmentGPSConverter';
import DepartmentGPSStatus from './DepartmentGPSStatus';
import { useDepartmentManagementContext } from './DepartmentManagementContext';

const EditDepartmentDialog = () => {
  const {
    isEditDialogOpen,
    setIsEditDialogOpen,
    currentDepartment,
    setCurrentDepartment,
    handleEditDepartment,
  } = useDepartmentManagementContext();

  if (!currentDepartment) return null;

  const handleSave = async () => {
    console.log('💾 開始儲存部門編輯:', currentDepartment);

    // 驗證必填欄位
    if (!currentDepartment.name.trim()) {
      toast({
        title: '驗證錯誤',
        description: '部門名稱為必填欄位',
        variant: 'destructive',
      });
      return;
    }

    if (!currentDepartment.type) {
      toast({
        title: '驗證錯誤',
        description: '部門類型為必填欄位',
        variant: 'destructive',
      });
      return;
    }

    try {
      console.log('🔄 呼叫 handleEditDepartment...');
      const success = await handleEditDepartment();
      if (success) {
        console.log('✅ 編輯完成，準備關閉對話框');
        setIsEditDialogOpen(false);
        setCurrentDepartment(null);
      }
    } catch (error) {
      console.error('💥 編輯部門失敗:', error);
      toast({
        title: '編輯失敗',
        description: '無法更新部門資料，請稍後再試',
        variant: 'destructive',
      });
    }
  };

  const handleCancel = () => {
    console.log('❌ 取消編輯部門');
    setIsEditDialogOpen(false);
    setCurrentDepartment(null);
  };

  // 開啟 Google Maps 查看位置
  const handleOpenGoogleMaps = () => {
    if (currentDepartment.latitude && currentDepartment.longitude) {
      const googleMapsUrl = `https://www.google.com/maps?q=${currentDepartment.latitude},${currentDepartment.longitude}`;
      window.open(googleMapsUrl, '_blank');
    } else if (currentDepartment.location) {
      const encodedAddress = encodeURIComponent(currentDepartment.location);
      const googleMapsUrl = `https://www.google.com/maps/search/${encodedAddress}`;
      window.open(googleMapsUrl, '_blank');
    }
  };

  return (
    <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg">編輯部門</DialogTitle>
          <DialogDescription className="text-sm">修改部門資訊</DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* 基本資訊區塊 - 重新設計 */}
          <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
            <div className="flex items-center gap-2 mb-4">
              <Building className="h-4 w-4 text-slate-600" />
              <h3 className="text-sm font-semibold text-slate-900">基本資訊</h3>
            </div>

            <div className="space-y-4">
              {/* 第一行：部門名稱和類型 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-name" className="text-sm font-medium text-slate-700">
                    部門名稱 <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="edit-name"
                    value={currentDepartment.name}
                    onChange={e =>
                      setCurrentDepartment({ ...currentDepartment, name: e.target.value })
                    }
                    className="text-sm"
                    placeholder="請輸入部門名稱"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-type" className="text-sm font-medium text-slate-700">
                    部門類型 <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={currentDepartment.type}
                    onValueChange={(value: 'headquarters' | 'branch' | 'store') =>
                      setCurrentDepartment({ ...currentDepartment, type: value })
                    }
                  >
                    <SelectTrigger className="text-sm" id="edit-type">
                      <SelectValue placeholder="選擇類型" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="headquarters" className="text-sm">
                        總部
                      </SelectItem>
                      <SelectItem value="branch" className="text-sm">
                        分部
                      </SelectItem>
                      <SelectItem value="store" className="text-sm">
                        門市
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* 第二行：地點 */}
              <div className="space-y-2">
                <Label
                  htmlFor="edit-location"
                  className="text-sm font-medium text-slate-700 flex items-center gap-1"
                >
                  <MapPin className="h-3 w-3" />
                  部門地點
                </Label>
                <Input
                  id="edit-location"
                  value={currentDepartment.location || ''}
                  onChange={e =>
                    setCurrentDepartment({ ...currentDepartment, location: e.target.value })
                  }
                  className="text-sm"
                  placeholder="請輸入完整地址"
                />
              </div>

              {/* 第三行：單位主管和聯絡方式 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label
                    htmlFor="edit-manager_name"
                    className="text-sm font-medium text-slate-700 flex items-center gap-1"
                  >
                    <User className="h-3 w-3" />
                    單位主管
                  </Label>
                  <Input
                    id="edit-manager_name"
                    value={currentDepartment.manager_name || ''}
                    onChange={e =>
                      setCurrentDepartment({ ...currentDepartment, manager_name: e.target.value })
                    }
                    className="text-sm"
                    placeholder="請輸入單位主管姓名"
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="edit-manager_contact"
                    className="text-sm font-medium text-slate-700 flex items-center gap-1"
                  >
                    <Phone className="h-3 w-3" />
                    聯絡方式
                  </Label>
                  <Input
                    id="edit-manager_contact"
                    value={currentDepartment.manager_contact || ''}
                    onChange={e =>
                      setCurrentDepartment({
                        ...currentDepartment,
                        manager_contact: e.target.value,
                      })
                    }
                    className="text-sm"
                    placeholder="請輸入聯絡方式"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* GPS 位置資訊區塊 */}
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <div className="flex items-center gap-2 mb-3">
              <MapPin className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-semibold text-blue-900">GPS 位置資訊</span>
            </div>

            {/* GPS 狀態顯示 */}
            <div className="mb-3">
              <DepartmentGPSStatus department={currentDepartment} />
            </div>

            {/* GPS 座標資訊 */}
            {currentDepartment.latitude && currentDepartment.longitude ? (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-3">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium text-green-800 mb-1">GPS 座標已設定</div>
                    <div className="text-xs text-green-700">
                      緯度: {currentDepartment.latitude.toFixed(6)}
                    </div>
                    <div className="text-xs text-green-700">
                      經度: {currentDepartment.longitude.toFixed(6)}
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleOpenGoogleMaps}
                    className="text-xs"
                  >
                    <ExternalLink className="h-3 w-3 mr-1" />
                    查看地圖
                  </Button>
                </div>
              </div>
            ) : (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-3">
                <div className="text-sm font-medium text-yellow-800 mb-1">尚未設定 GPS 座標</div>
                <div className="text-xs text-yellow-700">員工將無法使用位置打卡功能</div>
              </div>
            )}

            {/* GPS 轉換功能 */}
            <DepartmentGPSConverter department={currentDepartment} />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleCancel} className="text-sm">
            取消
          </Button>
          <Button onClick={handleSave} className="text-sm">
            儲存
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditDepartmentDialog;
