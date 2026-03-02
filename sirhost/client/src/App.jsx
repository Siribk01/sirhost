import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

// Public
import Home from './pages/public/Home';

// Admin
import AdminLogin   from './pages/admin/Login';
import AdminLayout  from './components/admin/AdminLayout';
import Dashboard    from './pages/admin/Dashboard';
import Plans        from './pages/admin/Plans';
import Orders       from './pages/admin/Orders';
import Messages     from './pages/admin/Messages';
import Users        from './pages/admin/Users';

function PrivateRoute({ children }) {
  const { admin, loading } = useAuth();
  if (loading) return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      height: '100vh', background: '#060c1c', color: '#6a8eb0',
      fontFamily: "'Sora',sans-serif", fontSize: '1rem', gap: 12
    }}>
      <span style={{ fontSize: 28 }}>🖧</span> Loading Sir Host...
    </div>
  );
  return admin ? children : <Navigate to="/admin/login" replace />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/"  element={<Home />} />

        {/* Admin login */}
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* Admin protected */}
        <Route path="/admin" element={<PrivateRoute><AdminLayout /></PrivateRoute>}>
          <Route index            element={<Dashboard />} />
          <Route path="plans"     element={<Plans />} />
          <Route path="orders"    element={<Orders />} />
          <Route path="messages"  element={<Messages />} />
          <Route path="users"     element={<Users />} />
        </Route>

        {/* 404 fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
