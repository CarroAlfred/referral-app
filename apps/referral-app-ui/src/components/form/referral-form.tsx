import React from 'react';
import { useForm } from 'react-hook-form';
import { Referral } from '../../types/referral';

type ReferralFormData = Omit<Referral, 'id' | 'createdAt' | 'updatedAt'>;

interface ReferralFormProps {
  mode: 'create' | 'update';
  initialData?: Referral;
  onSubmit: (data: ReferralFormData) => Promise<void>;
  onCancel: () => void;
  isSubmitting?: boolean;
}

const ReferralForm: React.FC<ReferralFormProps> = ({ mode, initialData, onSubmit, onCancel, isSubmitting }) => {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<ReferralFormData>({
    defaultValues: initialData || {
      givenName: '',
      surname: '',
      email: '',
      phone: '',
      homeNameOrNumber: '',
      street: '',
      suburb: '',
      state: '',
      postcode: '',
      country: '',
      status: 'pending',
      notes: '',
      referredBy: '',
    },
  });

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className='space-y-4'
    >
      <div className='grid grid-cols-2 gap-4'>
        <div>
          <label className='block text-sm font-medium text-gray-700'>Given Name</label>
          <input
            {...register('givenName', { required: 'Given name is required' })}
            className='w-full mt-1 p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none'
          />
          {errors.givenName && <p className='text-red-500 text-sm'>{errors.givenName.message}</p>}
        </div>
        <div>
          <label className='block text-sm font-medium text-gray-700'>Surname</label>
          <input
            {...register('surname', { required: 'Surname is required' })}
            className='w-full mt-1 p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none'
          />
          {errors.surname && <p className='text-red-500 text-sm'>{errors.surname.message}</p>}
        </div>
      </div>

      <div className='grid grid-cols-2 gap-4'>
        <div>
          <label className='block text-sm font-medium text-gray-700'>Email</label>
          <input
            type='email'
            {...register('email', { required: 'Email is required' })}
            className='w-full mt-1 p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none'
          />
          {errors.email && <p className='text-red-500 text-sm'>{errors.email.message}</p>}
        </div>
        <div>
          <label className='block text-sm font-medium text-gray-700'>Phone</label>
          <input
            {...register('phone', { required: 'Phone is required' })}
            className='w-full mt-1 p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none'
          />
          {errors.phone && <p className='text-red-500 text-sm'>{errors.phone.message}</p>}
        </div>
      </div>

      {/* Address */}
      <div className='grid grid-cols-2 gap-4'>
        <div>
          <label className='block text-sm font-medium text-gray-700'>Home Name/Number</label>
          <input
            {...register('homeNameOrNumber', { required: 'Home name/number is required' })}
            className='w-full mt-1 p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none'
          />
          {errors.homeNameOrNumber && <p className='text-red-500 text-sm'>{errors.homeNameOrNumber.message}</p>}
        </div>
        <div>
          <label className='block text-sm font-medium text-gray-700'>Street</label>
          <input
            {...register('street', { required: 'Street is required' })}
            className='w-full mt-1 p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none'
          />
          {errors.street && <p className='text-red-500 text-sm'>{errors.street.message}</p>}
        </div>
      </div>

      <div className='grid grid-cols-3 gap-4'>
        <div>
          <label className='block text-sm font-medium text-gray-700'>Suburb</label>
          <input
            {...register('suburb', { required: 'Suburb is required' })}
            className='w-full mt-1 p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none'
          />
          {errors.suburb && <p className='text-red-500 text-sm'>{errors.suburb.message}</p>}
        </div>
        <div>
          <label className='block text-sm font-medium text-gray-700'>State</label>
          <input
            {...register('state', { required: 'State is required' })}
            className='w-full mt-1 p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none'
          />
          {errors.state && <p className='text-red-500 text-sm'>{errors.state.message}</p>}
        </div>
        <div>
          <label className='block text-sm font-medium text-gray-700'>Postcode</label>
          <input
            {...register('postcode', { required: 'Postcode is required' })}
            className='w-full mt-1 p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none'
          />
          {errors.postcode && <p className='text-red-500 text-sm'>{errors.postcode.message}</p>}
        </div>
      </div>

      <div>
        <label className='block text-sm font-medium text-gray-700'>Country</label>
        <input
          {...register('country', { required: 'Country is required' })}
          className='w-full mt-1 p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none'
        />
        {errors.country && <p className='text-red-500 text-sm'>{errors.country.message}</p>}
      </div>

      {/* Status */}
      <div>
        <label className='block text-sm font-medium text-gray-700'>Status</label>
        <select
          {...register('status', { required: 'Status is required' })}
          className='w-full mt-1 p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none'
        >
          <option value='pending'>Pending</option>
          <option value='contacted'>Contacted</option>
          <option value='completed'>Completed</option>
          <option value='declined'>Declined</option>
        </select>
        {errors.status && <p className='text-red-500 text-sm'>{errors.status.message}</p>}
      </div>

      {/* Optional Fields */}
      <div>
        <label className='block text-sm font-medium text-gray-700'>Notes</label>
        <textarea
          {...register('notes')}
          rows={3}
          className='w-full mt-1 p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none'
        />
      </div>
      <div>
        <label className='block text-sm font-medium text-gray-700'>Referred By</label>
        <input
          {...register('referredBy')}
          className='w-full mt-1 p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none'
        />
      </div>

      <div className='flex justify-end space-x-2'>
        <button
          type='button'
          onClick={onCancel}
          className='px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300'
        >
          Cancel
        </button>
        <button
          type='submit'
          disabled={isSubmitting}
          className='px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50'
        >
          {isSubmitting ? 'Saving...' : mode === 'create' ? 'Create Referral' : 'Update Referral'}
        </button>
      </div>
    </form>
  );
};

export default ReferralForm;
