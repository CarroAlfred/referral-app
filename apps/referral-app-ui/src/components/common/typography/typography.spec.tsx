import { render, screen } from '@testing-library/react';
import { Typography } from './typography';

describe('Typography', () => {
  it('renders with default props', () => {
    render(<Typography>Default Text</Typography>);
    const el = screen.getByText('Default Text');
    expect(el.tagName.toLowerCase()).toBe('p'); // default is <p>
    expect(el).toHaveClass('text-base');
  });

  it('renders with a specific variant', () => {
    render(<Typography variant='h1'>Heading 1</Typography>);
    const el = screen.getByText('Heading 1');
    expect(el).toHaveClass('text-4xl');
  });

  it('renders with a custom element via `as`', () => {
    render(
      <Typography
        as='span'
        variant='caption'
      >
        Inline text
      </Typography>,
    );
    const el = screen.getByText('Inline text');
    expect(el.tagName.toLowerCase()).toBe('span');
    expect(el).toHaveClass('text-xs');
  });

  it('applies weight classes', () => {
    render(<Typography weight='bold'>Bold text</Typography>);
    expect(screen.getByText('Bold text')).toHaveClass('font-bold');
  });

  it('applies alignment classes', () => {
    render(<Typography align='center'>Centered</Typography>);
    expect(screen.getByText('Centered')).toHaveClass('text-center');
  });

  it('applies truncate class', () => {
    render(<Typography truncate>Truncated</Typography>);
    expect(screen.getByText('Truncated')).toHaveClass('truncate');
  });

  it('applies lineClamp class when provided', () => {
    render(<Typography lineClamp={2}>Clamped</Typography>);
    expect(screen.getByText('Clamped')).toHaveClass('line-clamp-2');
  });

  it('applies uppercase class when enabled', () => {
    render(<Typography uppercase>Uppercase</Typography>);
    expect(screen.getByText('Uppercase')).toHaveClass('uppercase');
  });

  it('merges additional className', () => {
    render(<Typography className='custom-class'>With Custom Class</Typography>);
    expect(screen.getByText('With Custom Class')).toHaveClass('custom-class');
  });
});
