import { supabase } from '@/integrations/supabase/client';
import { useEffect, useState } from 'react';

export interface Checkpoint {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  created_at: string;
  disabled_at: string | null;
}

export function useCheckpoints() {
  const [data, setData] = useState<Checkpoint[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCheckpoints = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('checkpoints')
      .select('*')
      .order('id', { ascending: true });
    if (!error && data) setData(data as Checkpoint[]);
    setLoading(false);
  };

  useEffect(() => {
    fetchCheckpoints();
  }, []);

  return { data, loading, refresh: fetchCheckpoints };
}

export async function addCheckpoint(payload: Omit<Checkpoint, 'id' | 'created_at'>) {
  const { data, error } = await supabase.from('checkpoints').insert([payload]).select();
  if (error) throw error;
  return data;
}

export async function updateCheckpoint(id: number, payload: Partial<Checkpoint>) {
  const { data, error } = await supabase.from('checkpoints').update(payload).eq('id', id).select();
  if (error) throw error;
  return data;
}

export async function deleteCheckpoint(id: number) {
  const { error } = await supabase.from('checkpoints').delete().eq('id', id);
  if (error) throw error;
}
