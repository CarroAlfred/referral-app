import React from 'react';
import { Button, CommonModal, Typography } from '../../components';
import { useDeleteReferral } from '../../store';
import { Referral } from '../../types';

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
    <CommonModal
      isOpen={isOpen}
      onClose={onClose}
      footerActions={
        <div className='flex gap-2'>
          <Button
            onClick={onClose}
            variant='outline'
          >
            Cancel
          </Button>
          <Button
            disabled={isLoading}
            onClick={confirmDelete}
          >
            Delete
          </Button>
        </div>
      }
    >
      <Typography
        variant='h2'
        className='mb-4'
      >
        Confirm Delete
      </Typography>
      <Typography variant='body'>
        Are you sure you want to delete
        <Typography
          as='span'
          weight='bold'
          className='font-semibold px-1'
        >
          {referral.givenName}
        </Typography>
        ? This action cannot be undone.
      </Typography>
    </CommonModal>
  );
};

export default DeleteReferralModal;
