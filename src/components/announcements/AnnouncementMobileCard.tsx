
import React from 'react';
import { Eye, MoreVertical, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CompanyAnnouncement } from '@/types/announcement';
import { formatAnnouncementDate } from '@/utils/announcementUtils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface AnnouncementMobileCardProps {
  announcement: CompanyAnnouncement;
  onView: (announcement: CompanyAnnouncement) => void;
  onEdit: (announcement: CompanyAnnouncement) => void;
}

const AnnouncementMobileCard: React.FC<AnnouncementMobileCardProps> = ({
  announcement,
  onView,
  onEdit
}) => {
  return (
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
            <DropdownMenuItem onClick={() => onView(announcement)}>
              <Eye className="h-4 w-4 mr-2" />
              查看
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onEdit(announcement)}>
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
};

export default AnnouncementMobileCard;
