
import React, { useState, useEffect } from 'react';
import { Upload, Calendar, Trash2, Save } from 'lucide-react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { CompanyAnnouncement, AnnouncementCategory } from '@/types/announcement';
import { useUser } from '@/contexts/UserContext';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const announcementSchema = z.object({
  title: z.string().min(1, '標題不能為空'),
  content: z.string().min(1, '內容不能為空'),
  is_pinned: z.boolean().default(false),
  is_active: z.boolean().default(true),
  category: z.string().optional(),
  file: z.any().optional()
});

type FormData = z.infer<typeof announcementSchema>;

interface AnnouncementFormProps {
  isOpen: boolean;
  onClose: () => void;
  announcement?: CompanyAnnouncement;
  onSave: (data: Omit<CompanyAnnouncement, 'id'> | CompanyAnnouncement) => void;
}

const AnnouncementForm: React.FC<AnnouncementFormProps> = ({
  isOpen,
  onClose,
  announcement,
  onSave
}) => {
  const { toast } = useToast();
  const { currentUser } = useUser();
  const [fileName, setFileName] = useState<string>('');
  const isEditMode = !!announcement;
  
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<FormData>({
    resolver: zodResolver(announcementSchema),
    defaultValues: {
      title: '',
      content: '',
      is_pinned: false,
      is_active: true,
      category: undefined
    }
  });

  // Initialize form when announcement changes
  useEffect(() => {
    if (announcement) {
      reset({
        title: announcement.title,
        content: announcement.content,
        is_pinned: announcement.is_pinned,
        is_active: announcement.is_active,
        category: announcement.category
      });
      
      if (announcement.file) {
        setFileName(announcement.file.name);
      } else {
        setFileName('');
      }
    } else {
      reset({
        title: '',
        content: '',
        is_pinned: false,
        is_active: true,
        category: undefined
      });
      setFileName('');
    }
  }, [announcement, reset]);

  const onSubmit = async (data: FormData) => {
    if (!currentUser) {
      toast({
        title: '錯誤',
        description: '請先登入',
        variant: 'destructive'
      });
      return;
    }

    // Mock file upload
    let fileData = announcement?.file;
    if (data.file && data.file[0]) {
      // In a real app, upload the file to a server and get the URL
      fileData = {
        url: URL.createObjectURL(data.file[0]),
        name: data.file[0].name,
        type: data.file[0].type
      };
    }

    try {
      const announcementData = {
        ...(isEditMode ? { id: announcement.id } : {}),
        title: data.title,
        content: data.content,
        file: fileData,
        created_at: isEditMode ? announcement.created_at : new Date().toISOString(),
        created_by: isEditMode ? announcement.created_by : {
          id: currentUser.id,
          name: currentUser.name
        },
        company_id: '1', // In a real app, get this from the context
        is_pinned: data.is_pinned,
        is_active: data.is_active,
        category: data.category as AnnouncementCategory
      };
      
      onSave(announcementData as CompanyAnnouncement);
      toast({
        title: '成功',
        description: isEditMode ? '公告已更新' : '公告已發布'
      });
      onClose();
    } catch (error) {
      console.error('Error saving announcement:', error);
      toast({
        title: '錯誤',
        description: '儲存公告時發生錯誤',
        variant: 'destructive'
      });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFileName(e.target.files[0].name);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditMode ? '編輯公告' : '新增公告'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 py-4">
          <div className="space-y-2">
            <label htmlFor="title" className="text-sm font-medium">
              公告標題 <span className="text-red-500">*</span>
            </label>
            <Input
              id="title"
              placeholder="輸入公告標題"
              {...register('title')}
            />
            {errors.title && (
              <p className="text-sm text-red-500">{errors.title.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="category" className="text-sm font-medium">
              公告分類
            </label>
            <Controller
              name="category"
              control={control}
              render={({ field }) => (
                <Select 
                  onValueChange={field.onChange} 
                  value={field.value}
                >
                  <SelectTrigger id="category">
                    <SelectValue placeholder="選擇分類" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="HR">人事</SelectItem>
                    <SelectItem value="Administration">行政</SelectItem>
                    <SelectItem value="Meeting">會議</SelectItem>
                    <SelectItem value="Official">公文</SelectItem>
                    <SelectItem value="General">一般</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="content" className="text-sm font-medium">
              公告內容 <span className="text-red-500">*</span>
            </label>
            <Textarea
              id="content"
              placeholder="輸入公告內容"
              className="min-h-[200px]"
              {...register('content')}
            />
            {errors.content && (
              <p className="text-sm text-red-500">{errors.content.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="file" className="text-sm font-medium">
              附件檔案
            </label>
            <div className="flex items-center gap-2">
              <Input
                id="file"
                type="file"
                className="hidden"
                {...register('file')}
                onChange={handleFileChange}
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => document.getElementById('file')?.click()}
              >
                <Upload className="h-4 w-4 mr-2" />
                選擇檔案
              </Button>
              <span className="text-sm text-gray-500 truncate">
                {fileName || '未選擇檔案'}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Controller
                name="is_pinned"
                control={control}
                render={({ field }) => (
                  <Switch
                    id="is_pinned"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                )}
              />
              <label htmlFor="is_pinned" className="text-sm font-medium">
                置頂公告
              </label>
            </div>
            <div className="text-sm text-gray-500 flex items-center">
              <Calendar className="h-4 w-4 mr-1" />
              {isEditMode
                ? `發布時間: ${new Date(announcement.created_at).toLocaleDateString()}`
                : `將發布於: ${new Date().toLocaleDateString()}`}
            </div>
          </div>

          <DialogFooter className="pt-4">
            {isEditMode && (
              <Button
                type="button"
                variant="destructive"
                className="mr-auto"
                onClick={() => {
                  if (confirm('確定要刪除此公告？')) {
                    onSave({
                      ...announcement,
                      is_active: false
                    });
                    onClose();
                    toast({
                      title: '成功',
                      description: '公告已刪除'
                    });
                  }
                }}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                刪除
              </Button>
            )}
            <Button type="button" variant="outline" onClick={onClose}>
              取消
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              <Save className="h-4 w-4 mr-2" />
              {isEditMode ? '更新' : '發布'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AnnouncementForm;
