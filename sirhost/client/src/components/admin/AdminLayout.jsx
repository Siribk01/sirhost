import { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const NAV = [
  { to: '/admin',          end: true, icon: '📊', label: 'Dashboard'  },
  { to: '/admin/plans',               icon: '📦', label: 'Plans'      },
  { to: '/admin/orders',              icon: '🛒', label: 'Orders'     },
  { to: '/admin/messages',            icon: '✉️',  label: 'Messages'   },
  { to: '/admin/users',               icon: '👥', label: 'Users'      },
];

export default function AdminLayout() {
  const { admin, logout } = useAuth();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = () => { logout(); navigate('/admin/login'); };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: "'Sora',sans-serif" }}>

      {/* ── Sidebar ── */}
      <aside style={{
        width: collapsed ? 68 : 240,
        background: '#060c1c',
        borderRight: '1px solid rgba(46,115,248,0.15)',
        display: 'flex', flexDirection: 'column',
        transition: 'width 0.3s ease',
        flexShrink: 0, position: 'sticky', top: 0, height: '100vh', overflowY: 'auto'
      }}>

        {/* Logo / toggle */}
        <div style={{
          padding: '20px 16px', borderBottom: '1px solid rgba(46,115,248,0.12)',
          display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', userSelect: 'none'
        }} onClick={() => setCollapsed(c => !c)}>
          <div style={{
            width: 36, height: 36, minWidth: 36,
            background: 'linear-gradient(135deg,#1e56c0,#00c6ff)',
            borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 18, flexShrink: 0
          }}>🖧</div>
          {!collapsed && (
            <span style={{ fontSize: '1.1rem', fontWeight: 800, color: '#fff', whiteSpace: 'nowrap' }}>
              Sir<span style={{ color: '#00c6ff' }}>Host</span>
            </span>
          )}
        </div>

        {/* Nav links */}
        <nav style={{ flex: 1, padding: '14px 8px', display: 'flex', flexDirection: 'column', gap: 3 }}>
          {NAV.map(item => (
            <NavLink key={item.to} to={item.to} end={item.end}
              style={({ isActive }) => ({
                display: 'flex', alignItems: 'center',
                gap: collapsed ? 0 : 12,
                justifyContent: collapsed ? 'center' : 'flex-start',
                padding: '11px 12px', borderRadius: 10,
                textDecoration: 'none',
                color: isActive ? '#fff' : '#6a8eb0',
                background: isActive ? 'rgba(46,115,248,0.18)' : 'transparent',
                borderLeft: isActive ? '3px solid #2e73f8' : '3px solid transparent',
                fontSize: '0.875rem', fontWeight: isActive ? 600 : 400,
                transition: 'all 0.18s',
              })}
            >
              <span style={{ fontSize: 18 }} title={collapsed ? item.label : ''}>{item.icon}</span>
              {!collapsed && <span>{item.label}</span>}
            </NavLink>
          ))}
        </nav>

        {/* Admin info + logout */}
        <div style={{ padding: '14px 12px', borderTop: '1px solid rgba(46,115,248,0.12)' }}>
          {!collapsed && (
            <div style={{ marginBottom: 10 }}>
              <div style={{ color: '#fff', fontWeight: 600, fontSize: '0.82rem', marginBottom: 2 }}>
                {admin?.name}
              </div>
              <div style={{ color: '#4a6888', fontSize: '0.72rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {admin?.email}
              </div>
            </div>
          )}
          <button onClick={handleLogout} style={{
            width: '100%', padding: collapsed ? '9px' : '9px 12px',
            borderRadius: 8, border: 'none',
            background: 'rgba(239,68,68,0.12)',
            color: '#ef4444', cursor: 'pointer',
            fontFamily: "'Sora',sans-serif", fontSize: '0.82rem', fontWeight: 600,
            display: 'flex', alignItems: 'center',
            justifyContent: collapsed ? 'center' : 'flex-start', gap: 8
          }}>
            <span>🚪</span>
            {!collapsed && 'Logout'}
          </button>
        </div>
      </aside>

      {/* ── Main content ── */}
      <main style={{ flex: 1, background: '#080f22', minHeight: '100vh', overflowY: 'auto' }}>
        <Outlet />
      </main>
    </div>
  );
}
