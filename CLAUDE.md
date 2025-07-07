# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Core Development

- `npm run dev` - Start development server with hot reloading on port 8080
- `npm run build` - Build production bundle
- `npm run build:dev` - Build development bundle
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint with automatic fixes
- `npm run prepare` - Setup Husky git hooks

### Testing

- `npm test` - Run all tests using Jest
- `npm run test:watch` - Run tests in watch mode for development
- `npm run test:coverage` - Run tests with coverage report
- `npm run test:ci` - Run tests in CI mode (no watch, with coverage)
- `npm test src/test/` - Run specific test directory (working tests)

## Project Architecture

### Tech Stack

- **Frontend**: React 18 with TypeScript, Vite bundler
- **UI Framework**: shadcn/ui components with Radix UI primitives
- **Styling**: Tailwind CSS with custom theme extensions
- **State Management**: Zustand stores (auth, user, permissions)
- **Data Layer**: Supabase for backend services, TanStack Query for API state
- **Routing**: React Router v6
- **Forms**: React Hook Form with Zod validation
- **Date Handling**: date-fns library
- **Testing**: Jest with React Testing Library for unit and integration tests

### Core Architecture Patterns

**State Management Strategy**:

- Zustand stores for global state (`authStore`, `userStore`, `permissionStore`)
- TanStack Query for server state management
- Context providers for specific feature domains (LeaveManagement, Scheduling)

**Authentication Flow**:

- Supabase Auth with automatic session management
- User data synchronized with staff records in database
- Permission-based access control with role hierarchy (admin, manager, user)
- Auto-initialization through `useAutoInitAuth` hook

**Component Organization**:

- Feature-based folder structure under `src/components/`
- Shared UI components in `src/components/ui/` (shadcn/ui)
- Page components in `src/pages/` with route protection
- Custom hooks in `src/hooks/` for reusable logic

**Data Layer**:

- Supabase client configured with RLS (Row Level Security)
- Service layer in `src/services/` for business logic
- Database migrations in `supabase/migrations/`

### Key Architectural Concepts

**Permission System**:

- Role-based permissions with granular controls
- Permission guards for UI components and routes
- Simplified permission service for common checks

**Multi-tenant Architecture**:

- Company/branch-based data isolation
- Department-based organization structure
- Staff hierarchy with supervisor relationships

**Module Structure**:

- **HR Management**: Staff, roles, positions, departments
- **Leave Management**: Leave requests, approvals, balance tracking
- **Attendance**: Check-in/out, location-based tracking, missed check-ins
- **Scheduling**: Staff scheduling, time slots, calendar views
- **Overtime**: Overtime requests and approvals
- **Announcements**: Company-wide communications
- **Payroll**: Salary structures and payroll processing

### Database Schema Highlights

- Uses Supabase with PostgreSQL backend
- RLS policies for multi-tenant security
- Audit trails and soft deletes where applicable
- Complex permission hierarchies with supervisor relationships

## Code Style Guidelines

### Formatting

- Prettier configured with semi-colons, single quotes, 2-space indentation
- Trailing commas in ES5 mode
- Line length: 100 characters

### TypeScript

- Strict mode disabled for gradual migration
- Path aliases: `@/` maps to `src/`
- Interface definitions in `src/types/`

### React Patterns

- Functional components with hooks
- Custom hooks for complex logic
- Context providers for feature-specific state
- Protected routes with permission checks

### File Naming

- PascalCase for React components
- camelCase for hooks, utilities, and services
- kebab-case for pages and routes
- Descriptive names reflecting functionality

## Development Workflow

### Branch Strategy

- Main branch: `main`
- Feature branches from main
- Commits should be descriptive and atomic

### Pre-commit Hooks

- ESLint fixes applied automatically
- Prettier formatting applied to all files
- lint-staged configured for affected files only

### Component Development

- Use existing shadcn/ui components when possible
- Follow established patterns from existing components
- Implement proper loading states and error handling
- Consider mobile responsiveness (safe area insets configured)

### API Integration

- Use TanStack Query for server state
- Implement proper error handling and loading states
- Follow RLS patterns for data access
- Consider pagination for large datasets

## Important Notes

- The codebase includes Chinese comments and console logs
- Multi-language support infrastructure is in place
- GPS-based check-in functionality for attendance
- Real-time notifications system implemented
- Vision Pro styles included for future compatibility
- Lunar calendar integration for holiday management

## Testing Architecture

### Framework Setup

- **Jest**: Test runner with jsdom environment for DOM testing
- **React Testing Library**: Component testing with user-centric approach
- **User Event**: Realistic user interaction simulation
- **ts-jest**: TypeScript transformation with full type support
- **Module Resolution**: @/\* path aliases fully supported

### Test Organization

- Unit tests in `__tests__` folders alongside components
- Test utilities in `src/test/utils.tsx` with custom render functions
- Global test setup in `src/test/setup.ts` with comprehensive mocks
- Mock configurations for Supabase, Zustand stores, and React Router

### Testing Patterns

- **Component Testing**: Render, interaction, and assertion patterns
- **Mock Strategy**: Comprehensive mocking of Supabase, stores, and services
- **User-Centric Testing**: Focus on user interactions rather than implementation
- **Integration Testing**: Test component interaction with mocked services
- **Async Testing**: waitFor patterns for async operations and state changes

### Current Test Coverage

- **LoginForm.tsx**: 92% statement coverage, 84% branch coverage
- **Login.tsx**: 100% complete coverage
- **RegisterForm.tsx**: 100% statement coverage, 95.83% branch coverage
- **Total Tests**: 60+ test cases covering authentication and registration flows
- **Test Types**: Unit, integration, user interaction, error handling, accessibility

### Implemented Test Features

- **Login Flow**: Complete login testing with success/failure scenarios
- **Registration Flow**: Comprehensive registration testing with all validation scenarios
- **Form Validation**: Password matching, length validation, email format checking
- **Error Handling**: Network errors, server errors, validation errors
- **Loading States**: Loading indicators and disabled states during async operations
- **User Interactions**: Form field typing, button clicks, keyboard navigation
- **Accessibility**: Proper labels, tab order, form associations
- **Mock Integration**: Supabase auth, toast notifications, React Router navigation

### Best Practices

- Use descriptive test names in Chinese for clarity
- Group related tests with `describe` blocks
- Mock at the service boundary, not implementation details
- Test user behavior, not internal component state
- Ensure tests are deterministic and fast
- Cover both happy path and error scenarios
- Test accessibility features and form validations

## Supabase Configuration

- Database URL and keys configured in client.ts
- RLS policies enforce data security
- Real-time subscriptions for live updates
- Migration files track schema changes
- Auth persistence enabled in localStorage
