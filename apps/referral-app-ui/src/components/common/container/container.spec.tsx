import { render, screen } from '@testing-library/react';
import { Container } from './container';

describe('Container component', () => {
  it('renders children correctly', () => {
    render(
      <Container className='custom-class'>
        <p>Container Content</p>
      </Container>,
    );

    // Check if child text is rendered
    expect(screen.getByText('Container Content')).toBeInTheDocument();

    // Check if custom and default classes are applied
    const containerDiv = screen.getByText('Container Content').parentElement;
    expect(containerDiv).toHaveClass('custom-class');
    expect(containerDiv).toHaveClass('max-w-7xl');
    expect(containerDiv).toHaveClass('mx-auto');
  });
});
