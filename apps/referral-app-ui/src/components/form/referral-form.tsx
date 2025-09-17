import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { TextInput, Typography, TextArea, Button, Loader, Dropdown } from '../common';
import { Referral } from '../../types';

type ReferralFormData = Omit<Referral, 'id' | 'createdAt' | 'updatedAt'>;

interface ReferralFormProps {
  mode: 'create' | 'update';
  initialData?: Referral;
  onSubmit: (data: ReferralFormData) => Promise<void>;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export const ReferralForm: React.FC<ReferralFormProps> = ({ mode, initialData, onSubmit, onCancel, isSubmitting }) => {
  const {
    handleSubmit,
    register,
    formState: { errors },
    control,
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
    <div className='p-6 space-y-4'>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className='space-y-4'
      >
        {/* Name */}
        <div className='grid grid-cols-2 gap-4'>
          <TextInput
            label='Given Name'
            error={errors.givenName?.message}
            {...register('givenName', { required: 'Given name is required' })}
          />
          <TextInput
            label='Surname'
            error={errors.surname?.message}
            {...register('surname', { required: 'Surname is required' })}
          />
        </div>

        {/* Contact */}
        <div className='grid grid-cols-2 gap-4'>
          <TextInput
            label='Email'
            type='email'
            error={errors.email?.message}
            {...register('email', { required: 'Email is required' })}
          />
          <TextInput
            label='Phone'
            error={errors.phone?.message}
            {...register('phone', { required: 'Phone is required' })}
          />
        </div>

        {/* Address */}
        <div className='grid grid-cols-2 gap-4'>
          <TextInput
            label='Home Name/Number'
            error={errors.homeNameOrNumber?.message}
            {...register('homeNameOrNumber', { required: 'Home name/number is required' })}
          />
          <TextInput
            label='Street'
            error={errors.street?.message}
            {...register('street', { required: 'Street is required' })}
          />
        </div>

        <div className='grid grid-cols-3 gap-4'>
          <TextInput
            label='Suburb'
            error={errors.suburb?.message}
            {...register('suburb', { required: 'Suburb is required' })}
          />
          <TextInput
            label='State'
            error={errors.state?.message}
            {...register('state', { required: 'State is required' })}
          />
          <TextInput
            label='Postcode'
            error={errors.postcode?.message}
            {...register('postcode', { required: 'Postcode is required' })}
          />
        </div>

        <TextInput
          label='Country'
          error={errors.country?.message}
          {...register('country', { required: 'Country is required' })}
        />

        {/* Status */}
        <div>
          <Typography
            variant='body'
            className='block mb-1'
          >
            Status
          </Typography>
          <Controller
            control={control}
            name='status'
            rules={{ required: 'Status is required' }}
            render={({ field }) => (
              <Dropdown
                items={[
                  { id: 'pending', label: 'Pending' },
                  { id: 'contacted', label: 'Contacted' },
                  { id: 'completed', label: 'Completed' },
                  { id: 'declined', label: 'Declined' },
                ]}
                value={field.value}
                onChange={(item) => field.onChange(item.id)}
                placeholder='Select status'
              />
            )}
          />
          {errors.status && (
            <Typography
              variant='caption'
              className='text-red-500'
            >
              {errors.status.message}
            </Typography>
          )}
        </div>

        {/* Notes */}
        <TextArea
          label='Notes'
          error={errors.notes?.message}
          {...register('notes')}
          rows={3}
        />

        <TextInput
          label='Referred By'
          error={errors.referredBy?.message}
          {...register('referredBy')}
        />

        {/* Actions */}
        <div className='flex justify-end space-x-2'>
          <Button
            variant='outline'
            onClick={onCancel}
          >
            Cancel
          </Button>
          <Button
            disabled={isSubmitting}
            type='submit'
          >
            {isSubmitting ? <Loader size={20} /> : mode === 'create' ? 'Create Referral' : 'Update Referral'}
          </Button>
        </div>
      </form>
    </div>
  );
};
