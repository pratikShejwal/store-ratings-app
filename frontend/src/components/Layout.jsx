import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const ROLE_HOME = {
  admin: '/admin',
  user: '/stores',
  store_owner: '/store-owner',
};

const ROLE_LABEL = {
  admin: 'Administrator',
  user: 'Member',
  store_owner: 'Store Owner',
};

export default function Layout({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    toast.success('Logged out');
    navigate('/login');
  }

  return (
    <div className="min-h-screen bg-canvas">
      <header className="border-b border-ink-100 bg-surface">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link to={user ? ROLE_HOME[user.role] : '/'} className="flex items-center gap-2">
            {/* <span className="text-amber-500 text-xl">★</span> */}
            <span className="font-display text-lg font-semibold text-ink-950">Storefront Ratings</span>
          </Link>

          {user && (
            <nav className="flex items-center gap-6 text-sm">
              {user.role === 'admin' && (
                <>
                  <Link to="/admin" className="text-ink-600 hover:text-ink-950">Dashboard</Link>
                  <Link to="/admin/users" className="text-ink-600 hover:text-ink-950">Users</Link>
                  <Link to="/admin/stores" className="text-ink-600 hover:text-ink-950">Stores</Link>
                </>
              )}
              {user.role === 'user' && (
                <Link to="/stores" className="text-ink-600 hover:text-ink-950">Stores</Link>
              )}
              {user.role === 'store_owner' && (
                <Link to="/store-owner" className="text-ink-600 hover:text-ink-950">Dashboard</Link>
              )}
              <Link to="/account/password" className="text-ink-600 hover:text-ink-950">Password</Link>

              <span className="rounded-full bg-ink-50 px-3 py-1 font-mono text-xs text-ink-600">
                {ROLE_LABEL[user.role]}
              </span>
              <button
                onClick={handleLogout}
                className="rounded-md border border-ink-100 px-3 py-1.5 text-ink-700 transition-colors hover:border-ink-700 hover:text-ink-950"
              >
                Log out
              </button>
            </nav>
          )}
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-8">{children}</main>
    </div>
  );
}
