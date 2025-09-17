import { render } from '@testing-library/react';
import { Loader } from './circular';

describe('Loader component', () => {
  it('renders with default props', () => {
    render(<Loader />);
    const loader = document.querySelector('.animate-spin');
    expect(loader).toBeInTheDocument();
    expect(loader).toHaveClass('animate-spin', 'text-gray-500');
    expect(loader).toHaveStyle({ width: '40px', height: '40px' });
  });

  it('applies custom size and color', () => {
    render(
      <Loader
        size={60}
        color='text-blue-500'
      />,
    );
    const loader = document.querySelector('.animate-spin');
    expect(loader).toHaveClass('text-blue-500');
    expect(loader).toHaveStyle({ width: '60px', height: '60px' });
  });

  it('renders inside overlay when overlay is true', () => {
    render(<Loader overlay />);
    const overlay = document.querySelector('.fixed.inset-0');
    expect(overlay).toBeInTheDocument();
    const loader = overlay?.querySelector('.animate-spin');
    expect(loader).toBeInTheDocument();
  });
});
