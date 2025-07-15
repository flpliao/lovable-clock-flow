import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import React, { useEffect, useState } from 'react';
import { Checkpoint, updateCheckpoint } from './useCheckpoints';

const EditCheckpointDialog = ({
  open,
  onClose,
  checkpoint,
  onSuccess,
}: {
  open: boolean;
  onClose: () => void;
  checkpoint: Checkpoint | null;
  onSuccess?: () => void;
}) => {
  const [name, setName] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState(false);

  useEffect(() => {
    if (checkpoint) {
      setName(checkpoint.name || '');
      setLatitude(checkpoint.latitude?.toString() || '');
      setLongitude(checkpoint.longitude?.toString() || '');
      setDisabled(!!checkpoint.disabled_at);
    }
  }, [checkpoint]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateCheckpoint(checkpoint!.id, {
        name,
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        disabled_at: disabled ? new Date().toISOString() : null,
      });
      onClose();
      onSuccess?.();
    } finally {
      setLoading(false);
    }
  };

  if (!open || !checkpoint) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl">
        <h2 className="text-lg font-semibold leading-none tracking-tight mb-4">編輯打卡點</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">名稱</Label>
            <Input
              id="name"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="請輸入打卡點名稱"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="latitude">緯度</Label>
            <Input
              id="latitude"
              value={latitude}
              onChange={e => setLatitude(e.target.value)}
              placeholder="請輸入緯度"
              required
              type="number"
              step="any"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="longitude">經度</Label>
            <Input
              id="longitude"
              value={longitude}
              onChange={e => setLongitude(e.target.value)}
              placeholder="請輸入經度"
              required
              type="number"
              step="any"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="status">狀態</Label>
            <Select
              value={disabled ? 'disabled' : 'enabled'}
              onValueChange={value => setDisabled(value === 'disabled')}
            >
              <SelectTrigger>
                <SelectValue placeholder="選擇狀態" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="enabled">啟用</SelectItem>
                <SelectItem value="disabled">停用</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
              取消
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? '儲存中...' : '儲存'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditCheckpointDialog;
