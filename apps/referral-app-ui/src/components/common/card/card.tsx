import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ children, className = '' }: CardProps) => {
  return (
    <div
      className={`relative rounded-xl bg-white backdrop-blur-sm border border-gray-300 p-6 flex flex-col justify-between group hover:shadow-md transition-shadow ${className}`}
    >
      {children}
    </div>
  );
};
