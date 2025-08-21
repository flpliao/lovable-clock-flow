import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { companyService } from '@/services/companyService';
import { useCompanyStore } from '@/stores/companyStore';
import { Edit } from 'lucide-react';
import { FormEvent, useEffect, useState } from 'react';

interface EditCompanyDialogProps {
  open: boolean;
  onClose: () => void;
}

const EditCompanyDialog = ({ open, onClose }: EditCompanyDialogProps) => {
  const { toast } = useToast();
  const { company, setCompany } = useCompanyStore();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    registration_number: '',
    legal_representative: '',
    business_type: '',
    address: '',
    phone: '',
    email: '',
    website: '',
    established_date: '',
    capital: '',
  });

  useEffect(() => {
    if (company) {
      setFormData({
        name: company.name || '',
        registration_number: company.registration_number || '',
        legal_representative: company.legal_representative || '',
        business_type: company.business_type || '',
        address: company.address || '',
        phone: company.phone || '',
        email: company.email || '',
        website: company.website || '',
        established_date: company.established_date || '',
        capital: company.capital?.toString() || '',
      });
    }
  }, [company]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.registration_number) {
      toast({
        title: '請填寫必要資訊',
        description: '公司名稱和統一編號為必填欄位',
        variant: 'destructive',
      });
      return;
    }

    if (!company) {
      toast({
        title: '錯誤',
        description: '找不到要編輯的公司',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const updatedCompany = {
        ...company,
        ...formData,
        capital: formData.capital ? Number(formData.capital) : null,
      };

      const data = await companyService.updateCompany(company.id, updatedCompany);
      if (data) {
        setCompany(data);
        toast({
          title: '更新成功',
          description: `公司 ${formData.name} 已成功更新`,
        });
        onClose();
      } else {
        throw new Error('更新失敗');
      }
    } catch (error) {
      toast({
        title: '更新失敗',
        description: error instanceof Error ? error.message : '更新公司時發生錯誤',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData({
      ...formData,
      [field]: value,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Edit className="h-5 w-5" />
            編輯公司資料
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">公司名稱 *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={e => handleInputChange('name', e.target.value)}
                placeholder="請輸入公司名稱"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="registration_number">統一編號 *</Label>
              <Input
                id="registration_number"
                value={formData.registration_number}
                onChange={e => handleInputChange('registration_number', e.target.value)}
                placeholder="請輸入統一編號"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="legal_representative">單位主管</Label>
              <Input
                id="legal_representative"
                value={formData.legal_representative}
                onChange={e => handleInputChange('legal_representative', e.target.value)}
                placeholder="請輸入單位主管"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="business_type">營業類型</Label>
              <Input
                id="business_type"
                value={formData.business_type}
                onChange={e => handleInputChange('business_type', e.target.value)}
                placeholder="請輸入營業類型"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">地址</Label>
            <Input
              id="address"
              value={formData.address}
              onChange={e => handleInputChange('address', e.target.value)}
              placeholder="請輸入地址"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone">電話</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={e => handleInputChange('phone', e.target.value)}
                placeholder="請輸入電話"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">電子信箱</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={e => handleInputChange('email', e.target.value)}
                placeholder="請輸入電子信箱"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="website">網站</Label>
              <Input
                id="website"
                value={formData.website}
                onChange={e => handleInputChange('website', e.target.value)}
                placeholder="請輸入網站"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="established_date">成立日期</Label>
              <Input
                id="established_date"
                type="date"
                value={formData.established_date}
                onChange={e => handleInputChange('established_date', e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="capital">資本額</Label>
            <Input
              id="capital"
              type="number"
              value={formData.capital}
              onChange={e => handleInputChange('capital', e.target.value)}
              placeholder="請輸入資本額"
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
              取消
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? '更新中...' : '更新'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditCompanyDialog;
