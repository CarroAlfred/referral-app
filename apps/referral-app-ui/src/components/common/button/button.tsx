import React from 'react';

type ButtonProps = {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'text';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  children?: React.ReactNode;
  href?: string;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
  type?: 'button' | 'reset' | 'submit';
};

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  icon,
  children,
  href,
  onClick,
  className = '',
  disabled = false,
  type = 'button',
}) => {
  const base =
    'inline-flex items-center justify-center font-medium transition-colors focus:outline-none cursor-pointer disabled:cursor-not-allowed disabled:opacity-50';

  const variants: Record<string, string> = {
    primary: 'bg-blue-600 text-white px-4 py-2 hover:bg-blue-700 disabled:hover:bg-blue-600 rounded-2xl',
    secondary: 'bg-gray-200 text-gray-800 px-4 py-2 hover:bg-gray-300 disabled:hover:bg-gray-200 rounded-2xl',
    outline:
      'border border-gray-300 text-gray-900 px-1.5 py-1 hover:bg-gray-100 disabled:hover:bg-transparent rounded-2xl',
    ghost: 'text-gray-600 px-3 py-2 hover:bg-gray-100 disabled:hover:bg-transparent',
    text: 'text-gray-600 px-1 hover:underline disabled:hover:no-underline disabled:text-gray-400',
  };

  const sizes: Record<string, string> = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
  };

  const classes = `${base} ${variants[variant]} ${sizes[size]} ${className}`;

  if (href) {
    return (
      <a
        href={href}
        className={classes}
        aria-disabled={disabled}
      >
        {icon && <span className='mr-2'>{icon}</span>}
        {children}
      </a>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      className={classes}
      disabled={disabled}
    >
      {icon && <span className='mr-2'>{icon}</span>}
      {children}
    </button>
  );
};
