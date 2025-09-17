import React from 'react';
import Modal from 'react-modal';
import ReferralForm from './form/referral-form';
import { useCreateReferral } from '../store/hooks/referrals/use-create-referral';
import { ReferralFormData } from '../types/referral';

interface AddReferralModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddReferralModal: React.FC<AddReferralModalProps> = ({ isOpen, onClose }) => {
  const { mutate, isLoading } = useCreateReferral();

  const handleCreate = async (data: ReferralFormData) => {
    await mutate(data);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      overlayClassName='fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center'
      className='bg-white rounded-2xl shadow-lg max-w-2xl w-full p-6 overflow-y-auto max-h-[90vh]'
    >
      <h2 className='text-xl font-semibold text-gray-800 mb-4'>Add New Referral</h2>
      <ReferralForm
        mode='create'
        isSubmitting={isLoading}
        onSubmit={handleCreate}
        onCancel={onClose}
      />
    </Modal>
  );
};

export default AddReferralModal;
