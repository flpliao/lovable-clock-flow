
import React, { useState } from 'react';
import { Plus, Search, Filter, Check, X, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { CompanyAnnouncement } from '@/types/announcement';
import { useAnnouncements } from '@/hooks/useAnnouncements';
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
import { formatAnnouncementDate } from '@/utils/announcementUtils';

const AnnouncementManagement: React.FC = () => {
  const { toast } = useToast();
  const {
    announcements,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    categories,
    createAnnouncement,
    editAnnouncement,
    removeAnnouncement,
    hasAdminAccess
  } = useAnnouncements(true);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<CompanyAnnouncement | null>(null);
  const [viewAnnouncement, setViewAnnouncement] = useState<CompanyAnnouncement | null>(null);

  // Handle saving announcement (create or edit)
  const handleSaveAnnouncement = (data: CompanyAnnouncement | Omit<CompanyAnnouncement, 'id'>) => {
    if ('id' in data) {
      // Update existing announcement
      editAnnouncement(data);
      toast({
        title: '成功',
        description: '公告已更新'
      });
    } else {
      // Create new announcement
      createAnnouncement(data);
      toast({
        title: '成功',
        description: '公告已發布'
      });
    }
  };

  // Handle deleting announcement
  const handleDeleteAnnouncement = (id: string) => {
    if (confirm('確定要刪除此公告？')) {
      removeAnnouncement(id);
      toast({
        title: '成功',
        description: '公告已刪除'
      });
    }
  };

  if (!hasAdminAccess) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold mb-2">無權限訪問</h2>
        <p className="text-gray-500">您沒有權限管理公司公告</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">公告管理</h2>
        <Button onClick={() => {
          setSelectedAnnouncement(null);
          setIsFormOpen(true);
        }}>
          <Plus className="h-4 w-4 mr-2" />
          新增公告
        </Button>
      </div>

      <div className="flex flex-col gap-4 md:flex-row">
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
          onValueChange={(value) => setSelectedCategory(value as any)}
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

      <div className="border rounded-md overflow-hidden">
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
            {announcements.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                  沒有找到符合條件的公告
                </TableCell>
              </TableRow>
            ) : (
              announcements.map((announcement) => (
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
                      <Check className="h-5 w-5 text-green-500 mx-auto" />
                    ) : (
                      <X className="h-5 w-5 text-gray-300 mx-auto" />
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
                      <Check className="h-5 w-5 text-blue-500 mx-auto" />
                    ) : (
                      <X className="h-5 w-5 text-gray-300 mx-auto" />
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
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Create/Edit Form */}
      <AnnouncementForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
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
