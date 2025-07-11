import React from 'react';
import { useAuth } from './hooks/useAuth';
import { Layout } from './components/Layout';
import { AuthForm } from './components/AuthForm';
import { Dashboard } from './components/Dashboard';
import { AdminDashboard } from './components/AdminDashboard';

function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div
          className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"
          aria-label="Loading"
        ></div>
      </div>
    );
  }

  if (!user) {
    return <AuthForm />;
  }

  return (
    <Layout user={user}>
      {user?.role === 'admin' ? (
        <AdminDashboard user={user} />
      ) : (
        <Dashboard user={user} />
      )}
    </Layout>
  );
}

export default App;
