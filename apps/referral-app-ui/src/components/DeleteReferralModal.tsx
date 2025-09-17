import React from 'react';
import Modal from 'react-modal';
import { useAppDispatch } from '../store/hooks/hooks';
import { deleteReferral } from '../api/middleware/referral';
import { Referral } from '../types/referral';
import { useDeleteReferral } from '../store/hooks/referrals/use-delete-referral';

interface DeleteReferralModalProps {
  isOpen: boolean;
  onClose: () => void;
  referral: Referral;
}

const DeleteReferralModal: React.FC<DeleteReferralModalProps> = ({ isOpen, onClose, referral }) => {
  const { mutate: deleteReferralMutate, isLoading } = useDeleteReferral();

  const confirmDelete = async () => {
    await deleteReferralMutate(referral.id);
    onClose();
  };
  
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      ariaHideApp={false}
      className='bg-white p-6 rounded-lg shadow-lg max-w-md mx-auto mt-24 outline-none'
      overlayClassName='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center'
    >
      <h2 className='text-xl font-semibold mb-4'>Confirm Delete</h2>
      <p className='mb-6 text-gray-600'>
        Are you sure you want to delete <span className='font-semibold'>{referral.givenName}</span>? This action cannot
        be undone.
      </p>
      <div className='flex justify-end space-x-3'>
        <button
          onClick={onClose}
          className='px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300'
        >
          Cancel
        </button>
        <button
          aria-disabled={isLoading}
          onClick={confirmDelete}
          className='px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700'
        >
          Delete
        </button>
      </div>
    </Modal>
  );
};

export default DeleteReferralModal;
