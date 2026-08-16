import { useEffect, useState } from 'react';
import { getDashboardApi } from '../../api/admin';

function StatCard({ label, value }) {
  return (
    <div className="rounded-xl border border-ink-100 bg-surface p-6">
      <p className="text-sm text-ink-500">{label}</p>
      <p className="font-display mt-2 text-4xl font-semibold text-ink-950">{value}</p>
    </div>
  );
}

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDashboardApi()
      .then((res) => setStats(res.data))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-ink-950">Dashboard</h1>
      <p className="mt-1 text-sm text-ink-500">Platform overview at a glance.</p>

      {loading ? (
        <p className="mt-8 text-ink-500">Loading...</p>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <StatCard label="Total users" value={stats.totalUsers} />
          <StatCard label="Total stores" value={stats.totalStores} />
          <StatCard label="Total ratings submitted" value={stats.totalRatings} />
        </div>
      )}
    </div>
  );
}
