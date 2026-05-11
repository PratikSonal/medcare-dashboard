import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { signInWithEmailAndPassword } from "firebase/auth";
import { Eye, EyeOff, Mail, Lock, Activity, Shield, Zap, Brain, Heart, Clock, TrendingUp } from "lucide-react";
import { auth } from "@/lib/firebase";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { setError, setLoading } from "@/features/auth/authSlice";
import { showWelcomeNotification, registerServiceWorker } from "@/lib/notifications";
import { Button } from "@/components/ui/Button";

const slides = [
  { icon: Shield,    color: "#3c83f6", stat: "99.9%",  headline: "Always On",             description: "Round-the-clock monitoring with enterprise-grade uptime SLA and zero workflow interruptions." },
  { icon: Zap,       color: "#0ea5e9", stat: "170%",   headline: "Smarter Scheduling",    description: "Patients book in under 2 minutes. 44.5% of bookings happen after hours — automatically." },
  { icon: Brain,     color: "#7c3bed", stat: "1000+",  headline: "AI Does the Paperwork", description: "Intake forms, prescription refills, prior auths — automated. 1000+ staff hours saved weekly." },
  { icon: Heart,     color: "#38bdf8", stat: "46.5%",  headline: "Fewer Claim Denials",   description: "Pre-visit eligibility checks and real-time benefit verification eliminate failures early." },
  { icon: TrendingUp,color: "#0ea5e9", stat: "$5M+",   headline: "Revenue Impact",        description: "Higher bookings, saved staff time, improved margins — $5M+ revenue impact per practice annually." },
  { icon: Clock,     color: "#3c83f6", stat: "2 min",  headline: "Instant Onboarding",    description: "Up and running in days, not months. White glove support and direct EHR integration." },
];

function FeatureCarousel() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setActive((p) => (p + 1) % slides.length), 3000);
    return () => clearInterval(t);
  }, []);

  const slide = slides[active];
  const Icon = slide.icon;

  return (
    <>
      {/* Fixed-height carousel */}
      <div style={{ height: "120px", overflow: "hidden", position: "relative" }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            style={{ display: "flex", alignItems: "stretch", gap: "20px", height: "100%", position: "absolute", width: "100%" }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <Icon size={56} style={{ color: slide.color }} />
            </div>
            <div style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
              <div style={{ display: "flex", alignItems: "baseline", gap: "10px", marginBottom: "8px" }}>
                <span style={{ fontSize: "32px", fontWeight: 800, color: slide.color, lineHeight: 1, letterSpacing: "-0.02em" }}>
                  {slide.stat}
                </span>
                <span style={{ fontSize: "16px", fontWeight: 600, color: "#f8fafc", lineHeight: 1 }}>
                  {slide.headline}
                </span>
              </div>
              <p style={{ fontSize: "13px", color: "#9ca3af", lineHeight: 1.55, margin: 0, maxWidth: "300px" }}>
                {slide.description}
              </p>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Dots */}
      <div style={{ display: "flex", alignItems: "center", gap: "6px", marginTop: "20px" }}>
        {slides.map((s, i) => (
          <button key={i} onClick={() => setActive(i)}
            style={{ width: i === active ? "20px" : "6px", height: "6px", borderRadius: "99px", border: "none", cursor: "pointer", padding: 0, transition: "all 300ms ease", background: i === active ? s.color : "#1d2839" }}
          />
        ))}
      </div>
    </>
  );
}

export default function LoginPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLocalLoading] = useState(false);
  const [error, setLocalError] = useState("");

  const validate = () => {
    if (!email) { setLocalError("Email is required"); return false; }
    if (!/\S+@\S+\.\S+/.test(email)) { setLocalError("Enter a valid email"); return false; }
    if (!password) { setLocalError("Password is required"); return false; }
    if (password.length < 6) { setLocalError("Password must be at least 6 characters"); return false; }
    return true;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError("");
    if (!validate()) return;
    setLocalLoading(true);
    dispatch(setLoading(true));
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      await registerServiceWorker();
      showWelcomeNotification(result.user.displayName || result.user.email || "Doctor");
      navigate("/dashboard");
    } catch (err: unknown) {
      const code = (err as { code?: string }).code || "";
      const messages: Record<string, string> = {
        "auth/user-not-found": "No account found with this email.",
        "auth/wrong-password": "Incorrect password. Please try again.",
        "auth/invalid-credential": "Invalid email or password.",
        "auth/too-many-requests": "Too many attempts. Please try again later.",
        "auth/network-request-failed": "Network error. Check your connection.",
      };
      const msg = messages[code] || "Login failed. Please try again.";
      setLocalError(msg);
      dispatch(setError(msg));
    } finally {
      setLocalLoading(false);
    }
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    background: "var(--bg-secondary)",
    border: "1px solid var(--border-primary)",
    borderRadius: "12px",
    padding: "12px 16px",
    fontSize: "14px",
    color: "var(--text-primary)",
    outline: "none",
    fontFamily: "inherit",
    transition: "border-color 200ms ease",
    boxSizing: "border-box",
  };

  return (
    <div className="dot-grid" style={{ minHeight: "100vh", display: "flex", background: "var(--bg-primary)" }}>

      {/* ── Left Panel — always dark, Option B layout ── */}
      <motion.div
        initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="lg-flex"
        style={{
          display: "none",
          flexDirection: "column",
          width: "52%",
          position: "relative",
          overflow: "hidden",
          background: "#0c111d",
          borderRight: "1px solid #1d2839",
        }}
      >
        {/* bg orbs */}
        <div style={{ position: "absolute", top: "-80px", left: "-80px", width: "400px", height: "400px", borderRadius: "50%", opacity: 0.07, filter: "blur(80px)", background: "#3c83f6", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: "-80px", right: "-60px", width: "350px", height: "350px", borderRadius: "50%", opacity: 0.05, filter: "blur(80px)", background: "#0ea5e9", pointerEvents: "none" }} />

        {/* TOP — logo pinned */}
        <div style={{ padding: "40px 48px 0", position: "relative", zIndex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{ width: "36px", height: "36px", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--gradient-primary)", flexShrink: 0 }}>
              <Activity size={18} color="white" />
            </div>
            <span className="gradient-text" style={{ fontSize: "18px", fontWeight: 700 }}>MedCare</span>
          </div>
        </div>

        {/* MIDDLE — hero text + carousel, vertically centred */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 48px", position: "relative", zIndex: 1 }}>
          <div className="glow-line" style={{ marginBottom: "20px", width: "56px" }} />
          <h1 style={{ fontSize: "36px", fontWeight: 800, color: "#f8fafc", lineHeight: 1.2, marginBottom: "12px", letterSpacing: "-0.02em" }}>
            Healthcare Intelligence<br />
            <span className="gradient-text">Reimagined</span>
          </h1>
          <p style={{ color: "#9ca3af", fontSize: "14px", lineHeight: 1.7, marginBottom: "40px", maxWidth: "340px" }}>
            A unified platform for modern healthcare teams — monitor patients, schedule appointments, and deliver exceptional care.
          </p>
          <FeatureCarousel />
        </div>

        {/* BOTTOM — compliance pinned */}
        <div style={{ padding: "0 48px 40px", position: "relative", zIndex: 1 }}>
          <p style={{ fontSize: "12px", color: "#4b5563", display: "flex", alignItems: "center", gap: "0" }}>
            HIPAA Certified
            <span style={{ display: "inline-block", width: "3px", height: "3px", borderRadius: "50%", background: "#4b5563", margin: "0 10px" }} />
            SOC 2 Type II
            <span style={{ display: "inline-block", width: "3px", height: "3px", borderRadius: "50%", background: "#4b5563", margin: "0 10px" }} />
            FHIR Ready
          </p>
        </div>
      </motion.div>

      {/* ── Right Panel — follows theme ── */}
      <motion.div
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "32px" }}
      >
        <div style={{ width: "100%", maxWidth: "400px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "40px" }}>
            <div style={{ width: "36px", height: "36px", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--gradient-primary)" }}>
              <Activity size={18} color="white" />
            </div>
            <span className="gradient-text" style={{ fontSize: "18px", fontWeight: 700 }}>MedCare</span>
          </div>

          <div style={{ marginBottom: "28px" }}>
            <h2 style={{ fontSize: "26px", fontWeight: 700, color: "var(--text-primary)", marginBottom: "6px", letterSpacing: "-0.01em" }}>Welcome back</h2>
            <p style={{ color: "var(--text-secondary)", fontSize: "14px" }}>Sign in to your MedCare account</p>
          </div>

          <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <label style={{ fontSize: "13px", fontWeight: 500, color: "var(--text-secondary)" }}>Email Address</label>
              <div style={{ position: "relative" }}>
                <Mail size={15} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "var(--text-tertiary)" }} />
                <input type="email" placeholder="doctor@medcare.com" value={email}
                  onChange={(e) => { setEmail(e.target.value); setLocalError(""); }}
                  style={{ ...inputStyle, paddingLeft: "38px" }}
                  onFocus={(e) => (e.target.style.borderColor = "var(--accent-blue)")}
                  onBlur={(e) => (e.target.style.borderColor = "var(--border-primary)")}
                />
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <label style={{ fontSize: "13px", fontWeight: 500, color: "var(--text-secondary)" }}>Password</label>
                <button type="button" style={{ fontSize: "12px", color: "var(--accent-blue)", background: "none", border: "none", cursor: "pointer", fontFamily: "inherit", padding: 0 }}>
                  Forgot password?
                </button>
              </div>
              <div style={{ position: "relative" }}>
                <Lock size={15} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "var(--text-tertiary)" }} />
                <input type={showPassword ? "text" : "password"} placeholder="••••••••" value={password}
                  onChange={(e) => { setPassword(e.target.value); setLocalError(""); }}
                  style={{ ...inputStyle, paddingLeft: "38px", paddingRight: "38px" }}
                  onFocus={(e) => (e.target.style.borderColor = "var(--accent-blue)")}
                  onBlur={(e) => (e.target.style.borderColor = "var(--border-primary)")}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "var(--text-tertiary)", display: "flex", alignItems: "center", padding: 0 }}>
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {error && (
              <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
                style={{ display: "flex", alignItems: "center", gap: "8px", padding: "10px 14px", borderRadius: "10px", fontSize: "13px", background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", color: "var(--accent-red)" }}>
                ⚠️ {error}
              </motion.div>
            )}

            <Button type="submit" loading={loading}
              style={{ width: "100%", padding: "13px", fontSize: "14px", marginTop: "6px", borderRadius: "12px", background: "var(--gradient-primary)", border: "none", color: "white", fontWeight: 600, cursor: loading ? "not-allowed" : "pointer", fontFamily: "inherit" }}>
              Sign In to MedCare
            </Button>
          </form>

          <p style={{ textAlign: "center", fontSize: "13px", color: "var(--text-secondary)", marginTop: "20px" }}>
            Don't have an account?{" "}
            <Link to="/register" style={{ color: "var(--accent-blue)", textDecoration: "none", fontWeight: 600 }}>Create one</Link>
          </p>

          <div style={{ marginTop: "24px", paddingTop: "20px", borderTop: "1px solid var(--border-primary)", display: "flex", justifyContent: "center" }}>
            <p style={{ fontSize: "12px", color: "var(--text-secondary)", display: "flex", alignItems: "center" }}>
              HIPAA Certified
              <span style={{ display: "inline-block", width: "3px", height: "3px", borderRadius: "50%", background: "var(--text-secondary)", opacity: 0.5, margin: "0 10px" }} />
              SOC 2 Type II
              <span style={{ display: "inline-block", width: "3px", height: "3px", borderRadius: "50%", background: "var(--text-secondary)", opacity: 0.5, margin: "0 10px" }} />
              FHIR Ready
            </p>
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
