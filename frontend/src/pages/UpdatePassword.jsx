import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import { updatePasswordSchema } from '../utils/schemas';
import { updatePasswordApi } from '../api/auth';
import FormField, { inputClass } from '../components/FormField';

export default function UpdatePassword() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(updatePasswordSchema) });

  async function onSubmit(data) {
    try {
      await updatePasswordApi(data);
      toast.success('Password updated');
      reset();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not update password');
    }
  }

  return (
    <div className="mx-auto max-w-md">
      <h1 className="font-display text-2xl font-semibold text-ink-950">Update password</h1>
      <p className="mt-1 text-sm text-ink-500">Choose a new password for your account.</p>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4 rounded-xl border border-ink-100 bg-surface p-6">
        <FormField label="Current password" error={errors.currentPassword?.message}>
          <input type="password" className={inputClass} {...register('currentPassword')} autoComplete="current-password" />
        </FormField>
        <FormField label="New password" error={errors.newPassword?.message}>
          <input
            type="password"
            className={inputClass}
            {...register('newPassword')}
            autoComplete="new-password"
            placeholder="8-16 chars, 1 uppercase, 1 special char"
          />
        </FormField>
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-md bg-ink-950 px-4 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {isSubmitting ? 'Updating...' : 'Update password'}
        </button>
      </form>
    </div>
  );
}
