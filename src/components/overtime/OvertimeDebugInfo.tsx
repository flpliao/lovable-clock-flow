
import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useUser } from '@/contexts/UserContext';
import { Card } from '@/components/ui/card';
import { overtimeService } from '@/services/overtimeService';

export const OvertimeDebugInfo: React.FC = () => {
  const { currentUser } = useUser();
  const [debugInfo, setDebugInfo] = useState<any>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const checkDebugInfo = async () => {
      try {
        // 檢查認證狀態
        const authStatus = await overtimeService.checkUserAuthentication();
        
        // 檢查員工資料
        const { data: staffData } = await supabase
          .from('staff')
          .select('*')
          .eq('id', authStatus.user?.id)
          .single();

        // 檢查加班類型
        const { data: overtimeTypes } = await supabase
          .from('overtime_types')
          .select('*')
          .eq('is_active', true);

        // 檢查 RLS 政策 - 嘗試插入測試記錄
        let insertTest = { success: false, error: null };
        if (authStatus.isAuthenticated) {
          try {
            const testData = {
              staff_id: authStatus.user.id,
              user_id: authStatus.user.id,
              overtime_type: 'regular_overtime',
              overtime_date: '2025-01-01',
              start_time: '09:00',
              end_time: '18:00',
              hours: 9,
              reason: '測試用途 - 權限檢查',
              status: 'pending'
            };

            console.log('🧪 測試 RLS 插入權限，數據:', testData);
            
            const { data: testInsert, error: insertError } = await supabase
              .from('overtime_requests')
              .insert(testData)
              .select()
              .single();

            if (testInsert) {
              // 測試成功，立即刪除測試記錄
              await supabase
                .from('overtime_requests')
                .delete()
                .eq('id', testInsert.id);
              
              insertTest = { success: true, error: null };
              console.log('✅ RLS 插入測試成功');
            } else if (insertError) {
              insertTest = { success: false, error: insertError };
              console.log('❌ RLS 插入測試失敗:', insertError);
            }
          } catch (testError) {
            insertTest = { success: false, error: testError };
            console.log('❌ RLS 插入測試異常:', testError);
          }
        }

        setDebugInfo({
          authStatus,
          staffData,
          overtimeTypes,
          insertTest,
          currentUser
        });
      } catch (error) {
        console.error('❌ 調試信息收集失敗:', error);
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
          className="bg-blue-500 text-white px-3 py-2 rounded text-sm shadow-lg hover:bg-blue-600 transition-colors"
        >
          顯示調試信息
        </button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-lg">
      <Card className="p-4 bg-white shadow-xl max-h-96 overflow-y-auto">
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-bold text-sm">加班功能調試信息</h3>
          <button
            onClick={() => setIsVisible(false)}
            className="text-gray-500 hover:text-gray-700 text-lg"
          >
            ✕
          </button>
        </div>
        
        <div className="text-xs space-y-3">
          <div>
            <strong className="text-blue-600">🔐 認證狀態:</strong>
            <pre className="bg-blue-50 p-2 rounded mt-1 whitespace-pre-wrap text-xs">
              {JSON.stringify({
                isAuthenticated: debugInfo?.authStatus?.isAuthenticated,
                hasUser: !!debugInfo?.authStatus?.user,
                hasSession: !!debugInfo?.authStatus?.session,
                userId: debugInfo?.authStatus?.user?.id,
                userEmail: debugInfo?.authStatus?.user?.email
              }, null, 2)}
            </pre>
          </div>

          <div>
            <strong className="text-green-600">👤 員工資料:</strong>
            <pre className="bg-green-50 p-2 rounded mt-1 whitespace-pre-wrap text-xs">
              {JSON.stringify(debugInfo?.staffData ? {
                id: debugInfo.staffData.id,
                name: debugInfo.staffData.name,
                role: debugInfo.staffData.role,
                department: debugInfo.staffData.department
              } : 'null', null, 2)}
            </pre>
          </div>

          <div>
            <strong className="text-purple-600">📋 Context 用戶:</strong>
            <pre className="bg-purple-50 p-2 rounded mt-1 whitespace-pre-wrap text-xs">
              {JSON.stringify(debugInfo?.currentUser ? {
                id: debugInfo.currentUser.id,
                name: debugInfo.currentUser.name,
                role: debugInfo.currentUser.role
              } : 'null', null, 2)}
            </pre>
          </div>

          <div>
            <strong className="text-orange-600">⚙️ 加班類型 ({debugInfo?.overtimeTypes?.length || 0} 筆):</strong>
            <pre className="bg-orange-50 p-2 rounded mt-1 whitespace-pre-wrap text-xs">
              {JSON.stringify(debugInfo?.overtimeTypes?.slice(0, 2)?.map(t => ({
                code: t.code,
                name_zh: t.name_zh,
                is_active: t.is_active
              })) || [], null, 2)}
            </pre>
          </div>

          <div>
            <strong className={`${debugInfo?.insertTest?.success ? 'text-green-600' : 'text-red-600'}`}>
              🧪 RLS 插入權限測試:
            </strong>
            <pre className={`${debugInfo?.insertTest?.success ? 'bg-green-50' : 'bg-red-50'} p-2 rounded mt-1 whitespace-pre-wrap text-xs`}>
              {JSON.stringify({
                success: debugInfo?.insertTest?.success || false,
                errorCode: debugInfo?.insertTest?.error?.code,
                errorMessage: debugInfo?.insertTest?.error?.message
              }, null, 2)}
            </pre>
          </div>

          {debugInfo?.error && (
            <div>
              <strong className="text-red-500">❌ 錯誤:</strong>
              <pre className="bg-red-100 p-2 rounded mt-1 whitespace-pre-wrap text-xs">
                {debugInfo.error}
              </pre>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};
