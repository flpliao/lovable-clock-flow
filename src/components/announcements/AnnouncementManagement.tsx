
import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { CompanyAnnouncement } from '@/types/announcement';
import { useSupabaseAnnouncements } from '@/hooks/useSupabaseAnnouncements';
import { useUser } from '@/contexts/UserContext';
import AnnouncementDetail from './AnnouncementDetail';
import AnnouncementForm from './AnnouncementForm';
import AnnouncementSearchFilter from './AnnouncementSearchFilter';
import AnnouncementListView from './AnnouncementListView';
import { visionProStyles } from '@/utils/visionProStyles';

const AnnouncementManagement: React.FC = () => {
  const { toast } = useToast();
  const { isAdmin } = useUser();
  const {
    announcements,
    loading,
    createAnnouncement,
    updateAnnouncement,
    deleteAnnouncement
  } = useSupabaseAnnouncements();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<CompanyAnnouncement | null>(null);
  const [viewAnnouncement, setViewAnnouncement] = useState<CompanyAnnouncement | null>(null);

  const categories = ['HR', 'Administration', 'Meeting', 'Official', 'General'];

  // Check admin access
  const hasAdminAccess = isAdmin();

  // Filter announcements based on search and category
  const filteredAnnouncements = announcements.filter(announcement => {
    const matchesSearch = !searchQuery || 
      announcement.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      announcement.content.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || 
      announcement.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  // Handle saving announcement (create or edit)
  const handleSaveAnnouncement = async (data: CompanyAnnouncement | Omit<CompanyAnnouncement, 'id' | 'created_at' | 'created_by' | 'company_id'>): Promise<boolean> => {
    try {
      console.log('handleSaveAnnouncement called with:', data);
      
      if ('id' in data) {
        // Update existing announcement
        console.log('Updating announcement with ID:', data.id);
        const success = await updateAnnouncement(data.id, data);
        if (success) {
          setIsFormOpen(false);
          setSelectedAnnouncement(null);
          return true;
        }
        return false;
      } else {
        // Create new announcement
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
        variant: 'destructive'
      });
      return false;
    }
  };

  const handleViewAnnouncement = (announcement: CompanyAnnouncement) => {
    setViewAnnouncement(announcement);
  };

  const handleEditAnnouncement = (announcement: CompanyAnnouncement) => {
    setSelectedAnnouncement(announcement);
    setIsFormOpen(true);
  };

  if (!hasAdminAccess) {
    return (
      <div className={`text-center py-12 ${visionProStyles.cardBackground} rounded-3xl`}>
        <h2 className={`text-xl font-semibold mb-2 ${visionProStyles.primaryText} text-white`}>無權限訪問</h2>
        <p className="text-white/70 font-medium drop-shadow-md">您沒有權限管理公司公告</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className={`text-center py-12 ${visionProStyles.cardBackground} rounded-3xl`}>
        <p className="text-white/70 font-medium drop-shadow-md">載入中...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 標題和新增按鈕 - Vision Pro 風格 */}
      <div className={`${visionProStyles.cardBackground} rounded-3xl p-6 relative overflow-hidden`}>
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10"></div>
        <div className="relative z-10 flex flex-col space-y-3 sm:flex-row sm:justify-between sm:items-center sm:space-y-0">
          <h2 className={`text-lg sm:text-xl font-semibold ${visionProStyles.primaryText} text-white`}>
            公告列表
          </h2>
          <Button 
            onClick={() => {
              setSelectedAnnouncement(null);
              setIsFormOpen(true);
            }}
            className={`w-full sm:w-auto h-12 sm:h-10 text-base sm:text-sm ${visionProStyles.glassButton} border-white/40 text-white font-semibold shadow-lg hover:bg-white/50 transition-all duration-300`}
          >
            <Plus className="h-4 w-4 mr-2 drop-shadow-md" />
            新增公告
          </Button>
        </div>
      </div>

      {/* 搜尋和篩選區域 - Vision Pro 風格 */}
      <div className={`${visionProStyles.cardBackground} rounded-3xl p-6`}>
        <AnnouncementSearchFilter
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          categories={categories}
        />
      </div>

      {/* 公告顯示區域 - Vision Pro 風格 */}
      <div className={`${visionProStyles.cardBackground} rounded-3xl p-6`}>
        <AnnouncementListView
          announcements={filteredAnnouncements}
          onView={handleViewAnnouncement}
          onEdit={handleEditAnnouncement}
        />
      </div>

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
