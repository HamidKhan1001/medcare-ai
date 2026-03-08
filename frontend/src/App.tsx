import React, { useState, useEffect, useRef } from 'react';
import Login from './pages/Login';
import PatientDashboard from './pages/PatientDashboard';
import DoctorDashboard from './pages/DoctorDashboard';
import { isLoggedIn, getUser, logout } from './services/api';

// ── Animated Counter ─────────────────────
const Counter = ({ end, suffix = '' }: { end: number; suffix?: string }) => {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        let start = 0;
        const step = Math.ceil(end / 40);
        const timer = setInterval(() => {
          start += step;
          if (start >= end) { setCount(end); clearInterval(timer); }
          else setCount(start);
        }, 30);
      }
    }, { threshold: 0.5 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [end]);
  return <span ref={ref}>{count}{suffix}</span>;
};

function App() {
  const [page, setPage] = useState('home');
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [scrolled, setScrolled] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (isLoggedIn()) {
      const user = getUser();
      if (user) {
        setCurrentUser(user);
        setPage(user.role === 'doctor' ? 'doctor' : 'dashboard');
      }
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    const handleMouse = (e: MouseEvent) => setMousePos({ x: e.clientX, y: e.clientY });
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('mousemove', handleMouse);
    return () => { window.removeEventListener('scroll', handleScroll); window.removeEventListener('mousemove', handleMouse); };
  }, []);

  const handleLogin = (user: any) => {
    setCurrentUser(user);
    setPage(user.role === 'doctor' ? 'doctor' : 'dashboard');
  };

  const handleLogout = () => { logout(); setCurrentUser(null); setPage('home'); };

  if (page === 'login') return <Login onLogin={handleLogin} />;
  if (page === 'dashboard') return <PatientDashboard user={currentUser} onLogout={handleLogout} />;
  if (page === 'doctor') return <DoctorDashboard user={currentUser} onLogout={handleLogout} />;

  const modules = [
    { icon: '🫁', title: 'X-Ray Analysis', desc: 'Chest X-ray, MRI & CT scan', color: '#3B82F6' },
    { icon: '🦴', title: 'Bone Scan', desc: 'Fracture & bone disease detection', color: '#8B5CF6' },
    { icon: '💓', title: 'ECG Analyzer', desc: 'Heart rhythm & cardiac reports', color: '#EF4444' },
    { icon: '🧪', title: 'Blood Tests', desc: 'Complete blood report analysis', color: '#10B981' },
    { icon: '🧠', title: 'Mental Health', desc: 'PHQ-9 & GAD-7 screening', color: '#F59E0B' },
    { icon: '🔍', title: 'Diagnosis AI', desc: 'Symptom-based diagnosis', color: '#06B6D4' },
    { icon: '💊', title: 'Prescription', desc: 'Handwritten prescription reader', color: '#EC4899' },
    { icon: '📊', title: 'Vital Signs', desc: 'BP, sugar & oxygen monitoring', color: '#14B8A6' },
    { icon: '🚨', title: 'Emergency Aid', desc: 'Instant first aid guidance', color: '#F97316' },
  ];

  return (
    <div style={{ fontFamily: "'DM Sans', -apple-system, sans-serif", background: '#03060F', color: '#fff', overflowX: 'hidden' }}>

      {/* Dynamic cursor glow */}
      <div style={{
        position: 'fixed', top: mousePos.y - 200, left: mousePos.x - 200,
        width: 400, height: 400, borderRadius: '50%', pointerEvents: 'none', zIndex: 0,
        background: 'radial-gradient(circle, rgba(59,130,246,0.06) 0%, transparent 70%)',
        transition: 'top 0.3s ease, left 0.3s ease',
      }} />

      {/* Navbar */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        padding: '0 5%',
        background: scrolled ? 'rgba(3,6,15,0.85)' : 'transparent',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(255,255,255,0.06)' : 'none',
        transition: 'all 0.3s ease',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        height: 70,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: 'linear-gradient(135deg, #3B82F6, #1D4ED8)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 18, boxShadow: '0 0 20px rgba(59,130,246,0.4)',
          }}>🏥</div>
          <span style={{ fontWeight: 700, fontSize: 18, letterSpacing: '-0.5px' }}>
            MedCare <span style={{ color: '#3B82F6' }}>AI</span>
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button onClick={() => setPage('login')} style={{
            background: 'transparent', border: '1px solid rgba(255,255,255,0.15)',
            color: 'rgba(255,255,255,0.8)', padding: '9px 20px', borderRadius: 10,
            cursor: 'pointer', fontSize: 14, fontWeight: 500,
            transition: 'all 0.2s',
          }}
            onMouseEnter={e => { (e.target as HTMLElement).style.borderColor = 'rgba(59,130,246,0.5)'; (e.target as HTMLElement).style.color = '#fff'; }}
            onMouseLeave={e => { (e.target as HTMLElement).style.borderColor = 'rgba(255,255,255,0.15)'; (e.target as HTMLElement).style.color = 'rgba(255,255,255,0.8)'; }}
          >Login</button>
          <button onClick={() => setPage('login')} style={{
            background: 'linear-gradient(135deg, #3B82F6, #1D4ED8)',
            border: 'none', color: '#fff', padding: '9px 22px', borderRadius: 10,
            cursor: 'pointer', fontSize: 14, fontWeight: 600,
            boxShadow: '0 4px 15px rgba(59,130,246,0.35)',
            transition: 'all 0.2s',
          }}
            onMouseEnter={e => { (e.target as HTMLElement).style.transform = 'translateY(-1px)'; (e.target as HTMLElement).style.boxShadow = '0 6px 20px rgba(59,130,246,0.5)'; }}
            onMouseLeave={e => { (e.target as HTMLElement).style.transform = 'translateY(0)'; (e.target as HTMLElement).style.boxShadow = '0 4px 15px rgba(59,130,246,0.35)'; }}
          >Get Started →</button>
        </div>
      </nav>

      {/* Hero */}
      <section style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '120px 5% 80px', position: 'relative', textAlign: 'center',
      }}>
        {/* Grid background */}
        <div style={{
          position: 'absolute', inset: 0, zIndex: 0,
          backgroundImage: `
            linear-gradient(rgba(59,130,246,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(59,130,246,0.04) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }} />

        {/* Glow orbs */}
        <div style={{
          position: 'absolute', top: '20%', left: '15%', width: 500, height: 500,
          borderRadius: '50%', filter: 'blur(80px)', zIndex: 0,
          background: 'radial-gradient(circle, rgba(59,130,246,0.12) 0%, transparent 70%)',
        }} />
        <div style={{
          position: 'absolute', bottom: '20%', right: '15%', width: 400, height: 400,
          borderRadius: '50%', filter: 'blur(80px)', zIndex: 0,
          background: 'radial-gradient(circle, rgba(139,92,246,0.1) 0%, transparent 70%)',
        }} />

        <div style={{ position: 'relative', zIndex: 1, maxWidth: 860, margin: '0 auto' }}>
          {/* Badge */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.25)',
            borderRadius: 100, padding: '6px 16px', marginBottom: 32,
            fontSize: 13, color: '#93C5FD', fontWeight: 500,
          }}>
            <span style={{
              width: 6, height: 6, borderRadius: '50%', background: '#3B82F6',
              boxShadow: '0 0 8px #3B82F6', display: 'inline-block',
              animation: 'pulse 2s infinite',
            }} />
            🇵🇰 Pakistan's First AI Medical Platform
          </div>

          {/* Headline */}
          <h1 style={{
            fontSize: 'clamp(42px, 7vw, 80px)', fontWeight: 800, lineHeight: 1.08,
            letterSpacing: '-2px', marginBottom: 24,
          }}>
            Medical AI For<br />
            <span style={{
              background: 'linear-gradient(135deg, #3B82F6 0%, #60A5FA 50%, #93C5FD 100%)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            }}>Every Pakistani</span>
          </h1>

          <p style={{
            fontSize: 'clamp(16px, 2vw, 20px)', color: 'rgba(255,255,255,0.5)',
            lineHeight: 1.7, marginBottom: 44, maxWidth: 560, margin: '0 auto 44px',
          }}>
            AI-powered X-ray analysis, ECG reading, blood test interpretation and more.
            Free. Fast. In Urdu & English.
          </p>

          {/* CTAs */}
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 60 }}>
            <button onClick={() => setPage('login')} style={{
              background: 'linear-gradient(135deg, #3B82F6, #1D4ED8)',
              border: 'none', color: '#fff', padding: '14px 32px',
              borderRadius: 12, cursor: 'pointer', fontSize: 16, fontWeight: 700,
              boxShadow: '0 8px 30px rgba(59,130,246,0.4)',
              transition: 'all 0.25s',
            }}
              onMouseEnter={e => { (e.target as HTMLElement).style.transform = 'translateY(-2px)'; (e.target as HTMLElement).style.boxShadow = '0 12px 40px rgba(59,130,246,0.5)'; }}
              onMouseLeave={e => { (e.target as HTMLElement).style.transform = 'translateY(0)'; (e.target as HTMLElement).style.boxShadow = '0 8px 30px rgba(59,130,246,0.4)'; }}
            >
              Start Free Analysis →
            </button>
            <button style={{
              background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
              color: 'rgba(255,255,255,0.8)', padding: '14px 32px',
              borderRadius: 12, cursor: 'pointer', fontSize: 16, fontWeight: 600,
              transition: 'all 0.25s',
            }}
              onMouseEnter={e => { (e.target as HTMLElement).style.background = 'rgba(255,255,255,0.08)'; (e.target as HTMLElement).style.borderColor = 'rgba(255,255,255,0.2)'; }}
              onMouseLeave={e => { (e.target as HTMLElement).style.background = 'rgba(255,255,255,0.05)'; (e.target as HTMLElement).style.borderColor = 'rgba(255,255,255,0.1)'; }}
            >
              Watch Demo ▶
            </button>
          </div>

          {/* Trust badges */}
          <div style={{ display: 'flex', gap: 24, justifyContent: 'center', flexWrap: 'wrap' }}>
            {['🔒 HIPAA Compliant', '⚡ 2-3 min analysis', '🌐 Urdu & English', '💯 Free for patients'].map((b, i) => (
              <span key={i} style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)', display: 'flex', alignItems: 'center', gap: 6 }}>
                {b}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section style={{
        padding: '60px 5%',
        borderTop: '1px solid rgba(255,255,255,0.06)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        background: 'rgba(255,255,255,0.02)',
      }}>
        <div style={{
          maxWidth: 900, margin: '0 auto',
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 40,
          textAlign: 'center',
        }}>
          {[
            { num: 9, suffix: '', label: 'AI Modules' },
            { num: 3, suffix: '', label: 'AI Models' },
            { num: 24, suffix: '/7', label: 'Available' },
            { num: 100, suffix: '%', label: 'Free for Patients' },
          ].map((s, i) => (
            <div key={i}>
              <div style={{ fontSize: 48, fontWeight: 800, letterSpacing: '-2px', color: '#3B82F6' }}>
                <Counter end={s.num} suffix={s.suffix} />
              </div>
              <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14, marginTop: 4 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Modules */}
      <section style={{ padding: '100px 5%' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 60 }}>
            <div style={{
              display: 'inline-block', background: 'rgba(59,130,246,0.1)',
              border: '1px solid rgba(59,130,246,0.2)', borderRadius: 100,
              padding: '5px 14px', fontSize: 12, color: '#60A5FA',
              fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase',
              marginBottom: 16,
            }}>AI Modules</div>
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 800, letterSpacing: '-1.5px', marginBottom: 12 }}>
              9 Medical AI Modules
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 16 }}>
              Powered by LLaVA-Med — Microsoft Research, Nature Medicine 2024
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: 16,
          }}>
            {modules.map((mod, i) => (
              <div key={i} style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: 16, padding: '24px',
                cursor: 'pointer', transition: 'all 0.25s',
                display: 'flex', alignItems: 'center', gap: 16,
              }}
                onMouseEnter={e => {
                  const el = e.currentTarget;
                  el.style.background = 'rgba(255,255,255,0.06)';
                  el.style.borderColor = `${mod.color}40`;
                  el.style.transform = 'translateY(-2px)';
                  el.style.boxShadow = `0 8px 30px ${mod.color}15`;
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget;
                  el.style.background = 'rgba(255,255,255,0.03)';
                  el.style.borderColor = 'rgba(255,255,255,0.07)';
                  el.style.transform = 'translateY(0)';
                  el.style.boxShadow = 'none';
                }}
                onClick={() => setPage('login')}
              >
                <div style={{
                  width: 48, height: 48, borderRadius: 12, flexShrink: 0,
                  background: `${mod.color}15`,
                  border: `1px solid ${mod.color}30`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 22,
                }}>{mod.icon}</div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 3 }}>{mod.title}</div>
                  <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13 }}>{mod.desc}</div>
                </div>
                <div style={{ marginLeft: 'auto', color: 'rgba(255,255,255,0.2)', fontSize: 18 }}>→</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section style={{
        padding: '100px 5%',
        background: 'rgba(255,255,255,0.02)',
        borderTop: '1px solid rgba(255,255,255,0.06)',
      }}>
        <div style={{ maxWidth: 900, margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 800, letterSpacing: '-1.5px', marginBottom: 60 }}>
            How It Works
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 40 }}>
            {[
              { step: '01', icon: '📤', title: 'Upload Scan', desc: 'Upload your X-ray, ECG, or blood report' },
              { step: '02', icon: '🤖', title: 'AI Analyzes', desc: 'LLaVA-Med processes in 2-3 minutes' },
              { step: '03', icon: '📋', title: 'Get Report', desc: 'Detailed report in Urdu & English' },
              { step: '04', icon: '👨‍⚕️', title: 'Doctor Reviews', desc: 'Verified by certified physicians' },
            ].map((s, i) => (
              <div key={i} style={{ position: 'relative' }}>
                <div style={{
                  fontSize: 11, fontWeight: 800, letterSpacing: '0.1em',
                  color: '#3B82F6', marginBottom: 16, opacity: 0.6,
                }}>{s.step}</div>
                <div style={{ fontSize: 36, marginBottom: 16 }}>{s.icon}</div>
                <div style={{ fontWeight: 700, fontSize: 17, marginBottom: 8 }}>{s.title}</div>
                <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14, lineHeight: 1.6 }}>{s.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{ padding: '100px 5%' }}>
        <div style={{
          maxWidth: 800, margin: '0 auto', textAlign: 'center',
          background: 'linear-gradient(135deg, rgba(59,130,246,0.12), rgba(139,92,246,0.08))',
          border: '1px solid rgba(59,130,246,0.2)',
          borderRadius: 24, padding: '70px 40px',
          position: 'relative', overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute', top: -60, right: -60, width: 200, height: 200,
            borderRadius: '50%', background: 'rgba(59,130,246,0.1)', filter: 'blur(40px)',
          }} />
          <h2 style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 800, letterSpacing: '-1.5px', marginBottom: 16 }}>
            Healthcare For Everyone 🇵🇰
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 17, marginBottom: 36, lineHeight: 1.7 }}>
            Join thousands of Pakistanis getting AI-powered medical insights.
            Free. Always.
          </p>
          <button onClick={() => setPage('login')} style={{
            background: 'linear-gradient(135deg, #3B82F6, #1D4ED8)',
            border: 'none', color: '#fff', padding: '15px 36px',
            borderRadius: 12, cursor: 'pointer', fontSize: 17, fontWeight: 700,
            boxShadow: '0 8px 30px rgba(59,130,246,0.4)',
            transition: 'all 0.25s',
          }}
            onMouseEnter={e => { (e.target as HTMLElement).style.transform = 'translateY(-2px)'; }}
            onMouseLeave={e => { (e.target as HTMLElement).style.transform = 'translateY(0)'; }}
          >
            Start Free Analysis →
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        borderTop: '1px solid rgba(255,255,255,0.06)',
        padding: '32px 5%',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        flexWrap: 'wrap', gap: 16,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 28, height: 28, borderRadius: 8,
            background: 'linear-gradient(135deg, #3B82F6, #1D4ED8)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14,
          }}>🏥</div>
          <span style={{ fontWeight: 700, fontSize: 15 }}>MedCare AI</span>
        </div>
        <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: 13 }}>
          Built by Syed Hassan Tayyab — Atomcamp Cohort 15 — 2026
        </p>
        <div style={{ display: 'flex', gap: 20 }}>
          {['Privacy', 'Terms', 'Contact'].map(l => (
            <span key={l} style={{ color: 'rgba(255,255,255,0.3)', fontSize: 13, cursor: 'pointer' }}>{l}</span>
          ))}
        </div>
      </footer>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');
        * { margin: 0; padding: 0; box-sizing: border-box; }
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(0.8); }
        }
        html { scroll-behavior: smooth; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: #03060F; }
        ::-webkit-scrollbar-thumb { background: rgba(59,130,246,0.3); border-radius: 3px; }
        @media (max-width: 768px) {
          nav { padding: 0 4% !important; }
          section { padding: 60px 4% !important; }
        }
      `}</style>
    </div>
  );
}

export default App;