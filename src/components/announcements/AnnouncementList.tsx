
import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AnnouncementCard from './AnnouncementCard';
import AnnouncementDetail from './AnnouncementDetail';
import { useSupabaseAnnouncements } from '@/hooks/useSupabaseAnnouncements';
import { Skeleton } from '@/components/ui/skeleton';
import { CompanyAnnouncement } from '@/types/announcement';

const AnnouncementList: React.FC = () => {
  const {
    announcements,
    loading,
    markAnnouncementAsRead,
    checkAnnouncementRead
  } = useSupabaseAnnouncements();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [openAnnouncement, setOpenAnnouncement] = useState<CompanyAnnouncement | null>(null);
  const [readStatus, setReadStatus] = useState<Record<string, boolean>>({});

  const categories = ['HR', 'Administration', 'Meeting', 'Official', 'General'];

  // Filter announcements based on search and category
  const filteredAnnouncements = announcements.filter(announcement => {
    const matchesSearch = !searchQuery || 
      announcement.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      announcement.content.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || 
      announcement.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const handleOpenAnnouncement = async (announcement: CompanyAnnouncement) => {
    setOpenAnnouncement(announcement);
    await markAnnouncementAsRead(announcement.id);
    setReadStatus(prev => ({ ...prev, [announcement.id]: true }));
  };

  // Check if announcement is read
  const checkIfRead = async (announcementId: string): Promise<boolean> => {
    if (readStatus[announcementId] !== undefined) {
      return readStatus[announcementId];
    }
    
    const isRead = await checkAnnouncementRead(announcementId);
    setReadStatus(prev => ({ ...prev, [announcementId]: isRead }));
    return isRead;
  };

  return (
    <div>
      <div className="flex flex-col gap-4 mb-6 md:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="搜尋公告標題或內容..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select
          value={selectedCategory}
          onValueChange={setSelectedCategory}
        >
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="選擇分類" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">所有分類</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category} value={category}>{category}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        // Loading skeleton
        <>
          {[1, 2, 3].map((i) => (
            <div key={i} className="mb-4">
              <Skeleton className="h-32 w-full mb-4" />
            </div>
          ))}
        </>
      ) : filteredAnnouncements.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          沒有找到符合條件的公告
        </div>
      ) : (
        // Announcement cards
        <div>
          {filteredAnnouncements.map((announcement) => (
            <AnnouncementCard
              key={announcement.id}
              announcement={announcement}
              isRead={readStatus[announcement.id] || false}
              onClick={handleOpenAnnouncement}
            />
          ))}
        </div>
      )}

      <AnnouncementDetail
        announcement={openAnnouncement}
        isOpen={!!openAnnouncement}
        onClose={() => setOpenAnnouncement(null)}
        onMarkAsRead={markAnnouncementAsRead}
      />
    </div>
  );
};

export default AnnouncementList;
