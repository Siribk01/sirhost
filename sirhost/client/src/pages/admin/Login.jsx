import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function AdminLogin() {
  const { login, admin } = useAuth();
  const navigate = useNavigate();
  const [form, setForm]     = useState({ email: '', password: '' });
  const [error, setError]   = useState('');
  const [loading, setLoading] = useState(false);

  if (admin) return <Navigate to="/admin" replace />;

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      const data = await login(form.email, form.password);
      if (data.user.role !== 'admin') {
        setError('Access denied. Admin accounts only.');
        return;
      }
      navigate('/admin');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const inp = {
    padding: '13px 16px', borderRadius: 10,
    border: '2px solid rgba(46,115,248,0.2)',
    background: 'rgba(255,255,255,0.05)',
    color: '#fff', fontSize: '0.9rem',
    fontFamily: "'Sora',sans-serif", outline: 'none', width: '100%',
    transition: 'border-color 0.2s'
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg,#060c1c 0%,#0d1e40 55%,#0a2260 100%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: "'Sora',sans-serif", padding: '20px'
    }}>
      {/* Background grid */}
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', backgroundImage: 'linear-gradient(rgba(56,130,255,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(56,130,255,0.04) 1px,transparent 1px)', backgroundSize: '60px 60px' }} />

      <div style={{
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(46,115,248,0.2)',
        borderRadius: 24, padding: '48px 40px',
        width: '100%', maxWidth: 420,
        backdropFilter: 'blur(16px)',
        position: 'relative', zIndex: 1,
        boxShadow: '0 30px 80px rgba(0,0,0,0.4)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <div style={{
            width: 60, height: 60,
            background: 'linear-gradient(135deg,#1e56c0,#00c6ff)',
            borderRadius: 16, display: 'flex', alignItems: 'center',
            justifyContent: 'center', fontSize: 28, margin: '0 auto 18px',
            boxShadow: '0 8px 28px rgba(30,86,192,0.4)'
          }}>🖧</div>
          <h1 style={{ color: '#fff', fontSize: '1.6rem', fontWeight: 800 }}>
            Sir<span style={{ color: '#00c6ff' }}>Host</span> Admin
          </h1>
          <p style={{ color: '#6a8eb0', marginTop: 8, fontSize: '0.875rem' }}>
            Sign in to your admin panel
          </p>
        </div>

        <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          {error && (
            <div style={{
              background: 'rgba(239,68,68,0.12)',
              border: '1px solid rgba(239,68,68,0.3)',
              color: '#ef4444', padding: '11px 14px',
              borderRadius: 9, fontSize: '0.85rem'
            }}>{error}</div>
          )}

          <div>
            <label style={{ color: '#8eb4d8', fontSize: '0.76rem', fontWeight: 600, display: 'block', marginBottom: 7, letterSpacing: 0.5 }}>
              EMAIL ADDRESS
            </label>
            <input style={inp} type="email" value={form.email}
              onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
              placeholder="admin@sirhost.com" required
              onFocus={e => e.target.style.borderColor = '#2e73f8'}
              onBlur={e => e.target.style.borderColor = 'rgba(46,115,248,0.2)'}
            />
          </div>

          <div>
            <label style={{ color: '#8eb4d8', fontSize: '0.76rem', fontWeight: 600, display: 'block', marginBottom: 7, letterSpacing: 0.5 }}>
              PASSWORD
            </label>
            <input style={inp} type="password" value={form.password}
              onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
              placeholder="••••••••" required
              onFocus={e => e.target.style.borderColor = '#2e73f8'}
              onBlur={e => e.target.style.borderColor = 'rgba(46,115,248,0.2)'}
            />
          </div>

          <button type="submit" disabled={loading} style={{
            background: loading ? 'rgba(46,115,248,0.5)' : 'linear-gradient(135deg,#1e56c0,#00c6ff)',
            color: '#fff', border: 'none', padding: '14px',
            borderRadius: 10, fontWeight: 700, fontSize: '0.95rem',
            cursor: loading ? 'not-allowed' : 'pointer',
            fontFamily: "'Sora',sans-serif", marginTop: 4,
            boxShadow: loading ? 'none' : '0 8px 24px rgba(30,86,192,0.4)',
            transition: 'all 0.2s'
          }}>
            {loading ? 'Signing in...' : 'Sign In →'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: 24, color: '#4a6888', fontSize: '0.8rem' }}>
          Default: sirhost.ng@gmail.com / Admin@SirHost2024
        </p>
      </div>
    </div>
  );
}
