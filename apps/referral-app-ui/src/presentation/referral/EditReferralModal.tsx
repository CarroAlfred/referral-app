import React from 'react';
import { CommonModal, Typography, ReferralForm } from '../../components';
import { useUpdateReferral } from '../../store';
import { Referral } from '../../types';

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
    <CommonModal
      isOpen={isOpen}
      onClose={onClose}
    >
      <Typography
        variant='h2'
        className='text-xl font-semibold text-gray-800 mb-4'
      >
        Edit Referral
      </Typography>
      <ReferralForm
        mode='update'
        initialData={referral}
        onSubmit={handleUpdate}
        onCancel={onClose}
        isSubmitting={isLoading} // optional to disable submit button
      />
    </CommonModal>
  );
};

export default EditReferralModal;
