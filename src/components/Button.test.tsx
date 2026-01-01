import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/preact';
import { Button } from './Button';

describe('Button Component', () => {
  const mockOnClick = vi.fn();

  beforeEach(() => {
    mockOnClick.mockClear();
  });

  it('should render button with children', () => {
    render(<Button onClick={mockOnClick}>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('should call onClick handler when clicked', () => {
    render(<Button onClick={mockOnClick}>Click me</Button>);
    const button = screen.getByText('Click me');
    fireEvent.click(button);
    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  it('should apply primary variant by default', () => {
    render(<Button onClick={mockOnClick}>Primary</Button>);
    const button = screen.getByText('Primary');
    expect(button.className).toContain('bg-primary');
  });

  it('should apply secondary variant', () => {
    render(<Button variant="secondary" onClick={mockOnClick}>Secondary</Button>);
    const button = screen.getByText('Secondary');
    expect(button.className).toContain('bg-surface2');
  });

  it('should apply danger variant', () => {
    render(<Button variant="danger" onClick={mockOnClick}>Danger</Button>);
    const button = screen.getByText('Danger');
    expect(button.className).toContain('text-accent');
  });

  it('should apply ghost variant', () => {
    render(<Button variant="ghost" onClick={mockOnClick}>Ghost</Button>);
    const button = screen.getByText('Ghost');
    expect(button.className).toContain('bg-transparent');
  });

  it('should apply custom className', () => {
    render(<Button onClick={mockOnClick} className="custom-class">Custom</Button>);
    const button = screen.getByText('Custom');
    expect(button.className).toContain('custom-class');
  });

  it('should include title attribute', () => {
    render(<Button onClick={mockOnClick} title="Button tooltip">With Title</Button>);
    const button = screen.getByText('With Title');
    expect(button).toHaveAttribute('title', 'Button tooltip');
  });
});
