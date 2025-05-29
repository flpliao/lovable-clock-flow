
import { useToast } from '@/hooks/use-toast';
import { useUser } from '@/contexts/UserContext';
import { supabase } from '@/integrations/supabase/client';
import { Staff, NewStaff } from '../types';

export const useStaffCrudOperations = (
  staffList: Staff[],
  setStaffList: (staffList: Staff[]) => void
) => {
  const { toast } = useToast();
  const { isAdmin, currentUser } = useUser();

  // 新增員工
  const addStaff = async (newStaff: NewStaff) => {
    if (!isAdmin()) {
      toast({
        title: "權限不足",
        description: "只有管理員可以新增員工",
        variant: "destructive"
      });
      return false;
    }

    if (!currentUser?.id) {
      toast({
        title: "未登入",
        description: "請先登入後再操作",
        variant: "destructive"
      });
      return false;
    }

    if (!newStaff.name || !newStaff.position || !newStaff.department || !newStaff.contact || !newStaff.branch_id) {
      toast({
        title: "資料不完整",
        description: "請填寫員工基本資料包含營業處",
        variant: "destructive"
      });
      return false;
    }

    try {
      // 確保所有必填欄位都有值
      const staffData = {
        name: newStaff.name,
        position: newStaff.position,
        department: newStaff.department,
        branch_id: newStaff.branch_id,
        branch_name: newStaff.branch_name,
        contact: newStaff.contact,
        role: newStaff.role || 'user',
        role_id: newStaff.role_id || 'user',
        supervisor_id: newStaff.supervisor_id || null,
        username: newStaff.username || null,
        email: newStaff.email || null
      };

      const { data, error } = await supabase
        .from('staff')
        .insert(staffData)
        .select()
        .single();

      if (error) {
        if (error.message.includes('PGRST301') || error.message.includes('policy')) {
          throw new Error('權限不足，只有管理員可以新增員工');
        }
        throw error;
      }

      setStaffList([...staffList, data]);
      toast({
        title: "新增成功",
        description: `已成功新增員工「${data.name}」`
      });
      return true;
    } catch (error) {
      console.error('新增員工失敗:', error);
      
      let errorMessage = "無法新增員工";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      toast({
        title: "新增失敗",
        description: errorMessage,
        variant: "destructive"
      });
      return false;
    }
  };

  // 更新員工
  const updateStaff = async (updatedStaff: Staff) => {
    if (!isAdmin()) {
      toast({
        title: "權限不足",
        description: "只有管理員可以編輯員工資料",
        variant: "destructive"
      });
      return false;
    }

    if (!currentUser?.id) {
      toast({
        title: "未登入",
        description: "請先登入後再操作",
        variant: "destructive"
      });
      return false;
    }

    // 驗證必填欄位
    if (!updatedStaff.name || !updatedStaff.position || !updatedStaff.department || !updatedStaff.contact) {
      toast({
        title: "資料不完整",
        description: "請填寫所有必要的員工資料",
        variant: "destructive"
      });
      return false;
    }

    // 如果沒有營業處ID，使用預設值
    if (!updatedStaff.branch_id) {
      toast({
        title: "營業處資料錯誤",
        description: "請選擇員工所屬的營業處",
        variant: "destructive"
      });
      return false;
    }

    try {
      console.log('正在更新員工資料:', updatedStaff);

      // 準備更新資料，只包含可更新的欄位
      const updateData = {
        name: updatedStaff.name.trim(),
        position: updatedStaff.position,
        department: updatedStaff.department,
        branch_id: updatedStaff.branch_id,
        branch_name: updatedStaff.branch_name || '',
        contact: updatedStaff.contact.trim(),
        role: updatedStaff.role || 'user',
        role_id: updatedStaff.role_id || 'user',
        supervisor_id: updatedStaff.supervisor_id || null,
        username: updatedStaff.username || null,
        email: updatedStaff.email || null,
        updated_at: new Date().toISOString()
      };

      console.log('準備更新的資料:', updateData);

      const { data, error } = await supabase
        .from('staff')
        .update(updateData)
        .eq('id', updatedStaff.id)
        .select()
        .single();

      if (error) {
        console.error('Supabase 更新錯誤:', error);
        if (error.message.includes('PGRST301') || error.message.includes('policy')) {
          throw new Error('權限不足，只有管理員可以更新員工資料');
        }
        throw error;
      }

      console.log('更新成功的資料:', data);

      // 更新本地狀態
      setStaffList(
        staffList.map(staff => 
          staff.id === updatedStaff.id ? data : staff
        )
      );
      
      toast({
        title: "編輯成功",
        description: `已成功更新員工「${data.name}」的資料`
      });
      return true;
    } catch (error) {
      console.error('更新員工失敗:', error);
      
      // 提供更詳細的錯誤訊息
      let errorMessage = "無法更新員工資料";
      if (error instanceof Error) {
        if (error.message.includes('duplicate key')) {
          errorMessage = "員工資料重複，請檢查姓名或聯絡資訊";
        } else if (error.message.includes('foreign key')) {
          errorMessage = "營業處資料錯誤，請重新選擇營業處";
        } else if (error.message.includes('not null')) {
          errorMessage = "必填欄位不能為空";
        } else {
          errorMessage = error.message;
        }
      }
      
      toast({
        title: "更新失敗",
        description: errorMessage,
        variant: "destructive"
      });
      return false;
    }
  };

  // 刪除員工
  const deleteStaff = async (id: string) => {
    if (!isAdmin()) {
      toast({
        title: "權限不足",
        description: "只有管理員可以刪除員工",
        variant: "destructive"
      });
      return false;
    }

    if (!currentUser?.id) {
      toast({
        title: "未登入",
        description: "請先登入後再操作",
        variant: "destructive"
      });
      return false;
    }

    try {
      const { error } = await supabase
        .from('staff')
        .delete()
        .eq('id', id);

      if (error) {
        if (error.message.includes('PGRST301') || error.message.includes('policy')) {
          throw new Error('權限不足，只有管理員可以刪除員工');
        }
        throw error;
      }

      setStaffList(staffList.filter(staff => staff.id !== id));
      toast({
        title: "刪除成功",
        description: "已成功刪除該員工"
      });
      return true;
    } catch (error) {
      console.error('刪除員工失敗:', error);
      
      let errorMessage = "無法刪除員工";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      toast({
        title: "刪除失敗",
        description: errorMessage,
        variant: "destructive"
      });
      return false;
    }
  };

  return {
    addStaff,
    updateStaff,
    deleteStaff
  };
};
