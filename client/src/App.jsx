import { AuthProvider, useAuth } from './contexts/AuthContext';
import { useEffect } from 'react';
import StudentLogin from './pages/StudentLogin';
import TeacherLogin from './pages/TeacherLogin';
import Dashboard from './pages/Dashboard';

function AppContent() {
  const { user, loading } = useAuth();

  // Force re-render when user changes
  useEffect(() => {
    if (user) {
      console.log('User logged in:', user);
    }
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
          <div className="text-white text-lg font-medium">Loading...</div>
        </div>
      </div>
    );
  }

  // If user is logged in, show dashboard
  if (user) {
    return <Dashboard />;
  }

  // Router based on URL path
  const path = window.location.pathname;

  if (path === '/teacher-login') {
    return <TeacherLogin />;
  }

  return <StudentLogin />;
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
