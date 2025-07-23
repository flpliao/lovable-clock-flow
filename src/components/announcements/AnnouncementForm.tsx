import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { useCurrentUser } from '@/hooks/useStores';
import { useToast } from '@/hooks/useToast';
import { AnnouncementCategory, CompanyAnnouncement } from '@/types/announcement';
import { zodResolver } from '@hookform/resolvers/zod';
import { Calendar, Save, Upload, X } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';

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
  onSave: (data: Omit<CompanyAnnouncement, 'id' | 'created_at' | 'created_by' | 'company_id'> | CompanyAnnouncement) => Promise<boolean>;
}

const AnnouncementForm: React.FC<AnnouncementFormProps> = ({
  isOpen,
  onClose,
  announcement,
  onSave
}) => {
  const { toast } = useToast();
  const currentUser = useCurrentUser();
  const [fileName, setFileName] = useState<string>('');
  const [existingFile, setExistingFile] = useState<{url: string, name: string, type: string} | null>(null);
  const [newFile, setNewFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const isEditMode = !!announcement;
  
  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    formState: { errors }
  } = useForm<FormData>({
    resolver: zodResolver(announcementSchema),
    defaultValues: {
      title: '',
      content: '',
      is_pinned: false,
      is_active: true,
      category: 'General'
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
        category: announcement.category || 'General'
      });
      
      if (announcement.file) {
        setExistingFile(announcement.file);
        setFileName(announcement.file.name);
      } else {
        setExistingFile(null);
        setFileName('');
      }
      setNewFile(null);
    } else {
      reset({
        title: '',
        content: '',
        is_pinned: false,
        is_active: true,
        category: 'General'
      });
      setExistingFile(null);
      setFileName('');
      setNewFile(null);
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

    setIsLoading(true);

    try {
      // Handle file data
      let fileData = existingFile; // Keep existing file by default
      
      // If a new file was uploaded, use it instead
      if (newFile) {
        fileData = {
          url: URL.createObjectURL(newFile),
          name: newFile.name,
          type: newFile.type
        };
      }

      const announcementData = {
        ...(isEditMode ? { 
          id: announcement.id,
          created_at: announcement.created_at,
          created_by: announcement.created_by,
          company_id: announcement.company_id
        } : {}),
        title: data.title,
        content: data.content,
        file: fileData,
        is_pinned: data.is_pinned,
        is_active: data.is_active,
        category: (data.category || 'General') as AnnouncementCategory
      };
      
      console.log('Submitting announcement data:', announcementData);
      
      const success = await onSave(announcementData as CompanyAnnouncement);
      
      if (success) {
        toast({
          title: '成功',
          description: isEditMode ? '公告已更新' : '公告已發布'
        });
        onClose();
        // Reset form after successful save
        if (!isEditMode) {
          reset();
          setExistingFile(null);
          setNewFile(null);
          setFileName('');
        }
      } else {
        toast({
          title: '錯誤',
          description: isEditMode ? '更新公告失敗' : '發布公告失敗',
          variant: 'destructive'
        });
      }
    } catch (error) {
      console.error('Error saving announcement:', error);
      toast({
        title: '錯誤',
        description: '儲存公告時發生錯誤',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Check file size (limit to 10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: '檔案過大',
          description: '檔案大小不能超過 10MB',
          variant: 'destructive'
        });
        return;
      }
      
      setNewFile(file);
      setFileName(file.name);
    }
  };

  const handleRemoveFile = () => {
    setExistingFile(null);
    setNewFile(null);
    setFileName('');
    // Clear the file input
    const fileInput = document.getElementById('file') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  };

  const displayFileName = fileName || '未選擇檔案';
  const hasFile = existingFile || newFile;

  return (
    <Dialog open={isOpen} onOpenChange={() => !isLoading && onClose()}>
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
              disabled={isLoading}
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
                  value={field.value || 'General'}
                  disabled={isLoading}
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
              disabled={isLoading}
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
                disabled={isLoading}
                onChange={handleFileChange}
                accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.gif"
              />
              <Button
                type="button"
                variant="outline"
                disabled={isLoading}
                onClick={() => document.getElementById('file')?.click()}
              >
                <Upload className="h-4 w-4 mr-2" />
                選擇檔案
              </Button>
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <span className="text-sm text-gray-500 truncate">
                  {displayFileName}
                </span>
                {hasFile && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    disabled={isLoading}
                    onClick={handleRemoveFile}
                    className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
            {existingFile && !newFile && (
              <p className="text-xs text-blue-600">
                目前檔案: {existingFile.name}
              </p>
            )}
            {newFile && (
              <p className="text-xs text-green-600">
                新檔案: {newFile.name}
              </p>
            )}
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <Controller
                  name="is_pinned"
                  control={control}
                  render={({ field }) => (
                    <Switch
                      id="is_pinned"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={isLoading}
                    />
                  )}
                />
                <label htmlFor="is_pinned" className="text-sm font-medium">
                  置頂公告
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Controller
                  name="is_active"
                  control={control}
                  render={({ field }) => (
                    <Switch
                      id="is_active"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={isLoading}
                    />
                  )}
                />
                <label htmlFor="is_active" className="text-sm font-medium">
                  公告狀態
                </label>
              </div>
            </div>
            <div className="text-sm text-gray-500 flex items-center">
              <Calendar className="h-4 w-4 mr-1" />
              {isEditMode
                ? `發布時間: ${new Date(announcement.created_at).toLocaleDateString()}`
                : `將發布於: ${new Date().toLocaleDateString()}`}
            </div>
          </div>

          <DialogFooter className="pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose}
              disabled={isLoading}
            >
              取消
            </Button>
            <Button 
              type="submit" 
              disabled={isLoading}
            >
              <Save className="h-4 w-4 mr-2" />
              {isLoading ? '處理中...' : (isEditMode ? '更新' : '發布')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AnnouncementForm;
