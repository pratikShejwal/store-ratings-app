import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { listStoresForUserApi, submitRatingApi } from '../../api/stores';
import { StarDisplay, StarInput } from '../../components/StarRating';
import { inputClass } from '../../components/FormField';

export default function UserStores() {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [nameQuery, setNameQuery] = useState('');
  const [addressQuery, setAddressQuery] = useState('');
  const [submittingId, setSubmittingId] = useState(null);

  async function fetchStores(params = {}) {
    setLoading(true);
    try {
      const res = await listStoresForUserApi(params);
      setStores(res.data.stores);
    } catch {
      toast.error('Failed to load stores');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchStores();
  }, []);

  function handleSearch(e) {
    e.preventDefault();
    fetchStores({ name: nameQuery || undefined, address: addressQuery || undefined });
  }

  async function handleRate(storeId, value) {
    setSubmittingId(storeId);
    try {
      await submitRatingApi({ storeId, value });
      toast.success('Rating saved');
      setStores((prev) =>
        prev.map((s) => (s.id === storeId ? { ...s, userRating: value } : s))
      );
      // refresh overall rating from server since our local avg calc would be wrong
      fetchStores({ name: nameQuery || undefined, address: addressQuery || undefined });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit rating');
    } finally {
      setSubmittingId(null);
    }
  }

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-ink-950">Stores</h1>
      <p className="mt-1 text-sm text-ink-500">Browse and rate stores on the platform.</p>

      <form onSubmit={handleSearch} className="mt-6 flex flex-wrap gap-3 rounded-lg border border-ink-100 bg-surface p-4">
        <input
          className={`${inputClass} max-w-xs`}
          placeholder="Search by name"
          value={nameQuery}
          onChange={(e) => setNameQuery(e.target.value)}
        />
        <input
          className={`${inputClass} max-w-xs`}
          placeholder="Search by address"
          value={addressQuery}
          onChange={(e) => setAddressQuery(e.target.value)}
        />
        <button
          type="submit"
          className="rounded-md bg-ink-950 px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90"
        >
          Search
        </button>
      </form>

      {loading ? (
        <p className="mt-6 text-ink-500">Loading...</p>
      ) : stores.length === 0 ? (
        <p className="mt-6 text-ink-500">No stores found.</p>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {stores.map((store) => (
            <div key={store.id} className="rounded-xl border border-ink-100 bg-surface p-5">
              <h2 className="font-display text-lg font-semibold text-ink-950">{store.name}</h2>
              <p className="mt-1 text-sm text-ink-500">{store.address}</p>

              <div className="mt-4 flex items-center justify-between text-sm">
                <span className="text-ink-600">Overall rating</span>
                <StarDisplay value={store.overallRating} />
              </div>

              <div className="mt-3 border-t border-ink-100 pt-3">
                <p className="mb-1.5 text-sm text-ink-600">
                  {store.userRating ? 'Your rating' : 'Rate this store'}
                </p>
                <StarInput
                  value={store.userRating || 0}
                  disabled={submittingId === store.id}
                  onChange={(value) => handleRate(store.id, value)}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
