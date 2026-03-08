import React, { useState, useEffect, useRef } from 'react';
import Login from './pages/Login';
import PatientDashboard from './pages/PatientDashboard';
import DoctorDashboard from './pages/DoctorDashboard';
import { isLoggedIn, getUser, logout } from './services/api';

// ── Animated Counter ─────────────────────
const Counter = ({ end, suffix = '' }: { end: number; suffix?: string }) => {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const observer = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !started) {
        setStarted(true);
        let s = 0; const step = Math.ceil(end / 60);
        const t = setInterval(() => { s += step; if (s >= end) { setCount(end); clearInterval(t); } else setCount(s); }, 20);
      }
    }, { threshold: 0.5 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [end, started]);
  return <span ref={ref}>{count}{suffix}</span>;
};

// ── Scroll Fade ──────────────────────────
const FadeIn = ({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) => {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const observer = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setVisible(true); observer.disconnect(); }
    }, { threshold: 0.1 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  return (
    <div ref={ref} style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(28px)', transition: `opacity 0.65s ease ${delay}s, transform 0.65s ease ${delay}s` }}>
      {children}
    </div>
  );
};

function App() {
  const [page, setPage] = useState('home');
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [scrolled, setScrolled] = useState(false);
  const [activeModule, setActiveModule] = useState(0);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    if (isLoggedIn()) { const u = getUser(); if (u) { setCurrentUser(u); setPage(u.role === 'doctor' ? 'doctor' : 'dashboard'); } }
  }, []);

  useEffect(() => {
    const s = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', s);
    return () => window.removeEventListener('scroll', s);
  }, []);

  useEffect(() => {
    const t = setInterval(() => setActiveModule(p => (p + 1) % 9), 2200);
    return () => clearInterval(t);
  }, []);

  const handleLogin = (u: any) => { setCurrentUser(u); setPage(u.role === 'doctor' ? 'doctor' : 'dashboard'); };
  const handleLogout = () => { logout(); setCurrentUser(null); setPage('home'); };

  if (page === 'login') return <Login onLogin={handleLogin} />;
  if (page === 'dashboard') return <PatientDashboard user={currentUser} onLogout={handleLogout} />;
  if (page === 'doctor') return <DoctorDashboard user={currentUser} onLogout={handleLogout} />;

  const modules = [
    { icon: '🫁', title: 'X-Ray Analysis', desc: 'Chest X-ray, MRI & CT scan analysis with radiologist-level accuracy', color: '#2563EB', light: '#DBEAFE' },
    { icon: '🦴', title: 'Bone Scan', desc: 'Fracture & bone disease detection with orthopedic precision', color: '#7C3AED', light: '#EDE9FE' },
    { icon: '💓', title: 'ECG Analyzer', desc: 'Heart rhythm & cardiac condition detection in real-time', color: '#DC2626', light: '#FEE2E2' },
    { icon: '🧪', title: 'Blood Tests', desc: 'Complete blood report analysis with abnormal value flagging', color: '#059669', light: '#D1FAE5' },
    { icon: '🧠', title: 'Mental Health', desc: 'PHQ-9 & GAD-7 validated depression & anxiety screening', color: '#D97706', light: '#FEF3C7' },
    { icon: '🔍', title: 'Diagnosis AI', desc: 'Symptom-based differential diagnosis with confidence scores', color: '#0891B2', light: '#CFFAFE' },
    { icon: '💊', title: 'Prescription', desc: 'Handwritten prescription reader in Urdu & English', color: '#DB2777', light: '#FCE7F3' },
    { icon: '📊', title: 'Vital Signs', desc: 'BP, blood sugar & oxygen level monitoring & tracking', color: '#0D9488', light: '#CCFBF1' },
    { icon: '🚨', title: 'Emergency Aid', desc: 'Instant first aid guidance for critical situations', color: '#EA580C', light: '#FFEDD5' },
  ];

  const faqs = [
    { q: 'Is MedCare AI really free?', a: 'Yes! MedCare AI is completely free for patients. We believe healthcare should be accessible to every Pakistani regardless of income.' },
    { q: 'How accurate is the AI analysis?', a: 'Our AI is powered by LLaVA-Med, published in Nature Medicine 2024 by Microsoft Research. It achieves radiologist-level accuracy on chest X-rays and ECGs.' },
    { q: 'Is my medical data safe?', a: 'Absolutely. We use end-to-end encryption. Your scans and reports are never shared with third parties. You own your data.' },
    { q: 'Do I need to see a doctor after AI analysis?', a: 'Yes. AI reports are reviewed and approved by certified Pakistani physicians before being finalized. AI assists, doctors decide.' },
    { q: 'What languages are supported?', a: 'All reports are available in both Urdu and English. Our Urdu support is specifically designed for Pakistani patients.' },
  ];

  const cities = ['Karachi', 'Lahore', 'Islamabad', 'Rawalpindi', 'Peshawar', 'Quetta', 'Multan', 'Faisalabad'];

  return (
    <div style={{ fontFamily: "'Plus Jakarta Sans', -apple-system, sans-serif", background: '#FFFFFF', color: '#0F172A', overflowX: 'hidden' }}>

      {/* ══════════════════════════════════
          NAVBAR
      ══════════════════════════════════ */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000, height: 68,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 5%',
        background: scrolled ? 'rgba(255,255,255,0.96)' : 'transparent',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(0,0,0,0.06)' : 'none',
        boxShadow: scrolled ? '0 2px 20px rgba(0,0,0,0.06)' : 'none',
        transition: 'all 0.3s ease',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 40, height: 40, borderRadius: 12, background: 'linear-gradient(135deg, #2563EB, #1D4ED8)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, boxShadow: '0 4px 14px rgba(37,99,235,0.4)' }}>&#x1F3E5;</div>
          <span style={{ fontWeight: 800, fontSize: 18, letterSpacing: '-0.5px' }}>MedCare <span style={{ color: '#2563EB' }}>AI</span></span>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <button onClick={() => setPage('login')} style={{ background: 'transparent', border: '1.5px solid #E2E8F0', color: '#475569', padding: '9px 22px', borderRadius: 10, cursor: 'pointer', fontSize: 14, fontWeight: 600, transition: 'all 0.2s' }}
            onMouseEnter={e => { const el = e.currentTarget; el.style.borderColor = '#2563EB'; el.style.color = '#2563EB'; el.style.background = '#EFF6FF'; }}
            onMouseLeave={e => { const el = e.currentTarget; el.style.borderColor = '#E2E8F0'; el.style.color = '#475569'; el.style.background = 'transparent'; }}
          >Login</button>
          <button onClick={() => setPage('login')} style={{ background: 'linear-gradient(135deg, #2563EB, #1D4ED8)', border: 'none', color: '#fff', padding: '9px 24px', borderRadius: 10, cursor: 'pointer', fontSize: 14, fontWeight: 700, boxShadow: '0 4px 14px rgba(37,99,235,0.4)', transition: 'all 0.2s' }}
            onMouseEnter={e => { const el = e.currentTarget; el.style.transform = 'translateY(-1px)'; el.style.boxShadow = '0 8px 20px rgba(37,99,235,0.5)'; }}
            onMouseLeave={e => { const el = e.currentTarget; el.style.transform = 'translateY(0)'; el.style.boxShadow = '0 4px 14px rgba(37,99,235,0.4)'; }}
          >Get Started &#8594;</button>
        </div>
      </nav>

      {/* ══════════════════════════════════
          HERO
      ══════════════════════════════════ */}
      <section style={{ minHeight: '100vh', background: 'linear-gradient(155deg, #EFF6FF 0%, #FAFAFA 45%, #F0FDF4 100%)', display: 'flex', alignItems: 'center', padding: '100px 5% 60px', position: 'relative', overflow: 'hidden' }}>

        {/* Animated gradient orbs */}
        <div style={{ position: 'absolute', top: '8%', right: '-8%', width: '50vw', height: '50vw', maxWidth: 700, maxHeight: 700, borderRadius: '50%', background: 'radial-gradient(circle, rgba(37,99,235,0.07) 0%, transparent 70%)', pointerEvents: 'none', animation: 'slowFloat 8s ease-in-out infinite' }} />
        <div style={{ position: 'absolute', bottom: '5%', left: '-8%', width: '40vw', height: '40vw', maxWidth: 500, maxHeight: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(16,185,129,0.06) 0%, transparent 70%)', pointerEvents: 'none', animation: 'slowFloat 10s ease-in-out infinite reverse' }} />
        <div style={{ position: 'absolute', top: '40%', left: '40%', width: '20vw', height: '20vw', maxWidth: 300, maxHeight: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(124,58,237,0.04) 0%, transparent 70%)', pointerEvents: 'none' }} />

        {/* Dots grid */}
        <div style={{ position: 'absolute', top: '12%', right: '3%', opacity: 0.3, pointerEvents: 'none' }}>
          {[...Array(7)].map((_, r) => (
            <div key={r} style={{ display: 'flex', gap: 18, marginBottom: 18 }}>
              {[...Array(7)].map((_, c) => <div key={c} style={{ width: 4, height: 4, borderRadius: '50%', background: '#2563EB' }} />)}
            </div>
          ))}
        </div>

        <div style={{ position: 'relative', zIndex: 1, width: '100%', display: 'flex', alignItems: 'center', gap: '4%', flexWrap: 'wrap' }}>

          {/* LEFT */}
          <div style={{ flex: '1 1 440px', maxWidth: 580 }}>
            <FadeIn delay={0}>
              {/* Badge */}
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#EFF6FF', border: '1px solid #BFDBFE', borderRadius: 100, padding: '7px 16px', marginBottom: 28 }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#2563EB', display: 'inline-block', animation: 'pulse 2s infinite' }} />
                <span style={{ fontSize: 13, color: '#1D4ED8', fontWeight: 700 }}>&#x1F1F5;&#x1F1F0; Pakistan's First AI Medical Platform</span>
              </div>

              <h1 style={{ fontSize: 'clamp(38px, 5.5vw, 72px)', fontWeight: 800, lineHeight: 1.05, letterSpacing: '-2px', marginBottom: 22, color: '#0F172A' }}>
                Medical AI For<br />
                <span style={{ background: 'linear-gradient(135deg, #2563EB 0%, #7C3AED 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Every Pakistani</span>
              </h1>

              <p style={{ fontSize: 'clamp(15px, 1.8vw, 19px)', color: '#64748B', lineHeight: 1.75, marginBottom: 36, maxWidth: 500 }}>
                AI-powered X-ray, ECG & blood test analysis. <strong style={{ color: '#0F172A' }}>Free. Fast.</strong> In Urdu & English. No barriers.
              </p>

              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 44 }}>
                <button onClick={() => setPage('login')} style={{ background: 'linear-gradient(135deg, #2563EB, #1D4ED8)', border: 'none', color: '#fff', padding: '15px 32px', borderRadius: 12, cursor: 'pointer', fontSize: 16, fontWeight: 700, boxShadow: '0 8px 24px rgba(37,99,235,0.4)', transition: 'all 0.25s' }}
                  onMouseEnter={e => { const el = e.currentTarget; el.style.transform = 'translateY(-2px)'; el.style.boxShadow = '0 14px 32px rgba(37,99,235,0.5)'; }}
                  onMouseLeave={e => { const el = e.currentTarget; el.style.transform = 'translateY(0)'; el.style.boxShadow = '0 8px 24px rgba(37,99,235,0.4)'; }}
                >Start Free Analysis &#8594;</button>
                <button style={{ background: '#fff', border: '1.5px solid #E2E8F0', color: '#475569', padding: '15px 28px', borderRadius: 12, cursor: 'pointer', fontSize: 16, fontWeight: 600, boxShadow: '0 2px 8px rgba(0,0,0,0.05)', transition: 'all 0.25s' }}
                  onMouseEnter={e => { const el = e.currentTarget; el.style.borderColor = '#2563EB'; el.style.color = '#2563EB'; el.style.transform = 'translateY(-2px)'; }}
                  onMouseLeave={e => { const el = e.currentTarget; el.style.borderColor = '#E2E8F0'; el.style.color = '#475569'; el.style.transform = 'translateY(0)'; }}
                >&#9654; Watch Demo</button>
              </div>

              {/* Social proof */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap', marginBottom: 28 }}>
                <div style={{ display: 'flex' }}>
                  {['#FCA5A5', '#86EFAC', '#93C5FD', '#C4B5FD', '#FCD34D'].map((c, i) => (
                    <div key={i} style={{ width: 32, height: 32, borderRadius: '50%', background: c, border: '2px solid #fff', marginLeft: i === 0 ? 0 : -10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>
                      {['&#x1F9D1;&#x200D;&#x2695;&#xFE0F;', '&#x1F469;', '&#x1F468;', '&#x1F469;&#x200D;&#x2695;&#xFE0F;', '&#x1F9D1;'][i]}
                    </div>
                  ))}
                </div>
                <div>
                  <div style={{ display: 'flex', gap: 2, marginBottom: 2 }}>
                    {[1,2,3,4,5].map(s => <span key={s} style={{ color: '#F59E0B', fontSize: 13 }}>&#9733;</span>)}
                  </div>
                  <span style={{ fontSize: 13, color: '#64748B', fontWeight: 500 }}>Trusted by <strong style={{ color: '#0F172A' }}>10,000+</strong> Pakistanis</span>
                </div>
              </div>

              {/* Trust badges */}
              <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
                {[{ icon: '&#x1F512;', text: 'Secure & Private' }, { icon: '&#x26A1;', text: '2-3 min results' }, { icon: '&#x1F310;', text: 'Urdu & English' }, { icon: '&#x1F49A;', text: 'Always Free' }].map((b, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ fontSize: 15 }} dangerouslySetInnerHTML={{ __html: b.icon }} />
                    <span style={{ fontSize: 13, color: '#94A3B8', fontWeight: 500 }}>{b.text}</span>
                  </div>
                ))}
              </div>
            </FadeIn>
          </div>

          {/* RIGHT — App Mockup */}
          <div style={{ flex: '1 1 340px', maxWidth: 420 }}>
            <FadeIn delay={0.2}>
              <div style={{ background: '#fff', borderRadius: 24, boxShadow: '0 32px 80px rgba(0,0,0,0.12), 0 0 0 1px rgba(0,0,0,0.04)', overflow: 'hidden' }}>
                {/* Window chrome */}
                <div style={{ background: '#F8FAFC', padding: '13px 18px', borderBottom: '1px solid #F1F5F9', display: 'flex', alignItems: 'center', gap: 7 }}>
                  {['#EF4444','#F59E0B','#22C55E'].map((c, i) => <div key={i} style={{ width: 11, height: 11, borderRadius: '50%', background: c }} />)}
                  <div style={{ flex: 1, margin: '0 10px', background: '#EFF6FF', borderRadius: 6, padding: '4px 10px', display: 'flex', alignItems: 'center', gap: 5 }}>
                    <span style={{ fontSize: 11, color: '#93C5FD' }}>&#x1F512;</span>
                    <span style={{ fontSize: 11, color: '#64748B', fontFamily: 'monospace' }}>medcareai.app</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                    <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#22C55E', animation: 'pulse 2s infinite' }} />
                    <span style={{ fontSize: 11, color: '#22C55E', fontWeight: 700 }}>LIVE</span>
                  </div>
                </div>
                {/* Module list */}
                <div style={{ padding: '18px' }}>
                  <div style={{ fontSize: 11, color: '#94A3B8', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 10 }}>AI MODULES</div>
                  {modules.map((mod, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 11px', borderRadius: 12, marginBottom: 3, transition: 'all 0.35s ease', background: activeModule === i ? mod.light : 'transparent', border: `1px solid ${activeModule === i ? mod.color + '30' : 'transparent'}`, transform: activeModule === i ? 'translateX(6px)' : 'translateX(0)' }}>
                      <span style={{ fontSize: 19, width: 28, textAlign: 'center', flexShrink: 0 }}>{mod.icon}</span>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 13, fontWeight: 700, color: activeModule === i ? mod.color : '#475569' }}>{mod.title}</div>
                        {activeModule === i && <div style={{ fontSize: 11, color: '#64748B', marginTop: 1 }}>{mod.desc.substring(0, 38)}...</div>}
                      </div>
                      {activeModule === i && <div style={{ width: 7, height: 7, borderRadius: '50%', background: mod.color, flexShrink: 0 }} />}
                    </div>
                  ))}
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════
          STATS — Dark
      ══════════════════════════════════ */}
      <section style={{ padding: '64px 5%', background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)' }}>
        <FadeIn>
          <div style={{ maxWidth: 1000, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 40, textAlign: 'center' }}>
            {[
              { num: 10000, suffix: '+', label: 'Patients Served', icon: '&#x1F465;', color: '#60A5FA' },
              { num: 9, suffix: '', label: 'AI Modules', icon: '&#x1F916;', color: '#34D399' },
              { num: 98, suffix: '%', label: 'Accuracy Rate', icon: '&#x1F3AF;', color: '#FBBF24' },
              { num: 100, suffix: '%', label: 'Free for Patients', icon: '&#x1F49A;', color: '#F472B6' },
            ].map((s, i) => (
              <div key={i}>
                <div style={{ fontSize: 30, marginBottom: 8 }} dangerouslySetInnerHTML={{ __html: s.icon }} />
                <div style={{ fontSize: 46, fontWeight: 800, letterSpacing: '-2px', color: s.color, lineHeight: 1 }}>
                  <Counter end={s.num} suffix={s.suffix} />
                </div>
                <div style={{ color: '#64748B', fontSize: 14, marginTop: 8, fontWeight: 500 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </FadeIn>
      </section>

      {/* ══════════════════════════════════
          MODULES GRID
      ══════════════════════════════════ */}
      <section style={{ padding: '100px 5%', background: '#F8FAFC' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <FadeIn>
            <div style={{ textAlign: 'center', marginBottom: 60 }}>
              <div style={{ display: 'inline-block', background: '#EFF6FF', border: '1px solid #BFDBFE', borderRadius: 100, padding: '5px 16px', fontSize: 12, color: '#2563EB', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 16 }}>Capabilities</div>
              <h2 style={{ fontSize: 'clamp(28px, 4vw, 46px)', fontWeight: 800, letterSpacing: '-1.5px', color: '#0F172A', marginBottom: 12 }}>9 Medical AI Modules</h2>
              <p style={{ color: '#64748B', fontSize: 17, maxWidth: 480, margin: '0 auto' }}>Powered by LLaVA-Med — Nature Medicine 2024 by Microsoft Research</p>
            </div>
          </FadeIn>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
            {modules.map((mod, i) => (
              <FadeIn key={i} delay={i * 0.06}>
                <div style={{ background: '#fff', border: '1.5px solid #F1F5F9', borderRadius: 20, padding: '26px', cursor: 'pointer', transition: 'all 0.3s', display: 'flex', alignItems: 'flex-start', gap: 18, boxShadow: '0 1px 4px rgba(0,0,0,0.04)', height: '100%' }}
                  onMouseEnter={e => { const el = e.currentTarget; el.style.borderColor = mod.color + '50'; el.style.transform = 'translateY(-5px)'; el.style.boxShadow = `0 20px 40px ${mod.color}22`; el.style.background = mod.light + 'AA'; }}
                  onMouseLeave={e => { const el = e.currentTarget; el.style.borderColor = '#F1F5F9'; el.style.transform = 'translateY(0)'; el.style.boxShadow = '0 1px 4px rgba(0,0,0,0.04)'; el.style.background = '#fff'; }}
                  onClick={() => setPage('login')}
                >
                  <div style={{ width: 54, height: 54, borderRadius: 16, flexShrink: 0, background: mod.light, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26 }}>{mod.icon}</div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 16, color: '#0F172A', marginBottom: 5 }}>{mod.title}</div>
                    <div style={{ color: '#64748B', fontSize: 13, lineHeight: 1.6 }}>{mod.desc}</div>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════
          HOW IT WORKS
      ══════════════════════════════════ */}
      <section style={{ padding: '100px 5%', background: '#fff' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <FadeIn>
            <div style={{ textAlign: 'center', marginBottom: 60 }}>
              <div style={{ display: 'inline-block', background: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: 100, padding: '5px 16px', fontSize: 12, color: '#16A34A', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 16 }}>Process</div>
              <h2 style={{ fontSize: 'clamp(28px, 4vw, 46px)', fontWeight: 800, letterSpacing: '-1.5px', color: '#0F172A' }}>How It Works</h2>
            </div>
          </FadeIn>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
            {[
              { step: '01', icon: '&#x1F4E4;', title: 'Upload Scan', desc: 'Drag & drop your X-ray, ECG, or blood report image', color: '#2563EB', bg: '#EFF6FF', border: '#BFDBFE' },
              { step: '02', icon: '&#x26A1;', title: 'AI Analyzes', desc: 'LLaVA-Med processes with medical precision in 2-3 min', color: '#7C3AED', bg: '#F5F3FF', border: '#DDD6FE' },
              { step: '03', icon: '&#x1F4CB;', title: 'Get Report', desc: 'Detailed findings in Urdu & English instantly', color: '#059669', bg: '#F0FDF4', border: '#BBF7D0' },
              { step: '04', icon: '&#x1F468;&#x200D;&#x2695;&#xFE0F;', title: 'Doctor Reviews', desc: 'Certified physicians verify & approve your report', color: '#D97706', bg: '#FFFBEB', border: '#FDE68A' },
            ].map((s, i) => (
              <FadeIn key={i} delay={i * 0.1}>
                <div style={{ background: s.bg, border: `1.5px solid ${s.border}`, borderRadius: 20, padding: '32px 22px', textAlign: 'center', transition: 'all 0.3s', height: '100%' }}
                  onMouseEnter={e => { const el = e.currentTarget; el.style.transform = 'translateY(-6px)'; el.style.boxShadow = `0 20px 40px ${s.color}22`; }}
                  onMouseLeave={e => { const el = e.currentTarget; el.style.transform = 'translateY(0)'; el.style.boxShadow = 'none'; }}
                >
                  <div style={{ fontSize: 11, fontWeight: 800, color: s.color, letterSpacing: '0.12em', marginBottom: 16 }}>{s.step}</div>
                  <div style={{ width: 64, height: 64, borderRadius: 20, margin: '0 auto 18px', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, boxShadow: '0 4px 14px rgba(0,0,0,0.08)' }} dangerouslySetInnerHTML={{ __html: s.icon }} />
                  <div style={{ fontWeight: 700, fontSize: 17, color: '#0F172A', marginBottom: 10 }}>{s.title}</div>
                  <div style={{ color: '#64748B', fontSize: 13, lineHeight: 1.65 }}>{s.desc}</div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════
          COVERAGE — Pakistan Cities
      ══════════════════════════════════ */}
      <section style={{ padding: '80px 5%', background: 'linear-gradient(135deg, #EFF6FF 0%, #F5F3FF 100%)', borderTop: '1px solid #E2E8F0' }}>
        <FadeIn>
          <div style={{ maxWidth: 900, margin: '0 auto', textAlign: 'center' }}>
            <div style={{ fontSize: 36, marginBottom: 16 }}>&#x1F1F5;&#x1F1F0;</div>
            <h2 style={{ fontSize: 'clamp(24px, 3.5vw, 40px)', fontWeight: 800, letterSpacing: '-1.5px', color: '#0F172A', marginBottom: 12 }}>
              Serving All of Pakistan
            </h2>
            <p style={{ color: '#64748B', fontSize: 16, marginBottom: 36 }}>Free AI medical analysis available in every city, every village</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, justifyContent: 'center' }}>
              {cities.map((city, i) => (
                <div key={i} style={{ background: '#fff', border: '1.5px solid #BFDBFE', borderRadius: 100, padding: '8px 20px', fontSize: 14, color: '#1D4ED8', fontWeight: 600, boxShadow: '0 2px 8px rgba(37,99,235,0.1)', transition: 'all 0.2s' }}
                  onMouseEnter={e => { const el = e.currentTarget; el.style.background = '#EFF6FF'; el.style.transform = 'translateY(-2px)'; }}
                  onMouseLeave={e => { const el = e.currentTarget; el.style.background = '#fff'; el.style.transform = 'translateY(0)'; }}
                >{city}</div>
              ))}
              <div style={{ background: '#2563EB', border: '1.5px solid #2563EB', borderRadius: 100, padding: '8px 20px', fontSize: 14, color: '#fff', fontWeight: 600 }}>+ 200 more cities</div>
            </div>
          </div>
        </FadeIn>
      </section>

      {/* ══════════════════════════════════
          TESTIMONIALS
      ══════════════════════════════════ */}
      <section style={{ padding: '100px 5%', background: '#F8FAFC' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <FadeIn>
            <div style={{ textAlign: 'center', marginBottom: 60 }}>
              <div style={{ display: 'inline-block', background: '#FDF2F8', border: '1px solid #FBCFE8', borderRadius: 100, padding: '5px 16px', fontSize: 12, color: '#DB2777', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 16 }}>Testimonials</div>
              <h2 style={{ fontSize: 'clamp(28px, 4vw, 46px)', fontWeight: 800, letterSpacing: '-1.5px', color: '#0F172A' }}>Trusted by Doctors & Patients</h2>
            </div>
          </FadeIn>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
            {[
              { name: 'Dr. Ahmed Khan', role: 'Cardiologist, Lahore', text: 'The ECG analysis is remarkably accurate. It saves our team hours of manual review every single day.', avatar: '&#x1F468;&#x200D;&#x2695;&#xFE0F;', color: '#2563EB', bg: '#EFF6FF' },
              { name: 'Fatima Malik', role: 'Patient, Karachi', text: 'Got my X-ray analyzed in 3 minutes. The Urdu report was a complete game changer for our family.', avatar: '&#x1F469;', color: '#059669', bg: '#F0FDF4' },
              { name: 'Dr. Sara Hussain', role: 'Radiologist, Islamabad', text: 'LLaVA-Med integration is outstanding. I recommend MedCare AI to every rural clinic in Pakistan.', avatar: '&#x1F469;&#x200D;&#x2695;&#xFE0F;', color: '#7C3AED', bg: '#F5F3FF' },
            ].map((t, i) => (
              <FadeIn key={i} delay={i * 0.1}>
                <div style={{ background: '#fff', border: '1.5px solid #F1F5F9', borderRadius: 20, padding: '28px', transition: 'all 0.3s', boxShadow: '0 1px 4px rgba(0,0,0,0.04)', height: '100%', display: 'flex', flexDirection: 'column' }}
                  onMouseEnter={e => { const el = e.currentTarget; el.style.transform = 'translateY(-4px)'; el.style.boxShadow = '0 20px 40px rgba(0,0,0,0.08)'; }}
                  onMouseLeave={e => { const el = e.currentTarget; el.style.transform = 'translateY(0)'; el.style.boxShadow = '0 1px 4px rgba(0,0,0,0.04)'; }}
                >
                  <div style={{ color: '#F59E0B', fontSize: 16, marginBottom: 14, letterSpacing: 3 }}>&#9733;&#9733;&#9733;&#9733;&#9733;</div>
                  <p style={{ color: '#475569', fontSize: 14, lineHeight: 1.75, marginBottom: 22, fontStyle: 'italic', flex: 1 }}>"{t.text}"</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ width: 44, height: 44, borderRadius: '50%', background: t.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }} dangerouslySetInnerHTML={{ __html: t.avatar }} />
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 14, color: '#0F172A' }}>{t.name}</div>
                      <div style={{ color: '#94A3B8', fontSize: 12, marginTop: 2 }}>{t.role}</div>
                    </div>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════
          FAQ
      ══════════════════════════════════ */}
      <section style={{ padding: '100px 5%', background: '#fff' }}>
        <div style={{ maxWidth: 740, margin: '0 auto' }}>
          <FadeIn>
            <div style={{ textAlign: 'center', marginBottom: 56 }}>
              <div style={{ display: 'inline-block', background: '#FFFBEB', border: '1px solid #FDE68A', borderRadius: 100, padding: '5px 16px', fontSize: 12, color: '#D97706', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 16 }}>FAQ</div>
              <h2 style={{ fontSize: 'clamp(28px, 4vw, 46px)', fontWeight: 800, letterSpacing: '-1.5px', color: '#0F172A' }}>Frequently Asked Questions</h2>
            </div>
          </FadeIn>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {faqs.map((faq, i) => (
              <FadeIn key={i} delay={i * 0.08}>
                <div style={{ background: '#F8FAFC', border: `1.5px solid ${openFaq === i ? '#BFDBFE' : '#F1F5F9'}`, borderRadius: 16, overflow: 'hidden', transition: 'all 0.3s', boxShadow: openFaq === i ? '0 4px 20px rgba(37,99,235,0.08)' : 'none' }}>
                  <button style={{ width: '100%', padding: '20px 24px', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16 }}
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  >
                    <span style={{ fontWeight: 700, fontSize: 15, color: '#0F172A', textAlign: 'left' }}>{faq.q}</span>
                    <span style={{ fontSize: 20, color: '#2563EB', flexShrink: 0, transition: 'transform 0.3s', transform: openFaq === i ? 'rotate(45deg)' : 'rotate(0)' }}>+</span>
                  </button>
                  {openFaq === i && (
                    <div style={{ padding: '0 24px 20px', color: '#64748B', fontSize: 14, lineHeight: 1.7 }}>{faq.a}</div>
                  )}
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════
          COMPARISON TABLE
      ══════════════════════════════════ */}
      <section style={{ padding: '100px 5%', background: '#F8FAFC' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <FadeIn>
            <div style={{ textAlign: 'center', marginBottom: 56 }}>
              <div style={{ display: 'inline-block', background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 100, padding: '5px 16px', fontSize: 12, color: '#DC2626', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 16 }}>Why MedCare AI</div>
              <h2 style={{ fontSize: 'clamp(26px, 4vw, 44px)', fontWeight: 800, letterSpacing: '-1.5px', color: '#0F172A', marginBottom: 12 }}>Traditional vs AI-Powered Healthcare</h2>
              <p style={{ color: '#64748B', fontSize: 16 }}>See why 10,000+ Pakistanis switched to MedCare AI</p>
            </div>
          </FadeIn>

          <FadeIn delay={0.1}>
            <div style={{ background: '#fff', borderRadius: 24, border: '1.5px solid #F1F5F9', overflow: 'hidden', boxShadow: '0 8px 32px rgba(0,0,0,0.06)' }}>
              {/* Header row */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', background: 'linear-gradient(135deg, #0F172A, #1E293B)' }}>
                <div style={{ padding: '20px 24px', fontSize: 14, color: '#64748B', fontWeight: 600 }}>Feature</div>
                <div style={{ padding: '20px 24px', fontSize: 14, color: '#94A3B8', fontWeight: 700, textAlign: 'center', borderLeft: '1px solid rgba(255,255,255,0.06)' }}>Traditional Hospital</div>
                <div style={{ padding: '20px 24px', fontSize: 14, color: '#60A5FA', fontWeight: 800, textAlign: 'center', borderLeft: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                  <span>&#x1F3E5;</span> MedCare AI
                  <span style={{ background: '#2563EB', color: '#fff', fontSize: 10, padding: '2px 8px', borderRadius: 100, fontWeight: 700 }}>RECOMMENDED</span>
                </div>
              </div>

              {/* Rows */}
              {[
                { feature: 'Report Time', traditional: '2–5 days', medcare: '2–3 minutes', win: true },
                { feature: 'Cost per Analysis', traditional: 'Rs. 2,000–10,000', medcare: 'Completely Free', win: true },
                { feature: 'Urdu Reports', traditional: 'Rarely available', medcare: 'Always included', win: true },
                { feature: 'Available 24/7', traditional: 'No (working hours)', medcare: 'Yes, always', win: true },
                { feature: 'Doctor Review', traditional: 'Yes', medcare: 'Yes (certified)', win: false },
                { feature: 'Rural Access', traditional: 'Very limited', medcare: 'Anywhere in Pakistan', win: true },
                { feature: 'AI Accuracy', traditional: 'Human only', medcare: 'LLaVA-Med (Nature Medicine)', win: true },
              ].map((row, i) => (
                <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', borderTop: '1px solid #F1F5F9', background: i % 2 === 0 ? '#fff' : '#FAFAFA' }}>
                  <div style={{ padding: '16px 24px', fontSize: 14, color: '#374151', fontWeight: 600 }}>{row.feature}</div>
                  <div style={{ padding: '16px 24px', fontSize: 14, color: '#9CA3AF', textAlign: 'center', borderLeft: '1px solid #F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                    {row.win && <span style={{ color: '#EF4444', fontSize: 16 }}>&#x2717;</span>}
                    {row.traditional}
                  </div>
                  <div style={{ padding: '16px 24px', fontSize: 14, color: '#16A34A', textAlign: 'center', borderLeft: '1px solid #F1F5F9', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                    <span style={{ color: '#16A34A', fontSize: 16 }}>&#x2713;</span>
                    {row.medcare}
                  </div>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ══════════════════════════════════
          TRUSTED BY / PARTNER LOGOS
      ══════════════════════════════════ */}
      <section style={{ padding: '72px 5%', background: '#fff', borderTop: '1px solid #F1F5F9', borderBottom: '1px solid #F1F5F9' }}>
        <FadeIn>
          <div style={{ maxWidth: 1000, margin: '0 auto', textAlign: 'center' }}>
            <p style={{ color: '#94A3B8', fontSize: 13, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 36 }}>
              Powered by world-class technology
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, justifyContent: 'center', alignItems: 'center' }}>
              {[
                { name: 'Microsoft Research', icon: '&#x1F4BB;', color: '#0078D4', bg: '#F0F8FF' },
                { name: 'Nature Medicine', icon: '&#x1F52C;', color: '#16A34A', bg: '#F0FDF4' },
                { name: 'Google Cloud', icon: '&#x2601;&#xFE0F;', color: '#4285F4', bg: '#EFF6FF' },
                { name: 'LLaVA-Med AI', icon: '&#x1F9E0;', color: '#7C3AED', bg: '#F5F3FF' },
                { name: 'Atomcamp', icon: '&#x1F680;', color: '#EA580C', bg: '#FFF7ED' },
                { name: 'GitHub', icon: '&#x1F431;', color: '#24292F', bg: '#F6F8FA' },
              ].map((partner, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, background: partner.bg, border: `1.5px solid ${partner.color}20`, borderRadius: 14, padding: '12px 20px', transition: 'all 0.25s', cursor: 'default' }}
                  onMouseEnter={e => { const el = e.currentTarget; el.style.transform = 'translateY(-3px)'; el.style.boxShadow = `0 8px 24px ${partner.color}18`; el.style.borderColor = `${partner.color}50`; }}
                  onMouseLeave={e => { const el = e.currentTarget; el.style.transform = 'translateY(0)'; el.style.boxShadow = 'none'; el.style.borderColor = `${partner.color}20`; }}
                >
                  <span style={{ fontSize: 22 }} dangerouslySetInnerHTML={{ __html: partner.icon }} />
                  <span style={{ fontWeight: 700, fontSize: 14, color: partner.color }}>{partner.name}</span>
                </div>
              ))}
            </div>
          </div>
        </FadeIn>
      </section>

      {/* ══════════════════════════════════
          APP STORE BADGES
      ══════════════════════════════════ */}
      <section style={{ padding: '88px 5%', background: 'linear-gradient(155deg, #0F172A 0%, #1E293B 60%, #0F172A 100%)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '80%', height: '80%', borderRadius: '50%', background: 'radial-gradient(circle, rgba(37,99,235,0.08) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <FadeIn>
          <div style={{ maxWidth: 800, margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 1 }}>
            <div style={{ fontSize: 44, marginBottom: 16 }}>&#x1F4F1;</div>
            <h2 style={{ fontSize: 'clamp(24px, 3.5vw, 40px)', fontWeight: 800, letterSpacing: '-1.5px', color: '#fff', marginBottom: 12 }}>
              Take MedCare AI Everywhere
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: 16, marginBottom: 40, lineHeight: 1.7 }}>
              Access AI-powered health analysis from your smartphone.<br />Available on iOS & Android — always free.
            </p>

            <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 48 }}>
              {/* App Store */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, background: '#000', border: '1.5px solid rgba(255,255,255,0.15)', borderRadius: 16, padding: '14px 28px', cursor: 'pointer', transition: 'all 0.25s', minWidth: 190 }}
                onMouseEnter={e => { const el = e.currentTarget; el.style.transform = 'translateY(-3px)'; el.style.boxShadow = '0 12px 32px rgba(0,0,0,0.4)'; el.style.borderColor = 'rgba(255,255,255,0.3)'; }}
                onMouseLeave={e => { const el = e.currentTarget; el.style.transform = 'translateY(0)'; el.style.boxShadow = 'none'; el.style.borderColor = 'rgba(255,255,255,0.15)'; }}
              >
                <div style={{ fontSize: 32, lineHeight: 1 }}>&#xF8FF;</div>
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.6)', fontWeight: 500 }}>Download on the</div>
                  <div style={{ fontSize: 18, color: '#fff', fontWeight: 800, lineHeight: 1.2 }}>App Store</div>
                </div>
              </div>

              {/* Google Play */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, background: '#000', border: '1.5px solid rgba(255,255,255,0.15)', borderRadius: 16, padding: '14px 28px', cursor: 'pointer', transition: 'all 0.25s', minWidth: 190 }}
                onMouseEnter={e => { const el = e.currentTarget; el.style.transform = 'translateY(-3px)'; el.style.boxShadow = '0 12px 32px rgba(0,0,0,0.4)'; el.style.borderColor = 'rgba(255,255,255,0.3)'; }}
                onMouseLeave={e => { const el = e.currentTarget; el.style.transform = 'translateY(0)'; el.style.boxShadow = 'none'; el.style.borderColor = 'rgba(255,255,255,0.15)'; }}
              >
                <div style={{ fontSize: 32, lineHeight: 1 }}>&#x25B6;&#xFE0F;</div>
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.6)', fontWeight: 500 }}>Get it on</div>
                  <div style={{ fontSize: 18, color: '#fff', fontWeight: 800, lineHeight: 1.2 }}>Google Play</div>
                </div>
              </div>
            </div>

            {/* Phone mockup strip */}
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', alignItems: 'flex-end' }}>
              {[
                { label: 'X-Ray Analysis', color: '#2563EB', bg: '#1E3A5F', icon: '&#x1FAC1;' },
                { label: 'ECG Analyzer', color: '#DC2626', bg: '#3F1212', icon: '&#x1F493;' },
                { label: 'Blood Tests', color: '#059669', bg: '#0C2E1F', icon: '&#x1F9EA;' },
              ].map((screen, i) => (
                <div key={i} style={{ background: screen.bg, border: `1.5px solid ${screen.color}40`, borderRadius: 18, padding: '20px 16px', width: 110, textAlign: 'center', transform: i === 1 ? 'scale(1.08)' : 'scale(0.95)', transition: 'all 0.3s', boxShadow: i === 1 ? `0 12px 32px ${screen.color}30` : 'none' }}>
                  <div style={{ fontSize: 28, marginBottom: 8 }} dangerouslySetInnerHTML={{ __html: screen.icon }} />
                  <div style={{ fontSize: 11, color: '#fff', fontWeight: 700, lineHeight: 1.3 }}>{screen.label}</div>
                  <div style={{ marginTop: 10, height: 4, background: `linear-gradient(90deg, ${screen.color}, ${screen.color}60)`, borderRadius: 4 }} />
                  <div style={{ marginTop: 4, height: 4, background: `${screen.color}30`, borderRadius: 4, width: '60%', margin: '4px auto 0' }} />
                </div>
              ))}
            </div>
          </div>
        </FadeIn>
      </section>

      {/* ══════════════════════════════════
          CTA
      ══════════════════════════════════ */}
      <section style={{ padding: '80px 5% 100px', background: '#F8FAFC' }}>
        <FadeIn>
          <div style={{ maxWidth: 820, margin: '0 auto', textAlign: 'center', background: 'linear-gradient(135deg, #1D4ED8 0%, #1E1B4B 100%)', borderRadius: 28, padding: '72px 40px', position: 'relative', overflow: 'hidden', boxShadow: '0 32px 80px rgba(37,99,235,0.25)' }}>
            <div style={{ position: 'absolute', top: -80, right: -80, width: 300, height: 300, borderRadius: '50%', background: 'rgba(255,255,255,0.05)', pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', bottom: -80, left: -80, width: 300, height: 300, borderRadius: '50%', background: 'rgba(255,255,255,0.04)', pointerEvents: 'none' }} />
            <div style={{ position: 'relative', zIndex: 1 }}>
              <div style={{ fontSize: 52, marginBottom: 18 }}>&#x1F1F5;&#x1F1F0;</div>
              <h2 style={{ fontSize: 'clamp(26px, 4vw, 44px)', fontWeight: 800, letterSpacing: '-1.5px', color: '#fff', marginBottom: 14 }}>Healthcare for Every Pakistani</h2>
              <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: 17, marginBottom: 36, lineHeight: 1.7 }}>
                Join 10,000+ Pakistanis getting AI-powered medical insights.<br />No cost. No barriers. Always free.
              </p>
              <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
                <button onClick={() => setPage('login')} style={{ background: '#fff', border: 'none', color: '#1D4ED8', padding: '15px 36px', borderRadius: 14, cursor: 'pointer', fontSize: 17, fontWeight: 800, boxShadow: '0 8px 24px rgba(0,0,0,0.2)', transition: 'all 0.25s' }}
                  onMouseEnter={e => { const el = e.currentTarget; el.style.transform = 'translateY(-2px)'; el.style.boxShadow = '0 16px 40px rgba(0,0,0,0.3)'; }}
                  onMouseLeave={e => { const el = e.currentTarget; el.style.transform = 'translateY(0)'; el.style.boxShadow = '0 8px 24px rgba(0,0,0,0.2)'; }}
                >Start Free Analysis &#8594;</button>
                <button style={{ background: 'rgba(255,255,255,0.1)', border: '1.5px solid rgba(255,255,255,0.25)', color: '#fff', padding: '15px 28px', borderRadius: 14, cursor: 'pointer', fontSize: 16, fontWeight: 600, transition: 'all 0.25s' }}
                  onMouseEnter={e => { const el = e.currentTarget; el.style.background = 'rgba(255,255,255,0.18)'; }}
                  onMouseLeave={e => { const el = e.currentTarget; el.style.background = 'rgba(255,255,255,0.1)'; }}
                >&#9654; Watch Demo</button>
              </div>
            </div>
          </div>
        </FadeIn>
      </section>

      {/* ══════════════════════════════════
          FOOTER
      ══════════════════════════════════ */}
      <footer style={{ background: '#0F172A', padding: '56px 5% 32px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          {/* Top */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 40, marginBottom: 48, paddingBottom: 40, borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg, #2563EB, #1D4ED8)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>&#x1F3E5;</div>
                <span style={{ fontWeight: 800, fontSize: 16, color: '#fff' }}>MedCare <span style={{ color: '#60A5FA' }}>AI</span></span>
              </div>
              <p style={{ color: '#475569', fontSize: 13, lineHeight: 1.7, maxWidth: 200 }}>Pakistan's first AI-powered medical platform. Free for everyone.</p>
            </div>
            {[
              { title: 'Product', links: ['X-Ray Analysis', 'ECG Analyzer', 'Blood Tests', 'All Modules'] },
              { title: 'Company', links: ['About Us', 'Blog', 'Careers', 'Contact'] },
              { title: 'Legal', links: ['Privacy Policy', 'Terms of Use', 'Data Policy', 'HIPAA'] },
            ].map((col, i) => (
              <div key={i}>
                <div style={{ fontWeight: 700, fontSize: 14, color: '#fff', marginBottom: 16 }}>{col.title}</div>
                {col.links.map(l => (
                  <div key={l} style={{ color: '#475569', fontSize: 13, marginBottom: 10, cursor: 'pointer', transition: 'color 0.2s' }}
                    onMouseEnter={e => { (e.target as HTMLElement).style.color = '#94A3B8'; }}
                    onMouseLeave={e => { (e.target as HTMLElement).style.color = '#475569'; }}
                  >{l}</div>
                ))}
              </div>
            ))}
          </div>
          {/* Bottom */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
            <p style={{ color: '#334155', fontSize: 13 }}>&#169; 2026 MedCare AI. Built with &#10084;&#65039; by Syed Hassan Tayyab — Atomcamp Cohort 15</p>
            <div style={{ display: 'flex', gap: 12 }}>
              {['&#x1F426;', '&#x1F517;', '&#x1F4F1;'].map((icon, i) => (
                <div key={i} style={{ width: 36, height: 36, borderRadius: 8, background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.2s' }}
                  dangerouslySetInnerHTML={{ __html: icon }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.1)'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.05)'; }}
                />
              ))}
            </div>
          </div>
        </div>
      </footer>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        * { margin: 0; padding: 0; box-sizing: border-box; }
        html { scroll-behavior: smooth; }
        @keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.4;transform:scale(0.75)} }
        @keyframes slowFloat { 0%,100%{transform:translateY(0px)} 50%{transform:translateY(-20px)} }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: #F8FAFC; }
        ::-webkit-scrollbar-thumb { background: #CBD5E1; border-radius: 10px; }
        @media (max-width: 768px) {
          nav { padding: 0 4% !important; }
          section { padding: 64px 4% !important; }
          h1 { letter-spacing: -1.5px !important; }
          footer { padding: 48px 4% 28px !important; }
        }
        @media (max-width: 480px) {
          section { padding: 48px 4% !important; }
          h2 { letter-spacing: -1px !important; }
        }
      `}</style>
    </div>
  );
}

export default App;