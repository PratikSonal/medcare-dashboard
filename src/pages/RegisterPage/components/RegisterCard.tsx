import { useState, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { Eye, EyeOff, Mail, Lock, User } from 'lucide-react';
import { auth } from '@/lib/firebase';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { setLoading, setError } from '@/features/auth/authSlice';

const ERROR_MESSAGES: Record<string, string> = {
  'auth/email-already-in-use': 'An account with this email already exists.',
  'auth/invalid-email': 'Please enter a valid email address.',
  'auth/weak-password': 'Password must be at least 6 characters.',
  'auth/network-request-failed': 'Network error. Check your connection.',
};

const inputStyle = { background: '#0d1b33', border: '0.5px solid #1e3a5f', color: '#e2e8f0', transition: 'border-color 200ms ease' };

export const RegisterCard = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLocalLoading] = useState(false);
  const [error, setLocalError] = useState('');
  const [success, setSuccess] = useState(false);

  const validate = useCallback(() => {
    if (!name.trim()) { setLocalError('Full name is required'); return false; }
    if (!email) { setLocalError('Email is required'); return false; }
    if (!/\S+@\S+\.\S+/.test(email)) { setLocalError('Enter a valid email'); return false; }
    if (!password) { setLocalError('Password is required'); return false; }
    if (password.length < 6) { setLocalError('Password must be at least 6 characters'); return false; }
    return true;
  }, [name, email, password]);

  const handleRegister = useCallback(async (e: React.SyntheticEvent<HTMLFormElement>) => {
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
      const msg = ERROR_MESSAGES[code] || 'Registration failed. Please try again.';
      setLocalError(msg);
      dispatch(setError(msg));
    } finally {
      setLocalLoading(false);
    }
  }, [validate, name, email, password, navigate, dispatch]);

  return (
    <div style={{ background: '#0a1120', border: '0.5px solid #0f1f3d', borderRadius: '12px', padding: '36px' }}>
      {success ? (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-6">
          <div className="flex items-center justify-center w-12 h-12 rounded-full mx-auto mb-4" style={{ background: 'rgba(37,99,235,0.15)', border: '0.5px solid rgba(37,99,235,0.3)' }}>
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

          <form onSubmit={handleRegister} className="flex flex-col gap-[14px]">
            <div className="flex flex-col gap-[6px]">
              <label style={{ fontSize: '13px', fontWeight: 500, color: '#64748b' }}>Full name</label>
              <div className="relative">
                <User size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#334155' }} />
                <input
                  type="text"
                  placeholder="Dr. John Smith"
                  value={name}
                  onChange={(e) => { setName(e.target.value); setLocalError(''); }}
                  className="w-full rounded-[8px] py-[11px] px-[14px] pl-[38px] text-sm outline-none font-sans box-border"
                  style={inputStyle}
                  onFocus={(e) => (e.target.style.borderColor = '#2563eb')}
                  onBlur={(e) => (e.target.style.borderColor = '#1e3a5f')}
                />
              </div>
            </div>

            <div className="flex flex-col gap-[6px]">
              <label style={{ fontSize: '13px', fontWeight: 500, color: '#64748b' }}>Email address</label>
              <div className="relative">
                <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#334155' }} />
                <input
                  type="email"
                  placeholder="doctor@medcare.com"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setLocalError(''); }}
                  className="w-full rounded-[8px] py-[11px] px-[14px] pl-[38px] text-sm outline-none font-sans box-border"
                  style={inputStyle}
                  onFocus={(e) => (e.target.style.borderColor = '#2563eb')}
                  onBlur={(e) => (e.target.style.borderColor = '#1e3a5f')}
                />
              </div>
            </div>

            <div className="flex flex-col gap-[6px]">
              <label style={{ fontSize: '13px', fontWeight: 500, color: '#64748b' }}>Password</label>
              <div className="relative">
                <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#334155' }} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Min. 6 characters"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setLocalError(''); }}
                  className="w-full rounded-[8px] py-[11px] px-[14px] pl-[38px] pr-[38px] text-sm outline-none font-sans box-border"
                  style={inputStyle}
                  onFocus={(e) => (e.target.style.borderColor = '#2563eb')}
                  onBlur={(e) => (e.target.style.borderColor = '#1e3a5f')}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 bg-transparent border-0 cursor-pointer flex items-center p-0"
                  style={{ color: '#334155' }}
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 py-[10px] px-[14px] rounded-[6px] text-[13px]"
                style={{ background: 'rgba(239,68,68,0.08)', border: '0.5px solid rgba(239,68,68,0.25)', color: '#fca5a5' }}
              >
                ⚠️ {error}
              </motion.div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-[8px] border-0 text-sm font-semibold font-sans mt-1 transition-[background] duration-200 disabled:cursor-not-allowed"
              style={{ background: loading ? '#1e3a5f' : '#2563eb', color: loading ? '#475569' : 'white' }}
            >
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-[13px] mt-5" style={{ color: '#334155' }}>
            Already have an account?{' '}
            <Link to="/login" className="no-underline font-medium" style={{ color: '#3b82f6' }}>Sign in</Link>
          </p>
        </>
      )}
    </div>
  );
};
