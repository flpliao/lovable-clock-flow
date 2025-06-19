
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useUser } from '@/contexts/UserContext';
import { UserIdValidationService } from '@/services/userIdValidationService';
import { useStaffManagementContext } from '@/contexts/StaffManagementContext';

interface LoginFormProps {
  findUserByEmail: (email: string) => { userId: string, credentials: { userId: string, email: string, password: string } } | null;
}

const LoginForm: React.FC<LoginFormProps> = ({ findUserByEmail }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();
  const { toast } = useToast();
  const { setCurrentUser } = useUser();
  const { staffList } = useStaffManagementContext();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    console.log('🔑 員工登入嘗試:', email);
    
    try {
      // Find user by email from staff credentials
      const userFound = findUserByEmail(email);
      console.log('🔍 員工搜尋結果:', userFound);
      
      if (userFound) {
        console.log('✅ 找到員工憑證:', userFound.credentials);
        
        if (userFound.credentials.password === password) {
          // 從員工清單中找到對應的員工資料
          const staffMember = staffList.find(staff => staff.id === userFound.userId);
          
          if (staffMember) {
            console.log('👤 員工資料:', staffMember);
            
            const validatedUserId = UserIdValidationService.validateUserId(userFound.userId);
            
            const userData = {
              id: validatedUserId,
              name: staffMember.name,
              position: staffMember.position,
              department: staffMember.department,
              onboard_date: '2023-01-15', // 預設入職日期
              role: staffMember.role as 'admin' | 'manager' | 'user',
            };
            
            console.log('✅ 員工登入成功:', userData);
            setCurrentUser(userData);
            
            toast({
              title: '登錄成功',
              description: `歡迎回來，${staffMember.name}！`,
            });
            
            navigate('/');
          } else {
            console.log('❌ 找不到對應的員工資料');
            toast({
              variant: 'destructive',
              title: '登錄失敗',
              description: '員工資料不存在，請聯繫管理員',
            });
          }
        } else {
          console.log('❌ 密碼不正確');
          toast({
            variant: 'destructive',
            title: '登錄失敗',
            description: '電子郵件或密碼不正確',
          });
        }
      } else {
        console.log('❌ 找不到該電子郵件的帳號');
        toast({
          variant: 'destructive',
          title: '登錄失敗',
          description: '電子郵件或密碼不正確',
        });
      }
    } catch (error) {
      console.error('❌ 登入系統錯誤:', error);
      toast({
        variant: 'destructive',
        title: '登錄失敗',
        description: '發生錯誤，請稍後再試',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleLogin} className="mt-8 space-y-6">
      <div className="space-y-2">
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          電子郵件
        </label>
        <Input
          id="email"
          type="email"
          placeholder="請輸入您的公司電子郵件"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full"
        />
      </div>
      
      <div className="space-y-2">
        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
          密碼
        </label>
        <Input
          id="password"
          type="password"
          placeholder="請輸入密碼"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full"
        />
      </div>
      
      <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
        <p><strong>員工登入須知：</strong></p>
        <p>• 請使用公司分配給您的電子郵件地址</p>
        <p>• 如果是首次登入，預設密碼為 password123</p>
        <p>• 登入後請立即修改您的密碼</p>
        <p>• 如有登入問題，請聯繫系統管理員</p>
        {staffList && staffList.length > 0 && (
          <p>• 系統已載入 {staffList.length} 位員工帳號</p>
        )}
      </div>
      
      <Button
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-700"
        disabled={isLoading}
      >
        {isLoading ? '登入中...' : '登入'}
      </Button>
    </form>
  );
};

export default LoginForm;
