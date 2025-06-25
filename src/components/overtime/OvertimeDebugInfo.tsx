
import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useUser } from '@/contexts/UserContext';
import { Card } from '@/components/ui/card';

export const OvertimeDebugInfo: React.FC = () => {
  const { currentUser } = useUser();
  const [debugInfo, setDebugInfo] = useState<any>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const checkDebugInfo = async () => {
      try {
        // 檢查當前用戶
        const { data: userData } = await supabase.auth.getUser();
        
        // 檢查員工資料
        const { data: staffData } = await supabase
          .from('staff')
          .select('*')
          .eq('id', userData.user?.id)
          .single();

        // 檢查加班類型
        const { data: overtimeTypes } = await supabase
          .from('overtime_types')
          .select('*')
          .eq('is_active', true);

        // 檢查表格 RLS 政策
        const { data: testInsert, error: insertError } = await supabase
          .from('overtime_requests')
          .insert({
            staff_id: userData.user?.id,
            user_id: userData.user?.id,
            overtime_type: 'regular_overtime',
            overtime_date: '2025-01-01',
            start_time: '09:00',
            end_time: '18:00',
            hours: 9,
            reason: '測試用途',
            status: 'pending'
          })
          .select()
          .single();

        // 如果測試插入成功，立即刪除測試記錄
        if (testInsert) {
          await supabase
            .from('overtime_requests')
            .delete()
            .eq('id', testInsert.id);
        }

        setDebugInfo({
          userData,
          staffData,
          overtimeTypes,
          insertTest: { success: !insertError, error: insertError },
          currentUser
        });
      } catch (error) {
        setDebugInfo({ error: error.message });
      }
    };

    checkDebugInfo();
  }, [currentUser]);

  if (!isVisible) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <button
          onClick={() => setIsVisible(true)}
          className="bg-blue-500 text-white px-3 py-2 rounded text-sm"
        >
          顯示調試信息
        </button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-md">
      <Card className="p-4 bg-white shadow-lg max-h-96 overflow-y-auto">
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-bold text-sm">加班功能調試信息</h3>
          <button
            onClick={() => setIsVisible(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>
        
        <div className="text-xs space-y-2">
          <div>
            <strong>用戶登入狀態:</strong>
            <pre className="bg-gray-100 p-1 rounded mt-1 whitespace-pre-wrap">
              {JSON.stringify({
                isLoggedIn: !!debugInfo?.userData?.user,
                userId: debugInfo?.userData?.user?.id,
                email: debugInfo?.userData?.user?.email
              }, null, 2)}
            </pre>
          </div>

          <div>
            <strong>員工資料:</strong>
            <pre className="bg-gray-100 p-1 rounded mt-1 whitespace-pre-wrap">
              {JSON.stringify(debugInfo?.staffData || 'null', null, 2)}
            </pre>
          </div>

          <div>
            <strong>Context 用戶:</strong>
            <pre className="bg-gray-100 p-1 rounded mt-1 whitespace-pre-wrap">
              {JSON.stringify(debugInfo?.currentUser || 'null', null, 2)}
            </pre>
          </div>

          <div>
            <strong>加班類型 ({debugInfo?.overtimeTypes?.length || 0} 筆):</strong>
            <pre className="bg-gray-100 p-1 rounded mt-1 whitespace-pre-wrap">
              {JSON.stringify(debugInfo?.overtimeTypes?.slice(0, 2) || [], null, 2)}
            </pre>
          </div>

          <div>
            <strong>插入權限測試:</strong>
            <pre className="bg-gray-100 p-1 rounded mt-1 whitespace-pre-wrap">
              {JSON.stringify(debugInfo?.insertTest || 'loading...', null, 2)}
            </pre>
          </div>

          {debugInfo?.error && (
            <div>
              <strong className="text-red-500">錯誤:</strong>
              <pre className="bg-red-100 p-1 rounded mt-1 whitespace-pre-wrap">
                {debugInfo.error}
              </pre>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};
