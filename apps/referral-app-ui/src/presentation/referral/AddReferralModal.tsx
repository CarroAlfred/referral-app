import React from 'react';
import { CommonModal, Typography, ReferralForm } from '../../components';
import { ReferralFormData } from '../../types';
import { useCreateReferral } from '../../store';

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
    <CommonModal
      isOpen={isOpen}
      onClose={onClose}
    >
      <Typography variant='h2'>Add New Referral</Typography>
      <ReferralForm
        mode='create'
        isSubmitting={isLoading}
        onSubmit={handleCreate}
        onCancel={onClose}
      />
    </CommonModal>
  );
};

export default AddReferralModal;
