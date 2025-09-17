import { ReactNode } from 'react';
import Modal from 'react-modal';
import { Typography } from '../typography';

interface CommonModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  footerActions?: ReactNode;
  className?: string;
}

export function CommonModal({ isOpen, onClose, title, children, footerActions, className = '' }: CommonModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      ariaHideApp={false}
      overlayClassName='fixed inset-0 bg-white/30 backdrop-blur-md flex items-center justify-center z-50'
      className={`bg-white rounded-2xl shadow-lg max-w-2xl w-full p-6 overflow-y-auto max-h-[90vh] relative flex flex-col ${className}`}
    >
      {/* Modal Header */}
      {title && (
        <Typography
          variant='h2'
          className='mb-4'
        >
          {title}
        </Typography>
      )}

      {/* Modal Body */}
      <div className='flex-1 overflow-y-auto'>{children}</div>

      {/* Modal Footer */}
      {footerActions && (
        <div className='mt-4 pt-4 border-t flex justify-end gap-2 sticky bottom-0 bg-white'>{footerActions}</div>
      )}
    </Modal>
  );
}
