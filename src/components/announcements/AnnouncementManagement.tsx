
import React, { useState } from 'react';
import { Plus, Search, Eye, MoreVertical, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { CompanyAnnouncement } from '@/types/announcement';
import { useSupabaseAnnouncements } from '@/hooks/useSupabaseAnnouncements';
import AnnouncementDetail from './AnnouncementDetail';
import AnnouncementForm from './AnnouncementForm';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { formatAnnouncementDate } from '@/utils/announcementUtils';
import { useUser } from '@/contexts/UserContext';
import { useIsMobile } from '@/hooks/use-mobile';

const AnnouncementManagement: React.FC = () => {
  const { toast } = useToast();
  const { isAdmin } = useUser();
  const isMobile = useIsMobile();
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

  // Mobile card component for announcements
  const AnnouncementCard = ({ announcement }: { announcement: CompanyAnnouncement }) => (
    <div className="bg-white rounded-lg border border-gray-200 p-4 space-y-3 shadow-sm">
      <div className="flex justify-between items-start">
        <h3 className="font-medium text-gray-900 flex-1 pr-2 line-clamp-2">{announcement.title}</h3>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuItem onClick={() => setViewAnnouncement(announcement)}>
              <Eye className="h-4 w-4 mr-2" />
              查看
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => {
              setSelectedAnnouncement(announcement);
              setIsFormOpen(true);
            }}>
              <Edit className="h-4 w-4 mr-2" />
              編輯
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
      <div className="flex flex-wrap gap-2">
        {announcement.category && (
          <Badge variant="outline" className="text-xs">{announcement.category}</Badge>
        )}
        {announcement.is_pinned && (
          <Badge className="bg-yellow-500 text-xs">置頂</Badge>
        )}
        {announcement.is_active ? (
          <Badge className="bg-green-500 text-xs">啟用</Badge>
        ) : (
          <Badge variant="outline" className="text-gray-500 text-xs">停用</Badge>
        )}
        {announcement.file && (
          <Badge variant="outline" className="text-xs">有附件</Badge>
        )}
      </div>
      
      <div className="flex justify-between items-center text-sm text-gray-500">
        <span>{announcement.created_by.name}</span>
        <span>{formatAnnouncementDate(announcement.created_at)}</span>
      </div>
    </div>
  );

  if (!hasAdminAccess) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold mb-2">無權限訪問</h2>
        <p className="text-gray-500">您沒有權限管理公司公告</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">載入中...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header with create button */}
      <div className="flex flex-col space-y-3 sm:flex-row sm:justify-between sm:items-center sm:space-y-0">
        <h2 className="text-lg sm:text-xl font-semibold">公告列表</h2>
        <Button 
          onClick={() => {
            setSelectedAnnouncement(null);
            setIsFormOpen(true);
          }}
          className="w-full sm:w-auto h-12 sm:h-10 text-base sm:text-sm"
        >
          <Plus className="h-4 w-4 mr-2" />
          新增公告
        </Button>
      </div>

      {/* Search and filter section */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
          <Input
            placeholder="搜尋公告標題或內容..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-12 text-base"
          />
        </div>
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
      </div>

      {/* Announcements display */}
      {filteredAnnouncements.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
          <p className="text-gray-500">沒有找到符合條件的公告</p>
        </div>
      ) : (
        <>
          {/* Mobile card layout */}
          {isMobile ? (
            <div className="space-y-3">
              {filteredAnnouncements.map((announcement) => (
                <AnnouncementCard key={announcement.id} announcement={announcement} />
              ))}
            </div>
          ) : (
            /* Desktop table layout */
            <div className="border rounded-md overflow-hidden bg-white">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[300px]">標題</TableHead>
                    <TableHead>分類</TableHead>
                    <TableHead>發布日期</TableHead>
                    <TableHead>發布者</TableHead>
                    <TableHead className="text-center">置頂</TableHead>
                    <TableHead className="text-center">狀態</TableHead>
                    <TableHead className="text-center">附件</TableHead>
                    <TableHead className="text-right">操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAnnouncements.map((announcement) => (
                    <TableRow key={announcement.id}>
                      <TableCell className="font-medium">
                        <div className="truncate max-w-[280px]" title={announcement.title}>
                          {announcement.title}
                        </div>
                      </TableCell>
                      <TableCell>
                        {announcement.category ? (
                          <Badge variant="outline">{announcement.category}</Badge>
                        ) : (
                          <span className="text-gray-400">—</span>
                        )}
                      </TableCell>
                      <TableCell>{formatAnnouncementDate(announcement.created_at)}</TableCell>
                      <TableCell>{announcement.created_by.name}</TableCell>
                      <TableCell className="text-center">
                        {announcement.is_pinned ? (
                          <Badge className="bg-yellow-500">置頂</Badge>
                        ) : (
                          <span className="text-gray-400">—</span>
                        )}
                      </TableCell>
                      <TableCell className="text-center">
                        {announcement.is_active ? (
                          <Badge className="bg-green-500">啟用</Badge>
                        ) : (
                          <Badge variant="outline" className="text-gray-500">停用</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-center">
                        {announcement.file ? (
                          <Badge variant="outline">有附件</Badge>
                        ) : (
                          <span className="text-gray-400">—</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setViewAnnouncement(announcement)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                              setSelectedAnnouncement(announcement);
                              setIsFormOpen(true);
                            }}
                          >
                            編輯
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </>
      )}

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
