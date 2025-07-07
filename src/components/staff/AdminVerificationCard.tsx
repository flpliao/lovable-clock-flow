import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useCurrentUser } from '@/hooks/useStores';
import { permissionService } from '@/services/simplifiedPermissionService';
import { CheckCircle, Shield } from 'lucide-react';

const AdminVerificationCard = () => {
  const currentUser = useCurrentUser();
  const isAdmin = permissionService.isAdmin();

  return (
    <Card className="mb-2 border-blue-200 bg-blue-50">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center text-lg">
          <Shield className="h-5 w-5 mr-2 text-blue-600" />
          管理者身份確認
        </CardTitle>
        <CardDescription>目前登入用戶：{currentUser?.name || '未知'}</CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className="text-sm text-gray-600">權限狀態：</span>
            {isAdmin ? (
              <Badge className="bg-green-100 text-green-800 border-green-300">
                <CheckCircle className="h-3 w-3 mr-1" />
                管理者
              </Badge>
            ) : (
              <Badge variant="secondary">一般用戶</Badge>
            )}
          </div>
        </div>

        {isAdmin && (
          <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded-md">
            <p className="text-sm text-green-700 flex items-center">
              <CheckCircle className="h-4 w-4 mr-2" />
              已確認管理者權限，可管理所有員工和系統設定
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AdminVerificationCard;
