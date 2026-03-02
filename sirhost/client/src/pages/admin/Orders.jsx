import { useEffect, useState } from 'react';
import api from '../../utils/api';

const STATUS_META = {
  active:    { color: '34,197,94',  label: 'Active'    },
  pending:   { color: '245,158,11', label: 'Pending'   },
  cancelled: { color: '239,68,68',  label: 'Cancelled' },
  expired:   { color: '107,127,153',label: 'Expired'   },
};

const Badge = ({ status }) => {
  const m = STATUS_META[status] || STATUS_META.pending;
  return (
    <span style={{ background:`rgba(${m.color},0.15)`, color:`rgb(${m.color})`, padding:'3px 10px', borderRadius:50, fontSize:'0.72rem', fontWeight:600 }}>
      {m.label}
    </span>
  );
};

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [users, setUsers] = useState([]);
  const [plans, setPlans] = useState([]);
  const [newOrder, setNewOrder] = useState({ userId: '', planId: '', notes: '' });
  const [creating, setCreating] = useState(false);

  useEffect(() => { loadOrders(); }, []);

  const loadOrders = () => {
    setLoading(true);
    api.get('/orders').then(r => setOrders(r.data)).finally(() => setLoading(false));
  };

  const openCreate = async () => {
    const [u, p] = await Promise.all([api.get('/users'), api.get('/plans')]);
    setUsers(u.data); setPlans(p.data);
    setShowCreate(true);
  };

  const createOrder = async () => {
    if (!newOrder.userId || !newOrder.planId) return alert('Select user and plan');
    setCreating(true);
    try { await api.post('/orders', newOrder); setShowCreate(false); setNewOrder({ userId:'',planId:'',notes:'' }); loadOrders(); }
    catch (err) { alert(err.response?.data?.message || 'Failed'); }
    finally { setCreating(false); }
  };

  const updateStatus = async (id, status) => {
    await api.put(`/orders/${id}/status`, { status });
    setOrders(os => os.map(o => o._id === id ? { ...o, status } : o));
  };

  const deleteOrder = async (id) => {
    if (!confirm('Delete order?')) return;
    await api.delete(`/orders/${id}`);
    loadOrders();
  };

  const filtered = filter === 'all' ? orders : orders.filter(o => o.status === filter);
  const inp = { padding: '10px 14px', borderRadius: 8, border: '1.5px solid rgba(46,115,248,0.2)', background: 'rgba(255,255,255,0.04)', color: '#fff', fontSize: '0.875rem', fontFamily: "'Sora',sans-serif", outline: 'none', width: '100%' };

  return (
    <div style={{ padding: 32, fontFamily: "'Sora',sans-serif" }}>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28, flexWrap: 'wrap', gap: 14 }}>
        <div>
          <h1 style={{ color: '#fff', fontSize: '1.4rem', fontWeight: 800 }}>Orders & Subscriptions</h1>
          <p style={{ color: '#6a8eb0', fontSize: '0.84rem', marginTop: 4 }}>Manage all customer hosting subscriptions</p>
        </div>
        <button onClick={openCreate} style={{ background: 'linear-gradient(135deg,#1e56c0,#00c6ff)', color: '#fff', border: 'none', padding: '10px 22px', borderRadius: 9, fontWeight: 700, fontSize: '0.875rem', cursor: 'pointer', fontFamily: "'Sora',sans-serif" }}>
          + New Order
        </button>
      </div>

      {/* Filter */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 22, flexWrap: 'wrap' }}>
        {['all','active','pending','cancelled','expired'].map(s => (
          <button key={s} onClick={() => setFilter(s)} style={{ padding: '7px 16px', borderRadius: 7, border: 'none', background: filter===s?'#2e73f8':'rgba(255,255,255,0.06)', color: filter===s?'#fff':'#8eb4d8', fontWeight:600, fontSize:'0.8rem', cursor:'pointer', fontFamily:"'Sora',sans-serif", textTransform:'capitalize' }}>
            {s === 'all' ? `All (${orders.length})` : `${s} (${orders.filter(o=>o.status===s).length})`}
          </button>
        ))}
      </div>

      {/* Create form */}
      {showCreate && (
        <div style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(46,115,248,0.2)', borderRadius:18, padding:24, marginBottom:24 }}>
          <h3 style={{ color:'#fff', fontWeight:700, marginBottom:18 }}>Create New Order</h3>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
            <div>
              <label style={{ color:'#8eb4d8', fontSize:'0.75rem', fontWeight:600, display:'block', marginBottom:6 }}>USER</label>
              <select style={inp} value={newOrder.userId} onChange={e => setNewOrder(n=>({...n,userId:e.target.value}))}>
                <option value="">Select user...</option>
                {users.map(u => <option key={u._id} value={u._id}>{u.name} ({u.email})</option>)}
              </select>
            </div>
            <div>
              <label style={{ color:'#8eb4d8', fontSize:'0.75rem', fontWeight:600, display:'block', marginBottom:6 }}>PLAN</label>
              <select style={inp} value={newOrder.planId} onChange={e => setNewOrder(n=>({...n,planId:e.target.value}))}>
                <option value="">Select plan...</option>
                {plans.map(p => <option key={p._id} value={p._id}>{p.name} — ${p.price}/mo ({p.type})</option>)}
              </select>
            </div>
          </div>
          <div style={{ marginTop:14 }}>
            <label style={{ color:'#8eb4d8', fontSize:'0.75rem', fontWeight:600, display:'block', marginBottom:6 }}>NOTES (optional)</label>
            <input style={inp} value={newOrder.notes} onChange={e=>setNewOrder(n=>({...n,notes:e.target.value}))} placeholder="Any notes about this order..." />
          </div>
          <div style={{ display:'flex', gap:12, marginTop:18 }}>
            <button onClick={createOrder} disabled={creating} style={{ background:'linear-gradient(135deg,#1e56c0,#00c6ff)', color:'#fff', border:'none', padding:'10px 24px', borderRadius:8, fontWeight:700, cursor:'pointer', fontFamily:"'Sora',sans-serif" }}>
              {creating ? 'Creating...' : 'Create Order'}
            </button>
            <button onClick={() => setShowCreate(false)} style={{ background:'rgba(255,255,255,0.06)', color:'#8eb4d8', border:'none', padding:'10px 20px', borderRadius:8, cursor:'pointer', fontFamily:"'Sora',sans-serif" }}>Cancel</button>
          </div>
        </div>
      )}

      {/* Table */}
      <div style={{ background:'rgba(255,255,255,0.02)', borderRadius:18, border:'1px solid rgba(46,115,248,0.1)', overflow:'auto' }}>
        <table style={{ width:'100%', borderCollapse:'collapse', minWidth:720 }}>
          <thead>
            <tr style={{ borderBottom:'1px solid rgba(46,115,248,0.12)' }}>
              {['Customer','Plan','Amount','Status','Date','Expires','Actions'].map(h=>(
                <th key={h} style={{ padding:'14px 18px', textAlign:'left', color:'#4a6888', fontSize:'0.72rem', fontWeight:700, textTransform:'uppercase', letterSpacing:1 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={7} style={{ padding:40, textAlign:'center', color:'#4a6888' }}>Loading orders...</td></tr>
            ) : filtered.map(o => (
              <tr key={o._id} style={{ borderBottom:'1px solid rgba(255,255,255,0.03)' }}
                onMouseEnter={e=>e.currentTarget.style.background='rgba(46,115,248,0.04)'}
                onMouseLeave={e=>e.currentTarget.style.background='transparent'}
              >
                <td style={{ padding:'14px 18px' }}>
                  <div style={{ color:'#fff', fontWeight:600, fontSize:'0.875rem' }}>{o.user?.name || '—'}</div>
                  <div style={{ color:'#6a8eb0', fontSize:'0.76rem' }}>{o.user?.email}</div>
                </td>
                <td style={{ padding:'14px 18px' }}>
                  <div style={{ color:'#c8e0f8', fontSize:'0.875rem', fontWeight:600 }}>{o.plan?.name || '—'}</div>
                  <div style={{ color:'#4a6888', fontSize:'0.72rem', textTransform:'capitalize' }}>{o.plan?.type}</div>
                </td>
                <td style={{ padding:'14px 18px', color:'#22c55e', fontWeight:700 }}>${o.amount}<span style={{ color:'#4a6888', fontWeight:400, fontSize:'0.75rem' }}>/mo</span></td>
                <td style={{ padding:'14px 18px' }}><Badge status={o.status} /></td>
                <td style={{ padding:'14px 18px', color:'#6a8eb0', fontSize:'0.8rem' }}>{new Date(o.createdAt).toLocaleDateString()}</td>
                <td style={{ padding:'14px 18px', color:'#6a8eb0', fontSize:'0.8rem' }}>{o.endDate ? new Date(o.endDate).toLocaleDateString() : '—'}</td>
                <td style={{ padding:'14px 18px' }}>
                  <div style={{ display:'flex', gap:8, alignItems:'center' }}>
                    <select value={o.status} onChange={e=>updateStatus(o._id,e.target.value)}
                      style={{ padding:'5px 10px', borderRadius:7, border:'1px solid rgba(46,115,248,0.2)', background:'#0d1e40', color:'#fff', fontSize:'0.78rem', fontFamily:"'Sora',sans-serif", cursor:'pointer', outline:'none' }}>
                      {Object.keys(STATUS_META).map(s=><option key={s} value={s}>{s}</option>)}
                    </select>
                    <button onClick={()=>deleteOrder(o._id)} style={{ background:'rgba(239,68,68,0.1)', color:'#ef4444', border:'none', padding:'5px 10px', borderRadius:6, cursor:'pointer', fontFamily:"'Sora',sans-serif", fontSize:'0.78rem' }}>✕</button>
                  </div>
                </td>
              </tr>
            ))}
            {!loading && !filtered.length && (
              <tr><td colSpan={7} style={{ padding:40, textAlign:'center', color:'#3a5570' }}>No orders found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
