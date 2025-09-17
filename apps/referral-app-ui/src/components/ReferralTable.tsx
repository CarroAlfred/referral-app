import React from 'react';
import { Referral } from '../types/referral';

interface ReferralTableProps {
  referrals: Referral[];
  pagination: {
    total: number;
    limit: number;
    offset: number;
    hasMore: boolean;
  };
  onPageChange: (page: number) => void; // page-based now
  onEdit: (referral: Referral) => void;
  onDelete: (referral: Referral) => void;
}

const ReferralTable: React.FC<ReferralTableProps> = ({ referrals, pagination, onPageChange, onEdit, onDelete }) => {
  const currentPage = Math.floor(pagination.offset / pagination.limit) + 1;
  const totalPages = Math.ceil(pagination.total / pagination.limit);

  return (
    <div className='p-4 bg-white rounded-2xl shadow'>
      <table className='min-w-full divide-y divide-gray-200'>
        <thead className='bg-gray-50'>
          <tr>
            <th className='px-6 py-3 text-left text-sm font-semibold text-gray-600'>Given Name</th>
            <th className='px-6 py-3 text-left text-sm font-semibold text-gray-600'>Surname</th>
            <th className='px-6 py-3 text-left text-sm font-semibold text-gray-600'>Email</th>
            <th className='px-6 py-3 text-left text-sm font-semibold text-gray-600'>Phone</th>
            <th className='px-6 py-3 text-center text-sm font-semibold text-gray-600'>Actions</th>
          </tr>
        </thead>
        <tbody className='divide-y divide-gray-200'>
          {referrals.map((ref) => (
            <tr key={ref.id}>
              <td className='px-6 py-4 text-sm text-gray-800'>{ref.givenName}</td>
              <td className='px-6 py-4 text-sm text-gray-800'>{ref.surname}</td>
              <td className='px-6 py-4 text-sm text-gray-800'>{ref.email}</td>
              <td className='px-6 py-4 text-sm text-gray-800'>{ref.phone}</td>
              <td className='px-6 py-4 text-center space-x-2'>
                <button
                  onClick={() => onEdit(ref)}
                  className='px-3 py-1 text-sm text-white bg-blue-500 rounded-lg hover:bg-blue-600'
                >
                  Edit
                </button>
                <button
                  onClick={() => onDelete(ref)}
                  className='px-3 py-1 text-sm text-white bg-red-500 rounded-lg hover:bg-red-600'
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
          {referrals.length === 0 && (
            <tr>
              <td
                colSpan={5}
                className='px-6 py-4 text-center text-gray-500'
              >
                No referrals found
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Pagination */}
      <div className='flex justify-between items-center mt-4 text-sm'>
        <span className='text-gray-600'>
          Page {currentPage} of {totalPages}
        </span>
        <div className='space-x-2'>
          <button
            disabled={currentPage === 1}
            onClick={() => onPageChange(currentPage - 1)}
            className='px-3 py-1 border rounded-lg disabled:opacity-50'
          >
            Prev
          </button>
          <button
            disabled={currentPage === totalPages}
            onClick={() => onPageChange(currentPage + 1)}
            className='px-3 py-1 border rounded-lg disabled:opacity-50'
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReferralTable;
