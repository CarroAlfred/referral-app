import { render, screen, fireEvent } from '@testing-library/react';
import { CommonModal } from './modal';

describe('CommonModal', () => {
  it('renders modal with title and children when open', () => {
    render(
      <CommonModal
        isOpen={true}
        onClose={() => {}}
        title='Test Modal'
      >
        <p>Modal Content</p>
      </CommonModal>,
    );

    expect(screen.getByText('Test Modal')).toBeInTheDocument();
    expect(screen.getByText('Modal Content')).toBeInTheDocument();
  });

  it('does not render content when closed', () => {
    render(
      <CommonModal
        isOpen={false}
        onClose={() => {}}
        title='Hidden Modal'
      >
        <p>Hidden Content</p>
      </CommonModal>,
    );

    // content should not appear
    expect(screen.queryByText('Hidden Modal')).not.toBeInTheDocument();
    expect(screen.queryByText('Hidden Content')).not.toBeInTheDocument();
  });

  it('renders footer actions when provided', () => {
    render(
      <CommonModal
        isOpen={true}
        onClose={() => {}}
        title='Footer Modal'
        footerActions={<button>Close</button>}
      >
        <p>Content</p>
      </CommonModal>,
    );

    expect(screen.getByRole('button', { name: /close/i })).toBeInTheDocument();
  });

  it('calls onClose when overlay is clicked', () => {
    const handleClose = jest.fn();

    render(
      <CommonModal
        isOpen={true}
        onClose={handleClose}
        title='Closable Modal'
      >
        <p>Content</p>
      </CommonModal>,
    );

    // react-modal renders overlay with role="presentation"
    const overlay = document.querySelector('.ReactModal__Overlay') as HTMLElement;
    fireEvent.mouseDown(overlay); // simulate click
    fireEvent.mouseUp(overlay); // complete click
    fireEvent.click(overlay);

    expect(handleClose).toHaveBeenCalled();
  });
});
