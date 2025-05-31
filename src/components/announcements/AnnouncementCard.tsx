
import React from 'react';
import { Calendar, User, Eye, FileText, Pin } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CompanyAnnouncement } from '@/types/announcement';
import { formatAnnouncementDate } from '@/utils/announcementUtils';

interface AnnouncementCardProps {
  announcement: CompanyAnnouncement;
  isRead: boolean;
  onClick: (announcement: CompanyAnnouncement) => void;
}

const AnnouncementCard: React.FC<AnnouncementCardProps> = ({
  announcement,
  isRead,
  onClick
}) => {
  const getCategoryColor = (category?: string) => {
    switch (category) {
      case 'HR':
        return 'bg-blue-500 text-white';
      case 'Administration':
        return 'bg-amber-500 text-white';
      case 'Meeting':
        return 'bg-emerald-500 text-white';
      case 'Official':
        return 'bg-red-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  return (
    <Card 
      className={`mb-3 sm:mb-4 cursor-pointer transition-all duration-200 hover:shadow-md ${
        !isRead ? 'border-l-4 border-l-blue-500 bg-blue-50/30' : 'border-l-4 border-l-transparent'
      }`}
      onClick={() => onClick(announcement)}
    >
      <CardContent className="p-4">
        {/* Header with badges */}
        <div className="flex flex-wrap items-center gap-2 mb-3">
          {announcement.is_pinned && (
            <Badge className="bg-yellow-500 text-white text-xs flex items-center gap-1">
              <Pin className="h-3 w-3" />
              置頂
            </Badge>
          )}
          
          {announcement.category && (
            <Badge className={`text-xs ${getCategoryColor(announcement.category)}`}>
              {announcement.category}
            </Badge>
          )}
          
          {announcement.file && (
            <Badge variant="outline" className="text-xs flex items-center gap-1">
              <FileText className="h-3 w-3" />
              附件
            </Badge>
          )}
          
          {!isRead && (
            <Badge className="bg-blue-600 text-white text-xs">
              新
            </Badge>
          )}
        </div>

        {/* Title */}
        <h3 className={`text-base sm:text-lg font-semibold mb-2 line-clamp-2 ${
          !isRead ? 'text-gray-900' : 'text-gray-700'
        }`}>
          {announcement.title}
        </h3>

        {/* Content preview */}
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
          {announcement.content}
        </p>

        {/* Footer with meta info and action */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex flex-col gap-1 text-xs text-gray-500">
            <div className="flex items-center gap-1">
              <User className="h-3 w-3" />
              <span>{announcement.created_by.name}</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              <span>{formatAnnouncementDate(announcement.created_at)}</span>
            </div>
          </div>
          
          <Button 
            size="sm" 
            variant="outline"
            className="w-full sm:w-auto h-8 text-xs"
            onClick={(e) => {
              e.stopPropagation();
              onClick(announcement);
            }}
          >
            <Eye className="h-3 w-3 mr-1" />
            查看詳情
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AnnouncementCard;
