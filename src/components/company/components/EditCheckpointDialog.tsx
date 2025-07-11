import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { updateCheckpoint, Checkpoint } from './useCheckpoints';

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
    } catch (err) {
      alert('更新失敗');
    } finally {
      setLoading(false);
    }
  };

  if (!open || !checkpoint) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl">
        <h2 className="text-xl font-bold mb-4">編輯 Checkpoint</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1">名稱</label>
            <input
              className="w-full border rounded px-3 py-2"
              value={name}
              onChange={e => setName(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block mb-1">緯度</label>
            <input
              className="w-full border rounded px-3 py-2"
              value={latitude}
              onChange={e => setLatitude(e.target.value)}
              required
              type="number"
              step="any"
            />
          </div>
          <div>
            <label className="block mb-1">經度</label>
            <input
              className="w-full border rounded px-3 py-2"
              value={longitude}
              onChange={e => setLongitude(e.target.value)}
              required
              type="number"
              step="any"
            />
          </div>
          <div>
            <label className="block mb-1">狀態</label>
            <select
              className="w-full border rounded px-3 py-2"
              value={disabled ? 'disabled' : 'enabled'}
              onChange={e => setDisabled(e.target.value === 'disabled')}
            >
              <option value="enabled">啟用</option>
              <option value="disabled">停用</option>
            </select>
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
