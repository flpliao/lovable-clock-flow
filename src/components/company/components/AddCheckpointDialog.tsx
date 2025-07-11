import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { addCheckpoint } from './useCheckpoints';

const AddCheckpointDialog = ({
  open,
  onClose,
  onSuccess,
}: {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}) => {
  const [name, setName] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addCheckpoint({
        name,
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
      });
      setName('');
      setLatitude('');
      setLongitude('');
      onClose();
      onSuccess?.();
    } catch (err) {
      alert('新增失敗');
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl">
        <h2 className="text-xl font-bold mb-4">新增 Checkpoint</h2>
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
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
              取消
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? '新增中...' : '新增'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCheckpointDialog;
