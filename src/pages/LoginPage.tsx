import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { Eye, EyeOff, Mail, Lock, Activity, Shield, Zap, Users, Brain, Heart, Clock, Star } from 'lucide-react';
import { auth } from '@/lib/firebase';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { setError, setLoading } from '@/features/auth/authSlice';
import { showWelcomeNotification, registerServiceWorker } from '@/lib/notifications';
import { Button } from '@/components/ui/Button';

const carouselItems = [
  { icon: Shield, label: 'HIPAA Compliant', color: '#3c83f6', stat: '99.9%', statLabel: 'Uptime SLA' },
  { icon: Zap, label: 'Smart Scheduling', color: '#10bc83', stat: '170%', statLabel: 'Booking Growth' },
  { icon: Brain, label: 'AI-Powered Intake', color: '#7c3bed', stat: '1000+', statLabel: 'Hours Saved/Week' },
  { icon: Heart, label: 'Patient Monitoring', color: '#3c83f6', stat: '46.5%', statLabel: 'Fewer Claim Denials' },
  { icon: Users, label: 'Care Coordination', color: '#10bc83', stat: '150+', statLabel: 'Clinics Served' },
  { icon: Clock, label: 'After-Hours Booking', color: '#0da2e7', stat: '44.5%', statLabel: 'After-Hours Bookings' },
  { icon: Star, label: 'Revenue Cycle', color: '#10bc83', stat: '$5M+', statLabel: 'Revenue Impact/Practice' },
];

function AnimatedCounter({ value }: { value: string }) {
  const [display, setDisplay] = useState('0');
  useEffect(() => {
    const num = parseFloat(value.replace(/[^0-9.]/g, ''));
    if (isNaN(num)) { setDisplay(value); return; }
    const prefix = value.match(/^[^0-9]*/)?.[0] || '';
    const suffix = value.match(/[^0-9.]+$/)?.[0] || '';
    let current = 0;
    const steps = 50;
    const increment = num / steps;
    const timer = setInterval(() => {
      current += increment;
      if (current >= num) {
        setDisplay(`${prefix}${value.includes('.') ? num.toFixed(1) : Math.round(num)}${suffix}`);
        clearInterval(timer);
      } else {
        setDisplay(`${prefix}${value.includes('.') ? current.toFixed(1) : Math.round(current)}${suffix}`);
      }
    }, 1600 / steps);
    return () => clearInterval(timer);
  }, [value]);
  return <span>{display}</span>;
}

function FeatureCarousel() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setActive(p => (p + 1) % carouselItems.length), 3000);
    return () => clearInterval(t);
  }, []);

  const current = carouselItems[active];
  const Icon = current.icon;

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', position: 'relative', zIndex: 1 }}>
      <div className="glow-line" style={{ marginBottom: '32px', width: '80px' }} />
      <h1 style={{ fontSize: '38px', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1.15, marginBottom: '12px' }}>
        Healthcare Intelligence<br />
        <span className="gradient-text">Reimagined</span>
      </h1>
      <p style={{ color: 'var(--text-secondary)', fontSize: '15px', lineHeight: 1.7, marginBottom: '40px', maxWidth: '380px' }}>
        A unified platform for modern healthcare teams — monitor patients, schedule appointments, and deliver exceptional care.
      </p>

      {/* Badge pills */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '32px' }}>
        {carouselItems.map(({ label, color, icon }, i) => (
          <motion.button
            key={label}
            onClick={() => setActive(i)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '6px',
              padding: '7px 13px', borderRadius: '999px', fontSize: '12px', fontWeight: 500,
              cursor: 'pointer', fontFamily: 'inherit',
              transition: 'all 250ms ease',
              background: active === i ? `${color}22` : 'var(--bg-tertiary)',
              border: `1px solid ${active === i ? `${color}60` : 'var(--border-primary)'}`,
              color: active === i ? color : 'var(--text-secondary)',
              boxShadow: active === i ? `0 0 12px ${color}30` : 'none',
            } as React.CSSProperties}
          >
            {(() => { const Ic = icon; return <Ic size={12} />; })()}
            {label}
          </motion.button>
        ))}
      </div>

      {/* Active stat card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={active}
          initial={{ opacity: 0, y: 16, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -16, scale: 0.97 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          className="glass-card"
          style={{ borderRadius: '20px', padding: '24px', borderColor: `${current.color}30`, boxShadow: `0 0 24px ${current.color}15` }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ width: '52px', height: '52px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, background: `${current.color}18`, border: `1px solid ${current.color}30` }}>
              <Icon size={24} style={{ color: current.color }} />
            </div>
            <div>
              <p style={{ fontSize: '12px', color: 'var(--text-tertiary)', marginBottom: '2px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{current.label}</p>
              <p style={{ fontSize: '28px', fontWeight: 800, color: current.color, margin: 0, lineHeight: 1 }}>
                <AnimatedCounter value={current.stat} />
              </p>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>{current.statLabel}</p>
            </div>
          </div>
          <div style={{ marginTop: '16px', height: '3px', background: 'var(--bg-tertiary)', borderRadius: '99px', overflow: 'hidden' }}>
            <motion.div
              key={`progress-${active}`}
              initial={{ width: '0%' }}
              animate={{ width: '100%' }}
              transition={{ duration: 3, ease: 'linear' }}
              style={{ height: '100%', borderRadius: '99px', background: `linear-gradient(90deg, ${current.color}, ${current.color}80)` }}
            />
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Dots */}
      <div style={{ display: 'flex', gap: '6px', marginTop: '16px' }}>
        {carouselItems.map((_, i) => (
          <button key={i} onClick={() => setActive(i)}
            style={{ width: i === active ? '20px' : '6px', height: '6px', borderRadius: '99px', border: 'none', cursor: 'pointer', padding: 0, transition: 'all 300ms ease', background: i === active ? current.color : 'var(--border-primary)' }} />
        ))}
      </div>
    </div>
  );
}

export default function LoginPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLocalLoading] = useState(false);
  const [error, setLocalError] = useState('');

  const validate = () => {
    if (!email) { setLocalError('Email is required'); return false; }
    if (!/\S+@\S+\.\S+/.test(email)) { setLocalError('Enter a valid email'); return false; }
    if (!password) { setLocalError('Password is required'); return false; }
    if (password.length < 6) { setLocalError('Password must be at least 6 characters'); return false; }
    return true;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError('');
    if (!validate()) return;
    setLocalLoading(true);
    dispatch(setLoading(true));
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      await registerServiceWorker();
      await showWelcomeNotification(result.user.displayName || result.user.email || 'Doctor');
      navigate('/dashboard');
    } catch (err: unknown) {
      const code = (err as { code?: string }).code || '';
      const messages: Record<string, string> = {
        'auth/user-not-found': 'No account found with this email.',
        'auth/wrong-password': 'Incorrect password. Please try again.',
        'auth/invalid-credential': 'Invalid email or password.',
        'auth/too-many-requests': 'Too many attempts. Please try again later.',
        'auth/network-request-failed': 'Network error. Check your connection.',
      };
      const msg = messages[code] || 'Login failed. Please try again.';
      setLocalError(msg);
      dispatch(setError(msg));
    } finally {
      setLocalLoading(false);
    }
  };

  const inputStyle: React.CSSProperties = {
    width: '100%', background: 'var(--bg-secondary)', border: '1px solid var(--border-primary)',
    borderRadius: '12px', padding: '12px 16px', fontSize: '14px',
    color: 'var(--text-primary)', outline: 'none', fontFamily: 'inherit',
    transition: 'border-color 200ms ease', boxSizing: 'border-box',
  };

  return (
    <div className="dot-grid" style={{ minHeight: '100vh', display: 'flex', background: 'var(--bg-primary)' }}>

      {/* ── Left Panel ── */}
      <motion.div
        initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}
        className="lg-flex"
        style={{ display: 'none', flexDirection: 'column', width: '52%', padding: '48px', position: 'relative', overflow: 'hidden', background: 'var(--bg-secondary)', borderRight: '1px solid var(--border-primary)' }}
      >
        <div style={{ position: 'absolute', top: '-100px', left: '-100px', width: '400px', height: '400px', borderRadius: '50%', opacity: 0.08, filter: 'blur(80px)', background: 'var(--accent-blue)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '-100px', right: '-60px', width: '400px', height: '400px', borderRadius: '50%', opacity: 0.06, filter: 'blur(80px)', background: 'var(--accent-green)', pointerEvents: 'none' }} />

        {/* Logo — static, no animation */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '48px', position: 'relative', zIndex: 1 }}>
          <div style={{ width: '44px', height: '44px', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--gradient-primary)', flexShrink: 0 }}>
            <Activity size={22} color="white" />
          </div>
          <span className="gradient-text" style={{ fontSize: '22px', fontWeight: 700 }}>MedCare</span>
        </div>

        <FeatureCarousel />

        {/* Compliance badges — static */}
        <div style={{ display: 'flex', gap: '8px', marginTop: '32px', position: 'relative', zIndex: 1 }}>
          {[
            { icon: Shield, label: 'HIPAA Certified', color: '#3c83f6' },
            { icon: Star, label: 'SOC 2 Type II', color: '#10bc83' },
            { icon: Zap, label: 'FDA Ready', color: '#7c3bed' },
          ].map(({ icon: Ic, label, color }) => (
            <div key={label}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '6px 12px', borderRadius: '999px', fontSize: '12px', fontWeight: 500, background: `${color}18`, border: `1px solid ${color}40`, color }}>
              <Ic size={13} />
              {label}
            </div>
          ))}
        </div>
      </motion.div>

      {/* ── Right Panel ── */}
      <motion.div
        initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}
        style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '32px' }}
      >
        <div style={{ width: '100%', maxWidth: '420px' }}>
          {/* Right logo — also static */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '40px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--gradient-primary)' }}>
              <Activity size={20} color="white" />
            </div>
            <span className="gradient-text" style={{ fontSize: '20px', fontWeight: 700 }}>MedCare</span>
          </div>

          <div style={{ marginBottom: '32px' }}>
            <h2 style={{ fontSize: '30px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px' }}>Welcome back</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '15px' }}>Sign in to your MedCare account</p>
          </div>

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text-secondary)' }}>Email Address</label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }} />
                <input type="email" placeholder="doctor@medcare.com" value={email}
                  onChange={e => { setEmail(e.target.value); setLocalError(''); }}
                  style={{ ...inputStyle, paddingLeft: '40px' }}
                  onFocus={e => e.target.style.borderColor = 'var(--accent-blue)'}
                  onBlur={e => e.target.style.borderColor = 'var(--border-primary)'} />
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <label style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text-secondary)' }}>Password</label>
                <button type="button" style={{ fontSize: '12px', color: 'var(--accent-blue)', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', padding: 0 }}>Forgot password?</button>
              </div>
              <div style={{ position: 'relative' }}>
                <Lock size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }} />
                <input type={showPassword ? 'text' : 'password'} placeholder="••••••••" value={password}
                  onChange={e => { setPassword(e.target.value); setLocalError(''); }}
                  style={{ ...inputStyle, paddingLeft: '40px', paddingRight: '40px' }}
                  onFocus={e => e.target.style.borderColor = 'var(--accent-blue)'}
                  onBlur={e => e.target.style.borderColor = 'var(--border-primary)'} />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-tertiary)', display: 'flex', alignItems: 'center', padding: 0 }}>
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && (
              <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
                style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 16px', borderRadius: '12px', fontSize: '14px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: 'var(--accent-red)' }}>
                ⚠️ {error}
              </motion.div>
            )}

            <Button type="submit" loading={loading}
              style={{ width: '100%', padding: '14px', fontSize: '15px', marginTop: '4px', borderRadius: '12px', background: 'var(--gradient-primary)', border: 'none', color: 'white', fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'inherit' }}>
              Sign In to MedCare
            </Button>
          </form>

          <p style={{ textAlign: 'center', fontSize: '13px', color: 'var(--text-secondary)', marginTop: '24px' }}>
            Don't have an account?{' '}
            <Link to="/register" style={{ color: 'var(--accent-blue)', textDecoration: 'none', fontWeight: 600 }}>Create one</Link>
          </p>

          <div style={{ marginTop: '24px', paddingTop: '24px', borderTop: '1px solid var(--border-primary)', textAlign: 'center' }}>
            <p style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>🔒 Secured with Firebase Authentication · HIPAA Compliant</p>
          </div>
        </div>
      </motion.div>

      <style>{`
        @media (min-width: 1024px) { .lg-flex { display: flex !important; } }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
