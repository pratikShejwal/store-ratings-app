import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { getStoreOwnerDashboardApi } from '../../api/storeOwner';
import { StarDisplay } from '../../components/StarRating';
import DataTable from '../../components/DataTable';

export default function StoreOwnerDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getStoreOwnerDashboardApi()
      .then((res) => setData(res.data))
      .catch((err) => setError(err.response?.data?.message || 'Failed to load dashboard'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-ink-500">Loading...</p>;
  if (error) return <p className="text-ink-500">{error}</p>;

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-ink-950">{data.store.name}</h1>
      <p className="mt-1 text-sm text-ink-500">{data.store.address}</p>

      <div className="mt-6 rounded-xl border border-ink-100 bg-surface p-6">
        <p className="text-sm text-ink-500">Average rating</p>
        <div className="mt-2">
          <StarDisplay value={data.averageRating} size="text-2xl" />
        </div>
      </div>

      <h2 className="font-display mt-8 text-lg font-semibold text-ink-950">Users who rated your store</h2>
      <div className="mt-3">
        <DataTable
          columns={[
            { key: 'name', label: 'Name' },
            { key: 'email', label: 'Email' },
            { key: 'rating', label: 'Rating', render: (row) => <StarDisplay value={row.rating} /> },
          ]}
          rows={data.raters}
          emptyLabel="No ratings submitted yet"
        />
      </div>
    </div>
  );
}
