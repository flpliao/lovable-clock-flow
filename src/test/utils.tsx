import { render as rtlRender, RenderOptions } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React, { ReactElement } from 'react';
import { BrowserRouter } from 'react-router-dom';

// Create a test query client
const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        staleTime: 0,
        gcTime: 0,
      },
      mutations: {
        retry: false,
      },
    },
  });

interface WrapperProps {
  children: React.ReactNode;
}

// Test wrapper component that includes all necessary providers
const TestWrapper: React.FC<WrapperProps> = ({ children }) => {
  const queryClient = createTestQueryClient();

  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </BrowserRouter>
  );
};

// Custom render function that includes providers
const customRender = (ui: ReactElement, options?: Omit<RenderOptions, 'wrapper'>) =>
  rtlRender(ui, { wrapper: TestWrapper, ...options });

// Mock user data
export const mockUser = {
  id: 'test-user-id',
  name: '測試用戶',
  email: 'test@example.com',
  position: '軟體工程師',
  department: 'IT部門',
  role_id: 'user',
  onboard_date: '2024-01-01',
};

export const mockAdmin = {
  ...mockUser,
  name: '管理員',
  role_id: 'admin',
};

export const mockManager = {
  ...mockUser,
  name: '經理',
  role_id: 'manager',
};

// Mock auth responses
export const mockAuthSuccess = {
  success: true,
  user: mockUser,
  session: {
    access_token: 'mock-token',
    user: { id: mockUser.id, email: mockUser.email },
  },
};

export const mockAuthError = {
  success: false,
  error: '帳號或密碼不正確',
};

// Mock Supabase auth responses
export const mockSupabaseAuthSuccess = {
  data: {
    user: { id: mockUser.id, email: mockUser.email },
    session: { access_token: 'mock-token' },
  },
  error: null,
};

export const mockSupabaseAuthError = {
  data: { user: null, session: null },
  error: { message: 'Invalid login credentials' },
};

// Helper to wait for async operations
export const waitFor = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Helper to create mock functions with specific return values
export const createMockFn = <T extends (...args: unknown[]) => unknown>(
  returnValue?: ReturnType<T>
) => jest.fn(returnValue ? () => returnValue : undefined);

// Helper to mock component props
export const createMockProps = <T extends Record<string, unknown>>(overrides: Partial<T> = {}): T =>
  ({
    ...overrides,
  }) as T;

// Re-export everything from RTL
export * from '@testing-library/react';
export { customRender as render };
export { createTestQueryClient };
