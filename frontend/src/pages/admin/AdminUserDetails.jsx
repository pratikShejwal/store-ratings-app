import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { getUserDetailsApi } from '../../api/admin';
import { StarDisplay } from '../../components/StarRating';

const ROLE_LABEL = { admin: 'Administrator', user: 'Normal user', store_owner: 'Store owner' };

export default function AdminUserDetails() {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getUserDetailsApi(id)
      .then((res) => setUser(res.data.user))
      .catch(() => toast.error('Failed to load user'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p className="text-ink-500">Loading...</p>;
  if (!user) return <p className="text-ink-500">User not found.</p>;

  return (
    <div className="max-w-lg">
      <Link to="/admin/users" className="text-sm text-ink-500 hover:underline">
        ← Back to users
      </Link>

      <div className="mt-4 rounded-xl border border-ink-100 bg-surface p-6">
        <h1 className="font-display text-2xl font-semibold text-ink-950">{user.name}</h1>
        <span className="mt-1 inline-block rounded-full bg-ink-50 px-3 py-1 text-xs font-medium text-ink-600">
          {ROLE_LABEL[user.role]}
        </span>

        <dl className="mt-6 space-y-4 text-sm">
          <div>
            <dt className="text-ink-500">Email</dt>
            <dd className="mt-0.5 text-ink-900">{user.email}</dd>
          </div>
          <div>
            <dt className="text-ink-500">Address</dt>
            <dd className="mt-0.5 text-ink-900">{user.address}</dd>
          </div>
          {user.role === 'store_owner' && (
            <div>
              <dt className="text-ink-500">Store rating</dt>
              <dd className="mt-0.5">
                <StarDisplay value={user.rating} />
              </dd>
            </div>
          )}
        </dl>
      </div>
    </div>
  );
}
