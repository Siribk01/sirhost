import { useEffect, useState } from 'react';
import api from '../../utils/api';

const EMPTY = { name: '', type: 'web', price: '', features: '', popular: false, active: true };

const Badge = ({ text, color }) => (
  <span style={{ background: `rgba(${color},0.15)`, color: `rgb(${color})`, padding: '3px 10px', borderRadius: 50, fontSize: '0.72rem', fontWeight: 600 }}>
    {text}
  </span>
);

export default function Plans() {
  const [plans, setPlans]       = useState([]);
  const [form, setForm]         = useState(EMPTY);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving]     = useState(false);
  const [filter, setFilter]     = useState('all');

  useEffect(() => { loadPlans(); }, []);
  const loadPlans = () => api.get('/plans').then(r => setPlans(r.data));

  const openCreate = () => { setForm(EMPTY); setEditingId(null); setShowForm(true); };
  const openEdit   = (p)  => {
    setForm({ ...p, features: p.features.join('\n'), price: String(p.price) });
    setEditingId(p._id); setShowForm(true);
  };

  const save = async () => {
    setSaving(true);
    try {
      const payload = { ...form, price: +form.price, features: form.features.split('\n').map(s => s.trim()).filter(Boolean) };
      if (editingId) await api.put(`/plans/${editingId}`, payload);
      else           await api.post('/plans', payload);
      setShowForm(false); setForm(EMPTY); setEditingId(null);
      loadPlans();
    } catch (err) {
      alert(err.response?.data?.message || 'Save failed');
    } finally { setSaving(false); }
  };

  const deletePlan = async (id) => {
    if (!window.confirm('Delete this plan?')) return;
    await api.delete(`/plans/${id}`);
    loadPlans();
  };

  const upd = k => e => setForm(f => ({ ...f, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }));

  const filtered = filter === 'all' ? plans : plans.filter(p => p.type === filter);

  const inp = {
    padding: '10px 14px', borderRadius: 8,
    border: '1.5px solid rgba(46,115,248,0.2)',
    background: 'rgba(255,255,255,0.04)',
    color: '#fff', fontSize: '0.875rem',
    fontFamily: "'Sora',sans-serif", outline: 'none', width: '100%',
    transition: 'border-color 0.2s'
  };

  return (
    <div style={{ padding: 32, fontFamily: "'Sora',sans-serif" }}>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28, flexWrap: 'wrap', gap: 14 }}>
        <div>
          <h1 style={{ color: '#fff', fontSize: '1.4rem', fontWeight: 800 }}>Hosting Plans</h1>
          <p style={{ color: '#6a8eb0', fontSize: '0.84rem', marginTop: 4 }}>Manage and configure your hosting packages</p>
        </div>
        <button onClick={openCreate} style={{
          background: 'linear-gradient(135deg,#1e56c0,#00c6ff)', color: '#fff',
          border: 'none', padding: '10px 22px', borderRadius: 9,
          fontWeight: 700, fontSize: '0.875rem', cursor: 'pointer',
          fontFamily: "'Sora',sans-serif", boxShadow: '0 4px 16px rgba(30,86,192,0.35)'
        }}>+ New Plan</button>
      </div>

      {/* Filter */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 22 }}>
        {[['all','All'],['web','Web'],['vps','VPS'],['dedicated','Dedicated']].map(([k,l]) => (
          <button key={k} onClick={() => setFilter(k)} style={{ padding: '7px 18px', borderRadius: 7, border: 'none', background: filter === k ? '#2e73f8' : 'rgba(255,255,255,0.06)', color: filter === k ? '#fff' : '#8eb4d8', fontWeight: 600, fontSize: '0.82rem', cursor: 'pointer', fontFamily: "'Sora',sans-serif" }}>{l} ({k === 'all' ? plans.length : plans.filter(p => p.type === k).length})</button>
        ))}
      </div>

      {/* Form */}
      {showForm && (
        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(46,115,248,0.2)', borderRadius: 18, padding: 28, marginBottom: 28 }}>
          <h3 style={{ color: '#fff', fontWeight: 700, marginBottom: 22, fontSize: '1rem' }}>{editingId ? '✏️ Edit Plan' : '➕ Create New Plan'}</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            {[['name','Plan Name','e.g. Business Pro'],['price','Price (USD/mo)','e.g. 9']].map(([k,l,ph]) => (
              <div key={k}>
                <label style={{ color: '#8eb4d8', fontSize: '0.75rem', fontWeight: 600, display: 'block', marginBottom: 6, letterSpacing: 0.5 }}>{l.toUpperCase()}</label>
                <input style={inp} value={form[k]} onChange={upd(k)} placeholder={ph}
                  onFocus={e => e.target.style.borderColor='#2e73f8'}
                  onBlur={e => e.target.style.borderColor='rgba(46,115,248,0.2)'}
                />
              </div>
            ))}
            <div>
              <label style={{ color: '#8eb4d8', fontSize: '0.75rem', fontWeight: 600, display: 'block', marginBottom: 6, letterSpacing: 0.5 }}>TYPE</label>
              <select style={inp} value={form.type} onChange={upd('type')}>
                <option value="web">Web Hosting</option>
                <option value="vps">VPS / Cloud</option>
                <option value="dedicated">Dedicated Server</option>
              </select>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 24, paddingTop: 28 }}>
              {[['popular','⭐ Popular'],['active','✅ Active']].map(([k,l]) => (
                <label key={k} style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#8eb4d8', fontSize: '0.875rem', cursor: 'pointer' }}>
                  <input type="checkbox" checked={form[k]} onChange={upd(k)} style={{ width: 16, height: 16, accentColor: '#2e73f8' }} /> {l}
                </label>
              ))}
            </div>
          </div>
          <div style={{ marginTop: 16 }}>
            <label style={{ color: '#8eb4d8', fontSize: '0.75rem', fontWeight: 600, display: 'block', marginBottom: 6, letterSpacing: 0.5 }}>FEATURES (one per line)</label>
            <textarea style={{ ...inp, minHeight: 110, resize: 'vertical' }} value={form.features} onChange={upd('features')}
              placeholder={'10 GB NVMe SSD\nFree SSL Certificate\nUnlimited Bandwidth\n1-Click WordPress Install'}
              onFocus={e => e.target.style.borderColor='#2e73f8'}
              onBlur={e => e.target.style.borderColor='rgba(46,115,248,0.2)'}
            />
          </div>
          <div style={{ display: 'flex', gap: 12, marginTop: 20 }}>
            <button onClick={save} disabled={saving} style={{ background: 'linear-gradient(135deg,#1e56c0,#00c6ff)', color: '#fff', border: 'none', padding: '10px 26px', borderRadius: 9, fontWeight: 700, cursor: saving ? 'not-allowed' : 'pointer', fontFamily: "'Sora',sans-serif", opacity: saving ? 0.7 : 1 }}>
              {saving ? 'Saving...' : (editingId ? 'Update Plan' : 'Create Plan')}
            </button>
            <button onClick={() => setShowForm(false)} style={{ background: 'rgba(255,255,255,0.06)', color: '#8eb4d8', border: 'none', padding: '10px 20px', borderRadius: 9, cursor: 'pointer', fontFamily: "'Sora',sans-serif" }}>Cancel</button>
          </div>
        </div>
      )}

      {/* Table */}
      <div style={{ background: 'rgba(255,255,255,0.02)', borderRadius: 18, border: '1px solid rgba(46,115,248,0.1)', overflow: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 680 }}>
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(46,115,248,0.12)' }}>
              {['Plan Name','Type','Price','Status','Popular','Features','Actions'].map(h => (
                <th key={h} style={{ padding: '14px 18px', textAlign: 'left', color: '#4a6888', fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map(p => (
              <tr key={p._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}
                onMouseEnter={e => e.currentTarget.style.background='rgba(46,115,248,0.04)'}
                onMouseLeave={e => e.currentTarget.style.background='transparent'}
              >
                <td style={{ padding: '14px 18px', color: '#fff', fontWeight: 600, fontSize: '0.9rem' }}>{p.name}</td>
                <td style={{ padding: '14px 18px' }}>
                  <Badge text={p.type.toUpperCase()} color={p.type==='web'?'46,115,248':p.type==='vps'?'168,85,247':'245,158,11'} />
                </td>
                <td style={{ padding: '14px 18px', color: '#22c55e', fontWeight: 700, fontSize: '0.95rem' }}>${p.price}<span style={{ color: '#4a6888', fontWeight: 400, fontSize: '0.75rem' }}>/mo</span></td>
                <td style={{ padding: '14px 18px' }}><Badge text={p.active?'Active':'Inactive'} color={p.active?'34,197,94':'239,68,68'} /></td>
                <td style={{ padding: '14px 18px', fontSize: '1.1rem' }}>{p.popular ? '⭐' : <span style={{ color: '#3a5570' }}>—</span>}</td>
                <td style={{ padding: '14px 18px', color: '#6a8eb0', fontSize: '0.8rem' }}>{p.features.length} items</td>
                <td style={{ padding: '14px 18px' }}>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button onClick={() => openEdit(p)} style={{ background: 'rgba(46,115,248,0.14)', color: '#2e73f8', border: 'none', padding: '6px 14px', borderRadius: 7, cursor: 'pointer', fontFamily: "'Sora',sans-serif", fontSize: '0.8rem', fontWeight: 600 }}>Edit</button>
                    <button onClick={() => deletePlan(p._id)} style={{ background: 'rgba(239,68,68,0.1)', color: '#ef4444', border: 'none', padding: '6px 14px', borderRadius: 7, cursor: 'pointer', fontFamily: "'Sora',sans-serif", fontSize: '0.8rem', fontWeight: 600 }}>Delete</button>
                  </div>
                </td>
              </tr>
            ))}
            {!filtered.length && (
              <tr><td colSpan={7} style={{ padding: '40px', textAlign: 'center', color: '#3a5570', fontSize: '0.9rem' }}>No plans found. Click "+ New Plan" to create one.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
