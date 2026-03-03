import { useState, useEffect, useRef } from 'react';
import api from '../../utils/api';

// ── helpers ──────────────────────────────────────────────
function useFadeIn() {
  const ref = useRef(null);
  const [v, setV] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setV(true); obs.disconnect(); } }, { threshold: 0.1 });
    obs.observe(el); return () => obs.disconnect();
  }, []);
  return [ref, v];
}
const fade = (v, d=0) => ({ opacity: v?1:0, transform: v?'none':'translateY(24px)', transition:`all 0.6s ease ${d}ms` });
const scrollTo = href => document.querySelector(href)?.scrollIntoView({ behavior:'smooth' });

const FONT = "'Sora', sans-serif";
const EXTS = [{ ext:'.com',price:'₦9,999/yr' },{ ext:'.net',price:'₦12,999/yr' },{ ext:'.org',price:'₦11,999/yr' },{ ext:'.com.ng',price:'₦4,999/yr' },{ ext:'.ng',price:'₦7,999/yr' },{ ext:'.io',price:'₦39,999/yr' }];
const SERVICES = [
  { icon:'🌐', title:'Web Hosting',        desc:'Reliable shared hosting with cPanel, one-click installs for WordPress, Joomla and more.',        href:'#pricing', cta:'View Plans' },
  { icon:'☁️', title:'VPS / Cloud',         desc:'Scalable virtual private servers with dedicated resources, full root access and instant scaling.', href:'#pricing', cta:'View Plans' },
  { icon:'🖥️', title:'Dedicated Servers',   desc:'Maximum performance with bare-metal dedicated servers for high-traffic apps and enterprises.',    href:'#pricing', cta:'View Plans' },
  { icon:'🔗', title:'Domain Registration', desc:'Register your perfect domain from hundreds of extensions. Free WHOIS privacy included.',           href:'#domain',  cta:'Find Domain' },
];
const FEATURES = [
  { icon:'⚡', title:'NVMe SSD Storage',          desc:'All plans include ultra-fast NVMe SSD storage — up to 10× faster than traditional hard drives.' },
  { icon:'🛡️', title:'Free SSL & DDoS Protection', desc:'Every account includes a free SSL certificate and enterprise-grade DDoS protection.' },
  { icon:'🔄', title:'Daily Automatic Backups',    desc:'Your data is backed up daily. Restore any backup with one click from your control panel.' },
  { icon:'🎧', title:'24/7 Expert Support',        desc:'Our hosting specialists are available around the clock via live chat, email and phone.' },
];
const TESTIMONIALS = [
  { stars:5, text:'Sir Host has been a game changer for our agency. We migrated 20+ client sites with zero downtime. The support team is incredibly responsive.', name:'James Okafor',   role:'Web Agency Owner',   bg:'#1e56c0', i:'J' },
  { stars:5, text:"I've tried many hosting providers. Sir Host's VPS performance blows the competition at half the price. Highly recommend.",                      name:'Sarah Mitchell', role:'E-Commerce Owner',   bg:'#7c3aed', i:'S' },
  { stars:5, text:'Our app went from 3-second load times to under 800ms after switching to Sir Host. The NVMe storage makes a massive real-world difference.',   name:'Amir Hassan',    role:'Software Developer', bg:'#059669', i:'A' },
];

// ── Navbar ────────────────────────────────────────────────
function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => { const fn = () => setScrolled(window.scrollY > 50); window.addEventListener('scroll', fn); return () => window.removeEventListener('scroll', fn); }, []);
  const go = href => { setOpen(false); scrollTo(href); };
  const links = [['#services','Services'],['#pricing','Pricing'],['#domain','Domains'],['#about','About'],['#contact','Contact']];
  return (
    <nav style={{ position:'fixed',top:0,left:0,right:0,zIndex:1000, background: scrolled?'rgba(6,12,28,0.97)':'rgba(6,12,28,0.8)', backdropFilter:'blur(16px)', borderBottom:'1px solid rgba(46,115,248,0.15)', fontFamily:FONT }}>
      <div style={{ display:'flex',alignItems:'center',justifyContent:'space-between',padding:'0 5%',height:68 }}>
        <button onClick={()=>go('#home')} style={{ background:'none',border:'none',cursor:'pointer',display:'flex',alignItems:'center',gap:10 }}>
          <div style={{ width:38,height:38,background:'linear-gradient(135deg,#1e56c0,#00c6ff)',borderRadius:10,display:'flex',alignItems:'center',justifyContent:'center',fontSize:18 }}>🖧</div>
          <span style={{ fontSize:'1.35rem',fontWeight:800,color:'#fff' }}>Sir<span style={{ color:'#00c6ff' }}>Host</span></span>
        </button>
        <ul style={{ display:'flex',gap:28,listStyle:'none',margin:0 }} className="sh-nav">
          {links.map(([h,l])=><li key={h}><button onClick={()=>go(h)} style={{ background:'none',border:'none',color:'#b0c4de',fontWeight:500,fontSize:'0.875rem',cursor:'pointer',fontFamily:FONT }} onMouseEnter={e=>e.target.style.color='#00c6ff'} onMouseLeave={e=>e.target.style.color='#b0c4de'}>{l}</button></li>)}
        </ul>
        <button onClick={()=>go('#pricing')} className="sh-cta" style={{ background:'linear-gradient(135deg,#1e56c0,#00c6ff)',color:'#fff',border:'none',padding:'9px 22px',borderRadius:8,fontWeight:700,fontSize:'0.85rem',cursor:'pointer',fontFamily:FONT }}>Get Started</button>
        <button onClick={()=>setOpen(o=>!o)} className="sh-ham" style={{ background:'none',border:'none',cursor:'pointer',display:'none',flexDirection:'column',gap:5 }}>
          {[0,1,2].map(i=><span key={i} style={{ width:24,height:2,background:'#fff',display:'block',borderRadius:2 }}/>)}
        </button>
      </div>
      {open && (
        <div style={{ background:'rgba(6,12,28,0.98)',padding:'12px 5% 20px',borderTop:'1px solid rgba(46,115,248,0.1)' }}>
          {links.map(([h,l])=><button key={h} onClick={()=>go(h)} style={{ display:'block',background:'none',border:'none',color:'#b0c4de',fontSize:'1rem',padding:'10px 0',cursor:'pointer',fontFamily:FONT,width:'100%',textAlign:'left' }}>{l}</button>)}
        </div>
      )}
      <style>{`@media(max-width:720px){.sh-nav,.sh-cta{display:none!important}.sh-ham{display:flex!important}}`}</style>
    </nav>
  );
}

// ── Hero ─────────────────────────────────────────────────
function Hero() {
  return (
    <section id="home" style={{ minHeight:'100vh',background:'linear-gradient(135deg,#060c1c 0%,#0d1e40 55%,#0a2260 100%)',display:'flex',alignItems:'center',justifyContent:'center',position:'relative',overflow:'hidden',padding:'130px 5% 80px',fontFamily:FONT }}>
      <div style={{ position:'absolute',width:600,height:600,borderRadius:'50%',background:'radial-gradient(circle,rgba(30,86,192,0.22),transparent 70%)',top:-100,right:-80,pointerEvents:'none' }}/>
      <div style={{ position:'absolute',width:500,height:500,borderRadius:'50%',background:'radial-gradient(circle,rgba(0,198,255,0.12),transparent 70%)',bottom:-60,left:-60,pointerEvents:'none' }}/>
      <div style={{ position:'absolute',inset:0,backgroundImage:'linear-gradient(rgba(56,130,255,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(56,130,255,0.04) 1px,transparent 1px)',backgroundSize:'60px 60px',pointerEvents:'none' }}/>
      <div style={{ maxWidth:760,textAlign:'center',position:'relative',zIndex:1 }}>
        <div style={{ display:'inline-flex',alignItems:'center',gap:8,background:'rgba(0,198,255,0.1)',border:'1px solid rgba(0,198,255,0.3)',color:'#00c6ff',padding:'6px 18px',borderRadius:50,fontSize:'0.72rem',fontWeight:700,letterSpacing:1.5,marginBottom:28,textTransform:'uppercase' }}>
          ⚡ Nigeria's Trusted Hosting Partner
        </div>
        <h1 style={{ fontSize:'clamp(2.6rem,6vw,4.2rem)',fontWeight:800,color:'#fff',lineHeight:1.1,marginBottom:22,letterSpacing:'-1.5px' }}>
          Fast, Reliable &<br/>
          <span style={{ background:'linear-gradient(135deg,#4d8ef8,#00c6ff)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent' }}>Affordable Hosting</span>
        </h1>
        <p style={{ fontSize:'1.05rem',color:'#8eb4d8',lineHeight:1.8,marginBottom:40,maxWidth:560,margin:'0 auto 40px' }}>
          Launch your website, app, or business online with Sir Host's powerful infrastructure. 99.9% uptime, NVMe servers, and 24/7 expert support.
        </p>
        <div style={{ display:'flex',gap:14,justifyContent:'center',flexWrap:'wrap' }}>
          <button onClick={()=>scrollTo('#pricing')} style={{ background:'linear-gradient(135deg,#1e56c0,#00c6ff)',color:'#fff',border:'none',padding:'14px 34px',borderRadius:10,fontWeight:700,fontSize:'1rem',cursor:'pointer',fontFamily:FONT,boxShadow:'0 10px 40px rgba(30,86,192,0.5)' }}>Start Hosting Now</button>
          <button onClick={()=>scrollTo('#services')} style={{ background:'transparent',color:'#fff',border:'2px solid rgba(255,255,255,0.2)',padding:'14px 34px',borderRadius:10,fontWeight:600,fontSize:'1rem',cursor:'pointer',fontFamily:FONT }}>Explore Services</button>
        </div>
        <div style={{ display:'flex',gap:48,justifyContent:'center',marginTop:64,flexWrap:'wrap' }}>
          {[['99.9%','Uptime SLA'],['50K+','Happy Clients'],['24/7','Live Support'],['10ms','Avg. Response']].map(([n,l])=>(
            <div key={l} style={{ textAlign:'center' }}>
              <div style={{ fontSize:'2rem',fontWeight:800,color:'#fff' }}>{n}</div>
              <div style={{ fontSize:'0.7rem',color:'#4a6888',textTransform:'uppercase',letterSpacing:1,marginTop:4 }}>{l}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Services ─────────────────────────────────────────────
function Services() {
  const [ref,v] = useFadeIn();
  return (
    <section id="services" ref={ref} style={{ padding:'90px 5%',background:'#f0f5ff',fontFamily:FONT }}>
      <div style={{ textAlign:'center',marginBottom:56,...fade(v) }}>
        <span style={{ color:'#2e73f8',fontWeight:700,fontSize:'0.72rem',letterSpacing:2.5,textTransform:'uppercase' }}>What We Offer</span>
        <h2 style={{ fontSize:'clamp(1.8rem,3.5vw,2.5rem)',fontWeight:800,color:'#060c1c',marginTop:8,letterSpacing:'-0.5px' }}>Hosting for Every Need</h2>
        <p style={{ color:'#6b7f99',marginTop:12,maxWidth:500,margin:'12px auto 0',fontSize:'0.93rem',lineHeight:1.7 }}>From personal blogs to enterprise apps — we have the perfect solution.</p>
      </div>
      <div style={{ display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(230px,1fr))',gap:24 }}>
        {SERVICES.map((s,i)=><ServiceCard key={s.title} s={s} i={i}/>)}
      </div>
    </section>
  );
}
function ServiceCard({ s, i }) {
  const [ref,v] = useFadeIn(); const [h,setH] = useState(false);
  return (
    <div ref={ref} onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)}
      style={{ background:'#fff',borderRadius:18,padding:'32px 28px',border:`1.5px solid ${h?'#4d8ef8':'#dce8f8'}`,boxShadow:h?'0 20px 50px rgba(30,86,192,0.1)':'0 2px 12px rgba(30,86,192,0.04)',transform:v?(h?'translateY(-6px)':'none'):'translateY(24px)',opacity:v?1:0,transition:`all 0.5s ease ${i*90}ms`,position:'relative',overflow:'hidden' }}>
      <div style={{ position:'absolute',top:0,left:0,right:0,height:3,background:'linear-gradient(135deg,#1e56c0,#00c6ff)',transform:h?'scaleX(1)':'scaleX(0)',transformOrigin:'left',transition:'transform 0.3s' }}/>
      <div style={{ width:52,height:52,background:'linear-gradient(135deg,#1e56c0,#00c6ff)',borderRadius:14,display:'flex',alignItems:'center',justifyContent:'center',fontSize:22,marginBottom:20 }}>{s.icon}</div>
      <h3 style={{ fontSize:'1.05rem',fontWeight:700,color:'#060c1c',marginBottom:10 }}>{s.title}</h3>
      <p style={{ fontSize:'0.875rem',color:'#6b7f99',lineHeight:1.65,marginBottom:18 }}>{s.desc}</p>
      <button onClick={()=>scrollTo(s.href)} style={{ background:'none',border:'none',color:'#1e56c0',fontWeight:700,fontSize:'0.83rem',cursor:'pointer',fontFamily:FONT,padding:0 }}>{s.cta} →</button>
    </div>
  );
}

// ── Features ─────────────────────────────────────────────
function Features() {
  const [ref,v] = useFadeIn();
  return (
    <section id="features" ref={ref} style={{ padding:'90px 5%',background:'#fff',fontFamily:FONT }}>
      <div style={{ maxWidth:1150,margin:'0 auto',display:'grid',gridTemplateColumns:'1fr 1fr',gap:80,alignItems:'center' }} className="sh-feat">
        <div style={{ background:'linear-gradient(135deg,#060c1c,#0d1e40)',borderRadius:24,padding:40,display:'grid',gridTemplateColumns:'1fr 1fr',gap:16,...fade(v) }}>
          {[['🖥️','99.9%','Uptime'],['⚡','10ms','Response'],['🛡️','DDoS','Free Shield'],['🎧','24/7','Support']].map(([icon,val,lbl])=>(
            <div key={lbl} style={{ background:'rgba(255,255,255,0.05)',border:'1px solid rgba(255,255,255,0.08)',borderRadius:14,padding:'22px 16px',textAlign:'center' }}>
              <div style={{ fontSize:28,marginBottom:8 }}>{icon}</div>
              <div style={{ fontSize:'1.5rem',fontWeight:800,color:'#fff' }}>{val}</div>
              <div style={{ fontSize:'0.7rem',color:'#6a8eb0',marginTop:4 }}>{lbl}</div>
            </div>
          ))}
        </div>
        <div style={fade(v,150)}>
          <span style={{ color:'#2e73f8',fontWeight:700,fontSize:'0.72rem',letterSpacing:2.5,textTransform:'uppercase' }}>Why Sir Host</span>
          <h2 style={{ fontSize:'clamp(1.8rem,3.5vw,2.4rem)',fontWeight:800,color:'#060c1c',marginTop:8,marginBottom:14,letterSpacing:'-0.5px',lineHeight:1.2 }}>Built for Speed,<br/>Designed for You</h2>
          <p style={{ color:'#6b7f99',fontSize:'0.93rem',lineHeight:1.75,marginBottom:36 }}>We've built our infrastructure from the ground up to keep your website fast, secure, and always online.</p>
          <div style={{ display:'flex',flexDirection:'column',gap:22 }}>
            {FEATURES.map(f=>(
              <div key={f.title} style={{ display:'flex',gap:16 }}>
                <div style={{ width:38,height:38,minWidth:38,background:'rgba(30,86,192,0.1)',borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',fontSize:16,marginTop:2 }}>{f.icon}</div>
                <div>
                  <div style={{ fontSize:'0.93rem',fontWeight:700,color:'#060c1c',marginBottom:4 }}>{f.title}</div>
                  <div style={{ fontSize:'0.86rem',color:'#6b7f99',lineHeight:1.65 }}>{f.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <style>{`@media(max-width:760px){.sh-feat{grid-template-columns:1fr!important;gap:40px!important}}`}</style>
    </section>
  );
}

// ── Pricing ───────────────────────────────────────────────
function Pricing() {
  const [tab, setTab] = useState('web');
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ref,v] = useFadeIn();

  useEffect(() => {
    api.get('/plans').then(r => setPlans(r.data)).finally(() => setLoading(false));
  }, []);

  const filtered = plans.filter(p => p.type === tab);

  return (
    <section id="pricing" ref={ref} style={{ padding:'90px 5%',background:'linear-gradient(135deg,#060c1c,#0d1e40,#0a2260)',fontFamily:FONT,position:'relative',overflow:'hidden' }}>
      <div style={{ position:'absolute',width:400,height:400,borderRadius:'50%',background:'radial-gradient(circle,rgba(30,86,192,0.18),transparent 70%)',top:'10%',right:'5%',pointerEvents:'none' }}/>
      <div style={{ textAlign:'center',marginBottom:48,...fade(v) }}>
        <span style={{ color:'#00c6ff',fontWeight:700,fontSize:'0.72rem',letterSpacing:2.5,textTransform:'uppercase' }}>Pricing</span>
        <h2 style={{ fontSize:'clamp(1.8rem,3.5vw,2.5rem)',fontWeight:800,color:'#fff',marginTop:8,letterSpacing:'-0.5px' }}>Simple, Transparent Pricing</h2>
        <p style={{ color:'#8eb4d8',marginTop:12,maxWidth:480,margin:'12px auto 0',fontSize:'0.93rem',lineHeight:1.7 }}>No hidden fees. No surprises. Scale as you grow.</p>
      </div>
      <div style={{ display:'flex',justifyContent:'center',marginBottom:48 }}>
        <div style={{ display:'flex',gap:6,background:'rgba(255,255,255,0.07)',borderRadius:10,padding:4 }}>
          {[['web','Web Hosting'],['vps','VPS / Cloud'],['dedicated','Dedicated']].map(([k,lbl])=>(
            <button key={k} onClick={()=>setTab(k)} style={{ padding:'8px 22px',borderRadius:7,border:'none',background:tab===k?'#2e73f8':'transparent',color:tab===k?'#fff':'#8eb4d8',fontWeight:600,fontSize:'0.82rem',cursor:'pointer',fontFamily:FONT,transition:'all 0.2s' }}>{lbl}</button>
          ))}
        </div>
      </div>
      {loading ? (
        <div style={{ textAlign:'center',color:'#6a8eb0',padding:40 }}>Loading plans...</div>
      ) : (
        <div style={{ display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(260px,1fr))',gap:24,maxWidth:1100,margin:'0 auto' }}>
          {filtered.map((plan,i)=><PricingCard key={plan._id} plan={plan} v={v} i={i}/>)}
          {!filtered.length && <div style={{ gridColumn:'1/-1',textAlign:'center',color:'#4a6888',padding:40 }}>No plans available in this category.</div>}
        </div>
      )}
    </section>
  );
}
function PricingCard({ plan, v, i }) {
  const [h,setH] = useState(false); const p = plan.popular;
  return (
    <div onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)}
      style={{ background:p?'#fff':'rgba(255,255,255,0.05)',border:p?'2px solid #2e73f8':'1px solid rgba(255,255,255,0.1)',borderRadius:20,padding:'36px 30px',position:'relative',overflow:'hidden',boxShadow:p?'0 24px 70px rgba(30,86,192,0.28)':'none',transform:v?(h?'translateY(-5px)':'none'):'translateY(24px)',opacity:v?1:0,transition:`all 0.5s ease ${i*100}ms` }}>
      {p && <div style={{ position:'absolute',top:18,right:-30,background:'linear-gradient(135deg,#1e56c0,#00c6ff)',color:'#fff',fontSize:'0.62rem',fontWeight:700,padding:'4px 38px',transform:'rotate(45deg)',letterSpacing:1 }}>POPULAR</div>}
      <div style={{ fontSize:'0.7rem',fontWeight:700,color:p?'#1e56c0':'#00c6ff',textTransform:'uppercase',letterSpacing:2,marginBottom:8 }}>{plan.name}</div>
      <div style={{ display:'flex',alignItems:'flex-end',gap:4,marginBottom:6 }}>
        <span style={{ fontSize:'1.1rem',fontWeight:700,color:p?'#060c1c':'#fff',paddingBottom:6 }}>$</span>
        <span style={{ fontSize:'2.8rem',fontWeight:900,color:p?'#060c1c':'#fff',lineHeight:1 }}>{plan.price}</span>
        <span style={{ fontSize:'0.82rem',color:'#6b7f99',paddingBottom:6 }}>/mo</span>
      </div>
      <div style={{ height:1,background:p?'#e8eef6':'rgba(255,255,255,0.08)',margin:'16px 0' }}/>
      <ul style={{ listStyle:'none',display:'flex',flexDirection:'column',gap:11,marginBottom:30 }}>
        {plan.features.map(f=>(
          <li key={f} style={{ display:'flex',alignItems:'center',gap:10,fontSize:'0.87rem',color:p?'#060c1c':'#c8e0f8' }}>
            <span style={{ color:'#22c55e',fontSize:'0.75rem',minWidth:14 }}>✓</span>{f}
          </li>
        ))}
      </ul>
      <button onClick={()=>scrollTo('#contact')} style={{ display:'block',width:'100%',padding:13,borderRadius:10,fontWeight:700,fontSize:'0.88rem',cursor:'pointer',fontFamily:FONT,background:p?'linear-gradient(135deg,#1e56c0,#00c6ff)':'transparent',border:p?'none':'2px solid rgba(255,255,255,0.2)',color:'#fff',boxShadow:p?'0 8px 26px rgba(30,86,192,0.4)':'none' }}>
        Get Started
      </button>
    </div>
  );
}

// ── Domain ────────────────────────────────────────────────
function Domain() {
  const [q,setQ] = useState(''); const [res,setRes] = useState(false);
  return (
    <section id="domain" style={{ padding:'90px 5%',background:'#f0f5ff',fontFamily:FONT }}>
      <div style={{ textAlign:'center',marginBottom:48 }}>
        <span style={{ color:'#2e73f8',fontWeight:700,fontSize:'0.72rem',letterSpacing:2.5,textTransform:'uppercase' }}>Domains</span>
        <h2 style={{ fontSize:'clamp(1.8rem,3.5vw,2.5rem)',fontWeight:800,color:'#060c1c',marginTop:8,letterSpacing:'-0.5px' }}>Find Your Perfect Domain</h2>
      </div>
      <div style={{ background:'#fff',borderRadius:24,padding:'48px 40px',maxWidth:700,margin:'0 auto',boxShadow:'0 12px 50px rgba(30,86,192,0.08)',textAlign:'center' }}>
        <div style={{ display:'flex',gap:12,flexWrap:'wrap' }}>
          <input value={q} onChange={e=>{setQ(e.target.value);setRes(false);}} onKeyDown={e=>e.key==='Enter'&&q.trim()&&setRes(true)} placeholder="Type your domain, e.g. mywebsite"
            style={{ flex:1,padding:'14px 18px',borderRadius:10,fontSize:'0.93rem',border:'2px solid #dce8f8',outline:'none',fontFamily:FONT,minWidth:180 }}
            onFocus={e=>e.target.style.borderColor='#2e73f8'} onBlur={e=>e.target.style.borderColor='#dce8f8'}
          />
          <button onClick={()=>q.trim()&&setRes(true)} style={{ background:'linear-gradient(135deg,#1e56c0,#00c6ff)',color:'#fff',border:'none',padding:'14px 24px',borderRadius:10,fontWeight:700,fontSize:'0.9rem',cursor:'pointer',fontFamily:FONT }}>🔍 Search</button>
        </div>
        {res && q && (
          <div style={{ marginTop:22,padding:'18px 20px',background:'#f0f7ff',borderRadius:12,border:'1px solid #dce8f8',textAlign:'left' }}>
            <p style={{ fontWeight:700,color:'#060c1c',marginBottom:12,fontSize:'0.9rem' }}>Results for "{q}":</p>
            {EXTS.map(e=>(
              <div key={e.ext} style={{ display:'flex',justifyContent:'space-between',alignItems:'center',padding:'10px 0',borderBottom:'1px solid #e8eef6' }}>
                <span style={{ fontWeight:600,color:'#1e56c0',fontSize:'0.9rem' }}>{q.replace(/\s/g,'')}{e.ext}</span>
                <div style={{ display:'flex',gap:12,alignItems:'center' }}>
                  <span style={{ color:'#22c55e',fontWeight:700,fontSize:'0.85rem' }}>{e.price}</span>
                  <button onClick={()=>scrollTo('#contact')} style={{ background:'#1e56c0',color:'#fff',border:'none',borderRadius:6,padding:'5px 14px',fontSize:'0.78rem',fontWeight:700,cursor:'pointer',fontFamily:FONT }}>Buy</button>
                </div>
              </div>
            ))}
          </div>
        )}
        <div style={{ display:'flex',gap:10,flexWrap:'wrap',justifyContent:'center',marginTop:26 }}>
          {EXTS.map(e=>(
            <div key={e.ext} style={{ background:'#f0f5ff',borderRadius:50,padding:'6px 16px',fontSize:'0.82rem',fontWeight:600,color:'#3a5a8a',border:'1px solid #dce8f8' }}>
              <span style={{ color:'#1e56c0' }}>{e.ext}</span> {e.price}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── About ─────────────────────────────────────────────────
function About() {
  const [ref,v] = useFadeIn();
  return (
    <section id="about" ref={ref} style={{ padding:'90px 5%',background:'#fff',fontFamily:FONT }}>
      <div style={{ maxWidth:1150,margin:'0 auto',display:'grid',gridTemplateColumns:'1fr 1fr',gap:80,alignItems:'center' }} className="sh-about">
        <div style={{ background:'linear-gradient(135deg,#060c1c,#0d1e40)',borderRadius:24,padding:40,display:'flex',flexDirection:'column',gap:18,...fade(v) }}>
          {[['🌍','3+','Global Data Centers'],['👥','50,000+','Customers Worldwide'],['📅','10+ Years','Industry Experience'],['🏆','99.9%','Uptime Delivered']].map(([icon,val,lbl])=>(
            <div key={lbl} style={{ background:'rgba(255,255,255,0.05)',border:'1px solid rgba(255,255,255,0.08)',borderRadius:14,padding:'20px 24px',display:'flex',alignItems:'center',gap:16 }}>
              <div style={{ fontSize:26 }}>{icon}</div>
              <div>
                <div style={{ fontSize:'1.5rem',fontWeight:800,color:'#fff' }}>{val}</div>
                <div style={{ fontSize:'0.76rem',color:'#6a8eb0',marginTop:2 }}>{lbl}</div>
              </div>
            </div>
          ))}
        </div>
        <div style={fade(v,150)}>
          <span style={{ color:'#2e73f8',fontWeight:700,fontSize:'0.72rem',letterSpacing:2.5,textTransform:'uppercase' }}>About Us</span>
          <h2 style={{ fontSize:'clamp(1.8rem,3.5vw,2.4rem)',fontWeight:800,color:'#060c1c',marginTop:8,marginBottom:20,letterSpacing:'-0.5px',lineHeight:1.2 }}>Powering Nigerian &<br/>Global Businesses</h2>
          {['Sir Host was founded with one mission: make professional web hosting fast, reliable, and affordable for everyone — from individuals to enterprises.','We serve customers across Nigeria and beyond, powered by robust infrastructure and a team of hosting experts available around the clock.','We believe in transparency: every plan includes a 30-day money-back guarantee, no contracts, and no hidden fees.'].map((p,i)=>(
            <p key={i} style={{ fontSize:'0.92rem',color:'#4a5568',lineHeight:1.8,marginBottom:14 }}>{p}</p>
          ))}
          <div style={{ display:'flex',flexWrap:'wrap',gap:10,marginTop:24 }}>
            {['🚀 Performance First','🔒 Security Focused','💬 Customer Obsessed','🌍 Global Reach','💰 Fair Pricing'].map(val=>(
              <span key={val} style={{ background:'rgba(30,86,192,0.07)',color:'#1a3a6b',padding:'7px 16px',borderRadius:50,fontSize:'0.8rem',fontWeight:600 }}>{val}</span>
            ))}
          </div>
        </div>
      </div>
      <style>{`@media(max-width:760px){.sh-about{grid-template-columns:1fr!important;gap:40px!important}}`}</style>
    </section>
  );
}

// ── Testimonials ─────────────────────────────────────────
function Testimonials() {
  const [ref,v] = useFadeIn();
  return (
    <section id="testimonials" ref={ref} style={{ padding:'90px 5%',background:'#f0f5ff',fontFamily:FONT }}>
      <div style={{ textAlign:'center',marginBottom:56,...fade(v) }}>
        <span style={{ color:'#2e73f8',fontWeight:700,fontSize:'0.72rem',letterSpacing:2.5,textTransform:'uppercase' }}>Testimonials</span>
        <h2 style={{ fontSize:'clamp(1.8rem,3.5vw,2.5rem)',fontWeight:800,color:'#060c1c',marginTop:8,letterSpacing:'-0.5px' }}>Trusted by Thousands</h2>
      </div>
      <div style={{ display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))',gap:24,maxWidth:1100,margin:'0 auto' }}>
        {TESTIMONIALS.map((t,i)=>(
          <div key={t.name} style={{ background:'#fff',borderRadius:18,padding:32,border:'1px solid #dce8f8',...fade(v,i*100) }}>
            <div style={{ color:'#f59e0b',marginBottom:14,fontSize:'0.9rem' }}>{'★'.repeat(t.stars)}</div>
            <p style={{ fontSize:'0.9rem',color:'#4a5568',lineHeight:1.75,marginBottom:22,fontStyle:'italic' }}>"{t.text}"</p>
            <div style={{ display:'flex',alignItems:'center',gap:12 }}>
              <div style={{ width:44,height:44,borderRadius:'50%',background:t.bg,display:'flex',alignItems:'center',justifyContent:'center',color:'#fff',fontWeight:700,fontSize:'1rem',flexShrink:0 }}>{t.i}</div>
              <div>
                <div style={{ fontSize:'0.88rem',fontWeight:700,color:'#060c1c' }}>{t.name}</div>
                <div style={{ fontSize:'0.76rem',color:'#6b7f99' }}>{t.role}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ── Contact ───────────────────────────────────────────────
function Contact() {
  const [ref,v] = useFadeIn();
  const [form,setForm] = useState({ name:'', email:'', service:'', message:'' });
  const [sending,setSending] = useState(false);
  const [sent,setSent] = useState(false);
  const [error,setError] = useState('');
  const upd = k => e => setForm(f=>({...f,[k]:e.target.value}));

  const submit = async () => {
    if (!form.name||!form.email||!form.message) { setError('Please fill in Name, Email and Message.'); return; }
    setSending(true); setError('');
    try {
      await api.post('/contacts', form);
      setSent(true);
    } catch (err) { setError(err.response?.data?.message || 'Failed to send. Please try again.'); }
    finally { setSending(false); }
  };

  const inp = { padding:'12px 14px',borderRadius:10,border:'2px solid #dce8f8',fontSize:'0.9rem',fontFamily:FONT,outline:'none',width:'100%',boxSizing:'border-box',transition:'border-color 0.2s' };

  return (
    <section id="contact" ref={ref} style={{ padding:'90px 5%',background:'#fff',fontFamily:FONT }}>
      <div style={{ maxWidth:1100,margin:'0 auto' }}>
        <div style={{ marginBottom:56,...fade(v) }}>
          <span style={{ color:'#2e73f8',fontWeight:700,fontSize:'0.72rem',letterSpacing:2.5,textTransform:'uppercase' }}>Get In Touch</span>
          <h2 style={{ fontSize:'clamp(1.8rem,3.5vw,2.5rem)',fontWeight:800,color:'#060c1c',marginTop:8,letterSpacing:'-0.5px' }}>We're Here to Help</h2>
          <p style={{ color:'#6b7f99',marginTop:10,fontSize:'0.93rem',lineHeight:1.7 }}>Have a question or need a custom hosting solution? Our team is ready.</p>
        </div>
        <div style={{ display:'grid',gridTemplateColumns:'1fr 1.5fr',gap:70,...fade(v,100) }} className="sh-contact">
          {/* Info */}
          <div style={{ display:'flex',flexDirection:'column',gap:24 }}>
            {[
              { icon:'📞', title:'Call Us',      lines:['07025519997','Available 24/7'] },
              { icon:'✉️',  title:'Email Us',     lines:['sirhost.ng@gmail.com','We reply within a few hours'] },
              { icon:'📍', title:'Our Address',  lines:['31 Monrocia Street, Wuse 2','Abuja, Nigeria'] },
              { icon:'💬', title:'Live Chat',    lines:['Available 24/7 on our site','Avg. response under 2 mins'] },
            ].map(c=>(
              <div key={c.title} style={{ display:'flex',gap:16 }}>
                <div style={{ width:48,height:48,minWidth:48,background:'rgba(30,86,192,0.08)',borderRadius:12,display:'flex',alignItems:'center',justifyContent:'center',fontSize:20 }}>{c.icon}</div>
                <div>
                  <div style={{ fontSize:'0.88rem',fontWeight:700,color:'#060c1c',marginBottom:4 }}>{c.title}</div>
                  {c.lines.map(l=><div key={l} style={{ fontSize:'0.85rem',color:'#6b7f99',lineHeight:1.6 }}>{l}</div>)}
                </div>
              </div>
            ))}
          </div>

          {/* Form */}
          {sent ? (
            <div style={{ display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',background:'#f0f7ff',borderRadius:20,padding:48,textAlign:'center',gap:16,border:'1px solid #dce8f8' }}>
              <div style={{ fontSize:56 }}>✅</div>
              <h3 style={{ fontSize:'1.4rem',fontWeight:800,color:'#060c1c' }}>Message Sent!</h3>
              <p style={{ color:'#6b7f99',fontSize:'0.93rem',lineHeight:1.7 }}>Thank you! Our team will get back to you within 24 hours.</p>
              <button onClick={()=>{setSent(false);setForm({name:'',email:'',service:'',message:''}); }} style={{ background:'linear-gradient(135deg,#1e56c0,#00c6ff)',color:'#fff',border:'none',padding:'12px 28px',borderRadius:10,fontWeight:700,cursor:'pointer',fontFamily:FONT }}>Send Another</button>
            </div>
          ) : (
            <div style={{ display:'flex',flexDirection:'column',gap:16 }}>
              {error && <div style={{ background:'rgba(239,68,68,0.1)',border:'1px solid rgba(239,68,68,0.2)',color:'#ef4444',padding:'10px 14px',borderRadius:8,fontSize:'0.85rem' }}>{error}</div>}
              <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:14 }}>
                {[['name','Full Name *','John Doe'],['email','Email Address *','you@example.com']].map(([k,l,ph])=>(
                  <div key={k} style={{ display:'flex',flexDirection:'column',gap:6 }}>
                    <label style={{ fontSize:'0.78rem',fontWeight:600,color:'#1a3a6b' }}>{l}</label>
                    <input style={inp} type={k==='email'?'email':'text'} value={form[k]} onChange={upd(k)} placeholder={ph}
                      onFocus={e=>e.target.style.borderColor='#2e73f8'} onBlur={e=>e.target.style.borderColor='#dce8f8'}
                    />
                  </div>
                ))}
              </div>
              <div style={{ display:'flex',flexDirection:'column',gap:6 }}>
                <label style={{ fontSize:'0.78rem',fontWeight:600,color:'#1a3a6b' }}>Service Interest</label>
                <select style={inp} value={form.service} onChange={upd('service')}
                  onFocus={e=>e.target.style.borderColor='#2e73f8'} onBlur={e=>e.target.style.borderColor='#dce8f8'}>
                  <option value="">Select a service...</option>
                  {['Web Hosting','VPS / Cloud Hosting','Dedicated Servers','Domain Registration','General Inquiry'].map(o=><option key={o}>{o}</option>)}
                </select>
              </div>
              <div style={{ display:'flex',flexDirection:'column',gap:6 }}>
                <label style={{ fontSize:'0.78rem',fontWeight:600,color:'#1a3a6b' }}>Message *</label>
                <textarea style={{ ...inp,resize:'vertical',minHeight:120 }} value={form.message} onChange={upd('message')} placeholder="Tell us how we can help..."
                  onFocus={e=>e.target.style.borderColor='#2e73f8'} onBlur={e=>e.target.style.borderColor='#dce8f8'}
                />
              </div>
              <button onClick={submit} disabled={sending} style={{ background:'linear-gradient(135deg,#1e56c0,#00c6ff)',color:'#fff',border:'none',padding:14,borderRadius:10,fontWeight:700,fontSize:'0.95rem',cursor:sending?'not-allowed':'pointer',fontFamily:FONT,opacity:sending?0.7:1,boxShadow:'0 8px 24px rgba(30,86,192,0.35)' }}>
                {sending ? 'Sending...' : '📨 Send Message'}
              </button>
            </div>
          )}
        </div>
      </div>
      <style>{`@media(max-width:760px){.sh-contact{grid-template-columns:1fr!important;gap:40px!important}}`}</style>
    </section>
  );
}

// ── Footer ────────────────────────────────────────────────
function Footer() {
  const go = href => scrollTo(href);
  return (
    <footer style={{ background:'#060c1c',fontFamily:FONT }}>
      <div style={{ display:'grid',gridTemplateColumns:'2fr 1fr 1fr 1fr',gap:48,padding:'70px 5% 48px' }} className="sh-footer">
        <div>
          <button onClick={()=>go('#home')} style={{ background:'none',border:'none',cursor:'pointer',display:'flex',alignItems:'center',gap:10,marginBottom:16 }}>
            <div style={{ width:36,height:36,background:'linear-gradient(135deg,#1e56c0,#00c6ff)',borderRadius:9,display:'flex',alignItems:'center',justifyContent:'center',fontSize:16 }}>🖧</div>
            <span style={{ fontSize:'1.2rem',fontWeight:800,color:'#fff' }}>Sir<span style={{ color:'#00c6ff' }}>Host</span></span>
          </button>
          <p style={{ fontSize:'0.85rem',color:'#4a6888',lineHeight:1.75,maxWidth:270,marginBottom:22 }}>Fast, reliable, and affordable hosting for Nigeria and the world.</p>
          <div style={{ display:'flex',gap:10 }}>
            {['𝕏','f','in','📷'].map(s=>(
              <a key={s} href="#" style={{ width:36,height:36,borderRadius:'50%',background:'rgba(255,255,255,0.05)',border:'1px solid rgba(255,255,255,0.08)',display:'flex',alignItems:'center',justifyContent:'center',color:'#6a8eb0',textDecoration:'none',fontSize:13 }}
                onMouseEnter={e=>{e.currentTarget.style.background='#2e73f8';e.currentTarget.style.color='#fff';}}
                onMouseLeave={e=>{e.currentTarget.style.background='rgba(255,255,255,0.05)';e.currentTarget.style.color='#6a8eb0';}}
              >{s}</a>
            ))}
          </div>
        </div>
        {[
          { title:'Services', links:[['Web Hosting','#services'],['VPS / Cloud','#services'],['Dedicated Servers','#services'],['Domain Names','#domain']] },
          { title:'Company',  links:[['About Us','#about'],['Testimonials','#testimonials'],['Contact','#contact']] },
          { title:'Support',  links:[['Help Center','#'],['Status Page','#'],['Privacy Policy','#'],['Terms of Service','#']] },
        ].map(col=>(
          <div key={col.title}>
            <h4 style={{ fontSize:'0.87rem',fontWeight:700,color:'#fff',marginBottom:18 }}>{col.title}</h4>
            <ul style={{ listStyle:'none',display:'flex',flexDirection:'column',gap:10 }}>
              {col.links.map(([lbl,href])=>(
                <li key={lbl}><button onClick={()=>go(href)} style={{ background:'none',border:'none',color:'#4a6888',fontSize:'0.83rem',cursor:'pointer',fontFamily:FONT,padding:0 }}
                  onMouseEnter={e=>e.target.style.color='#00c6ff'} onMouseLeave={e=>e.target.style.color='#4a6888'}
                >{lbl}</button></li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div style={{ borderTop:'1px solid rgba(255,255,255,0.06)',padding:'22px 5%',display:'flex',justifyContent:'space-between',alignItems:'center',flexWrap:'wrap',gap:12,fontSize:'0.78rem',color:'#3a5570' }}>
        <span>© 2025 Sir Host Nigeria. All rights reserved.</span>
        <div style={{ display:'flex',gap:20 }}>{['Privacy','Terms','Cookies'].map(l=><a key={l} href="#" style={{ color:'#3a5570',textDecoration:'none' }}>{l}</a>)}</div>
      </div>
      <style>{`@media(max-width:760px){.sh-footer{grid-template-columns:1fr 1fr!important;gap:32px!important}}`}</style>
    </footer>
  );
}

// ── ScrollTop ─────────────────────────────────────────────
function ScrollTop() {
  const [show,setShow] = useState(false);
  useEffect(()=>{const fn=()=>setShow(window.scrollY>400);window.addEventListener('scroll',fn);return()=>window.removeEventListener('scroll',fn);},[]);
  if (!show) return null;
  return (
    <button onClick={()=>window.scrollTo({top:0,behavior:'smooth'})} style={{ position:'fixed',bottom:30,right:30,width:46,height:46,borderRadius:'50%',background:'linear-gradient(135deg,#1e56c0,#00c6ff)',border:'none',color:'#fff',fontSize:18,cursor:'pointer',boxShadow:'0 6px 24px rgba(30,86,192,0.4)',zIndex:999,display:'flex',alignItems:'center',justifyContent:'center' }}>↑</button>
  );
}

// ── Main export ───────────────────────────────────────────
export default function Home() {
  return (
    <div style={{ margin:0,padding:0,fontFamily:FONT }}>
      <Navbar/>
      <Hero/>
      <Services/>
      <Features/>
      <Pricing/>
      <Domain/>
      <About/>
      <Testimonials/>
      <Contact/>
      <Footer/>
      <ScrollTop/>
    </div>
  );
}
