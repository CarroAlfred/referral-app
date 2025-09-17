import React, { useState } from 'react';
import AddReferralModal from './AddReferralModal';
import EditReferralModal from './EditReferralModal';
import DeleteReferralModal from './DeleteReferralModal';
import { Loader, Typography, Button, DataTable } from '../../components';
import { useGetReferrals } from '../../store';
import { Referral } from '../../types';

export const ReferralList: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingReferral, setEditingReferral] = useState<Referral | null>(null);
  const [deletingReferral, setDeletingReferral] = useState<Referral | null>(null);

  const { referrals, pagination, isLoading, refetch } = useGetReferrals();

  const handleEdit = (referral: Referral) => {
    setEditingReferral(referral);
  };

  const handlePageChange = (page: number) => {
    const newOffset = (page - 1) * pagination.limit;
    refetch({ offset: newOffset, limit: pagination.limit });
  };

  const handleDelete = (referral: Referral) => {
    setDeletingReferral(referral);
  };

  return (
    <div>
      <div className='flex justify-between items-center mb-4'>
        {isLoading && <Loader overlay />}
        <Typography
          variant='h1'
          className='text-2xl font-bold'
        >
          Referrals
        </Typography>
        <Button
          onClick={() => setIsModalOpen(true)}
          variant='primary'
        >
          + Add Referral
        </Button>
      </div>

      <DataTable
        data={referrals}
        keyField='id'
        columns={[
          { header: 'Given Name', accessor: 'givenName' },
          { header: 'Surname', accessor: 'surname' },
          { header: 'Email', accessor: 'email' },
          { header: 'Phone', accessor: 'phone' },
        ]}
        onEdit={handleEdit}
        onDelete={handleDelete}
        pagination={pagination}
        onPageChange={handlePageChange}
      />

      {/* Add referral modal */}
      <AddReferralModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />

      {/* Edit referral modal */}
      {editingReferral && (
        <EditReferralModal
          isOpen={!!editingReferral}
          referral={editingReferral}
          onClose={() => setEditingReferral(null)}
        />
      )}

      {deletingReferral && (
        <DeleteReferralModal
          isOpen={!!deletingReferral}
          onClose={() => setDeletingReferral(null)}
          referral={deletingReferral}
        />
      )}
    </div>
  );
};
