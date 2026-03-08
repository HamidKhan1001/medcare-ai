import React, { useState, useEffect, useRef } from 'react';
import Login from './pages/Login';
import PatientDashboard from './pages/PatientDashboard';
import DoctorDashboard from './pages/DoctorDashboard';
import { isLoggedIn, getUser, logout } from './services/api';

const Counter = ({ end, suffix = '' }: { end: number; suffix?: string }) => {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const observer = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !started) {
        setStarted(true);
        let s = 0; const step = Math.ceil(end / 50);
        const t = setInterval(() => { s += step; if (s >= end) { setCount(end); clearInterval(t); } else setCount(s); }, 25);
      }
    }, { threshold: 0.5 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [end, started]);
  return <span ref={ref}>{count}{suffix}</span>;
};

function App() {
  const [page, setPage] = useState('home');
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [scrolled, setScrolled] = useState(false);
  const [activeModule, setActiveModule] = useState(0);

  useEffect(() => {
    if (isLoggedIn()) { const u = getUser(); if (u) { setCurrentUser(u); setPage(u.role === 'doctor' ? 'doctor' : 'dashboard'); } }
  }, []);
  useEffect(() => {
    const s = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', s);
    return () => window.removeEventListener('scroll', s);
  }, []);
  useEffect(() => {
    const t = setInterval(() => setActiveModule(p => (p + 1) % 9), 2000);
    return () => clearInterval(t);
  }, []);

  const handleLogin = (u: any) => { setCurrentUser(u); setPage(u.role === 'doctor' ? 'doctor' : 'dashboard'); };
  const handleLogout = () => { logout(); setCurrentUser(null); setPage('home'); };

  if (page === 'login') return <Login onLogin={handleLogin} />;
  if (page === 'dashboard') return <PatientDashboard user={currentUser} onLogout={handleLogout} />;
  if (page === 'doctor') return <DoctorDashboard user={currentUser} onLogout={handleLogout} />;

  const modules = [
    { icon: '🫁', title: 'X-Ray Analysis', desc: 'Chest X-ray, MRI & CT scan analysis', color: '#2563EB', light: '#DBEAFE' },
    { icon: '🦴', title: 'Bone Scan', desc: 'Fracture & bone disease detection', color: '#7C3AED', light: '#EDE9FE' },
    { icon: '💓', title: 'ECG Analyzer', desc: 'Heart rhythm & cardiac reports', color: '#DC2626', light: '#FEE2E2' },
    { icon: '🧪', title: 'Blood Tests', desc: 'Complete blood report analysis', color: '#059669', light: '#D1FAE5' },
    { icon: '🧠', title: 'Mental Health', desc: 'PHQ-9 & GAD-7 screening', color: '#D97706', light: '#FEF3C7' },
    { icon: '🔍', title: 'Diagnosis AI', desc: 'Symptom-based diagnosis', color: '#0891B2', light: '#CFFAFE' },
    { icon: '💊', title: 'Prescription', desc: 'Handwritten prescription reader', color: '#DB2777', light: '#FCE7F3' },
    { icon: '📊', title: 'Vital Signs', desc: 'BP, sugar & oxygen monitoring', color: '#0D9488', light: '#CCFBF1' },
    { icon: '🚨', title: 'Emergency Aid', desc: 'Instant first aid guidance', color: '#EA580C', light: '#FFEDD5' },
  ];

  return (
    <div style={{ fontFamily: "'Plus Jakarta Sans', 'DM Sans', -apple-system, sans-serif", background: '#FFFFFF', color: '#0F172A', overflowX: 'hidden' }}>

      {/* ═══ NAVBAR ═══ */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
        height: 68, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 5%',
        background: scrolled ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0)',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(0,0,0,0.06)' : 'none',
        transition: 'all 0.3s ease',
        boxShadow: scrolled ? '0 1px 20px rgba(0,0,0,0.06)' : 'none',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 40, height: 40, borderRadius: 12, background: 'linear-gradient(135deg, #2563EB, #1D4ED8)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, boxShadow: '0 4px 14px rgba(37,99,235,0.4)' }}>🏥</div>
          <span style={{ fontWeight: 800, fontSize: 18, color: '#0F172A', letterSpacing: '-0.5px' }}>
            MedCare <span style={{ color: '#2563EB' }}>AI</span>
          </span>
        </div>

        {/* Desktop nav */}
        <div className="desktop-nav" style={{ display: 'flex', gap: 8 }}>
          <button onClick={() => setPage('login')} style={{ background: 'transparent', border: '1.5px solid #E2E8F0', color: '#475569', padding: '9px 22px', borderRadius: 10, cursor: 'pointer', fontSize: 14, fontWeight: 600, transition: 'all 0.2s' }}
            onMouseEnter={e => { const el = e.currentTarget; el.style.borderColor = '#2563EB'; el.style.color = '#2563EB'; el.style.background = '#EFF6FF'; }}
            onMouseLeave={e => { const el = e.currentTarget; el.style.borderColor = '#E2E8F0'; el.style.color = '#475569'; el.style.background = 'transparent'; }}
          >Login</button>
          <button onClick={() => setPage('login')} style={{ background: 'linear-gradient(135deg, #2563EB, #1D4ED8)', border: 'none', color: '#fff', padding: '9px 24px', borderRadius: 10, cursor: 'pointer', fontSize: 14, fontWeight: 700, boxShadow: '0 4px 14px rgba(37,99,235,0.4)', transition: 'all 0.2s' }}
            onMouseEnter={e => { const el = e.currentTarget; el.style.transform = 'translateY(-1px)'; el.style.boxShadow = '0 8px 20px rgba(37,99,235,0.5)'; }}
            onMouseLeave={e => { const el = e.currentTarget; el.style.transform = 'translateY(0)'; el.style.boxShadow = '0 4px 14px rgba(37,99,235,0.4)'; }}
          >Get Started →</button>
        </div>
      </nav>

      {/* ═══ HERO ═══ */}
      <section style={{ minHeight: '100vh', background: 'linear-gradient(160deg, #EFF6FF 0%, #FFFFFF 50%, #F0FDF4 100%)', display: 'flex', alignItems: 'center', padding: '100px 5% 60px', position: 'relative', overflow: 'hidden' }}>

        {/* Decorative blobs */}
        <div style={{ position: 'absolute', top: '5%', right: '-5%', width: '45vw', height: '45vw', maxWidth: 600, maxHeight: 600, borderRadius: '50%', background: 'radial-gradient(circle, rgba(37,99,235,0.08) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '5%', left: '-5%', width: '35vw', height: '35vw', maxWidth: 450, maxHeight: 450, borderRadius: '50%', background: 'radial-gradient(circle, rgba(16,185,129,0.07) 0%, transparent 70%)', pointerEvents: 'none' }} />
        {/* Dots pattern */}
        <div style={{ position: 'absolute', top: '15%', right: '5%', opacity: 0.35, pointerEvents: 'none' }}>
          {[...Array(6)].map((_, row) => (
            <div key={row} style={{ display: 'flex', gap: 16, marginBottom: 16 }}>
              {[...Array(6)].map((_, col) => (
                <div key={col} style={{ width: 4, height: 4, borderRadius: '50%', background: '#2563EB' }} />
              ))}
            </div>
          ))}
        </div>

        <div style={{ position: 'relative', zIndex: 1, width: '100%', display: 'flex', alignItems: 'center', gap: '5%', flexWrap: 'wrap' }}>

          {/* LEFT TEXT */}
          <div style={{ flex: '1 1 420px', maxWidth: 600 }}>
            {/* Badge */}
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#EFF6FF', border: '1px solid #BFDBFE', borderRadius: 100, padding: '6px 16px', marginBottom: 28 }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#2563EB', display: 'inline-block', animation: 'pulse 2s infinite' }} />
              <span style={{ fontSize: 13, color: '#1D4ED8', fontWeight: 700 }}>🇵🇰 Pakistan's First AI Medical Platform</span>
            </div>

            <h1 style={{ fontSize: 'clamp(38px, 5.5vw, 72px)', fontWeight: 800, lineHeight: 1.05, letterSpacing: '-2px', marginBottom: 22, color: '#0F172A' }}>
              Medical AI For<br />
              <span style={{ background: 'linear-gradient(135deg, #2563EB 0%, #7C3AED 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                Every Pakistani
              </span>
            </h1>

            <p style={{ fontSize: 'clamp(15px, 1.8vw, 19px)', color: '#64748B', lineHeight: 1.75, marginBottom: 36, maxWidth: 500 }}>
              AI-powered X-ray analysis, ECG reading & blood test interpretation.
              <strong style={{ color: '#0F172A' }}> Free. Fast.</strong> In Urdu & English.
            </p>

            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 48 }}>
              <button onClick={() => setPage('login')} style={{ background: 'linear-gradient(135deg, #2563EB, #1D4ED8)', border: 'none', color: '#fff', padding: '14px 32px', borderRadius: 12, cursor: 'pointer', fontSize: 16, fontWeight: 700, boxShadow: '0 8px 24px rgba(37,99,235,0.4)', transition: 'all 0.25s' }}
                onMouseEnter={e => { const el = e.currentTarget; el.style.transform = 'translateY(-2px)'; el.style.boxShadow = '0 14px 32px rgba(37,99,235,0.5)'; }}
                onMouseLeave={e => { const el = e.currentTarget; el.style.transform = 'translateY(0)'; el.style.boxShadow = '0 8px 24px rgba(37,99,235,0.4)'; }}
              >Start Free Analysis →</button>
              <button style={{ background: '#fff', border: '1.5px solid #E2E8F0', color: '#475569', padding: '14px 28px', borderRadius: 12, cursor: 'pointer', fontSize: 16, fontWeight: 600, boxShadow: '0 2px 8px rgba(0,0,0,0.06)', transition: 'all 0.25s' }}
                onMouseEnter={e => { const el = e.currentTarget; el.style.borderColor = '#2563EB'; el.style.color = '#2563EB'; el.style.transform = 'translateY(-2px)'; }}
                onMouseLeave={e => { const el = e.currentTarget; el.style.borderColor = '#E2E8F0'; el.style.color = '#475569'; el.style.transform = 'translateY(0)'; }}
              >▶ Watch Demo</button>
            </div>

            {/* Trust badges */}
            <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
              {[
                { icon: '🔒', text: 'Secure & Private' },
                { icon: '⚡', text: '2-3 min results' },
                { icon: '🌐', text: 'Urdu & English' },
                { icon: '💚', text: 'Always Free' },
              ].map((b, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ fontSize: 16 }}>{b.icon}</span>
                  <span style={{ fontSize: 13, color: '#94A3B8', fontWeight: 500 }}>{b.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT — App Mockup */}
          <div style={{ flex: '1 1 320px', maxWidth: 400 }}>
            <div style={{ background: '#fff', borderRadius: 24, boxShadow: '0 32px 80px rgba(0,0,0,0.12), 0 0 0 1px rgba(0,0,0,0.04)', overflow: 'hidden', border: '1px solid #F1F5F9' }}>
              {/* Mac window chrome */}
              <div style={{ background: '#F8FAFC', padding: '14px 18px', borderBottom: '1px solid #F1F5F9', display: 'flex', alignItems: 'center', gap: 7 }}>
                {['#EF4444', '#F59E0B', '#22C55E'].map((c, i) => <div key={i} style={{ width: 11, height: 11, borderRadius: '50%', background: c }} />)}
                <div style={{ flex: 1, margin: '0 10px', background: '#EFF6FF', borderRadius: 6, padding: '4px 10px', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ fontSize: 11, color: '#93C5FD' }}>🔒</span>
                  <span style={{ fontSize: 11, color: '#64748B', fontFamily: 'monospace' }}>medcareai.app</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                  <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#22C55E', animation: 'pulse 2s infinite' }} />
                  <span style={{ fontSize: 11, color: '#22C55E', fontWeight: 700 }}>LIVE</span>
                </div>
              </div>

              {/* Module list */}
              <div style={{ padding: '18px' }}>
                <div style={{ fontSize: 11, color: '#94A3B8', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 12 }}>AI MODULES</div>
                {modules.map((mod, i) => (
                  <div key={i} style={{
                    display: 'flex', alignItems: 'center', gap: 10,
                    padding: '10px 12px', borderRadius: 12, marginBottom: 4,
                    transition: 'all 0.35s ease',
                    background: activeModule === i ? mod.light : 'transparent',
                    border: `1px solid ${activeModule === i ? mod.color + '30' : 'transparent'}`,
                    transform: activeModule === i ? 'translateX(6px)' : 'translateX(0)',
                  }}>
                    <span style={{ fontSize: 20, width: 30, textAlign: 'center', flexShrink: 0 }}>{mod.icon}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: 700, color: activeModule === i ? mod.color : '#475569' }}>{mod.title}</div>
                      {activeModule === i && <div style={{ fontSize: 11, color: '#64748B', marginTop: 1 }}>{mod.desc}</div>}
                    </div>
                    {activeModule === i && (
                      <div style={{ width: 8, height: 8, borderRadius: '50%', background: mod.color, flexShrink: 0 }} />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ STATS ═══ */}
      <section style={{ padding: '64px 5%', background: '#0F172A' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 40, textAlign: 'center' }}>
          {[
            { num: 9, suffix: '', label: 'AI Modules', icon: '🤖', color: '#60A5FA' },
            { num: 3, suffix: '+', label: 'AI Models', icon: '🧬', color: '#34D399' },
            { num: 24, suffix: '/7', label: 'Always Available', icon: '⚡', color: '#FBBF24' },
            { num: 100, suffix: '%', label: 'Free for Patients', icon: '💚', color: '#F472B6' },
          ].map((s, i) => (
            <div key={i}>
              <div style={{ fontSize: 32, marginBottom: 8 }}>{s.icon}</div>
              <div style={{ fontSize: 48, fontWeight: 800, letterSpacing: '-2px', color: s.color, lineHeight: 1 }}>
                <Counter end={s.num} suffix={s.suffix} />
              </div>
              <div style={{ color: '#94A3B8', fontSize: 14, marginTop: 8, fontWeight: 500 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ MODULES GRID ═══ */}
      <section style={{ padding: '100px 5%', background: '#F8FAFC' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 60 }}>
            <div style={{ display: 'inline-block', background: '#EFF6FF', border: '1px solid #BFDBFE', borderRadius: 100, padding: '5px 16px', fontSize: 12, color: '#2563EB', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 16 }}>Capabilities</div>
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 46px)', fontWeight: 800, letterSpacing: '-1.5px', color: '#0F172A', marginBottom: 12 }}>9 Medical AI Modules</h2>
            <p style={{ color: '#64748B', fontSize: 17, maxWidth: 480, margin: '0 auto' }}>Powered by LLaVA-Med — Nature Medicine 2024</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
            {modules.map((mod, i) => (
              <div key={i} style={{ background: '#fff', border: '1.5px solid #F1F5F9', borderRadius: 20, padding: '28px', cursor: 'pointer', transition: 'all 0.3s', display: 'flex', alignItems: 'flex-start', gap: 18, boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}
                onMouseEnter={e => { const el = e.currentTarget; el.style.borderColor = mod.color + '50'; el.style.transform = 'translateY(-4px)'; el.style.boxShadow = `0 20px 40px ${mod.color}20`; el.style.background = mod.light + 'AA'; }}
                onMouseLeave={e => { const el = e.currentTarget; el.style.borderColor = '#F1F5F9'; el.style.transform = 'translateY(0)'; el.style.boxShadow = '0 1px 4px rgba(0,0,0,0.04)'; el.style.background = '#fff'; }}
                onClick={() => setPage('login')}
              >
                <div style={{ width: 56, height: 56, borderRadius: 16, flexShrink: 0, background: mod.light, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26 }}>{mod.icon}</div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 16, color: '#0F172A', marginBottom: 5 }}>{mod.title}</div>
                  <div style={{ color: '#64748B', fontSize: 13, lineHeight: 1.6 }}>{mod.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ HOW IT WORKS ═══ */}
      <section style={{ padding: '100px 5%', background: '#fff' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 60 }}>
            <div style={{ display: 'inline-block', background: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: 100, padding: '5px 16px', fontSize: 12, color: '#16A34A', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 16 }}>Process</div>
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 46px)', fontWeight: 800, letterSpacing: '-1.5px', color: '#0F172A' }}>How It Works</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: 16 }}>
            {[
              { step: '01', icon: '📤', title: 'Upload Scan', desc: 'Drag & drop your X-ray, ECG, or blood report', color: '#2563EB', bg: '#EFF6FF', border: '#BFDBFE' },
              { step: '02', icon: '⚡', title: 'AI Analyzes', desc: 'LLaVA-Med processes with medical precision in 2-3 min', color: '#7C3AED', bg: '#F5F3FF', border: '#DDD6FE' },
              { step: '03', icon: '📋', title: 'Get Report', desc: 'Detailed findings in Urdu & English instantly', color: '#059669', bg: '#F0FDF4', border: '#BBF7D0' },
              { step: '04', icon: '👨‍⚕️', title: 'Doctor Reviews', desc: 'Certified physicians verify & approve the report', color: '#D97706', bg: '#FFFBEB', border: '#FDE68A' },
            ].map((s, i) => (
              <div key={i} style={{ background: s.bg, border: `1.5px solid ${s.border}`, borderRadius: 20, padding: '32px 24px', textAlign: 'center', transition: 'all 0.3s', cursor: 'default' }}
                onMouseEnter={e => { const el = e.currentTarget; el.style.transform = 'translateY(-6px)'; el.style.boxShadow = `0 20px 40px ${s.color}20`; }}
                onMouseLeave={e => { const el = e.currentTarget; el.style.transform = 'translateY(0)'; el.style.boxShadow = 'none'; }}
              >
                <div style={{ fontSize: 11, fontWeight: 800, color: s.color, letterSpacing: '0.12em', marginBottom: 18 }}>{s.step}</div>
                <div style={{ width: 68, height: 68, borderRadius: 20, margin: '0 auto 20px', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 30, boxShadow: '0 4px 14px rgba(0,0,0,0.08)' }}>{s.icon}</div>
                <div style={{ fontWeight: 700, fontSize: 17, color: '#0F172A', marginBottom: 10 }}>{s.title}</div>
                <div style={{ color: '#64748B', fontSize: 13, lineHeight: 1.65 }}>{s.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ TESTIMONIALS ═══ */}
      <section style={{ padding: '100px 5%', background: '#F8FAFC' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 60 }}>
            <div style={{ display: 'inline-block', background: '#FDF2F8', border: '1px solid #FBCFE8', borderRadius: 100, padding: '5px 16px', fontSize: 12, color: '#DB2777', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 16 }}>Testimonials</div>
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 46px)', fontWeight: 800, letterSpacing: '-1.5px', color: '#0F172A' }}>Trusted by Doctors & Patients</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
            {[
              { name: 'Dr. Ahmed Khan', role: 'Cardiologist, Lahore', text: 'The ECG analysis is remarkably accurate. Saves hours of manual review every day.', avatar: '👨‍⚕️', color: '#2563EB', bg: '#EFF6FF' },
              { name: 'Fatima Malik', role: 'Patient, Karachi', text: 'Got my X-ray analyzed in 3 minutes. The Urdu report was a complete game changer for my family.', avatar: '👩', color: '#059669', bg: '#F0FDF4' },
              { name: 'Dr. Sara Hussain', role: 'Radiologist, Islamabad', text: 'LLaVA-Med integration is impressive. Highly recommend for rural clinics across Pakistan.', avatar: '👩‍⚕️', color: '#7C3AED', bg: '#F5F3FF' },
            ].map((t, i) => (
              <div key={i} style={{ background: '#fff', border: '1.5px solid #F1F5F9', borderRadius: 20, padding: '28px', transition: 'all 0.3s', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}
                onMouseEnter={e => { const el = e.currentTarget; el.style.transform = 'translateY(-4px)'; el.style.boxShadow = '0 20px 40px rgba(0,0,0,0.08)'; el.style.borderColor = '#E2E8F0'; }}
                onMouseLeave={e => { const el = e.currentTarget; el.style.transform = 'translateY(0)'; el.style.boxShadow = '0 1px 4px rgba(0,0,0,0.04)'; el.style.borderColor = '#F1F5F9'; }}
              >
                <div style={{ color: '#F59E0B', fontSize: 17, marginBottom: 14, letterSpacing: 2 }}>★★★★★</div>
                <p style={{ color: '#475569', fontSize: 14, lineHeight: 1.75, marginBottom: 22, fontStyle: 'italic' }}>"{t.text}"</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 44, height: 44, borderRadius: '50%', background: t.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>{t.avatar}</div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 14, color: '#0F172A' }}>{t.name}</div>
                    <div style={{ color: '#94A3B8', fontSize: 12, marginTop: 2 }}>{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ CTA ═══ */}
      <section style={{ padding: '80px 5% 100px', background: '#fff' }}>
        <div style={{ maxWidth: 820, margin: '0 auto', textAlign: 'center', background: 'linear-gradient(135deg, #EFF6FF 0%, #F5F3FF 100%)', border: '1.5px solid #BFDBFE', borderRadius: 28, padding: '72px 40px', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: -60, right: -60, width: 240, height: 240, borderRadius: '50%', background: 'rgba(37,99,235,0.08)', filter: 'blur(50px)' }} />
          <div style={{ position: 'absolute', bottom: -60, left: -60, width: 240, height: 240, borderRadius: '50%', background: 'rgba(124,58,237,0.06)', filter: 'blur(50px)' }} />
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ fontSize: 52, marginBottom: 18 }}>🇵🇰</div>
            <h2 style={{ fontSize: 'clamp(26px, 4vw, 44px)', fontWeight: 800, letterSpacing: '-1.5px', color: '#0F172A', marginBottom: 14 }}>Healthcare for Every Pakistani</h2>
            <p style={{ color: '#64748B', fontSize: 17, marginBottom: 36, lineHeight: 1.7 }}>
              Join thousands getting AI-powered medical insights.<br />No cost. No barriers. Always free.
            </p>
            <button onClick={() => setPage('login')} style={{ background: 'linear-gradient(135deg, #2563EB, #1D4ED8)', border: 'none', color: '#fff', padding: '15px 38px', borderRadius: 14, cursor: 'pointer', fontSize: 17, fontWeight: 700, boxShadow: '0 8px 24px rgba(37,99,235,0.4)', transition: 'all 0.25s' }}
              onMouseEnter={e => { const el = e.currentTarget; el.style.transform = 'translateY(-2px)'; el.style.boxShadow = '0 16px 40px rgba(37,99,235,0.5)'; }}
              onMouseLeave={e => { const el = e.currentTarget; el.style.transform = 'translateY(0)'; el.style.boxShadow = '0 8px 24px rgba(37,99,235,0.4)'; }}
            >Start Free Analysis →</button>
          </div>
        </div>
      </section>

      {/* ═══ FOOTER ═══ */}
      <footer style={{ background: '#0F172A', padding: '40px 5%' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 34, height: 34, borderRadius: 10, background: 'linear-gradient(135deg, #2563EB, #1D4ED8)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 17 }}>🏥</div>
            <span style={{ fontWeight: 800, fontSize: 16, color: '#fff' }}>MedCare <span style={{ color: '#60A5FA' }}>AI</span></span>
          </div>
          <p style={{ color: '#475569', fontSize: 13 }}>Built with ❤️ by Syed Hassan Tayyab — Atomcamp Cohort 15 — 2026</p>
          <div style={{ display: 'flex', gap: 24 }}>
            {['Privacy', 'Terms', 'Contact'].map(l => (
              <span key={l} style={{ color: '#475569', fontSize: 13, cursor: 'pointer', transition: 'color 0.2s' }}
                onMouseEnter={e => { (e.target as HTMLElement).style.color = '#94A3B8'; }}
                onMouseLeave={e => { (e.target as HTMLElement).style.color = '#475569'; }}
              >{l}</span>
            ))}
          </div>
        </div>
      </footer>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        * { margin: 0; padding: 0; box-sizing: border-box; }
        html { scroll-behavior: smooth; }
        @keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.5;transform:scale(0.8)} }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: #F8FAFC; }
        ::-webkit-scrollbar-thumb { background: #CBD5E1; border-radius: 10px; }

        @media (max-width: 768px) {
          nav { padding: 0 4% !important; }
          section { padding: 64px 4% !important; }
          h1 { letter-spacing: -1.5px !important; }
          .desktop-nav button:first-child { display: none; }
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