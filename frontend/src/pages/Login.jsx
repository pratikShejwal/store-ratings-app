import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { loginSchema } from '../utils/schemas';
import { useAuth } from '../context/AuthContext';
import FormField, { inputClass } from '../components/FormField';

const ROLE_HOME = { admin: '/admin', user: '/stores', store_owner: '/store-owner' };

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(loginSchema) });

  async function onSubmit(data) {
    try {
      const user = await login(data);
      toast.success(`Welcome back, ${user.name.split(' ')[0]}`);
      navigate(ROLE_HOME[user.role] || '/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    }
  }

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center">
      <div className="mb-8 text-center">
        <span className="text-amber-500 text-3xl"></span>
        <h1 className="font-display mt-2 text-2xl font-semibold text-ink-950">Sign in</h1>
        <p className="mt-1 text-sm text-ink-500">Rate the stores you know. Discover the ones you don't.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 rounded-xl border border-ink-100 bg-surface p-6">
        <FormField label="Email" error={errors.email?.message}>
          <input type="email" className={inputClass} {...register('email')} autoComplete="email" />
        </FormField>
        <FormField label="Password" error={errors.password?.message}>
          <input type="password" className={inputClass} {...register('password')} autoComplete="current-password" />
        </FormField>
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-md bg-ink-950 px-4 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {isSubmitting ? 'Signing in...' : 'Sign in'}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-ink-500">
        New here?{' '}
        <Link to="/signup" className="font-medium text-ink-950 underline underline-offset-2">
          Create an account
        </Link>
      </p>
    </div>
  );
}
