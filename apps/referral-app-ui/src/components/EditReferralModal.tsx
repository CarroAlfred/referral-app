import React from 'react';
import Modal from 'react-modal';
import ReferralForm from './form/referral-form';
import { Referral } from '../types/referral';
import { useUpdateReferral } from '../store/hooks/referrals/use-update-referral';

interface EditReferralModalProps {
  isOpen: boolean;
  onClose: () => void;
  referral: Referral;
}

export type ReferralFormData = Partial<Omit<Referral, 'id' | 'createdAt' | 'updatedAt'>>;

const EditReferralModal: React.FC<EditReferralModalProps> = ({ isOpen, onClose, referral }) => {
  const { mutate: updateReferralMutate, isLoading } = useUpdateReferral();

  const handleUpdate = async (data: ReferralFormData) => {
    await updateReferralMutate({ id: referral.id, data });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      overlayClassName='fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center'
      className='bg-white rounded-2xl shadow-lg max-w-2xl w-full p-6 overflow-y-auto max-h-[90vh]'
    >
      <h2 className='text-xl font-semibold text-gray-800 mb-4'>Edit Referral</h2>
      <ReferralForm
        mode='update'
        initialData={referral}
        onSubmit={handleUpdate}
        onCancel={onClose}
        isSubmitting={isLoading} // optional to disable submit button
      />
    </Modal>
  );
};

export default EditReferralModal;
