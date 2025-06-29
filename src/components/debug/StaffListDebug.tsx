
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RefreshCw, Users, Shield, Eye } from 'lucide-react';

interface StaffData {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  position: string;
  user_id: string;
  created_at: string;
}

const StaffListDebug = () => {
  const [staffList, setStaffList] = useState<StaffData[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  const loadStaffData = async () => {
    try {
      setLoading(true);
      console.log('🔍 開始載入員工資料調試...');

      // 獲取當前用戶資訊
      const { data: { user } } = await supabase.auth.getUser();
      setCurrentUser(user);

      // 檢查管理員權限
      const { data: adminCheck } = await supabase.rpc('is_current_user_admin_safe');
      setIsAdmin(adminCheck || false);

      // 查詢員工資料
      const { data, error } = await supabase
        .from('staff')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('❌ 查詢員工資料失敗:', error);
        return;
      }

      console.log('✅ 員工資料查詢成功:', data);
      setStaffList(data || []);

    } catch (error) {
      console.error('❌ 載入員工資料時發生錯誤:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStaffData();
  }, []);

  return (
    <div className="p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            員工資料調試工具
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* 當前用戶資訊 */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <Shield className="h-4 w-4" />
                當前用戶資訊
              </h3>
              <div className="text-sm space-y-1">
                <p><span className="font-medium">Email:</span> {currentUser?.email || 'N/A'}</p>
                <p><span className="font-medium">用戶ID:</span> {currentUser?.id || 'N/A'}</p>
                <p><span className="font-medium">超級管理員:</span> {isAdmin ? '是' : '否'}</p>
              </div>
            </div>

            {/* 重新載入按鈕 */}
            <Button 
              onClick={loadStaffData} 
              disabled={loading}
              className="flex items-center gap-2"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              重新載入員工資料
            </Button>

            {/* 員工資料列表 */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Eye className="h-4 w-4" />
                可訪問的員工資料 ({staffList.length} 人)
              </h3>
              
              {loading ? (
                <p className="text-gray-500">載入中...</p>
              ) : staffList.length === 0 ? (
                <p className="text-gray-500">沒有找到員工資料</p>
              ) : (
                <div className="space-y-3">
                  {staffList.map((staff, index) => (
                    <div key={staff.id} className="bg-white p-3 rounded border">
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <span className="font-medium">#{index + 1} 姓名:</span> {staff.name}
                        </div>
                        <div>
                          <span className="font-medium">Email:</span> {staff.email || 'N/A'}
                        </div>
                        <div>
                          <span className="font-medium">角色:</span> {staff.role}
                        </div>
                        <div>
                          <span className="font-medium">部門:</span> {staff.department}
                        </div>
                        <div>
                          <span className="font-medium">職位:</span> {staff.position}
                        </div>
                        <div>
                          <span className="font-medium">員工ID:</span> {staff.id.substring(0, 8)}...
                        </div>
                        <div>
                          <span className="font-medium">用戶ID:</span> {staff.user_id?.substring(0, 8) || 'N/A'}...
                        </div>
                        <div>
                          <span className="font-medium">建立時間:</span> {new Date(staff.created_at).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StaffListDebug;
