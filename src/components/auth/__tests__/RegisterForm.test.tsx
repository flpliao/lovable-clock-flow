import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import RegisterForm from '../RegisterForm';
import { BrowserRouter } from 'react-router-dom';
import React from 'react';

// Mock Supabase client
jest.mock('@/integrations/supabase/client', () => ({
  supabase: {
    auth: {
      signUp: jest.fn(),
    },
  },
}));

// Mock the toast hook
const mockToast = jest.fn();
jest.mock('@/hooks/use-toast', () => ({
  useToast: () => ({
    toast: mockToast,
  }),
}));

// Mock React Router
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

// Test wrapper component
const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <BrowserRouter>{children}</BrowserRouter>
);

// Get the mocked Supabase function
const mockSupabaseSignUp = jest.fn();

describe('RegisterForm', () => {
  beforeEach(async () => {
    jest.clearAllMocks();
    mockToast.mockClear();
    mockNavigate.mockClear();

    // Reset the Supabase mock
    const { supabase } = await import('@/integrations/supabase/client');
    mockSupabaseSignUp.mockClear();
    supabase.auth.signUp = mockSupabaseSignUp;
  });

  describe('Form Rendering', () => {
    it('renders all form elements correctly', () => {
      render(
        <TestWrapper>
          <RegisterForm />
        </TestWrapper>
      );

      expect(screen.getByLabelText('姓名 (選填)')).toBeInTheDocument();
      expect(screen.getByLabelText('電子郵件')).toBeInTheDocument();
      expect(screen.getByLabelText('密碼')).toBeInTheDocument();
      expect(screen.getByLabelText('確認密碼')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: '註冊' })).toBeInTheDocument();
    });

    it('has correct input attributes', () => {
      render(
        <TestWrapper>
          <RegisterForm />
        </TestWrapper>
      );

      const nameInput = screen.getByLabelText('姓名 (選填)');
      const emailInput = screen.getByLabelText('電子郵件');
      const passwordInput = screen.getByLabelText('密碼');
      const confirmPasswordInput = screen.getByLabelText('確認密碼');

      expect(nameInput).toHaveAttribute('type', 'text');
      expect(nameInput).toHaveAttribute('placeholder', '請輸入您的姓名');
      expect(nameInput).not.toHaveAttribute('required');

      expect(emailInput).toHaveAttribute('type', 'email');
      expect(emailInput).toHaveAttribute('placeholder', 'email@example.com');
      expect(emailInput).toHaveAttribute('required');

      expect(passwordInput).toHaveAttribute('type', 'password');
      expect(passwordInput).toHaveAttribute('placeholder', '請輸入密碼 (至少6個字符)');
      expect(passwordInput).toHaveAttribute('required');
      expect(passwordInput).toHaveAttribute('minLength', '6');

      expect(confirmPasswordInput).toHaveAttribute('type', 'password');
      expect(confirmPasswordInput).toHaveAttribute('placeholder', '請再次輸入密碼');
      expect(confirmPasswordInput).toHaveAttribute('required');
      expect(confirmPasswordInput).toHaveAttribute('minLength', '6');
    });

    it('shows authentication information and login link', () => {
      render(
        <TestWrapper>
          <RegisterForm />
        </TestWrapper>
      );

      expect(screen.getByText('已有帳號？立即登入')).toBeInTheDocument();

      const loginLink = screen.getByText('已有帳號？立即登入');
      expect(loginLink.closest('a')).toHaveAttribute('href', '/login');
    });
  });

  describe('User Interactions', () => {
    it('allows typing in all form fields', async () => {
      const user = userEvent.setup();
      render(
        <TestWrapper>
          <RegisterForm />
        </TestWrapper>
      );

      const nameInput = screen.getByLabelText('姓名 (選填)');
      const emailInput = screen.getByLabelText('電子郵件');
      const passwordInput = screen.getByLabelText('密碼');
      const confirmPasswordInput = screen.getByLabelText('確認密碼');

      await user.type(nameInput, '測試用戶');
      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInput, 'password123');
      await user.type(confirmPasswordInput, 'password123');

      expect(nameInput).toHaveValue('測試用戶');
      expect(emailInput).toHaveValue('test@example.com');
      expect(passwordInput).toHaveValue('password123');
      expect(confirmPasswordInput).toHaveValue('password123');
    });

    it('shows loading state during registration', async () => {
      const user = userEvent.setup();

      // Mock a delayed Supabase response
      mockSupabaseSignUp.mockImplementation(
        () =>
          new Promise(resolve =>
            setTimeout(
              () =>
                resolve({
                  data: { user: { id: '1', email: 'test@example.com' }, session: null },
                  error: null,
                }),
              100
            )
          )
      );

      render(
        <TestWrapper>
          <RegisterForm />
        </TestWrapper>
      );

      const emailInput = screen.getByLabelText('電子郵件');
      const passwordInput = screen.getByLabelText('密碼');
      const confirmPasswordInput = screen.getByLabelText('確認密碼');
      const submitButton = screen.getByRole('button', { name: '註冊' });

      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInput, 'password123');
      await user.type(confirmPasswordInput, 'password123');
      await user.click(submitButton);

      // Check loading state
      expect(screen.getByText('註冊中...')).toBeInTheDocument();
      expect(submitButton).toBeDisabled();
    });
  });

  describe('Form Validation', () => {
    it('shows error when passwords do not match', async () => {
      const user = userEvent.setup();
      render(
        <TestWrapper>
          <RegisterForm />
        </TestWrapper>
      );

      const emailInput = screen.getByLabelText('電子郵件');
      const passwordInput = screen.getByLabelText('密碼');
      const confirmPasswordInput = screen.getByLabelText('確認密碼');
      const submitButton = screen.getByRole('button', { name: '註冊' });

      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInput, 'password123');
      await user.type(confirmPasswordInput, 'different123');
      await user.click(submitButton);

      expect(mockToast).toHaveBeenCalledWith({
        variant: 'destructive',
        title: '密碼不匹配',
        description: '請確認密碼輸入一致',
      });

      expect(mockSupabaseSignUp).not.toHaveBeenCalled();
    });

    it('shows error when password is too short', async () => {
      const user = userEvent.setup();
      render(
        <TestWrapper>
          <RegisterForm />
        </TestWrapper>
      );

      const emailInput = screen.getByLabelText('電子郵件');
      const passwordInput = screen.getByLabelText('密碼');
      const confirmPasswordInput = screen.getByLabelText('確認密碼');
      const submitButton = screen.getByRole('button', { name: '註冊' });

      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInput, '123');
      await user.type(confirmPasswordInput, '123');
      await user.click(submitButton);

      expect(mockToast).toHaveBeenCalledWith({
        variant: 'destructive',
        title: '密碼太短',
        description: '密碼長度至少需要6個字符',
      });

      expect(mockSupabaseSignUp).not.toHaveBeenCalled();
    });

    it('allows registration with valid data', async () => {
      const user = userEvent.setup();

      mockSupabaseSignUp.mockResolvedValue({
        data: { user: { id: '1', email: 'test@example.com' }, session: null },
        error: null,
      });

      render(
        <TestWrapper>
          <RegisterForm />
        </TestWrapper>
      );

      const nameInput = screen.getByLabelText('姓名 (選填)');
      const emailInput = screen.getByLabelText('電子郵件');
      const passwordInput = screen.getByLabelText('密碼');
      const confirmPasswordInput = screen.getByLabelText('確認密碼');
      const submitButton = screen.getByRole('button', { name: '註冊' });

      await user.type(nameInput, '測試用戶');
      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInput, 'password123');
      await user.type(confirmPasswordInput, 'password123');
      await user.click(submitButton);

      expect(mockSupabaseSignUp).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: {
            name: '測試用戶',
          },
        },
      });
    });

    it('uses email prefix as name when name field is empty', async () => {
      const user = userEvent.setup();

      mockSupabaseSignUp.mockResolvedValue({
        data: { user: { id: '1', email: 'test@example.com' }, session: null },
        error: null,
      });

      render(
        <TestWrapper>
          <RegisterForm />
        </TestWrapper>
      );

      const emailInput = screen.getByLabelText('電子郵件');
      const passwordInput = screen.getByLabelText('密碼');
      const confirmPasswordInput = screen.getByLabelText('確認密碼');
      const submitButton = screen.getByRole('button', { name: '註冊' });

      // Don't fill name field
      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInput, 'password123');
      await user.type(confirmPasswordInput, 'password123');
      await user.click(submitButton);

      expect(mockSupabaseSignUp).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: {
            name: 'test', // Should use email prefix
          },
        },
      });
    });
  });

  describe('Registration Flow', () => {
    it('handles successful registration with session (immediate login)', async () => {
      const user = userEvent.setup();

      mockSupabaseSignUp.mockResolvedValue({
        data: {
          user: { id: '1', email: 'test@example.com' },
          session: { access_token: 'fake-token', user: { id: '1' } },
        },
        error: null,
      });

      render(
        <TestWrapper>
          <RegisterForm />
        </TestWrapper>
      );

      const emailInput = screen.getByLabelText('電子郵件');
      const passwordInput = screen.getByLabelText('密碼');
      const confirmPasswordInput = screen.getByLabelText('確認密碼');
      const submitButton = screen.getByRole('button', { name: '註冊' });

      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInput, 'password123');
      await user.type(confirmPasswordInput, 'password123');
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockToast).toHaveBeenCalledWith({
          title: '註冊成功',
          description: '歡迎加入！您的帳號已建立完成。',
        });
      });

      // Should navigate to home page after delay
      await waitFor(
        () => {
          expect(mockNavigate).toHaveBeenCalledWith('/');
        },
        { timeout: 1500 }
      );
    });

    it('handles successful registration without session (email confirmation required)', async () => {
      const user = userEvent.setup();

      mockSupabaseSignUp.mockResolvedValue({
        data: {
          user: { id: '1', email: 'test@example.com' },
          session: null,
        },
        error: null,
      });

      render(
        <TestWrapper>
          <RegisterForm />
        </TestWrapper>
      );

      const emailInput = screen.getByLabelText('電子郵件');
      const passwordInput = screen.getByLabelText('密碼');
      const confirmPasswordInput = screen.getByLabelText('確認密碼');
      const submitButton = screen.getByRole('button', { name: '註冊' });

      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInput, 'password123');
      await user.type(confirmPasswordInput, 'password123');
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockToast).toHaveBeenCalledWith({
          title: '註冊成功',
          description: '請檢查您的電子郵件並點擊確認連結來啟用帳號。',
        });
      });

      // Should navigate to login page after delay
      await waitFor(
        () => {
          expect(mockNavigate).toHaveBeenCalledWith('/login');
        },
        { timeout: 2500 }
      );
    });
  });

  describe('Error Handling', () => {
    it('handles user already registered error', async () => {
      const user = userEvent.setup();

      mockSupabaseSignUp.mockResolvedValue({
        data: { user: null, session: null },
        error: { message: 'User already registered' },
      });

      render(
        <TestWrapper>
          <RegisterForm />
        </TestWrapper>
      );

      const emailInput = screen.getByLabelText('電子郵件');
      const passwordInput = screen.getByLabelText('密碼');
      const confirmPasswordInput = screen.getByLabelText('確認密碼');
      const submitButton = screen.getByRole('button', { name: '註冊' });

      await user.type(emailInput, 'existing@example.com');
      await user.type(passwordInput, 'password123');
      await user.type(confirmPasswordInput, 'password123');
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockToast).toHaveBeenCalledWith({
          variant: 'destructive',
          title: '註冊失敗',
          description: '此電子郵件已經註冊過，請直接登入',
        });
      });
    });

    it('handles invalid email error', async () => {
      const user = userEvent.setup();

      mockSupabaseSignUp.mockResolvedValue({
        data: { user: null, session: null },
        error: { message: 'Invalid email' },
      });

      render(
        <TestWrapper>
          <RegisterForm />
        </TestWrapper>
      );

      const emailInput = screen.getByLabelText('電子郵件');
      const passwordInput = screen.getByLabelText('密碼');
      const confirmPasswordInput = screen.getByLabelText('確認密碼');
      const submitButton = screen.getByRole('button', { name: '註冊' });

      // Use a valid email format but mock the server to return invalid email error
      await user.type(emailInput, 'test@invalid-domain');
      await user.type(passwordInput, 'password123');
      await user.type(confirmPasswordInput, 'password123');
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockToast).toHaveBeenCalledWith({
          variant: 'destructive',
          title: '註冊失敗',
          description: '請輸入有效的電子郵件地址',
        });
      });
    });

    it('handles password length error from server', async () => {
      const user = userEvent.setup();

      mockSupabaseSignUp.mockResolvedValue({
        data: { user: null, session: null },
        error: { message: 'Password should be at least 6 characters' },
      });

      render(
        <TestWrapper>
          <RegisterForm />
        </TestWrapper>
      );

      const emailInput = screen.getByLabelText('電子郵件');
      const passwordInput = screen.getByLabelText('密碼');
      const confirmPasswordInput = screen.getByLabelText('確認密碼');
      const submitButton = screen.getByRole('button', { name: '註冊' });

      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInput, 'password123');
      await user.type(confirmPasswordInput, 'password123');
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockToast).toHaveBeenCalledWith({
          variant: 'destructive',
          title: '註冊失敗',
          description: '密碼長度至少需要6個字符',
        });
      });
    });

    it('handles generic registration errors', async () => {
      const user = userEvent.setup();

      mockSupabaseSignUp.mockResolvedValue({
        data: { user: null, session: null },
        error: { message: 'Some unexpected error' },
      });

      render(
        <TestWrapper>
          <RegisterForm />
        </TestWrapper>
      );

      const emailInput = screen.getByLabelText('電子郵件');
      const passwordInput = screen.getByLabelText('密碼');
      const confirmPasswordInput = screen.getByLabelText('確認密碼');
      const submitButton = screen.getByRole('button', { name: '註冊' });

      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInput, 'password123');
      await user.type(confirmPasswordInput, 'password123');
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockToast).toHaveBeenCalledWith({
          variant: 'destructive',
          title: '註冊失敗',
          description: '註冊失敗，請稍後再試',
        });
      });
    });

    it('handles network and exception errors', async () => {
      const user = userEvent.setup();

      mockSupabaseSignUp.mockRejectedValue(new Error('Network error'));

      render(
        <TestWrapper>
          <RegisterForm />
        </TestWrapper>
      );

      const emailInput = screen.getByLabelText('電子郵件');
      const passwordInput = screen.getByLabelText('密碼');
      const confirmPasswordInput = screen.getByLabelText('確認密碼');
      const submitButton = screen.getByRole('button', { name: '註冊' });

      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInput, 'password123');
      await user.type(confirmPasswordInput, 'password123');
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockToast).toHaveBeenCalledWith({
          variant: 'destructive',
          title: '註冊失敗',
          description: '發生錯誤，請稍後再試',
        });
      });
    });
  });

  describe('Form State Management', () => {
    it('resets loading state after successful registration', async () => {
      const user = userEvent.setup();

      mockSupabaseSignUp.mockResolvedValue({
        data: {
          user: { id: '1', email: 'test@example.com' },
          session: { access_token: 'fake-token' },
        },
        error: null,
      });

      render(
        <TestWrapper>
          <RegisterForm />
        </TestWrapper>
      );

      const emailInput = screen.getByLabelText('電子郵件');
      const passwordInput = screen.getByLabelText('密碼');
      const confirmPasswordInput = screen.getByLabelText('確認密碼');
      const submitButton = screen.getByRole('button', { name: '註冊' });

      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInput, 'password123');
      await user.type(confirmPasswordInput, 'password123');
      await user.click(submitButton);

      // Wait for loading to complete
      await waitFor(() => {
        expect(screen.getByText('註冊')).toBeInTheDocument();
        expect(submitButton).not.toBeDisabled();
      });
    });

    it('resets loading state after failed registration', async () => {
      const user = userEvent.setup();

      mockSupabaseSignUp.mockResolvedValue({
        data: { user: null, session: null },
        error: { message: 'Registration failed' },
      });

      render(
        <TestWrapper>
          <RegisterForm />
        </TestWrapper>
      );

      const emailInput = screen.getByLabelText('電子郵件');
      const passwordInput = screen.getByLabelText('密碼');
      const confirmPasswordInput = screen.getByLabelText('確認密碼');
      const submitButton = screen.getByRole('button', { name: '註冊' });

      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInput, 'password123');
      await user.type(confirmPasswordInput, 'password123');
      await user.click(submitButton);

      // Wait for loading to complete
      await waitFor(() => {
        expect(screen.getByText('註冊')).toBeInTheDocument();
        expect(submitButton).not.toBeDisabled();
      });
    });
  });

  describe('Accessibility', () => {
    it('has proper form labels and associations', () => {
      render(
        <TestWrapper>
          <RegisterForm />
        </TestWrapper>
      );

      const nameInput = screen.getByLabelText('姓名 (選填)');
      const emailInput = screen.getByLabelText('電子郵件');
      const passwordInput = screen.getByLabelText('密碼');
      const confirmPasswordInput = screen.getByLabelText('確認密碼');

      expect(nameInput).toHaveAttribute('id', 'name');
      expect(emailInput).toHaveAttribute('id', 'email');
      expect(passwordInput).toHaveAttribute('id', 'password');
      expect(confirmPasswordInput).toHaveAttribute('id', 'confirmPassword');
    });

    it('maintains proper tab order', async () => {
      const user = userEvent.setup();
      render(
        <TestWrapper>
          <RegisterForm />
        </TestWrapper>
      );

      const nameInput = screen.getByLabelText('姓名 (選填)');
      const emailInput = screen.getByLabelText('電子郵件');
      const passwordInput = screen.getByLabelText('密碼');
      const confirmPasswordInput = screen.getByLabelText('確認密碼');
      const submitButton = screen.getByRole('button', { name: '註冊' });

      await user.tab();
      expect(nameInput).toHaveFocus();

      await user.tab();
      expect(emailInput).toHaveFocus();

      await user.tab();
      expect(passwordInput).toHaveFocus();

      await user.tab();
      expect(confirmPasswordInput).toHaveFocus();

      await user.tab();
      expect(submitButton).toHaveFocus();
    });
  });
});
