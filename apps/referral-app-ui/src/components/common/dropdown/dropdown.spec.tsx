import { render, screen, fireEvent } from '@testing-library/react';
import { Dropdown } from './dropdown';

const items = [
  { id: 1, label: 'Option 1' },
  { id: 2, label: 'Option 2' },
];

describe('Dropdown component', () => {
  it('renders placeholder when no value is selected', () => {
    render(
      <Dropdown
        items={items}
        onChange={jest.fn()}
        placeholder='Select an option'
      />,
    );
    expect(screen.getByText('Select an option')).toBeInTheDocument();
  });

  it('renders selected value when provided', () => {
    render(
      <Dropdown
        items={items}
        value={2}
        onChange={jest.fn()}
      />,
    );
    expect(screen.getByText('Option 2')).toBeInTheDocument();
  });

  it('opens dropdown on click and displays items', () => {
    render(
      <Dropdown
        items={items}
        onChange={jest.fn()}
      />,
    );
    const trigger = screen.getByRole('button');
    fireEvent.click(trigger);
    expect(screen.getByText('Option 1')).toBeInTheDocument();
    expect(screen.getByText('Option 2')).toBeInTheDocument();
  });

  it('calls onChange and closes when an item is clicked', () => {
    const handleChange = jest.fn();
    render(
      <Dropdown
        items={items}
        onChange={handleChange}
      />,
    );
    const trigger = screen.getByRole('button');
    fireEvent.click(trigger);
    fireEvent.click(screen.getByText('Option 1'));
    expect(handleChange).toHaveBeenCalledWith(items[0]);
    // The item should no longer be in the document
    expect(screen.queryByText('Option 1')).not.toBeInTheDocument();
  });

  it('shows "No options" when items are empty and dropdown opens', () => {
    render(
      <Dropdown
        items={[]}
        onChange={jest.fn()}
      />,
    );
    const trigger = screen.getByRole('button');
    fireEvent.click(trigger);
    expect(screen.getByText('No options')).toBeInTheDocument();
  });
});
