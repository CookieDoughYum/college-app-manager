import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { StudentProvider } from './contexts/StudentContext';
import AuthLayout from './layouts/AuthLayout';
import AppLayout from './layouts/AppLayout';
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import ProtectedRoute from './components/ProtectedRoute';
import Dashboard from './pages/Dashboard';
import Activities from './pages/screens/Activities';
import Exams from './pages/screens/Exams';
import Colleges from './pages/screens/Colleges';
import Essays from './pages/screens/Essays';
import RecLetters from './pages/screens/RecLetters';
import Portals from './pages/screens/Portals';
import Decide from './pages/screens/Decide';
import FinancialAid from './pages/screens/FinancialAid';
import Deadlines from './pages/screens/Deadlines';
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
              <Route path="/activities" element={<Activities />} />
              <Route path="/exams" element={<Exams />} />
              <Route path="/colleges" element={<Colleges />} />
              <Route path="/essays" element={<Essays />} />
              <Route path="/recs" element={<RecLetters />} />
              <Route path="/portals" element={<Portals />} />
              <Route path="/decide" element={<Decide />} />
              <Route path="/aid" element={<FinancialAid />} />
              <Route path="/deadlines" element={<Deadlines />} />
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
