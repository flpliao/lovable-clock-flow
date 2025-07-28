import { API_ROUTES } from '@/routes/constants';
import { callApiAndDecode } from '@/utils/apiHelper';
import { axiosWithEmployeeAuth } from '@/utils/axiosWithEmployeeAuth';

export async function updateEmployeeEmail(currentEmail: string, newEmail: string): Promise<void> {
  if (!newEmail || !newEmail.includes('@')) {
    throw new Error('請輸入有效的電子郵件地址');
  }

  if (newEmail === currentEmail) {
    throw new Error('新電子郵件地址與當前地址相同');
  }

  const { status } = await callApiAndDecode(
    axiosWithEmployeeAuth().put(API_ROUTES.EMPLOYEE.UPDATE_EMAIL, { email: newEmail })
  );

  if (status === 'error') {
    throw new Error('電子郵件更新失敗');
  }
}

export async function updateEmployeePassword(
  currentPassword: string,
  newPassword: string,
  confirmPassword: string
): Promise<void> {
  if (!currentPassword.trim()) {
    throw new Error('目前密碼不能為空');
  }

  if (!newPassword.trim()) {
    throw new Error('新密碼不能為空');
  }

  if (newPassword.length < 6) {
    throw new Error('新密碼至少需要6個字符');
  }

  if (newPassword !== confirmPassword) {
    throw new Error('新密碼與確認密碼不一致');
  }

  const { status } = await callApiAndDecode(
    axiosWithEmployeeAuth().put(API_ROUTES.EMPLOYEE.UPDATE_PASSWORD, {
      current_password: currentPassword,
      new_password: newPassword,
      new_password_confirmation: confirmPassword,
    })
  );

  if (status === 'error') {
    throw new Error('密碼更新失敗');
  }
}
