import { useEffect, useState } from 'react';
import {
  LineChart, Line, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend
} from 'recharts';
import api from '../../utils/api';

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const TOOLTIP_STYLE = { background: '#0d1e40', border: '1px solid rgba(46,115,248,0.3)', borderRadius: 8, color: '#fff', fontFamily: "'Sora',sans-serif", fontSize: '0.82rem' };

function StatCard({ icon, label, value, color, sub }) {
  return (
    <div style={{
      background: 'rgba(255,255,255,0.04)',
      border: '1px solid rgba(46,115,248,0.14)',
      borderRadius: 16, padding: '22px 20px',
      transition: 'border-color 0.2s',
    }}>
      <div style={{ fontSize: 26, marginBottom: 12 }}>{icon}</div>
      <div style={{ fontSize: '1.7rem', fontWeight: 800, color }}>{value}</div>
      <div style={{ fontSize: '0.78rem', color: '#6a8eb0', marginTop: 4 }}>{label}</div>
      {sub && <div style={{ fontSize: '0.72rem', color: '#3a5570', marginTop: 3 }}>{sub}</div>}
    </div>
  );
}

export default function Dashboard() {
  const [stats, setStats]   = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/orders/stats')
      .then(r => setStats(r.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:'100vh', color:'#6a8eb0', fontFamily:"'Sora',sans-serif", gap: 12 }}>
      <span style={{ fontSize: 28 }}>📊</span> Loading dashboard...
    </div>
  );

  const monthlyData = (stats?.monthly || []).map(m => ({
    name: MONTHS[m._id.month - 1],
    revenue: m.revenue,
    orders: m.count
  }));

  const pieData = [
    { name: 'Active',    value: stats?.active  || 0, color: '#22c55e' },
    { name: 'Pending',   value: stats?.pending || 0, color: '#f59e0b' },
    { name: 'Other',     value: Math.max(0, (stats?.total||0)-(stats?.active||0)-(stats?.pending||0)), color: '#6b7f99' },
  ];

  const planDistData = (stats?.planDist || []).map(d => ({
    name: d._id.charAt(0).toUpperCase() + d._id.slice(1),
    count: d.count,
    color: d._id === 'web' ? '#2e73f8' : d._id === 'vps' ? '#a855f7' : '#f59e0b'
  }));

  return (
    <div style={{ padding: 32, fontFamily: "'Sora',sans-serif" }}>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ color: '#fff', fontSize: '1.5rem', fontWeight: 800 }}>Dashboard</h1>
        <p style={{ color: '#6a8eb0', fontSize: '0.875rem', marginTop: 4 }}>
          Welcome back! Here's what's happening with Sir Host.
        </p>
      </div>

      {/* Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(170px,1fr))', gap: 18, marginBottom: 32 }}>
        <StatCard icon="💰" label="Total Revenue"  value={`$${(stats?.revenue||0).toLocaleString()}`} color="#22c55e" />
        <StatCard icon="🛒" label="Total Orders"   value={stats?.total   || 0} color="#2e73f8" />
        <StatCard icon="✅" label="Active Orders"  value={stats?.active  || 0} color="#00c6ff" />
        <StatCard icon="⏳" label="Pending"        value={stats?.pending || 0} color="#f59e0b" />
        <StatCard icon="👥" label="Total Users"    value={stats?.users   || 0} color="#a855f7" />
        <StatCard icon="✉️" label="Unread Messages" value={stats?.unread  || 0} color="#ef4444" />
      </div>

      {/* Row 1 – Revenue + Pie */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 24, marginBottom: 24 }}>

        {/* Revenue Line */}
        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(46,115,248,0.12)', borderRadius: 18, padding: 24 }}>
          <h3 style={{ color: '#fff', fontWeight: 700, fontSize: '0.95rem', marginBottom: 20 }}>Monthly Revenue (Last 6 Months)</h3>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="name" stroke="#4a6888" fontSize={12} />
              <YAxis stroke="#4a6888" fontSize={12} tickFormatter={v => `$${v}`} />
              <Tooltip contentStyle={TOOLTIP_STYLE} formatter={v => [`$${v}`, 'Revenue']} />
              <Line type="monotone" dataKey="revenue" stroke="#2e73f8" strokeWidth={2.5} dot={{ fill: '#2e73f8', r: 4 }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Pie – Order Status */}
        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(46,115,248,0.12)', borderRadius: 18, padding: 24 }}>
          <h3 style={{ color: '#fff', fontWeight: 700, fontSize: '0.95rem', marginBottom: 16 }}>Order Status</h3>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={46} outerRadius={76} paddingAngle={4} dataKey="value">
                {pieData.map((e, i) => <Cell key={i} fill={e.color} />)}
              </Pie>
              <Tooltip contentStyle={TOOLTIP_STYLE} />
            </PieChart>
          </ResponsiveContainer>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 8 }}>
            {pieData.map(d => (
              <div key={d.name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#8eb4d8' }}>
                  <div style={{ width: 10, height: 10, borderRadius: '50%', background: d.color }} />
                  {d.name}
                </div>
                <span style={{ color: '#fff', fontWeight: 600 }}>{d.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Row 2 – Bar Charts */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>

        {/* Orders Bar */}
        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(46,115,248,0.12)', borderRadius: 18, padding: 24 }}>
          <h3 style={{ color: '#fff', fontWeight: 700, fontSize: '0.95rem', marginBottom: 20 }}>Orders per Month</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="name" stroke="#4a6888" fontSize={12} />
              <YAxis stroke="#4a6888" fontSize={12} />
              <Tooltip contentStyle={TOOLTIP_STYLE} />
              <Bar dataKey="orders" fill="#00c6ff" radius={[6,6,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Plan Distribution */}
        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(46,115,248,0.12)', borderRadius: 18, padding: 24 }}>
          <h3 style={{ color: '#fff', fontWeight: 700, fontSize: '0.95rem', marginBottom: 20 }}>Orders by Plan Type</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={planDistData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis type="number" stroke="#4a6888" fontSize={12} />
              <YAxis type="category" dataKey="name" stroke="#4a6888" fontSize={12} width={70} />
              <Tooltip contentStyle={TOOLTIP_STYLE} />
              <Bar dataKey="count" radius={[0,6,6,0]}>
                {planDistData.map((d, i) => <Cell key={i} fill={d.color} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
