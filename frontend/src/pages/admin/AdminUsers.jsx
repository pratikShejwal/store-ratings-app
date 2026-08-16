import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { listUsersApi, createUserApi } from '../../api/admin';
import { adminCreateUserSchema } from '../../utils/schemas';
import DataTable from '../../components/DataTable';
import FilterBar from '../../components/FilterBar';
import FormField, { inputClass } from '../../components/FormField';

const ROLE_LABEL = { admin: 'Administrator', user: 'Normal user', store_owner: 'Store owner' };

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({});
  const [appliedFilters, setAppliedFilters] = useState({});
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [showForm, setShowForm] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(adminCreateUserSchema), defaultValues: { role: 'user' } });

  async function fetchUsers() {
    setLoading(true);
    try {
      const res = await listUsersApi({ ...appliedFilters, sortBy, sortOrder });
      setUsers(res.data.users);
    } catch (err) {
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appliedFilters, sortBy, sortOrder]);

  function handleSort(key, order) {
    setSortBy(key);
    setSortOrder(order);
  }

  async function onCreateUser(data) {
    try {
      await createUserApi(data);
      toast.success('User created');
      reset();
      setShowForm(false);
      fetchUsers();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create user');
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold text-ink-950">Users</h1>
          <p className="mt-1 text-sm text-ink-500">Manage normal users and administrators.</p>
        </div>
        <button
          onClick={() => setShowForm((s) => !s)}
          className="rounded-md bg-amber-500 px-4 py-2 text-sm font-medium text-ink-950 transition-opacity hover:opacity-90"
        >
          {showForm ? 'Cancel' : '+ Add user'}
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit(onCreateUser)}
          className="mt-4 grid grid-cols-1 gap-4 rounded-xl border border-ink-100 bg-surface p-6 sm:grid-cols-2"
        >
          <FormField label="Full name" error={errors.name?.message}>
            <input className={inputClass} {...register('name')} placeholder="20-60 characters" />
          </FormField>
          <FormField label="Email" error={errors.email?.message}>
            <input type="email" className={inputClass} {...register('email')} />
          </FormField>
          <FormField label="Address" error={errors.address?.message}>
            <textarea className={inputClass} rows={2} {...register('address')} />
          </FormField>
          <FormField label="Password" error={errors.password?.message}>
            <input type="password" className={inputClass} {...register('password')} placeholder="8-16 chars, 1 uppercase, 1 special char" />
          </FormField>
          <FormField label="Role" error={errors.role?.message}>
            <select className={inputClass} {...register('role')}>
              <option value="user">Normal user</option>
              <option value="admin">Administrator</option>
              <option value="store_owner">Store owner</option>
            </select>
          </FormField>
          <div className="sm:col-span-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-md bg-ink-950 px-4 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              {isSubmitting ? 'Creating...' : 'Create user'}
            </button>
          </div>
        </form>
      )}

      <div className="mt-6">
        <FilterBar
          fields={[
            { key: 'name', label: 'Name', placeholder: 'Search by name' },
            { key: 'email', label: 'Email', placeholder: 'Search by email' },
            { key: 'address', label: 'Address', placeholder: 'Search by address' },
            {
              key: 'role',
              label: 'Role',
              type: 'select',
              options: [
                { value: 'admin', label: 'Administrator' },
                { value: 'user', label: 'Normal user' },
                { value: 'store_owner', label: 'Store owner' },
              ],
            },
          ]}
          values={filters}
          onChange={(key, val) => setFilters((f) => ({ ...f, [key]: val }))}
          onSubmit={() => setAppliedFilters(filters)}
        />

        {loading ? (
          <p className="text-ink-500">Loading...</p>
        ) : (
          <DataTable
            sortBy={sortBy}
            sortOrder={sortOrder}
            onSort={handleSort}
            columns={[
              {
                key: 'name',
                label: 'Name',
                sortable: true,
                render: (row) => (
                  <Link to={`/admin/users/${row.id}`} className="font-medium text-ink-950 hover:underline">
                    {row.name}
                  </Link>
                ),
              },
              { key: 'email', label: 'Email', sortable: true },
              { key: 'address', label: 'Address', sortable: true },
              { key: 'role', label: 'Role', sortable: true, render: (row) => ROLE_LABEL[row.role] },
            ]}
            rows={users}
          />
        )}
      </div>
    </div>
  );
}
