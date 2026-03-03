import { useEffect, useState } from 'react';
import api from '../../utils/api';

const STATUS_COLOR = { unread: '239,68,68', read: '107,127,153', replied: '34,197,94' };

export default function Messages() {
  const [messages, setMessages]   = useState([]);
  const [selected, setSelected]   = useState(null);
  const [reply, setReply]         = useState('');
  const [filter, setFilter]       = useState('all');
  const [sending, setSending]     = useState(false);
  const [loading, setLoading]     = useState(true);

  useEffect(() => { loadMessages(); }, []);
  const loadMessages = () => api.get('/contacts').then(r => setMessages(r.data)).finally(() => setLoading(false));

  const select = async (m) => {
    setSelected(m); setReply('');
    if (m.status === 'unread') {
      await api.put(`/contacts/${m._id}`, { status: 'read' });
      setMessages(ms => ms.map(x => x._id === m._id ? { ...x, status: 'read' } : x));
    }
  };

  const sendReply = async () => {
    if (!reply.trim()) return;
    setSending(true);
    try {
      const updated = await api.post(`/contacts/${selected._id}/reply`, { reply });
      setSelected(updated.data);
      setMessages(ms => ms.map(m => m._id === selected._id ? updated.data : m));
      setReply('');
    } catch (err) { alert(err.response?.data?.message || 'Failed to send'); }
    finally { setSending(false); }
  };

  const deleteMsg = async (id) => {
    if (!confirm('Delete this message?')) return;
    await api.delete(`/contacts/${id}`);
    setMessages(ms => ms.filter(m => m._id !== id));
    if (selected?._id === id) setSelected(null);
  };

  const filtered = filter === 'all' ? messages : messages.filter(m => m.status === filter);
  const counts   = { all: messages.length, unread: messages.filter(m=>m.status==='unread').length, read: messages.filter(m=>m.status==='read').length, replied: messages.filter(m=>m.status==='replied').length };

  return (
    <div style={{ padding: 32, fontFamily: "'Sora',sans-serif" }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ color: '#fff', fontSize: '1.4rem', fontWeight: 800 }}>Contact Messages</h1>
        <p style={{ color: '#6a8eb0', fontSize: '0.84rem', marginTop: 4 }}>View and respond to customer inquiries</p>
      </div>

      {/* Filter tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap' }}>
        {['all','unread','read','replied'].map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{ padding:'7px 18px', borderRadius:7, border:'none', background: filter===f?'#2e73f8':'rgba(255,255,255,0.06)', color: filter===f?'#fff':'#8eb4d8', fontWeight:600, fontSize:'0.82rem', cursor:'pointer', fontFamily:"'Sora',sans-serif", textTransform:'capitalize', position:'relative' }}>
            {f} ({counts[f]})
            {f === 'unread' && counts.unread > 0 && <span style={{ position:'absolute', top:-6, right:-6, background:'#ef4444', color:'#fff', borderRadius:'50%', width:18, height:18, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'0.65rem', fontWeight:700 }}>{counts.unread}</span>}
          </button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: selected ? '1fr 1.1fr' : '1fr', gap: 24 }}>

        {/* List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, maxHeight: 'calc(100vh - 220px)', overflowY: 'auto', paddingRight: 4 }}>
          {loading && <div style={{ color:'#6a8eb0', padding:20, textAlign:'center' }}>Loading messages...</div>}
          {!loading && !filtered.length && <div style={{ color:'#3a5570', padding:40, textAlign:'center' }}>No messages found.</div>}
          {filtered.map(m => (
            <div key={m._id} onClick={() => select(m)}
              style={{ background: selected?._id===m._id?'rgba(46,115,248,0.12)':'rgba(255,255,255,0.03)', border:`1px solid ${selected?._id===m._id?'rgba(46,115,248,0.35)':'rgba(46,115,248,0.08)'}`, borderRadius:12, padding:'16px 18px', cursor:'pointer', transition:'all 0.2s' }}
              onMouseEnter={e => { if (selected?._id!==m._id) e.currentTarget.style.background='rgba(255,255,255,0.05)'; }}
              onMouseLeave={e => { if (selected?._id!==m._id) e.currentTarget.style.background='rgba(255,255,255,0.03)'; }}
            >
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:5 }}>
                <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                  <span style={{ color:'#fff', fontWeight:600, fontSize:'0.9rem' }}>{m.name}</span>
                  {m.status==='unread' && <span style={{ background:'rgba(239,68,68,0.2)', color:'#ef4444', padding:'1px 7px', borderRadius:50, fontSize:'0.62rem', fontWeight:700 }}>NEW</span>}
                </div>
                <span style={{ background:`rgba(${STATUS_COLOR[m.status]},0.15)`, color:`rgb(${STATUS_COLOR[m.status]})`, padding:'2px 8px', borderRadius:50, fontSize:'0.68rem', fontWeight:600, textTransform:'capitalize' }}>{m.status}</span>
              </div>
              <div style={{ color:'#5a7898', fontSize:'0.76rem', marginBottom:5 }}>{m.email}{m.service ? ` · ${m.service}` : ''}</div>
              <div style={{ color:'#8eb4d8', fontSize:'0.82rem', overflow:'hidden', whiteSpace:'nowrap', textOverflow:'ellipsis' }}>{m.message}</div>
              <div style={{ color:'#3a5570', fontSize:'0.7rem', marginTop:6 }}>{new Date(m.createdAt).toLocaleString()}</div>
            </div>
          ))}
        </div>

        {/* Detail panel */}
        {selected && (
          <div style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(46,115,248,0.14)', borderRadius:16, padding:24, maxHeight:'calc(100vh - 220px)', overflowY:'auto' }}>
            {/* Header */}
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:20 }}>
              <div>
                <div style={{ color:'#fff', fontWeight:700, fontSize:'1rem' }}>{selected.name}</div>
                <div style={{ color:'#6a8eb0', fontSize:'0.82rem', marginTop:2 }}>{selected.email}</div>
                {selected.service && <div style={{ color:'#2e73f8', fontSize:'0.78rem', marginTop:4 }}>Service: {selected.service}</div>}
                <div style={{ color:'#3a5570', fontSize:'0.72rem', marginTop:4 }}>{new Date(selected.createdAt).toLocaleString()}</div>
              </div>
              <button onClick={() => deleteMsg(selected._id)} style={{ background:'rgba(239,68,68,0.1)', color:'#ef4444', border:'none', padding:'7px 14px', borderRadius:8, cursor:'pointer', fontFamily:"'Sora',sans-serif", fontSize:'0.8rem', fontWeight:600 }}>🗑 Delete</button>
            </div>

            {/* Message */}
            <div style={{ background:'rgba(255,255,255,0.04)', borderRadius:10, padding:18, marginBottom:20 }}>
              <div style={{ color:'#5a7898', fontSize:'0.72rem', fontWeight:700, letterSpacing:1, marginBottom:8 }}>MESSAGE</div>
              <p style={{ color:'#c8e0f8', lineHeight:1.8, fontSize:'0.9rem' }}>{selected.message}</p>
            </div>

            {/* Existing reply */}
            {selected.reply && (
              <div style={{ background:'rgba(34,197,94,0.06)', border:'1px solid rgba(34,197,94,0.18)', borderRadius:10, padding:18, marginBottom:20 }}>
                <div style={{ color:'#22c55e', fontSize:'0.72rem', fontWeight:700, letterSpacing:1, marginBottom:8 }}>YOUR REPLY</div>
                <p style={{ color:'#8eb4d8', fontSize:'0.875rem', lineHeight:1.7 }}>{selected.reply}</p>
              </div>
            )}

            {/* Reply form */}
            {selected.status !== 'replied' && (
              <div>
                <div style={{ color:'#8eb4d8', fontSize:'0.75rem', fontWeight:600, letterSpacing:0.5, marginBottom:8 }}>WRITE A REPLY</div>
                <textarea value={reply} onChange={e => setReply(e.target.value)} placeholder="Type your response to the customer..."
                  style={{ width:'100%', minHeight:110, padding:'12px 14px', borderRadius:10, border:'1.5px solid rgba(46,115,248,0.2)', background:'rgba(255,255,255,0.04)', color:'#fff', fontSize:'0.875rem', fontFamily:"'Sora',sans-serif", outline:'none', resize:'vertical', marginBottom:12, transition:'border-color 0.2s' }}
                  onFocus={e=>e.target.style.borderColor='#2e73f8'}
                  onBlur={e=>e.target.style.borderColor='rgba(46,115,248,0.2)'}
                />
                <button onClick={sendReply} disabled={sending || !reply.trim()} style={{ background:'linear-gradient(135deg,#1e56c0,#00c6ff)', color:'#fff', border:'none', padding:'10px 24px', borderRadius:9, fontWeight:700, cursor:sending?'not-allowed':'pointer', fontFamily:"'Sora',sans-serif", opacity:sending||!reply.trim()?0.6:1 }}>
                  {sending ? 'Sending...' : '📨 Send Reply'}
                </button>
              </div>
            )}
            {selected.status === 'replied' && (
              <div style={{ textAlign:'center', color:'#22c55e', fontSize:'0.85rem', padding:'12px 0', fontWeight:600 }}>✅ Reply sent to customer</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
