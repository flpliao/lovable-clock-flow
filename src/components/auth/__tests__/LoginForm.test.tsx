import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LoginForm from '../LoginForm';
import { AuthService } from '@/services/authService';

// Mock the AuthService
jest.mock('@/services/authService', () => ({
  AuthService: {
    authenticate: jest.fn(),
  },
}));

// Mock the hooks
const mockToast = jest.fn();
const mockSetCurrentUser = jest.fn();
const mockSetIsAuthenticated = jest.fn();

jest.mock('@/hooks/use-toast', () => ({
  useToast: () => ({
    toast: mockToast,
  }),
}));

jest.mock('@/hooks/useStores', () => ({
  useUserActions: () => ({
    setCurrentUser: mockSetCurrentUser,
    setIsAuthenticated: mockSetIsAuthenticated,
  }),
}));

// Mock React Router
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}));

describe('LoginForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockToast.mockClear();
    mockSetCurrentUser.mockClear();
    mockSetIsAuthenticated.mockClear();
    mockNavigate.mockClear();
  });

  describe('Form Rendering', () => {
    it('renders all form elements correctly', () => {
      render(<LoginForm />);

      expect(screen.getByLabelText('電子郵件')).toBeInTheDocument();
      expect(screen.getByLabelText('密碼')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: '登入' })).toBeInTheDocument();
    });

    it('has correct input attributes', () => {
      render(<LoginForm />);

      const emailInput = screen.getByLabelText('電子郵件');
      const passwordInput = screen.getByLabelText('密碼');

      expect(emailInput).toHaveAttribute('type', 'email');
      expect(emailInput).toHaveAttribute('placeholder', 'email@example.com');
      expect(emailInput).toHaveAttribute('required');

      expect(passwordInput).toHaveAttribute('type', 'password');
      expect(passwordInput).toHaveAttribute('placeholder', '請輸入密碼');
      expect(passwordInput).toHaveAttribute('required');
    });

    it('shows authentication information', () => {
      render(<LoginForm />);

      expect(screen.getByText('使用 Supabase Auth 系統進行安全認證')).toBeInTheDocument();
    });
  });

  describe('User Interactions', () => {
    it('allows typing in form fields', async () => {
      const user = userEvent.setup();
      render(<LoginForm />);

      const emailInput = screen.getByLabelText('電子郵件');
      const passwordInput = screen.getByLabelText('密碼');

      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInput, 'password123');

      expect(emailInput).toHaveValue('test@example.com');
      expect(passwordInput).toHaveValue('password123');
    });

    it('shows loading state during authentication', async () => {
      const user = userEvent.setup();
      const mockAuthService = AuthService.authenticate as jest.Mock;

      // Mock a delayed response
      mockAuthService.mockImplementation(
        () =>
          new Promise(resolve =>
            setTimeout(() => resolve({ success: true, user: { id: '1', name: 'Test User' } }), 100)
          )
      );

      render(<LoginForm />);

      const emailInput = screen.getByLabelText('電子郵件');
      const passwordInput = screen.getByLabelText('密碼');
      const submitButton = screen.getByRole('button', { name: '登入' });

      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInput, 'password123');
      await user.click(submitButton);

      // Check loading state
      expect(screen.getByText('登入中...')).toBeInTheDocument();
      expect(submitButton).toBeDisabled();
      expect(emailInput).toBeDisabled();
      expect(passwordInput).toBeDisabled();
    });
  });

  describe('Authentication Flow', () => {
    it('calls AuthService.authenticate with correct credentials', async () => {
      const user = userEvent.setup();
      const mockAuthService = AuthService.authenticate as jest.Mock;
      mockAuthService.mockResolvedValue({ success: true, user: { id: '1', name: 'Test User' } });

      render(<LoginForm />);

      const emailInput = screen.getByLabelText('電子郵件');
      const passwordInput = screen.getByLabelText('密碼');
      const submitButton = screen.getByRole('button', { name: '登入' });

      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInput, 'password123');
      await user.click(submitButton);

      expect(mockAuthService).toHaveBeenCalledWith('test@example.com', 'password123');
    });

    it('prevents submission with empty fields', async () => {
      const user = userEvent.setup();
      const mockAuthService = AuthService.authenticate as jest.Mock;

      render(<LoginForm />);

      const submitButton = screen.getByRole('button', { name: '登入' });

      await user.click(submitButton);

      // Should not call AuthService
      expect(mockAuthService).not.toHaveBeenCalled();
    });

    it('handles authentication success', async () => {
      const user = userEvent.setup();
      const mockAuthService = AuthService.authenticate as jest.Mock;

      // Mock successful authentication
      mockAuthService.mockResolvedValue({
        success: true,
        user: {
          id: '1',
          name: 'Test User',
          email: 'test@example.com',
          position: 'Developer',
          department: 'Engineering',
          role_id: 1,
          onboard_date: '2023-01-01',
        },
      });

      render(<LoginForm />);

      const emailInput = screen.getByLabelText('電子郵件');
      const passwordInput = screen.getByLabelText('密碼');
      const submitButton = screen.getByRole('button', { name: '登入' });

      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInput, 'password123');
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockSetCurrentUser).toHaveBeenCalledWith({
          id: '1',
          name: 'Test User',
          position: 'Developer',
          department: 'Engineering',
          onboard_date: '2023-01-01',
          role_id: 1,
          email: 'test@example.com',
        });
        expect(mockSetIsAuthenticated).toHaveBeenCalledWith(true);
      });
    });

    it('handles authentication failure', async () => {
      const user = userEvent.setup();
      const mockAuthService = AuthService.authenticate as jest.Mock;

      // Mock failed authentication
      mockAuthService.mockResolvedValue({
        success: false,
        error: 'Invalid login credentials',
      });

      render(<LoginForm />);

      const emailInput = screen.getByLabelText('電子郵件');
      const passwordInput = screen.getByLabelText('密碼');
      const submitButton = screen.getByRole('button', { name: '登入' });

      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInput, 'wrongpassword');
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockToast).toHaveBeenCalledWith({
          variant: 'destructive',
          title: '登入失敗',
          description: '帳號或密碼不正確',
        });
      });
    });
  });

  describe('Error Handling', () => {
    it('handles network errors', async () => {
      const user = userEvent.setup();
      const mockAuthService = AuthService.authenticate as jest.Mock;

      // Mock network error
      mockAuthService.mockRejectedValue(new Error('Network error'));

      render(<LoginForm />);

      const emailInput = screen.getByLabelText('電子郵件');
      const passwordInput = screen.getByLabelText('密碼');
      const submitButton = screen.getByRole('button', { name: '登入' });

      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInput, 'password123');
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockToast).toHaveBeenCalledWith({
          variant: 'destructive',
          title: '登入失敗',
          description: '系統發生錯誤，請稍後再試',
        });
      });
    });

    it('handles different error types', async () => {
      const user = userEvent.setup();
      const mockAuthService = AuthService.authenticate as jest.Mock;

      // Mock email not confirmed error
      mockAuthService.mockResolvedValue({
        success: false,
        error: 'Email not confirmed',
      });

      render(<LoginForm />);

      const emailInput = screen.getByLabelText('電子郵件');
      const passwordInput = screen.getByLabelText('密碼');
      const submitButton = screen.getByRole('button', { name: '登入' });

      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInput, 'password123');
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockToast).toHaveBeenCalledWith({
          variant: 'destructive',
          title: '登入失敗',
          description: '請先確認您的電子郵件',
        });
      });
    });
  });

  describe('Form State Management', () => {
    it('resets loading state after successful authentication', async () => {
      const user = userEvent.setup();
      const mockAuthService = AuthService.authenticate as jest.Mock;

      mockAuthService.mockResolvedValue({
        success: true,
        user: { id: '1', name: 'Test User' },
      });

      render(<LoginForm />);

      const emailInput = screen.getByLabelText('電子郵件');
      const passwordInput = screen.getByLabelText('密碼');
      const submitButton = screen.getByRole('button', { name: '登入' });

      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInput, 'password123');
      await user.click(submitButton);

      // Wait for loading to complete
      await waitFor(() => {
        expect(screen.getByText('登入')).toBeInTheDocument();
        expect(submitButton).not.toBeDisabled();
      });
    });

    it('resets loading state after failed authentication', async () => {
      const user = userEvent.setup();
      const mockAuthService = AuthService.authenticate as jest.Mock;

      mockAuthService.mockResolvedValue({
        success: false,
        error: 'Invalid credentials',
      });

      render(<LoginForm />);

      const emailInput = screen.getByLabelText('電子郵件');
      const passwordInput = screen.getByLabelText('密碼');
      const submitButton = screen.getByRole('button', { name: '登入' });

      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInput, 'wrongpassword');
      await user.click(submitButton);

      // Wait for loading to complete
      await waitFor(() => {
        expect(screen.getByText('登入')).toBeInTheDocument();
        expect(submitButton).not.toBeDisabled();
      });
    });
  });

  describe('Accessibility', () => {
    it('has proper form labels and associations', () => {
      render(<LoginForm />);

      const emailInput = screen.getByLabelText('電子郵件');
      const passwordInput = screen.getByLabelText('密碼');

      expect(emailInput).toHaveAttribute('id', 'email');
      expect(passwordInput).toHaveAttribute('id', 'password');
    });

    it('maintains proper tab order', async () => {
      const user = userEvent.setup();
      render(<LoginForm />);

      const emailInput = screen.getByLabelText('電子郵件');
      const passwordInput = screen.getByLabelText('密碼');
      const submitButton = screen.getByRole('button', { name: '登入' });

      await user.tab();
      expect(emailInput).toHaveFocus();

      await user.tab();
      expect(passwordInput).toHaveFocus();

      await user.tab();
      expect(submitButton).toHaveFocus();
    });
  });
});
