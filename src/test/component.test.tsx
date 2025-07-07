import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';

// Test a simple button component without external dependencies
const SimpleButton = ({
  onClick,
  children,
}: {
  onClick: () => void;
  children: React.ReactNode;
}) => {
  return (
    <button onClick={onClick} className="px-4 py-2 bg-blue-500 text-white rounded">
      {children}
    </button>
  );
};

// Test a simple form component
const SimpleForm = ({
  onSubmit,
}: {
  onSubmit: (data: { email: string; password: string }) => void;
}) => {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    onSubmit({
      email: formData.get('email') as string,
      password: formData.get('password') as string,
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="email">Email:</label>
        <input id="email" name="email" type="email" required className="border rounded px-2 py-1" />
      </div>
      <div>
        <label htmlFor="password">Password:</label>
        <input
          id="password"
          name="password"
          type="password"
          required
          className="border rounded px-2 py-1"
        />
      </div>
      <button type="submit">Submit</button>
    </form>
  );
};

describe('Component Testing Examples', () => {
  describe('SimpleButton', () => {
    it('renders button with correct text', () => {
      const mockClick = jest.fn();
      render(<SimpleButton onClick={mockClick}>Click me</SimpleButton>);

      expect(screen.getByText('Click me')).toBeInTheDocument();
    });

    it('calls onClick when clicked', async () => {
      const user = userEvent.setup();
      const mockClick = jest.fn();
      render(<SimpleButton onClick={mockClick}>Click me</SimpleButton>);

      await user.click(screen.getByText('Click me'));

      expect(mockClick).toHaveBeenCalledTimes(1);
    });

    it('has correct CSS classes', () => {
      const mockClick = jest.fn();
      render(<SimpleButton onClick={mockClick}>Styled button</SimpleButton>);

      const button = screen.getByText('Styled button');
      expect(button).toHaveClass('px-4', 'py-2', 'bg-blue-500', 'text-white', 'rounded');
    });
  });

  describe('SimpleForm', () => {
    it('renders form fields', () => {
      const mockSubmit = jest.fn();
      render(<SimpleForm onSubmit={mockSubmit} />);

      expect(screen.getByLabelText('Email:')).toBeInTheDocument();
      expect(screen.getByLabelText('Password:')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Submit' })).toBeInTheDocument();
    });

    it('submits form with user input', async () => {
      const user = userEvent.setup();
      const mockSubmit = jest.fn();
      render(<SimpleForm onSubmit={mockSubmit} />);

      // Fill out the form
      await user.type(screen.getByLabelText('Email:'), 'test@example.com');
      await user.type(screen.getByLabelText('Password:'), 'password123');

      // Submit the form
      await user.click(screen.getByRole('button', { name: 'Submit' }));

      expect(mockSubmit).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      });
    });

    it('requires form fields to be filled', async () => {
      const user = userEvent.setup();
      const mockSubmit = jest.fn();
      render(<SimpleForm onSubmit={mockSubmit} />);

      // Try to submit without filling fields
      await user.click(screen.getByRole('button', { name: 'Submit' }));

      // Form should not submit due to HTML validation
      expect(mockSubmit).not.toHaveBeenCalled();
    });

    it('validates email field type', () => {
      const mockSubmit = jest.fn();
      render(<SimpleForm onSubmit={mockSubmit} />);

      const emailInput = screen.getByLabelText('Email:');
      expect(emailInput).toHaveAttribute('type', 'email');
      expect(emailInput).toHaveAttribute('required');
    });

    it('validates password field type', () => {
      const mockSubmit = jest.fn();
      render(<SimpleForm onSubmit={mockSubmit} />);

      const passwordInput = screen.getByLabelText('Password:');
      expect(passwordInput).toHaveAttribute('type', 'password');
      expect(passwordInput).toHaveAttribute('required');
    });
  });
});
