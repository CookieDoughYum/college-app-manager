import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { StudentProvider } from './contexts/StudentContext';
import AuthLayout from './layouts/AuthLayout';
import AppLayout from './layouts/AppLayout';
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import ProtectedRoute from './components/ProtectedRoute';
import Dashboard from './pages/Dashboard';
import AdminLogin from './pages/admin/AdminLogin';
import AdminLayout from './pages/admin/AdminLayout';
import EnvironmentInfo from './pages/admin/EnvironmentInfo';
import DatabaseViewer from './pages/admin/DatabaseViewer';
import ConfigPanel from './pages/admin/ConfigPanel';
import LogViewer from './pages/admin/LogViewer';
import SessionViewer from './pages/admin/SessionViewer';

function App() {
  return (
    <StudentProvider>
      <BrowserRouter>
        <Routes>
          {/* Public auth routes */}
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
          </Route>

          {/* Protected student routes */}
          <Route element={<ProtectedRoute />}>
            <Route element={<AppLayout />}>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<Dashboard />} />
              {/* feature screen routes added in tickets 005–007 */}
            </Route>
          </Route>

          {/* Admin routes */}
          <Route path="/admin" element={<AdminLogin />} />
          <Route element={<AdminLayout />}>
            <Route path="/admin/env" element={<EnvironmentInfo />} />
            <Route path="/admin/db" element={<DatabaseViewer />} />
            <Route path="/admin/config" element={<ConfigPanel />} />
            <Route path="/admin/logs" element={<LogViewer />} />
            <Route path="/admin/sessions" element={<SessionViewer />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </StudentProvider>
  );
}

export default App;
