import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';

import Login from './pages/Login';
import Signup from './pages/Signup';
import UpdatePassword from './pages/UpdatePassword';

import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsers from './pages/admin/AdminUsers';
import AdminUserDetails from './pages/admin/AdminUserDetails';
import AdminStores from './pages/admin/AdminStores';

import UserStores from './pages/user/UserStores';

import StoreOwnerDashboard from './pages/storeOwner/StoreOwnerDashboard';

const ROLE_HOME = { admin: '/admin', user: '/stores', store_owner: '/store-owner' };

function RootRedirect() {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;
  return <Navigate to={ROLE_HOME[user.role]} replace />;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      <Route path="/" element={<RootRedirect />} />

      <Route element={<ProtectedRoute />}>
        <Route
          path="/account/password"
          element={
            <Layout>
              <UpdatePassword />
            </Layout>
          }
        />
      </Route>

      <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
        <Route
          path="/admin"
          element={
            <Layout>
              <AdminDashboard />
            </Layout>
          }
        />
        <Route
          path="/admin/users"
          element={
            <Layout>
              <AdminUsers />
            </Layout>
          }
        />
        <Route
          path="/admin/users/:id"
          element={
            <Layout>
              <AdminUserDetails />
            </Layout>
          }
        />
        <Route
          path="/admin/stores"
          element={
            <Layout>
              <AdminStores />
            </Layout>
          }
        />
      </Route>

      <Route element={<ProtectedRoute allowedRoles={['user']} />}>
        <Route
          path="/stores"
          element={
            <Layout>
              <UserStores />
            </Layout>
          }
        />
      </Route>

      <Route element={<ProtectedRoute allowedRoles={['store_owner']} />}>
        <Route
          path="/store-owner"
          element={
            <Layout>
              <StoreOwnerDashboard />
            </Layout>
          }
        />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}
