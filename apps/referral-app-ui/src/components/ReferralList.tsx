import React, { useState } from 'react';
import ReferralTable from './ReferralTable';
import AddReferralModal from './AddReferralModal';
import EditReferralModal from './EditReferralModal';
import DeleteReferralModal from './DeleteReferralModal';
import { Referral } from '../types/referral';
import { useReferrals } from '../store/hooks/referrals/use-get-referrals';

const ReferralList: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingReferral, setEditingReferral] = useState<Referral | null>(null);
  const [deletingReferral, setDeletingReferral] = useState<Referral | null>(null);

  const { referrals, pagination, isLoading, refetch } = useReferrals();

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

  if (isLoading) return <p className='p-4'>Loading...</p>;

  return (
    <div>
      <div className='flex justify-between items-center mb-4'>
        <h1 className='text-2xl font-bold'>Referrals</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className='px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700'
        >
          + Add Referral
        </button>
      </div>

      <ReferralTable
        referrals={referrals}
        pagination={pagination}
        onPageChange={handlePageChange}
        onEdit={handleEdit}
        onDelete={handleDelete}
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

export default ReferralList;
