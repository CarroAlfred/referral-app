import { FC } from 'react';

interface LoaderProps {
  size?: number; // diameter in pixels
  color?: string; // Tailwind color, e.g., 'text-blue-500'
  overlay?: boolean; // full screen overlay
}

export const Loader: FC<LoaderProps> = ({ size = 40, color = 'text-gray-500', overlay = false }) => {
  const loader = (
    <div
      className={`animate-spin rounded-full border-4 border-t-4 border-gray-200 ${color}`}
      style={{ width: size, height: size, borderTopColor: 'currentColor' }}
    />
  );

  if (overlay) {
    return <div className='fixed inset-0 bg-black/30 flex items-center justify-center z-50'>{loader}</div>;
  }

  return loader;
};
