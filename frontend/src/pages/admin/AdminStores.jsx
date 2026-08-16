import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import { listStoresApi, createStoreApi, listUsersApi } from '../../api/admin';
import { createStoreSchema } from '../../utils/schemas';
import DataTable from '../../components/DataTable';
import FilterBar from '../../components/FilterBar';
import FormField, { inputClass } from '../../components/FormField';
import { StarDisplay } from '../../components/StarRating';

export default function AdminStores() {
  const [stores, setStores] = useState([]);
  const [owners, setOwners] = useState([]);
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
  } = useForm({ resolver: zodResolver(createStoreSchema) });

  async function fetchStores() {
    setLoading(true);
    try {
      const res = await listStoresApi({ ...appliedFilters, sortBy, sortOrder });
      setStores(res.data.stores);
    } catch {
      toast.error('Failed to load stores');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchStores();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appliedFilters, sortBy, sortOrder]);

  useEffect(() => {
    listUsersApi({ role: 'store_owner' }).then((res) => setOwners(res.data.users));
  }, []);

  function handleSort(key, order) {
    setSortBy(key);
    setSortOrder(order);
  }

  async function onCreateStore(data) {
    try {
      await createStoreApi(data);
      toast.success('Store created');
      reset();
      setShowForm(false);
      fetchStores();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create store');
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold text-ink-950">Stores</h1>
          <p className="mt-1 text-sm text-ink-500">Manage stores registered on the platform.</p>
        </div>
        <button
          onClick={() => setShowForm((s) => !s)}
          className="rounded-md bg-amber-500 px-4 py-2 text-sm font-medium text-ink-950 transition-opacity hover:opacity-90"
        >
          {showForm ? 'Cancel' : '+ Add store'}
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit(onCreateStore)}
          className="mt-4 grid grid-cols-1 gap-4 rounded-xl border border-ink-100 bg-surface p-6 sm:grid-cols-2"
        >
          <FormField label="Store name" error={errors.name?.message}>
            <input className={inputClass} {...register('name')} placeholder="20-60 characters" />
          </FormField>
          <FormField label="Store email" error={errors.email?.message}>
            <input type="email" className={inputClass} {...register('email')} />
          </FormField>
          <div className="sm:col-span-2">
            <FormField label="Address" error={errors.address?.message}>
              <textarea className={inputClass} rows={2} {...register('address')} />
            </FormField>
          </div>
          <FormField label="Store owner (optional)" error={errors.ownerId?.message}>
            <select className={inputClass} {...register('ownerId')}>
              <option value="">Unassigned</option>
              {owners.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.name} ({o.email})
                </option>
              ))}
            </select>
          </FormField>
          <div className="sm:col-span-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-md bg-ink-950 px-4 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              {isSubmitting ? 'Creating...' : 'Create store'}
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
              { key: 'name', label: 'Name', sortable: true },
              { key: 'email', label: 'Email', sortable: true },
              { key: 'address', label: 'Address', sortable: true },
              { key: 'avgRating', label: 'Rating', render: (row) => <StarDisplay value={row.avgRating} /> },
            ]}
            rows={stores}
          />
        )}
      </div>
    </div>
  );
}
