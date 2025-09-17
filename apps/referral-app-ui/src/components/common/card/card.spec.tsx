import { render, screen } from '@testing-library/react';
import { Card } from './card';

describe('Card component', () => {
  it('renders children correctly', () => {
    render(
      <Card className='custom-class'>
        <p>Card Content</p>
      </Card>,
    );

    // Check if child text is rendered
    expect(screen.getByText('Card Content')).toBeInTheDocument();

    // Check if custom class is applied
    const cardDiv = screen.getByText('Card Content').parentElement;
    expect(cardDiv).toHaveClass('custom-class');
    expect(cardDiv).toHaveClass('rounded-xl');
  });
});
