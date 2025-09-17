import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TextArea } from './text-area';
import { TextInput } from './text-input';

describe('input component', () => {
  describe('TextArea component', () => {
    it('renders a textarea with label', () => {
      render(<TextArea label='Description' />);
      expect(screen.getByText('Description')).toBeInTheDocument();
      expect(screen.getByRole('textbox')).toBeInTheDocument();
    });

    it('renders an error message', () => {
      render(
        <TextArea
          label='Description'
          error='Required'
        />,
      );
      expect(screen.getByText('Required')).toBeInTheDocument();
    });

    it('calls onChange when typing', async () => {
      const user = userEvent.setup();
      const handleChange = jest.fn();
      render(<TextArea onChange={handleChange} />);
      const textarea = screen.getByRole('textbox');
      await user.type(textarea, 'Hello');
      expect(handleChange).toHaveBeenCalledTimes(5); // called once per keystroke
    });

    it('applies error styling', () => {
      render(<TextArea error='Required' />);
      const textarea = screen.getByRole('textbox');
      expect(textarea).toHaveClass('border-red-500');
    });
  });

  describe('TextInput component', () => {
    it('renders an input with label', () => {
      render(<TextInput label='Username' />);
      expect(screen.getByText('Username')).toBeInTheDocument();
      expect(screen.getByRole('textbox')).toBeInTheDocument();
    });

    it('renders an error message', () => {
      render(
        <TextInput
          label='Username'
          error='Required'
        />,
      );
      expect(screen.getByText('Required')).toBeInTheDocument();
    });

    it('calls onChange when typing', async () => {
      const user = userEvent.setup();
      const handleChange = jest.fn();
      render(<TextInput onChange={handleChange} />);
      const input = screen.getByRole('textbox');
      await user.type(input, 'Hello');
      expect(handleChange).toHaveBeenCalledTimes(5); // called once per keystroke
    });

    it('applies error styling', () => {
      render(<TextInput error='Required' />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveClass('border-red-500');
    });
  });
});
