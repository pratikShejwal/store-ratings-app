import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { signupSchema } from '../utils/schemas';
import { useAuth } from '../context/AuthContext';
import FormField, { inputClass } from '../components/FormField';

export default function Signup() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(signupSchema) });

  async function onSubmit(data) {
    try {
      await signup(data);
      toast.success('Account created');
      navigate('/stores');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Signup failed');
    }
  }

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center">
      <div className="mb-8 text-center">
        <span className="text-amber-500 text-3xl"></span>
        <h1 className="font-display mt-2 text-2xl font-semibold text-ink-950">Create your account</h1>
        <p className="mt-1 text-sm text-ink-500">Join to rate and discover stores.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 rounded-xl border border-ink-100 bg-surface p-6">
        <FormField label="Full name" error={errors.name?.message}>
          <input className={inputClass} {...register('name')} placeholder="20-60 characters" />
        </FormField>
        <FormField label="Email" error={errors.email?.message}>
          <input type="email" className={inputClass} {...register('email')} autoComplete="email" />
        </FormField>
        <FormField label="Address" error={errors.address?.message}>
          <textarea className={inputClass} rows={3} {...register('address')} placeholder="Up to 400 characters" />
        </FormField>
        <FormField label="Password" error={errors.password?.message}>
          <input
            type="password"
            className={inputClass}
            {...register('password')}
            autoComplete="new-password"
            placeholder="8-16 chars, 1 uppercase, 1 special char"
          />
        </FormField>
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-md bg-ink-950 px-4 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {isSubmitting ? 'Creating account...' : 'Create account'}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-ink-500">
        Already have an account?{' '}
        <Link to="/login" className="font-medium text-ink-950 underline underline-offset-2">
          Sign in
        </Link>
      </p>
    </div>
  );
}
