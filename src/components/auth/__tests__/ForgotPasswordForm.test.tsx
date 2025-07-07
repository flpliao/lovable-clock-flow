import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ForgotPasswordForm from '../ForgotPasswordForm';
import { BrowserRouter } from 'react-router-dom';
import React from 'react';

// Mock Supabase client
jest.mock('@/integrations/supabase/client', () => ({
  supabase: {
    auth: {
      resetPasswordForEmail: jest.fn(),
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
const mockResetPasswordForEmail = jest.fn();

describe('ForgotPasswordForm', () => {
  beforeEach(async () => {
    jest.clearAllMocks();
    mockToast.mockClear();
    mockNavigate.mockClear();

    // Reset the Supabase mock
    const { supabase } = await import('@/integrations/supabase/client');
    mockResetPasswordForEmail.mockClear();
    supabase.auth.resetPasswordForEmail = mockResetPasswordForEmail;
  });

  describe('Form Rendering', () => {
    it('renders email input and submit button', () => {
      render(
        <TestWrapper>
          <ForgotPasswordForm />
        </TestWrapper>
      );

      expect(screen.getByLabelText('電子郵件')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: '發送重設郵件' })).toBeInTheDocument();
    });

    it('has correct input attributes', () => {
      render(
        <TestWrapper>
          <ForgotPasswordForm />
        </TestWrapper>
      );

      const emailInput = screen.getByLabelText('電子郵件');

      expect(emailInput).toHaveAttribute('type', 'email');
      expect(emailInput).toHaveAttribute('placeholder', 'email@example.com');
      expect(emailInput).toHaveAttribute('required');
    });

    it('shows helpful information text', () => {
      render(
        <TestWrapper>
          <ForgotPasswordForm />
        </TestWrapper>
      );

      expect(
        screen.getByText(/如果您未收到郵件，請檢查垃圾郵件資料夾或聯繫系統管理員/)
      ).toBeInTheDocument();
    });
  });

  describe('User Interactions', () => {
    it('allows typing in email field', async () => {
      const user = userEvent.setup();
      render(
        <TestWrapper>
          <ForgotPasswordForm />
        </TestWrapper>
      );

      const emailInput = screen.getByLabelText('電子郵件');

      await user.type(emailInput, 'test@example.com');

      expect(emailInput).toHaveValue('test@example.com');
    });

    it('shows loading state during password reset', async () => {
      const user = userEvent.setup();

      // Mock a delayed Supabase response
      mockResetPasswordForEmail.mockImplementation(
        () => new Promise(resolve => setTimeout(() => resolve({ error: null }), 100))
      );

      render(
        <TestWrapper>
          <ForgotPasswordForm />
        </TestWrapper>
      );

      const emailInput = screen.getByLabelText('電子郵件');
      const submitButton = screen.getByRole('button', { name: '發送重設郵件' });

      await user.type(emailInput, 'test@example.com');
      await user.click(submitButton);

      // Check loading state
      expect(screen.getByText('發送中...')).toBeInTheDocument();
      expect(submitButton).toBeDisabled();
    });
  });

  describe('Form Validation', () => {
    it('shows error when email field is empty', async () => {
      const user = userEvent.setup();
      render(
        <TestWrapper>
          <ForgotPasswordForm />
        </TestWrapper>
      );

      const emailInput = screen.getByLabelText('電子郵件');
      // First type and then clear to bypass HTML validation
      await user.type(emailInput, 'test');
      await user.clear(emailInput);
      await waitFor(() => expect(emailInput).toHaveValue(''));
      // 直接 fireEvent 送出表單，確保 onSubmit 當下 state 為空
      const form = emailInput.closest('form');
      fireEvent.submit(form!);

      await waitFor(() => {
        expect(mockToast).toHaveBeenCalledWith({
          variant: 'destructive',
          title: '請輸入電子郵件',
          description: '請提供有效的電子郵件地址',
        });
      });

      expect(mockResetPasswordForEmail).not.toHaveBeenCalled();
    });

    it('submits form with valid email', async () => {
      const user = userEvent.setup();

      mockResetPasswordForEmail.mockResolvedValue({ error: null });

      render(
        <TestWrapper>
          <ForgotPasswordForm />
        </TestWrapper>
      );

      const emailInput = screen.getByLabelText('電子郵件');
      const submitButton = screen.getByRole('button', { name: '發送重設郵件' });

      await user.type(emailInput, 'test@example.com');
      await user.click(submitButton);

      expect(mockResetPasswordForEmail).toHaveBeenCalledWith('test@example.com', {
        redirectTo: `${window.location.origin}/reset-password`,
      });
    });

    it('handles invalid email error', async () => {
      const user = userEvent.setup();
      mockResetPasswordForEmail.mockResolvedValue({
        error: { message: 'Invalid email', status: 400, name: 'AuthError' },
      });

      render(
        <TestWrapper>
          <ForgotPasswordForm />
        </TestWrapper>
      );

      const emailInput = screen.getByLabelText('電子郵件');
      await user.type(emailInput, 'invalid-email');
      await waitFor(() => expect(emailInput).toHaveValue('invalid-email'));
      const form = emailInput.closest('form');
      fireEvent.submit(form!);

      await waitFor(() => {
        expect(mockToast).toHaveBeenCalledWith({
          variant: 'destructive',
          title: '發送失敗',
          description: '請輸入有效的電子郵件地址',
        });
      });

      expect(screen.getByLabelText('電子郵件')).toBeInTheDocument();
    });
  });

  describe('Password Reset Flow', () => {
    it('handles successful password reset request', async () => {
      const user = userEvent.setup();

      mockResetPasswordForEmail.mockResolvedValue({ error: null });

      render(
        <TestWrapper>
          <ForgotPasswordForm />
        </TestWrapper>
      );

      const emailInput = screen.getByLabelText('電子郵件');
      const submitButton = screen.getByRole('button', { name: '發送重設郵件' });

      await user.type(emailInput, 'test@example.com');
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockToast).toHaveBeenCalledWith({
          title: '郵件已發送',
          description: '請檢查您的電子郵件，點擊重設密碼連結來更新您的密碼。',
        });
      });

      // Should show success state
      expect(screen.getByText('郵件已發送！')).toBeInTheDocument();
      expect(screen.getByText('我們已將重設密碼的連結發送到：')).toBeInTheDocument();
      expect(screen.getByText('test@example.com')).toBeInTheDocument();
    });

    it('shows success screen with detailed instructions', async () => {
      const user = userEvent.setup();

      mockResetPasswordForEmail.mockResolvedValue({ error: null });

      render(
        <TestWrapper>
          <ForgotPasswordForm />
        </TestWrapper>
      );

      const emailInput = screen.getByLabelText('電子郵件');
      const submitButton = screen.getByRole('button', { name: '發送重設郵件' });

      await user.type(emailInput, 'user@company.com');
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('郵件已發送！')).toBeInTheDocument();
      });

      // Check detailed instructions
      expect(
        screen.getByText('請檢查您的郵箱（包括垃圾郵件資料夾），並點擊連結重設密碼。')
      ).toBeInTheDocument();
      expect(screen.getByText('注意事項：')).toBeInTheDocument();
      expect(screen.getByText('• 郵件可能需要幾分鐘才會送達')).toBeInTheDocument();
      expect(screen.getByText('• 請檢查垃圾郵件資料夾')).toBeInTheDocument();
      expect(screen.getByText('• 重設連結有效期為 1 小時')).toBeInTheDocument();
      expect(screen.getByText('• 如未收到郵件，請聯繫系統管理員')).toBeInTheDocument();
    });

    it('allows resending email from success screen', async () => {
      const user = userEvent.setup();

      mockResetPasswordForEmail.mockResolvedValue({ error: null });

      render(
        <TestWrapper>
          <ForgotPasswordForm />
        </TestWrapper>
      );

      const emailInput = screen.getByLabelText('電子郵件');
      const submitButton = screen.getByRole('button', { name: '發送重設郵件' });

      await user.type(emailInput, 'test@example.com');
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('郵件已發送！')).toBeInTheDocument();
      });

      const resendButton = screen.getByRole('button', { name: '重新發送' });
      await user.click(resendButton);

      // Should return to form
      expect(screen.getByLabelText('電子郵件')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: '發送重設郵件' })).toBeInTheDocument();
      expect(screen.getByLabelText('電子郵件')).toHaveValue(''); // Email should be cleared
    });
  });

  describe('Error Handling', () => {
    it('handles email not confirmed error', async () => {
      const user = userEvent.setup();

      mockResetPasswordForEmail.mockResolvedValue({
        error: { message: 'Email not confirmed', status: 400, name: 'AuthError' },
      });

      render(
        <TestWrapper>
          <ForgotPasswordForm />
        </TestWrapper>
      );

      const emailInput = screen.getByLabelText('電子郵件');
      const submitButton = screen.getByRole('button', { name: '發送重設郵件' });

      await user.type(emailInput, 'unconfirmed@example.com');
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockToast).toHaveBeenCalledWith({
          variant: 'destructive',
          title: '發送失敗',
          description: '此電子郵件尚未確認，請先完成註冊流程',
        });
      });
    });

    it('handles security restriction error', async () => {
      const user = userEvent.setup();

      mockResetPasswordForEmail.mockResolvedValue({
        error: {
          message: 'For security purposes, you can only request this once every 60 seconds',
          status: 429,
          name: 'AuthError',
        },
      });

      render(
        <TestWrapper>
          <ForgotPasswordForm />
        </TestWrapper>
      );

      const emailInput = screen.getByLabelText('電子郵件');
      const submitButton = screen.getByRole('button', { name: '發送重設郵件' });

      await user.type(emailInput, 'test@example.com');
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockToast).toHaveBeenCalledWith({
          variant: 'destructive',
          title: '發送失敗',
          description: '為了安全考量，請稍後再試',
        });
      });
    });

    it('handles rate limit error', async () => {
      const user = userEvent.setup();

      mockResetPasswordForEmail.mockResolvedValue({
        error: { message: 'rate limit exceeded', status: 429, name: 'AuthError' },
      });

      render(
        <TestWrapper>
          <ForgotPasswordForm />
        </TestWrapper>
      );

      const emailInput = screen.getByLabelText('電子郵件');
      const submitButton = screen.getByRole('button', { name: '發送重設郵件' });

      await user.type(emailInput, 'test@example.com');
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockToast).toHaveBeenCalledWith({
          variant: 'destructive',
          title: '發送失敗',
          description: '請求過於頻繁，請稍後再試',
        });
      });
    });

    it('handles generic server errors', async () => {
      const user = userEvent.setup();

      mockResetPasswordForEmail.mockResolvedValue({
        error: { message: 'Server error', status: 500, name: 'AuthError' },
      });

      render(
        <TestWrapper>
          <ForgotPasswordForm />
        </TestWrapper>
      );

      const emailInput = screen.getByLabelText('電子郵件');
      const submitButton = screen.getByRole('button', { name: '發送重設郵件' });

      await user.type(emailInput, 'test@example.com');
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockToast).toHaveBeenCalledWith({
          variant: 'destructive',
          title: '發送失敗',
          description: '發送重設郵件失敗，請稍後再試',
        });
      });
    });

    it('handles network and exception errors', async () => {
      const user = userEvent.setup();

      mockResetPasswordForEmail.mockRejectedValue(new Error('Network error'));

      render(
        <TestWrapper>
          <ForgotPasswordForm />
        </TestWrapper>
      );

      const emailInput = screen.getByLabelText('電子郵件');
      const submitButton = screen.getByRole('button', { name: '發送重設郵件' });

      await user.type(emailInput, 'test@example.com');
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockToast).toHaveBeenCalledWith({
          variant: 'destructive',
          title: '發送失敗',
          description: '發生錯誤，請稍後再試',
        });
      });
    });
  });

  describe('Form State Management', () => {
    it('resets loading state after successful submission', async () => {
      const user = userEvent.setup();

      mockResetPasswordForEmail.mockResolvedValue({ error: null });

      render(
        <TestWrapper>
          <ForgotPasswordForm />
        </TestWrapper>
      );

      const emailInput = screen.getByLabelText('電子郵件');
      const submitButton = screen.getByRole('button', { name: '發送重設郵件' });

      await user.type(emailInput, 'test@example.com');
      await user.click(submitButton);

      // Wait for success state to appear
      await waitFor(() => {
        expect(screen.getByText('郵件已發送！')).toBeInTheDocument();
      });

      // Original form should not be visible in success state
      expect(screen.queryByLabelText('電子郵件')).not.toBeInTheDocument();
    });

    it('resets loading state after failed submission', async () => {
      const user = userEvent.setup();

      mockResetPasswordForEmail.mockResolvedValue({
        error: { message: 'Invalid email', status: 400, name: 'AuthError' },
      });

      render(
        <TestWrapper>
          <ForgotPasswordForm />
        </TestWrapper>
      );

      const emailInput = screen.getByLabelText('電子郵件');
      const submitButton = screen.getByRole('button', { name: '發送重設郵件' });

      await user.type(emailInput, 'invalid@email');
      await user.click(submitButton);

      // Wait for error handling to complete
      await waitFor(() => {
        expect(screen.getByText('發送重設郵件')).toBeInTheDocument();
        expect(submitButton).not.toBeDisabled();
      });
    });

    it('preserves email value during loading state', async () => {
      const user = userEvent.setup();

      // Mock a slow response
      mockResetPasswordForEmail.mockImplementation(
        () => new Promise(resolve => setTimeout(() => resolve({ error: null }), 200))
      );

      render(
        <TestWrapper>
          <ForgotPasswordForm />
        </TestWrapper>
      );

      const emailInput = screen.getByLabelText('電子郵件');
      const submitButton = screen.getByRole('button', { name: '發送重設郵件' });

      await user.type(emailInput, 'test@example.com');
      await user.click(submitButton);

      // During loading, email should still be visible
      expect(screen.getByText('發送中...')).toBeInTheDocument();
      expect(emailInput).toHaveValue('test@example.com');
    });
  });

  describe('Accessibility', () => {
    it('has proper form label associations', () => {
      render(
        <TestWrapper>
          <ForgotPasswordForm />
        </TestWrapper>
      );

      const emailInput = screen.getByLabelText('電子郵件');
      expect(emailInput).toHaveAttribute('id', 'email');
    });

    it('maintains proper tab order', async () => {
      const user = userEvent.setup();
      render(
        <TestWrapper>
          <ForgotPasswordForm />
        </TestWrapper>
      );

      const emailInput = screen.getByLabelText('電子郵件');
      const submitButton = screen.getByRole('button', { name: '發送重設郵件' });

      await user.tab();
      expect(emailInput).toHaveFocus();

      await user.tab();
      expect(submitButton).toHaveFocus();
    });

    it('has proper accessibility in success state', async () => {
      const user = userEvent.setup();

      mockResetPasswordForEmail.mockResolvedValue({ error: null });

      render(
        <TestWrapper>
          <ForgotPasswordForm />
        </TestWrapper>
      );

      const emailInput = screen.getByLabelText('電子郵件');
      const submitButton = screen.getByRole('button', { name: '發送重設郵件' });

      await user.type(emailInput, 'test@example.com');
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('郵件已發送！')).toBeInTheDocument();
      });

      const resendButton = screen.getByRole('button', { name: '重新發送' });
      expect(resendButton).toBeInTheDocument();

      // Check that the resend button is focusable
      await user.tab();
      expect(resendButton).toHaveFocus();
    });
  });

  describe('Component Integration', () => {
    it('renders without crashing', () => {
      const { container } = render(
        <TestWrapper>
          <ForgotPasswordForm />
        </TestWrapper>
      );

      expect(container.firstChild).toBeInTheDocument();
    });

    it('displays correct email in success state', async () => {
      const user = userEvent.setup();
      const testEmail = 'user@domain.com';

      mockResetPasswordForEmail.mockResolvedValue({ error: null });

      render(
        <TestWrapper>
          <ForgotPasswordForm />
        </TestWrapper>
      );

      const emailInput = screen.getByLabelText('電子郵件');
      const submitButton = screen.getByRole('button', { name: '發送重設郵件' });

      await user.type(emailInput, testEmail);
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(testEmail)).toBeInTheDocument();
      });
    });
  });
});
