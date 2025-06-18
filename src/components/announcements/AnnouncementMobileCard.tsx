
import React from 'react';
import { Calendar, User, Eye, FileText, Pin, Edit } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CompanyAnnouncement } from '@/types/announcement';
import { formatAnnouncementDate } from '@/utils/announcementUtils';

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
  const getCategoryColor = (category?: string) => {
    switch (category) {
      case 'HR':
        return 'bg-blue-500/20 text-blue-700 border-blue-300/30';
      case 'Administration':
        return 'bg-orange-500/20 text-orange-700 border-orange-300/30';
      case 'Meeting':
        return 'bg-green-500/20 text-green-700 border-green-300/30';
      case 'Official':
        return 'bg-red-500/20 text-red-700 border-red-300/30';
      default:
        return 'bg-gray-500/20 text-gray-700 border-gray-300/30';
    }
  };

  return (
    <div className="backdrop-blur-xl bg-white/20 border border-white/30 rounded-3xl shadow-xl p-6 space-y-4">
      {/* Header with badges */}
      <div className="flex flex-wrap items-center gap-2">
        {announcement.is_pinned && (
          <Badge className="text-xs flex items-center gap-1 font-medium bg-yellow-500/20 text-yellow-700 border-yellow-300/30 backdrop-blur-xl">
            <Pin className="h-3 w-3" />
            置頂
          </Badge>
        )}
        
        {announcement.category && (
          <Badge className={`text-xs font-medium backdrop-blur-xl ${getCategoryColor(announcement.category)}`}>
            {announcement.category}
          </Badge>
        )}
        
        {announcement.file && (
          <Badge className="text-xs flex items-center gap-1 bg-purple-500/20 text-purple-700 border-purple-300/30 backdrop-blur-xl font-medium">
            <FileText className="h-3 w-3" />
            附件
          </Badge>
        )}
        
        {announcement.is_active ? (
          <Badge className="text-xs font-medium bg-green-500/20 text-green-700 border-green-300/30 backdrop-blur-xl">
            啟用
          </Badge>
        ) : (
          <Badge className="text-xs font-medium bg-gray-500/20 text-gray-700 border-gray-300/30 backdrop-blur-xl">
            停用
          </Badge>
        )}
      </div>

      {/* Title */}
      <h3 className="font-bold text-white text-lg line-clamp-2 drop-shadow-md">
        {announcement.title}
      </h3>

      {/* Content preview */}
      <p className="text-white/80 text-sm leading-relaxed font-medium line-clamp-2 drop-shadow-sm">
        {announcement.content}
      </p>

      {/* Meta info */}
      <div className="flex flex-col gap-2 text-sm text-white/80 font-medium">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-white/40 rounded-lg backdrop-blur-xl">
            <User className="h-4 w-4" />
          </div>
          <span>{announcement.created_by.name}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="p-2 bg-white/40 rounded-lg backdrop-blur-xl">
            <Calendar className="h-4 w-4" />
          </div>
          <span>{formatAnnouncementDate(announcement.created_at)}</span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2 pt-2">
        <Button 
          size="sm" 
          className="flex-1 h-10 text-sm bg-white/40 text-gray-800 border-white/30 backdrop-blur-xl font-semibold hover:bg-white/60 transition-all duration-300 shadow-lg rounded-xl"
          onClick={() => onView(announcement)}
        >
          <Eye className="h-4 w-4 mr-2" />
          查看
        </Button>
        <Button 
          size="sm" 
          className="flex-1 h-10 text-sm bg-white/40 text-gray-800 border-white/30 backdrop-blur-xl font-semibold hover:bg-white/60 transition-all duration-300 shadow-lg rounded-xl"
          onClick={() => onEdit(announcement)}
        >
          <Edit className="h-4 w-4 mr-2" />
          編輯
        </Button>
      </div>
    </div>
  );
};

export default AnnouncementMobileCard;
