import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { Eye, EyeOff, Mail, Lock, User, Activity } from 'lucide-react';
import { auth } from '@/lib/firebase';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { setLoading, setError } from '@/features/auth/authSlice';

export default function RegisterPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLocalLoading] = useState(false);
  const [error, setLocalError] = useState('');
  const [success, setSuccess] = useState(false);

  const validate = () => {
    if (!name.trim()) { setLocalError('Full name is required'); return false; }
    if (!email) { setLocalError('Email is required'); return false; }
    if (!/\S+@\S+\.\S+/.test(email)) { setLocalError('Enter a valid email'); return false; }
    if (!password) { setLocalError('Password is required'); return false; }
    if (password.length < 6) { setLocalError('Password must be at least 6 characters'); return false; }
    return true;
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError('');
    if (!validate()) return;
    setLocalLoading(true);
    dispatch(setLoading(true));
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(result.user, { displayName: name });
      setSuccess(true);
      setTimeout(() => navigate('/dashboard'), 1500);
    } catch (err: unknown) {
      const code = (err as { code?: string }).code || '';
      const messages: Record<string, string> = {
        'auth/email-already-in-use': 'An account with this email already exists.',
        'auth/invalid-email': 'Please enter a valid email address.',
        'auth/weak-password': 'Password must be at least 6 characters.',
        'auth/network-request-failed': 'Network error. Check your connection.',
      };
      const msg = messages[code] || 'Registration failed. Please try again.';
      setLocalError(msg);
      dispatch(setError(msg));
    } finally {
      setLocalLoading(false);
    }
  };

  const inputStyle: React.CSSProperties = {
    width: '100%', background: '#0d1b33', border: '0.5px solid #1e3a5f',
    borderRadius: '8px', padding: '11px 14px', fontSize: '14px',
    color: '#e2e8f0', outline: 'none', fontFamily: 'inherit',
    transition: 'border-color 200ms ease', boxSizing: 'border-box',
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#070d1a', padding: '24px', fontFamily: 'Poppins, sans-serif' }}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}
        style={{ width: '100%', maxWidth: '420px' }}>

        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '36px', justifyContent: 'center' }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#1d4ed8' }}>
            <Activity size={16} color="#bfdbfe" />
          </div>
          <span style={{ fontSize: '16px', fontWeight: 600, color: '#e2e8f0', letterSpacing: '-0.01em' }}>MedCare</span>
        </div>

        {/* Card */}
        <div style={{ background: '#0a1120', border: '0.5px solid #0f1f3d', borderRadius: '12px', padding: '36px' }}>
          {success ? (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
              style={{ textAlign: 'center', padding: '24px 0' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(37,99,235,0.15)', border: '0.5px solid rgba(37,99,235,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                <span style={{ fontSize: '22px' }}>✓</span>
              </div>
              <p style={{ fontSize: '16px', fontWeight: 600, color: '#93c5fd', marginBottom: '6px' }}>Account created</p>
              <p style={{ fontSize: '13px', color: '#334155' }}>Redirecting to dashboard...</p>
            </motion.div>
          ) : (
            <>
              <div style={{ marginBottom: '28px' }}>
                <h2 style={{ fontSize: '22px', fontWeight: 600, color: '#f1f5f9', marginBottom: '6px', letterSpacing: '-0.02em' }}>Create account</h2>
                <p style={{ fontSize: '13px', color: '#475569' }}>Set up your MedCare access</p>
              </div>

              <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {/* Name */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '13px', fontWeight: 500, color: '#64748b' }}>Full name</label>
                  <div style={{ position: 'relative' }}>
                    <User size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#334155' }} />
                    <input type="text" placeholder="Dr. John Smith" value={name}
                      onChange={e => { setName(e.target.value); setLocalError(''); }}
                      style={{ ...inputStyle, paddingLeft: '38px' }}
                      onFocus={e => e.target.style.borderColor = '#2563eb'}
                      onBlur={e => e.target.style.borderColor = '#1e3a5f'} />
                  </div>
                </div>

                {/* Email */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '13px', fontWeight: 500, color: '#64748b' }}>Email address</label>
                  <div style={{ position: 'relative' }}>
                    <Mail size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#334155' }} />
                    <input type="email" placeholder="doctor@medcare.com" value={email}
                      onChange={e => { setEmail(e.target.value); setLocalError(''); }}
                      style={{ ...inputStyle, paddingLeft: '38px' }}
                      onFocus={e => e.target.style.borderColor = '#2563eb'}
                      onBlur={e => e.target.style.borderColor = '#1e3a5f'} />
                  </div>
                </div>

                {/* Password */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '13px', fontWeight: 500, color: '#64748b' }}>Password</label>
                  <div style={{ position: 'relative' }}>
                    <Lock size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#334155' }} />
                    <input type={showPassword ? 'text' : 'password'} placeholder="Min. 6 characters" value={password}
                      onChange={e => { setPassword(e.target.value); setLocalError(''); }}
                      style={{ ...inputStyle, paddingLeft: '38px', paddingRight: '38px' }}
                      onFocus={e => e.target.style.borderColor = '#2563eb'}
                      onBlur={e => e.target.style.borderColor = '#1e3a5f'} />
                    <button type="button" onClick={() => setShowPassword(!showPassword)}
                      style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#334155', display: 'flex', alignItems: 'center', padding: 0 }}>
                      {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </div>

                {/* Error */}
                {error && (
                  <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}
                    style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 14px', borderRadius: '6px', fontSize: '13px', background: 'rgba(239,68,68,0.08)', border: '0.5px solid rgba(239,68,68,0.25)', color: '#fca5a5' }}>
                    ⚠️ {error}
                  </motion.div>
                )}

                <button type="submit" disabled={loading}
                  style={{ width: '100%', padding: '12px', borderRadius: '8px', border: 'none', background: loading ? '#1e3a5f' : '#2563eb', color: loading ? '#475569' : 'white', fontSize: '14px', fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'inherit', marginTop: '4px', transition: 'background 200ms ease' }}>
                  {loading ? 'Creating account...' : 'Create Account'}
                </button>
              </form>

              <p style={{ textAlign: 'center', fontSize: '13px', color: '#334155', marginTop: '20px' }}>
                Already have an account?{' '}
                <Link to="/login" style={{ color: '#3b82f6', textDecoration: 'none', fontWeight: 500 }}>Sign in</Link>
              </p>
            </>
          )}
        </div>

        <div style={{ textAlign: 'center', marginTop: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px' }}>
          {['HIPAA', 'SOC 2', 'FDA Ready'].map(b => (
            <span key={b} style={{ fontSize: '11px', color: '#1e3a5f', fontWeight: 500 }}>{b}</span>
          ))}
        </div>
      </motion.div>

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
