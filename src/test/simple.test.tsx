import { render, screen } from '@testing-library/react';

// Simple test to verify Jest setup is working
describe('Jest Setup', () => {
  it('should render a simple component', () => {
    const TestComponent = () => <div>Hello Jest!</div>;

    render(<TestComponent />);

    expect(screen.getByText('Hello Jest!')).toBeInTheDocument();
  });

  it('should perform basic assertions', () => {
    expect(1 + 1).toBe(2);
    expect('hello').toContain('ell');
    expect(true).toBeTruthy();
  });
});
