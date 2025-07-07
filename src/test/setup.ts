import '@testing-library/jest-dom';
import type { ReactNode, AnchorHTMLAttributes } from 'react';
// 直接定義 ResizeObserverCallback 型別
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ResizeObserverCallback = (entries: any[], observer: ResizeObserver) => void;

// Mock Supabase client
jest.mock('../integrations/supabase/client', () => ({
  supabase: {
    auth: {
      signInWithPassword: jest.fn(),
      signOut: jest.fn(),
      getUser: jest.fn(),
      getSession: jest.fn(),
      onAuthStateChange: jest.fn(),
    },
    from: jest.fn(() => ({
      select: jest.fn(() => ({
        eq: jest.fn(() => ({
          maybeSingle: jest.fn(),
        })),
      })),
      insert: jest.fn(),
      update: jest.fn(() => ({
        eq: jest.fn(),
      })),
    })),
  },
  ensureUserAuthenticated: jest.fn(),
  verifyAdminPermissions: jest.fn(),
}));

// Mock AuthService
jest.mock('../services/authService', () => ({
  AuthService: {
    authenticate: jest.fn(),
    signOut: jest.fn(),
    getCurrentSession: jest.fn(),
    getCurrentUser: jest.fn(),
    buildUserFromSession: jest.fn(),
  },
}));

// Mock Zustand stores
jest.mock('../stores/authStore', () => ({
  useAuthStore: jest.fn(() => ({
    isAuthenticated: false,
    isInitializing: false,
    session: null,
    authError: null,
    isInitialized: true,
    setIsAuthenticated: jest.fn(),
    setSession: jest.fn(),
    setAuthError: jest.fn(),
    handleUserLogin: jest.fn(),
    handleUserLogout: jest.fn(),
    initializeAuth: jest.fn(),
    forceLogout: jest.fn(),
  })),
  ensureAuthInitialized: jest.fn(),
}));

jest.mock('../stores/userStore', () => ({
  useUserStore: jest.fn(() => ({
    currentUser: null,
    annualLeaveBalance: null,
    isUserLoaded: true,
    setCurrentUser: jest.fn(),
    setAnnualLeaveBalance: jest.fn(),
    setIsUserLoaded: jest.fn(),
    clearUserData: jest.fn(),
  })),
}));

jest.mock('../stores/permissionStore', () => ({
  usePermissionStore: jest.fn(() => ({
    loadUserPermissions: jest.fn(),
    clearPermissions: jest.fn(),
    hasPermission: jest.fn(() => false),
    isAdmin: jest.fn(() => false),
    isManager: jest.fn(() => false),
  })),
}));

// Mock react-router-dom
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
  Link: ({
    children,
    to,
    ...props
  }: { children: ReactNode; to: string } & AnchorHTMLAttributes<HTMLAnchorElement>) => {
    const React = jest.requireActual('react');
    return React.createElement('a', { href: to, ...props }, children);
  },
}));

// Mock toast
jest.mock('../hooks/use-toast', () => ({
  useToast: () => ({
    toast: jest.fn(),
  }),
}));

// Mock hooks
jest.mock('../hooks/useStores', () => ({
  useAutoInitAuth: jest.fn(),
  useAuthenticated: jest.fn(() => false),
  useAuthInitializing: jest.fn(() => false),
  useCurrentUser: jest.fn(() => null),
  useUserLoaded: jest.fn(() => true),
  useUserActions: jest.fn(() => ({
    setCurrentUser: jest.fn(),
    setIsAuthenticated: jest.fn(),
  })),
}));

// Global test utilities
(globalThis as unknown as { console: typeof console }).console = {
  ...console,
  // Suppress console.log in tests unless explicitly needed
  log: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock IntersectionObserver
(
  globalThis as unknown as { IntersectionObserver: typeof IntersectionObserver }
).IntersectionObserver = class IntersectionObserver {
  root: Element | null = null;
  rootMargin: string = '';
  thresholds: number[] = [];

  constructor() {}
  observe() {
    return null;
  }
  disconnect() {
    return null;
  }
  unobserve() {
    return null;
  }
  takeRecords() {
    return [];
  }
};

// Mock ResizeObserver
(globalThis as unknown as { ResizeObserver: typeof ResizeObserver }).ResizeObserver =
  class ResizeObserver {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    constructor(_cb: ResizeObserverCallback) {}
    observe() {
      return null;
    }
    disconnect() {
      return null;
    }
    unobserve() {
      return null;
    }
  };
