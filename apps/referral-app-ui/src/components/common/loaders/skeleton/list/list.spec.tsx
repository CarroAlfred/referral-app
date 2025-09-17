import { render, screen } from '@testing-library/react';
import { SkeletonList } from './list';

describe('SkeletonList suite', () => {
  it('renders the default number of skeleton items', () => {
    render(<SkeletonList />);
    const items = screen.getAllByRole('listitem');
    expect(items.length).toBe(5); // default count
  });

  it('renders the specified number of skeleton items', () => {
    render(<SkeletonList count={3} />);
    const items = screen.getAllByRole('listitem');
    expect(items.length).toBe(3);
  });
});
