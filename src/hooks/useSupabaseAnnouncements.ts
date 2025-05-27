
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useUser } from '@/contexts/UserContext';
import { CompanyAnnouncement } from '@/types/announcement';
import { 
  getActiveAnnouncements, 
  addAnnouncement,
  updateAnnouncement,
  deleteAnnouncement
} from '@/utils/announcementUtils';

export const useSupabaseAnnouncements = () => {
  const [announcements, setAnnouncements] = useState<CompanyAnnouncement[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { currentUser, isAdmin } = useUser();

  // 載入公告 - Using mock data system
  const loadAnnouncements = async () => {
    try {
      console.log('Loading announcements from mock data');
      const mockAnnouncements = getActiveAnnouncements();
      setAnnouncements(mockAnnouncements);
    } catch (error) {
      console.error('載入公告失敗:', error);
      toast({
        title: "載入失敗",
        description: "無法載入公告資料",
        variant: "destructive"
      });
      setAnnouncements([]);
    }
  };

  // 建立公告 - Using mock data system
  const createAnnouncement = async (newAnnouncement: Omit<CompanyAnnouncement, 'id' | 'created_at' | 'created_by' | 'company_id'>) => {
    if (!isAdmin()) {
      toast({
        title: "權限不足",
        description: "只有管理員可以建立公告",
        variant: "destructive"
      });
      return false;
    }

    if (!currentUser) {
      toast({
        title: "錯誤",
        description: "請先登入",
        variant: "destructive"
      });
      return false;
    }

    try {
      const announcementData = {
        ...newAnnouncement,
        created_at: new Date().toISOString(),
        created_by: {
          id: currentUser.id,
          name: currentUser.name
        },
        company_id: '550e8400-e29b-41d4-a716-446655440000'
      };

      addAnnouncement(announcementData);
      await loadAnnouncements();
      
      toast({
        title: "建立成功",
        description: "公告已成功發佈",
      });
      
      return true;
    } catch (error) {
      console.error('建立公告失敗:', error);
      toast({
        title: "建立失敗",
        description: "無法建立公告",
        variant: "destructive"
      });
      return false;
    }
  };

  // 更新公告 - Using mock data system
  const updateAnnouncementData = async (id: string, updatedAnnouncement: Partial<CompanyAnnouncement>) => {
    if (!isAdmin()) {
      toast({
        title: "權限不足",
        description: "只有管理員可以編輯公告",
        variant: "destructive"
      });
      return false;
    }

    try {
      const existingAnnouncement = announcements.find(a => a.id === id);
      if (!existingAnnouncement) {
        throw new Error('公告不存在');
      }

      const updated = {
        ...existingAnnouncement,
        ...updatedAnnouncement
      };

      updateAnnouncement(updated);
      await loadAnnouncements();
      
      toast({
        title: "更新成功",
        description: "公告已成功更新",
      });
      
      return true;
    } catch (error) {
      console.error('更新公告失敗:', error);
      toast({
        title: "更新失敗",
        description: "無法更新公告",
        variant: "destructive"
      });
      return false;
    }
  };

  // 刪除公告 - Using mock data system
  const deleteAnnouncementData = async (id: string) => {
    if (!isAdmin()) {
      toast({
        title: "權限不足",
        description: "只有管理員可以刪除公告",
        variant: "destructive"
      });
      return false;
    }

    try {
      const result = deleteAnnouncement(id);
      if (!result) {
        throw new Error('刪除失敗');
      }

      await loadAnnouncements();
      
      toast({
        title: "刪除成功",
        description: "公告已成功刪除",
      });
      
      return true;
    } catch (error) {
      console.error('刪除公告失敗:', error);
      toast({
        title: "刪除失敗",
        description: "無法刪除公告",
        variant: "destructive"
      });
      return false;
    }
  };

  // 初始載入
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await loadAnnouncements();
      setLoading(false);
    };
    loadData();
  }, []);

  return {
    announcements,
    loading,
    createAnnouncement,
    updateAnnouncement: updateAnnouncementData,
    deleteAnnouncement: deleteAnnouncementData,
    refreshData: loadAnnouncements
  };
};
