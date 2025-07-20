import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '../../components/Button/Button';
import { describe, it, expect, vi } from 'vitest';

describe('Button Component', () => {
  it('renders button with label', () => {
    render(<Button label="Click me" />);
    expect(
      screen.getByRole('button', { name: 'Click me' })
    ).toBeInTheDocument();
  });

  it('calls onClick handler when clicked', () => {
    const handleClick = vi.fn();
    render(<Button label="Click me" onClick={handleClick} />);
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('is disabled when disabled prop is true', () => {
    render(<Button label="Click me" disabled />);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('applies maxWidth style when provided', () => {
    render(<Button label="Click me" maxWith="200px" />);
    expect(screen.getByRole('button')).toHaveStyle({ maxWidth: '200px' });
  });
});
