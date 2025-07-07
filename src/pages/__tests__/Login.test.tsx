import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Login from '../Login';
import React from 'react';
import * as useStores from '@/hooks/useStores';

// Mock the store hooks
const mockCurrentUser = null;
const mockIsAuthenticated = false;
const mockIsUserLoaded = false;
const mockIsInitializing = true;

jest.mock('@/hooks/useStores', () => ({
  useCurrentUser: jest.fn(() => mockCurrentUser),
  useAuthenticated: jest.fn(() => mockIsAuthenticated),
  useUserLoaded: jest.fn(() => mockIsUserLoaded),
  useAuthInitializing: jest.fn(() => mockIsInitializing),
  useAutoInitAuth: jest.fn(),
}));

// Mock the LoginForm component
jest.mock('@/components/auth/LoginForm', () => {
  return function MockLoginForm() {
    return <div data-testid="login-form">Login Form</div>;
  };
});

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

// Test wrapper component
const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <BrowserRouter>{children}</BrowserRouter>
);

describe('Login Page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Loading States', () => {
    it('shows loading state when initializing', () => {
      // Mock initializing state
      (useStores.useAuthInitializing as jest.Mock).mockReturnValue(true);
      (useStores.useUserLoaded as jest.Mock).mockReturnValue(false);
      (useStores.useAuthenticated as jest.Mock).mockReturnValue(false);

      const { container } = render(
        <TestWrapper>
          <Login />
        </TestWrapper>
      );

      expect(screen.getByText('載入中...')).toBeInTheDocument();
      // Check for loading spinner element
      expect(container.querySelector('.animate-spin')).toBeInTheDocument();
    });

    it('shows redirecting state when user is authenticated', () => {
      // Mock authenticated state
      (useStores.useAuthInitializing as jest.Mock).mockReturnValue(false);
      (useStores.useUserLoaded as jest.Mock).mockReturnValue(false);
      (useStores.useAuthenticated as jest.Mock).mockReturnValue(true);

      render(
        <TestWrapper>
          <Login />
        </TestWrapper>
      );

      expect(screen.getByText('正在跳轉...')).toBeInTheDocument();
    });
  });

  describe('Login Form Rendering', () => {
    beforeEach(() => {
      // Mock loaded but not authenticated state
      (useStores.useAuthInitializing as jest.Mock).mockReturnValue(false);
      (useStores.useUserLoaded as jest.Mock).mockReturnValue(true);
      (useStores.useAuthenticated as jest.Mock).mockReturnValue(false);
      (useStores.useCurrentUser as jest.Mock).mockReturnValue(null);
    });

    it('renders login form when not authenticated', () => {
      render(
        <TestWrapper>
          <Login />
        </TestWrapper>
      );

      expect(screen.getByText('考勤系統')).toBeInTheDocument();
      expect(screen.getByText('請登入您的帳號')).toBeInTheDocument();
      expect(screen.getByTestId('login-form')).toBeInTheDocument();
    });

    it('renders all navigation links', () => {
      render(
        <TestWrapper>
          <Login />
        </TestWrapper>
      );

      expect(screen.getByText('🪄 使用 Magic Link 登入（無需密碼）')).toBeInTheDocument();
      expect(screen.getByText('忘記密碼？')).toBeInTheDocument();
      expect(screen.getByText('還沒有帳號？立即註冊')).toBeInTheDocument();
    });

    it('has correct link destinations', () => {
      render(
        <TestWrapper>
          <Login />
        </TestWrapper>
      );

      const magicLinkButton = screen.getByText('🪄 使用 Magic Link 登入（無需密碼）');
      const forgotPasswordLink = screen.getByText('忘記密碼？');
      const registerLink = screen.getByText('還沒有帳號？立即註冊');

      expect(magicLinkButton.closest('a')).toHaveAttribute('href', '/magic-link');
      expect(forgotPasswordLink.closest('a')).toHaveAttribute('href', '/forgot-password');
      expect(registerLink.closest('a')).toHaveAttribute('href', '/register');
    });

    it('displays user icon and system branding', () => {
      render(
        <TestWrapper>
          <Login />
        </TestWrapper>
      );

      // Check for the User icon (represented by svg)
      expect(document.querySelector('svg')).toBeInTheDocument();
      expect(screen.getByText('考勤系統')).toBeInTheDocument();
    });
  });

  describe('Authentication Redirect Logic', () => {
    it('redirects to home when user is authenticated', async () => {
      // Mock authenticated user state
      (useStores.useAuthInitializing as jest.Mock).mockReturnValue(false);
      (useStores.useUserLoaded as jest.Mock).mockReturnValue(true);
      (useStores.useAuthenticated as jest.Mock).mockReturnValue(true);
      (useStores.useCurrentUser as jest.Mock).mockReturnValue({
        id: '1',
        name: 'Test User',
        email: 'test@example.com',
      });

      render(
        <TestWrapper>
          <Login />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/', { replace: true });
      });
    });

    it('does not redirect when user is not authenticated', () => {
      // Mock non-authenticated state
      (useStores.useAuthInitializing as jest.Mock).mockReturnValue(false);
      (useStores.useUserLoaded as jest.Mock).mockReturnValue(true);
      (useStores.useAuthenticated as jest.Mock).mockReturnValue(false);
      (useStores.useCurrentUser as jest.Mock).mockReturnValue(null);

      render(
        <TestWrapper>
          <Login />
        </TestWrapper>
      );

      expect(mockNavigate).not.toHaveBeenCalled();
    });

    it('does not redirect when user data is still loading', () => {
      // Mock loading state
      (useStores.useAuthInitializing as jest.Mock).mockReturnValue(false);
      (useStores.useUserLoaded as jest.Mock).mockReturnValue(false);
      (useStores.useAuthenticated as jest.Mock).mockReturnValue(false);

      render(
        <TestWrapper>
          <Login />
        </TestWrapper>
      );

      expect(mockNavigate).not.toHaveBeenCalled();
    });
  });

  describe('Visual Elements', () => {
    beforeEach(() => {
      // Mock loaded but not authenticated state
      (useStores.useAuthInitializing as jest.Mock).mockReturnValue(false);
      (useStores.useUserLoaded as jest.Mock).mockReturnValue(true);
      (useStores.useAuthenticated as jest.Mock).mockReturnValue(false);
      (useStores.useCurrentUser as jest.Mock).mockReturnValue(null);
    });

    it('applies correct styling classes for gradient background', () => {
      const { container } = render(
        <TestWrapper>
          <Login />
        </TestWrapper>
      );

      const backgroundDiv = container.querySelector('.bg-gradient-to-br');
      expect(backgroundDiv).toHaveClass('from-blue-400', 'via-blue-500', 'to-purple-600');
    });

    it('renders decorative floating dots', () => {
      const { container } = render(
        <TestWrapper>
          <Login />
        </TestWrapper>
      );

      const dots = container.querySelectorAll('.animate-pulse');
      expect(dots.length).toBeGreaterThan(0);
    });

    it('renders backdrop blur form container', () => {
      const { container } = render(
        <TestWrapper>
          <Login />
        </TestWrapper>
      );

      const formContainer = container.querySelector('.backdrop-blur-xl');
      expect(formContainer).toBeInTheDocument();
    });
  });

  describe('Component Integration', () => {
    it('renders without calling useAutoInitAuth (centralized in App.tsx)', () => {
      const mockUseAutoInitAuth = useStores.useAutoInitAuth;

      render(
        <TestWrapper>
          <Login />
        </TestWrapper>
      );

      // Login component should NOT call useAutoInitAuth since it's centralized in App.tsx
      expect(mockUseAutoInitAuth).not.toHaveBeenCalled();
    });

    it('renders without crashing', () => {
      (useStores.useAuthInitializing as jest.Mock).mockReturnValue(false);
      (useStores.useUserLoaded as jest.Mock).mockReturnValue(true);
      (useStores.useAuthenticated as jest.Mock).mockReturnValue(false);

      const { container } = render(
        <TestWrapper>
          <Login />
        </TestWrapper>
      );

      expect(container.firstChild).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    beforeEach(() => {
      (useStores.useAuthInitializing as jest.Mock).mockReturnValue(false);
      (useStores.useUserLoaded as jest.Mock).mockReturnValue(true);
      (useStores.useAuthenticated as jest.Mock).mockReturnValue(false);
    });

    it('provides proper heading structure', () => {
      render(
        <TestWrapper>
          <Login />
        </TestWrapper>
      );

      const heading = screen.getByRole('heading', { level: 2 });
      expect(heading).toHaveTextContent('考勤系統');
    });

    it('has accessible navigation links', () => {
      render(
        <TestWrapper>
          <Login />
        </TestWrapper>
      );

      const links = screen.getAllByRole('link');
      expect(links).toHaveLength(3); // Magic link, forgot password, register
    });
  });
});
