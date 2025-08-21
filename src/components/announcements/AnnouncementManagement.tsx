import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { permissionService } from '@/services/simplifiedPermissionService';
import { useSupabaseAnnouncements } from '@/hooks/useSupabaseAnnouncements';
import { CompanyAnnouncement } from '@/types/announcement';
import { Plus } from 'lucide-react';
import React, { useState } from 'react';
import AnnouncementDetail from './AnnouncementDetail';
import AnnouncementForm from './AnnouncementForm';
import AnnouncementListView from './AnnouncementListView';
import AnnouncementSearchFilter from './AnnouncementSearchFilter';

const AnnouncementManagement: React.FC = () => {
  const { toast } = useToast();
  const { announcements, loading, createAnnouncement, updateAnnouncement, deleteAnnouncement } =
    useSupabaseAnnouncements(true); // 載入所有公告，包括已停用的

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<CompanyAnnouncement | null>(
    null
  );
  const [viewAnnouncement, setViewAnnouncement] = useState<CompanyAnnouncement | null>(null);

  const categories = ['HR', 'Administration', 'Meeting', 'Official', 'General'];

  // 檢查公告管理權限 - 使用 SimplifiedPermissionService
  const canCreateAnnouncement = permissionService.hasPermission('announcement:create');
  const canEditAnnouncement = permissionService.hasPermission('announcement:edit');
  const canDeleteAnnouncement = permissionService.hasPermission('announcement:delete');

  // 過濾公告
  const filteredAnnouncements = announcements.filter(announcement => {
    const matchesSearch =
      !searchQuery ||
      announcement.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      announcement.content.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === 'all' || announcement.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  // 處理保存公告
  const handleSaveAnnouncement = async (
    data:
      | CompanyAnnouncement
      | Omit<CompanyAnnouncement, 'id' | 'created_at' | 'created_by' | 'company_id'>
  ): Promise<boolean> => {
    try {
      console.log('handleSaveAnnouncement called with:', data);

      if ('id' in data) {
        // 更新現有公告
        console.log('Updating announcement with ID:', data.id);
        const success = await updateAnnouncement(data.id, data);
        if (success) {
          setIsFormOpen(false);
          setSelectedAnnouncement(null);
          return true;
        }
        return false;
      } else {
        // 新增公告
        console.log('Creating new announcement');
        const success = await createAnnouncement(data);
        if (success) {
          setIsFormOpen(false);
          return true;
        }
        return false;
      }
    } catch (error) {
      console.error('Error in handleSaveAnnouncement:', error);
      toast({
        title: '錯誤',
        description: '儲存公告時發生錯誤',
        variant: 'destructive',
      });
      return false;
    }
  };

  const handleViewAnnouncement = (announcement: CompanyAnnouncement) => {
    setViewAnnouncement(announcement);
  };

  const handleEditAnnouncement = (announcement: CompanyAnnouncement) => {
    // 動態檢查編輯權限
    if (!permissionService.hasPermission('announcement:edit')) {
      toast({
        title: '權限不足',
        description: '您沒有編輯公告的權限',
        variant: 'destructive',
      });
      return;
    }
    setSelectedAnnouncement(announcement);
    setIsFormOpen(true);
  };

  const handleDeleteAnnouncement = async (announcementId: string) => {
    // 動態檢查刪除權限
    if (!permissionService.hasPermission('announcement:delete')) {
      toast({
        title: '權限不足',
        description: '您沒有刪除公告的權限',
        variant: 'destructive',
      });
      return;
    }

    try {
      const success = await deleteAnnouncement(announcementId);
      if (success) {
        toast({
          title: '刪除成功',
          description: '公告已成功刪除',
        });
      } else {
        toast({
          title: '刪除失敗',
          description: '無法刪除公告，請重試',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error deleting announcement:', error);
      toast({
        title: '刪除失敗',
        description: '刪除公告時發生錯誤',
        variant: 'destructive',
      });
    }
  };

  if (!canCreateAnnouncement) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold mb-2 text-white">無權限訪問</h2>
        <p className="text-white/70 font-medium drop-shadow-md">您沒有權限管理公司公告</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="text-center py-12">
        <p className="text-white/70 font-medium drop-shadow-md">載入中...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 標題和新增按鈕區域 */}
      <div className="flex flex-col space-y-3 sm:flex-row sm:justify-between sm:items-center sm:space-y-0">
        <h2 className="text-xl sm:text-2xl font-bold text-white drop-shadow-md">公告列表</h2>
        {canCreateAnnouncement && (
          <Button
            onClick={() => {
              setSelectedAnnouncement(null);
              setIsFormOpen(true);
            }}
            className="w-full sm:w-auto h-12 sm:h-10 text-base sm:text-sm backdrop-blur-xl bg-white/30 border-white/40 text-white font-semibold shadow-lg hover:bg-white/50 transition-all duration-300 rounded-xl"
          >
            <Plus className="h-4 w-4 mr-2 drop-shadow-md" />
            新增公告
          </Button>
        )}
      </div>

      {/* 搜尋和篩選區域 */}
      <AnnouncementSearchFilter
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        categories={categories}
      />

      {/* 公告顯示區域 */}
      <AnnouncementListView
        announcements={filteredAnnouncements}
        onView={handleViewAnnouncement}
        onEdit={canEditAnnouncement ? handleEditAnnouncement : undefined}
        onDelete={canDeleteAnnouncement ? handleDeleteAnnouncement : undefined}
      />

      {/* Create/Edit Form */}
      <AnnouncementForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setSelectedAnnouncement(null);
        }}
        announcement={selectedAnnouncement || undefined}
        onSave={handleSaveAnnouncement}
      />

      {/* View Announcement Detail */}
      <AnnouncementDetail
        announcement={viewAnnouncement}
        isOpen={!!viewAnnouncement}
        onClose={() => setViewAnnouncement(null)}
      />
    </div>
  );
};

export default AnnouncementManagement;
