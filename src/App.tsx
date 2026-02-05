import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import LoginPage from '@/pages/auth/Login';
import ForgotPasswordPage from '@/pages/auth/ForgotPassword';
import ResetPasswordPage from '@/pages/auth/ResetPassword';
import GuestHomePage from '@/pages/guest/Home';
import GuestIncidentReportPage from '@/pages/guest/IncidentReport';
import GuestNewsPage from '@/pages/guest/News';
import VerifiedReportsPage from '@/pages/guest/VerifiedReports';
import AdminDashboardPage from '@/pages/admin/Dashboard';
import BarangayDashboardPage from '@/pages/barangay/Dashboard';
import NotFoundPage from '@/pages/NotFound';
import WelcomePage from '@/pages/Welcome';
import ProtectedRoute from '@/components/common/ProtectedRoute';
import { useAuth } from '@/hooks/useAuth';
import { UserRole } from '@/types/auth';
import NotificationContainer from '@/components/common/Notification'; // Import the NotificationContainer
import { loadSharedNewsVideos } from '@/api/shared-news-videos';

function App() {
  const { isAuthenticated, user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!loading && isAuthenticated && location.pathname === '/') {
      // Redirect logged-in users to their respective dashboards
      if (user?.role === 'admin') {
        navigate('/admin/dashboard');
      } else if (user?.role === 'barangay') {
        navigate('/barangay/dashboard');
      } else { // guest role could still have an account and be redirected to public home
        navigate('/guest/home');
      }
    } else if (!loading && !isAuthenticated && (location.pathname.startsWith('/admin') || location.pathname.startsWith('/barangay'))) {
      // Redirect unauthenticated users from protected routes to login
      navigate('/login');
    }
  }, [isAuthenticated, user, loading, navigate, location.pathname]);

  // Load shared news/videos on app initialization
  useEffect(() => {
    loadSharedNewsVideos().catch(err => console.error('Failed to load shared news/videos:', err));
  }, []);


  return (
    <> {/* Use React Fragment to wrap the NotificationContainer and Routes */}
      <NotificationContainer /> {/* Render the notification container at the top level */}
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<WelcomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />

        {/* Guest Routes (publicly accessible, but can also be accessed by logged-in users) */}
        <Route path="/guest/home" element={<GuestHomePage />} />
        <Route path="/guest/report" element={<GuestIncidentReportPage />} />
        <Route path="/guest/news" element={<GuestNewsPage />} />
        <Route path="/guest/verified-reports" element={<VerifiedReportsPage />} />

        {/* Protected Admin Routes */}
        <Route
          path="/admin/dashboard/*"
          element={
            <ProtectedRoute allowedRoles={['admin'] as UserRole[]}>
              <AdminDashboardPage />
            </ProtectedRoute>
          }
        />

        {/* Protected Barangay Routes */}
        <Route
          path="/barangay/dashboard/*"
          element={
            <ProtectedRoute allowedRoles={['barangay'] as UserRole[]}>
              <BarangayDashboardPage />
            </ProtectedRoute>
          }
        />

        {/* Catch-all for 404 */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  );
}

export default App;