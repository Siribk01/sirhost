import { useEffect, useState } from 'react';
import api from '../../utils/api';

export default function Users() {
  const [users, setUsers]       = useState([]);
  const [loading, setLoading]   = useState(true);
  const [search, setSearch]     = useState('');
  const [showCreate, setShowCreate] = useState(false);
  const [newUser, setNewUser]   = useState({ name:'', email:'', password:'' });
  const [creating, setCreating] = useState(false);

  useEffect(() => { loadUsers(); }, []);
  const loadUsers = () => api.get('/users').then(r => setUsers(r.data)).finally(() => setLoading(false));

  const toggleStatus = async (u) => {
    const status = u.status === 'active' ? 'suspended' : 'active';
    const { data } = await api.put(`/users/${u._id}/status`, { status });
    setUsers(us => us.map(x => x._id === u._id ? data : x));
  };

  const deleteUser = async (id) => {
    if (!confirm('Permanently delete this user?')) return;
    await api.delete(`/users/${id}`);
    setUsers(us => us.filter(u => u._id !== id));
  };

  const createUser = async () => {
    if (!newUser.name || !newUser.email || !newUser.password) return alert('All fields required');
    setCreating(true);
    try {
      await api.post('/users', newUser);
      setShowCreate(false); setNewUser({ name:'',email:'',password:'' });
      loadUsers();
    } catch (err) { alert(err.response?.data?.message || 'Failed'); }
    finally { setCreating(false); }
  };

  const filtered = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  const inp = { padding:'10px 14px', borderRadius:8, border:'1.5px solid rgba(46,115,248,0.2)', background:'rgba(255,255,255,0.04)', color:'#fff', fontSize:'0.875rem', fontFamily:"'Sora',sans-serif", outline:'none', width:'100%' };

  return (
    <div style={{ padding: 32, fontFamily: "'Sora',sans-serif" }}>

      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:28, flexWrap:'wrap', gap:14 }}>
        <div>
          <h1 style={{ color:'#fff', fontSize:'1.4rem', fontWeight:800 }}>Users</h1>
          <p style={{ color:'#6a8eb0', fontSize:'0.84rem', marginTop:4 }}>Manage registered customer accounts ({users.length} total)</p>
        </div>
        <button onClick={() => setShowCreate(s=>!s)} style={{ background:'linear-gradient(135deg,#1e56c0,#00c6ff)', color:'#fff', border:'none', padding:'10px 22px', borderRadius:9, fontWeight:700, fontSize:'0.875rem', cursor:'pointer', fontFamily:"'Sora',sans-serif" }}>
          + Add User
        </button>
      </div>

      {/* Search */}
      <div style={{ marginBottom:20 }}>
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="🔍  Search by name or email..."
          style={{ ...inp, maxWidth:360, paddingLeft:14 }}
          onFocus={e=>e.target.style.borderColor='#2e73f8'}
          onBlur={e=>e.target.style.borderColor='rgba(46,115,248,0.2)'}
        />
      </div>

      {/* Create form */}
      {showCreate && (
        <div style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(46,115,248,0.2)', borderRadius:18, padding:24, marginBottom:24 }}>
          <h3 style={{ color:'#fff', fontWeight:700, marginBottom:18 }}>Add New User</h3>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:14 }}>
            {[['name','Full Name','John Doe'],['email','Email Address','john@example.com'],['password','Password','••••••••']].map(([k,l,ph])=>(
              <div key={k}>
                <label style={{ color:'#8eb4d8', fontSize:'0.74rem', fontWeight:600, display:'block', marginBottom:6 }}>{l.toUpperCase()}</label>
                <input style={inp} type={k==='password'?'password':'text'} value={newUser[k]} onChange={e=>setNewUser(n=>({...n,[k]:e.target.value}))} placeholder={ph}
                  onFocus={e=>e.target.style.borderColor='#2e73f8'} onBlur={e=>e.target.style.borderColor='rgba(46,115,248,0.2)'}
                />
              </div>
            ))}
          </div>
          <div style={{ display:'flex', gap:12, marginTop:18 }}>
            <button onClick={createUser} disabled={creating} style={{ background:'linear-gradient(135deg,#1e56c0,#00c6ff)', color:'#fff', border:'none', padding:'10px 24px', borderRadius:9, fontWeight:700, cursor:'pointer', fontFamily:"'Sora',sans-serif" }}>{creating?'Creating...':'Create User'}</button>
            <button onClick={()=>setShowCreate(false)} style={{ background:'rgba(255,255,255,0.06)', color:'#8eb4d8', border:'none', padding:'10px 20px', borderRadius:9, cursor:'pointer', fontFamily:"'Sora',sans-serif" }}>Cancel</button>
          </div>
        </div>
      )}

      {/* Table */}
      <div style={{ background:'rgba(255,255,255,0.02)', borderRadius:18, border:'1px solid rgba(46,115,248,0.1)', overflow:'auto' }}>
        <table style={{ width:'100%', borderCollapse:'collapse', minWidth:600 }}>
          <thead>
            <tr style={{ borderBottom:'1px solid rgba(46,115,248,0.12)' }}>
              {['User','Email','Status','Joined','Actions'].map(h=>(
                <th key={h} style={{ padding:'14px 18px', textAlign:'left', color:'#4a6888', fontSize:'0.72rem', fontWeight:700, textTransform:'uppercase', letterSpacing:1 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading
              ? <tr><td colSpan={5} style={{ padding:40, textAlign:'center', color:'#4a6888' }}>Loading users...</td></tr>
              : filtered.map(u => (
              <tr key={u._id} style={{ borderBottom:'1px solid rgba(255,255,255,0.03)' }}
                onMouseEnter={e=>e.currentTarget.style.background='rgba(46,115,248,0.04)'}
                onMouseLeave={e=>e.currentTarget.style.background='transparent'}
              >
                <td style={{ padding:'14px 18px' }}>
                  <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                    <div style={{ width:38, height:38, borderRadius:'50%', background:'linear-gradient(135deg,#1e56c0,#00c6ff)', display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontWeight:700, fontSize:'0.95rem', flexShrink:0 }}>
                      {u.name[0].toUpperCase()}
                    </div>
                    <span style={{ color:'#fff', fontWeight:600, fontSize:'0.875rem' }}>{u.name}</span>
                  </div>
                </td>
                <td style={{ padding:'14px 18px', color:'#8eb4d8', fontSize:'0.85rem' }}>{u.email}</td>
                <td style={{ padding:'14px 18px' }}>
                  <span style={{ background: u.status==='active'?'rgba(34,197,94,0.14)':'rgba(239,68,68,0.14)', color: u.status==='active'?'#22c55e':'#ef4444', padding:'3px 10px', borderRadius:50, fontSize:'0.72rem', fontWeight:600, textTransform:'capitalize' }}>
                    {u.status}
                  </span>
                </td>
                <td style={{ padding:'14px 18px', color:'#6a8eb0', fontSize:'0.82rem' }}>{new Date(u.createdAt).toLocaleDateString()}</td>
                <td style={{ padding:'14px 18px' }}>
                  <div style={{ display:'flex', gap:8 }}>
                    <button onClick={()=>toggleStatus(u)} style={{ background: u.status==='active'?'rgba(245,158,11,0.1)':'rgba(34,197,94,0.1)', color: u.status==='active'?'#f59e0b':'#22c55e', border:'none', padding:'6px 13px', borderRadius:7, cursor:'pointer', fontFamily:"'Sora',sans-serif", fontSize:'0.78rem', fontWeight:600 }}>
                      {u.status==='active' ? 'Suspend' : 'Activate'}
                    </button>
                    <button onClick={()=>deleteUser(u._id)} style={{ background:'rgba(239,68,68,0.1)', color:'#ef4444', border:'none', padding:'6px 13px', borderRadius:7, cursor:'pointer', fontFamily:"'Sora',sans-serif", fontSize:'0.78rem', fontWeight:600 }}>Delete</button>
                  </div>
                </td>
              </tr>
            ))}
            {!loading && !filtered.length && (
              <tr><td colSpan={5} style={{ padding:40, textAlign:'center', color:'#3a5570' }}>No users found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
