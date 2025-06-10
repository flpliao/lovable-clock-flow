
import React, { useState } from 'react';
import { Search, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import AnnouncementCard from './AnnouncementCard';
import AnnouncementDetail from './AnnouncementDetail';
import { useSupabaseAnnouncements } from '@/hooks/useSupabaseAnnouncements';
import { Skeleton } from '@/components/ui/skeleton';
import { CompanyAnnouncement } from '@/types/announcement';
import { visionProStyles } from '@/utils/visionProStyles';

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
  const [isFilterOpen, setIsFilterOpen] = useState(false);

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

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setIsFilterOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Mobile-optimized search and filter with glass effect */}
      <div className="space-y-4">
        {/* Search bar */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-600" />
          <Input
            placeholder="搜尋公告標題或內容..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12 h-12 text-base bg-white/70 text-gray-800 border-white/40 backdrop-blur-xl font-medium placeholder:text-gray-600 shadow-md drop-shadow-sm"
          />
        </div>

        {/* Filter section */}
        <div className="flex gap-3">
          <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" className="flex-1 h-12 text-base bg-white/70 text-gray-800 border-white/40 backdrop-blur-xl font-semibold hover:bg-white/80 shadow-md drop-shadow-sm">
                <Filter className="h-4 w-4 mr-2" />
                篩選分類
                {selectedCategory !== 'all' && (
                  <span className="ml-2 px-2 py-1 bg-blue-500/90 text-white text-xs rounded-full shadow-sm">
                    1
                  </span>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="h-[300px]">
              <SheetHeader>
                <SheetTitle>篩選公告</SheetTitle>
                <SheetDescription>
                  選擇您想查看的公告分類
                </SheetDescription>
              </SheetHeader>
              <div className="mt-6 space-y-4">
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="h-12 text-base">
                    <SelectValue placeholder="選擇分類" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">所有分類</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>{category}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className="flex gap-2">
                  <Button onClick={clearFilters} variant="outline" className="flex-1">
                    清除篩選
                  </Button>
                  <Button onClick={() => setIsFilterOpen(false)} className="flex-1">
                    確定
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>

          {/* Desktop filter */}
          <div className="hidden sm:block flex-1">
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="h-12 text-base bg-white/70 text-gray-800 border-white/40 backdrop-blur-xl font-medium shadow-md drop-shadow-sm">
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
        </div>
      </div>

      {/* Results summary */}
      {!loading && (
        <div className="text-sm text-gray-700 font-medium px-1 drop-shadow-sm">
          共 {filteredAnnouncements.length} 則公告
          {(searchQuery || selectedCategory !== 'all') && (
            <Button 
              variant="link" 
              size="sm" 
              onClick={clearFilters}
              className="ml-2 h-auto p-0 text-sm text-blue-600 font-medium"
            >
              清除所有篩選
            </Button>
          )}
        </div>
      )}

      {/* Announcements list */}
      {loading ? (
        // Loading skeleton with glass effect
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className={`p-6 ${visionProStyles.featureCard}`}>
              <div className="space-y-4">
                <div className="flex gap-2">
                  <Skeleton className="h-5 w-12 bg-white/40" />
                  <Skeleton className="h-5 w-16 bg-white/40" />
                </div>
                <Skeleton className="h-6 w-3/4 bg-white/40" />
                <Skeleton className="h-4 w-full bg-white/40" />
                <Skeleton className="h-4 w-2/3 bg-white/40" />
                <div className="flex justify-between items-center">
                  <Skeleton className="h-4 w-24 bg-white/40" />
                  <Skeleton className="h-8 w-20 bg-white/40" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : filteredAnnouncements.length === 0 ? (
        <div className={`text-center py-12 ${visionProStyles.featureCard}`}>
          <div className="text-base mb-2 text-gray-800 font-bold drop-shadow-sm">沒有找到符合條件的公告</div>
          {(searchQuery || selectedCategory !== 'all') && (
            <Button 
              variant="outline" 
              onClick={clearFilters}
              className="mt-4 bg-white/70 text-gray-800 border-white/40 backdrop-blur-xl font-semibold hover:bg-white/80 shadow-md"
            >
              查看所有公告
            </Button>
          )}
        </div>
      ) : (
        // Announcement cards
        <div className="space-y-6">
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
