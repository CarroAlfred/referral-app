import { forwardRef, TextareaHTMLAttributes } from 'react';
import { Typography } from '../typography';

interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
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
        <textarea
          ref={ref}
          className={`w-full resize-y rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 placeholder-gray-400 focus:ring-1 focus:ring-gray-500 focus:outline-none  ${className} ${
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

TextArea.displayName = 'TextArea';
