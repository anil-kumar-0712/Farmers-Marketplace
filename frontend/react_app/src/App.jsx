import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
// Placeholder components until created
import Navbar from './components/Navbar';
import FarmerDashboard from './pages/FarmerDashboard';
import BuyerDashboard from './pages/BuyerDashboard';
import Prediction from './pages/Prediction';
import AdminDashboard from './pages/AdminDashboard';
import Profile from './pages/Profile';
import Landing from './pages/Landing';
import VerifyOTP from './pages/VerifyOTP';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) return <div className="container">Loading...</div>;

  if (!user) {
    return <Navigate to="/login" />;
  }

  // Case-insensitive role check
  const userRole = user.role?.toLowerCase();
  const normalizedAllowedRoles = allowedRoles?.map(r => r.toLowerCase());

  if (normalizedAllowedRoles && !normalizedAllowedRoles.includes(userRole)) {
    console.warn(`🔐 Authorize Check Failed: User Role '${userRole}', required: [${normalizedAllowedRoles}]`);
    return <Navigate to="/dashboard" />;
  }

  return children;
};

const DashboardRedirect = () => {
  const { user, loading } = useAuth();
  if (loading) return <div className="container">Loading...</div>;
  if (!user) return <Navigate to="/login" />;

  const role = user.role?.toLowerCase();
  if (role === 'admin') return <Navigate to="/admin" />;
  if (role === 'farmer') return <Navigate to="/farmer" />;
  return <Navigate to="/buyer" />;
};


function App() {
  return (
    <AuthProvider>
      <Router>
        <NavbarWrapper />
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify-otp" element={<VerifyOTP />} />

          {/* Protected Routes */}
          <Route path="/farmer" element={
            <ProtectedRoute allowedRoles={['farmer']}>
              <FarmerDashboard />
            </ProtectedRoute>
          } />
          <Route path="/buyer" element={
            <ProtectedRoute allowedRoles={['buyer']}>
              <BuyerDashboard />
            </ProtectedRoute>
          } />
          <Route path="/predict" element={
            <ProtectedRoute allowedRoles={['farmer', 'admin']}>
              <Prediction />
            </ProtectedRoute>
          } />
          <Route path="/admin" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } />

          {/* Root Redirects */}
          <Route path="/dashboard" element={<DashboardRedirect />} />
          <Route path="/" element={<Home />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

const Home = () => {
  const { user, loading } = useAuth();
  if (loading) return <div className="container">Loading...</div>;
  return user ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />;
};

const NavbarWrapper = () => {
  const { user, loading } = useAuth();
  if (loading) return null;
  return user ? <Navbar /> : null;
};

export default App;
