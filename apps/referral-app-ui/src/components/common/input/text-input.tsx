import { InputHTMLAttributes, forwardRef } from 'react';
import { Typography } from '../typography';

interface TextInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
  ({ label, error, className = '', ...props }, ref) => {
    return (
      <div className='flex flex-col gap-1 w-full'>
        {label && (
          <Typography
            variant='caption'
            className='font-medium text-gray-700'
          >
            {label}
          </Typography>
        )}

        <input
          ref={ref}
          onWheel={(e) => (e.target as HTMLElement).blur()}
          className={`w-full px-2.5 py-2 border border-gray-300 rounded-md text-gray-600 text-sm tracking-tight focus:outline-none focus:ring-1 focus:ring-gray-500 ${className} ${
            error ? 'border-red-500 focus:ring-red-500' : ''
          }`}
          {...props}
        />

        {error && (
          <Typography
            variant='caption'
            className='text-red-500'
          >
            {error}
          </Typography>
        )}
      </div>
    );
  },
);

TextInput.displayName = 'TextInput';
