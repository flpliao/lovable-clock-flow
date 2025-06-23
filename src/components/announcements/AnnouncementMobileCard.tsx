
import React, { useState } from 'react';
import { Eye, Calendar, User, Pin, FileText, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CompanyAnnouncement } from '@/types/announcement';
import { formatAnnouncementDate } from '@/utils/announcementUtils';
import { DeleteConfirmDialog } from '@/components/dialogs/DeleteConfirmDialog';
import { visionProStyles } from '@/utils/visionProStyles';

interface AnnouncementMobileCardProps {
  announcement: CompanyAnnouncement;
  onView: (announcement: CompanyAnnouncement) => void;
  onEdit: (announcement: CompanyAnnouncement) => void;
  onDelete?: (announcementId: string) => void;
}

const AnnouncementMobileCard: React.FC<AnnouncementMobileCardProps> = ({
  announcement,
  onView,
  onEdit,
  onDelete
}) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const handleDeleteClick = () => {
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (onDelete) {
      onDelete(announcement.id);
      setDeleteDialogOpen(false);
    }
  };

  return (
    <>
      <div className={`${visionProStyles.glassBackground} rounded-2xl p-4 border border-white/30 shadow-xl backdrop-blur-3xl`}>
        <div className="space-y-3">
          {/* 標題和置頂標記 */}
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold text-white drop-shadow-md text-base line-clamp-2 flex-1">
              {announcement.title}
            </h3>
            {announcement.is_pinned && (
              <Badge className="bg-yellow-500/80 text-white border-yellow-400/50 font-medium flex-shrink-0">
                <Pin className="h-3 w-3 mr-1" />
                置頂
              </Badge>
            )}
          </div>

          {/* 分類和狀態 */}
          <div className="flex items-center gap-2 flex-wrap">
            {announcement.category && (
              <Badge className={`${visionProStyles.glassButton} border-white/40 text-white font-medium text-xs`}>
                {announcement.category}
              </Badge>
            )}
            <Badge className={
              announcement.is_active 
                ? "bg-green-500/80 text-white border-green-400/50 font-medium text-xs"
                : `${visionProStyles.glassButton} border-white/40 text-white/60 font-medium text-xs`
            }>
              {announcement.is_active ? '啟用' : '停用'}
            </Badge>
            {announcement.file && (
              <Badge className={`${visionProStyles.glassButton} border-white/40 text-white font-medium text-xs`}>
                <FileText className="h-3 w-3 mr-1" />
                有附件
              </Badge>
            )}
          </div>

          {/* 發布資訊 */}
          <div className="space-y-2 text-sm text-white/70">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 flex-shrink-0" />
              <span>{formatAnnouncementDate(announcement.created_at)}</span>
            </div>
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 flex-shrink-0" />
              <span>{announcement.created_by.name}</span>
            </div>
          </div>

          {/* 操作按鈕 */}
          <div className="flex gap-2 pt-2">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onView(announcement)}
              className={`flex-1 ${visionProStyles.glassButton} border-white/40 text-white hover:bg-white/20 transition-colors duration-200`}
            >
              <Eye className="h-4 w-4 mr-1" />
              查看
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onEdit(announcement)}
              className={`flex-1 ${visionProStyles.glassButton} border-white/40 text-white hover:bg-white/20 transition-colors duration-200`}
            >
              編輯
            </Button>
            {onDelete && (
              <Button
                size="sm"
                variant="ghost"
                onClick={handleDeleteClick}
                className={`${visionProStyles.glassButton} border-red-400/40 text-red-300 hover:bg-red-500/20 transition-colors duration-200`}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </div>

      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleConfirmDelete}
        title="確認刪除公告"
        description={`確定要刪除公告「${announcement.title}」嗎？此操作無法復原。`}
      />
    </>
  );
};

export default AnnouncementMobileCard;
