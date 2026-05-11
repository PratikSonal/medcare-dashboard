import { useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { Eye, EyeOff, Mail, Lock, Activity, Shield, Zap, Brain, Heart, Clock, TrendingUp, User } from "lucide-react";
import { auth } from "@/lib/firebase";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { setError, setLoading } from "@/features/auth/authSlice";
import { showWelcomeNotification, registerServiceWorker } from "@/lib/notifications";
import { Button } from "@/components/ui/Button";

const slides = [
  { icon: Shield,     color: "#3c83f6", stat: "99.9%",  headline: "Always On",             description: "Round-the-clock monitoring with enterprise-grade uptime SLA and zero workflow interruptions." },
  { icon: Zap,        color: "#0ea5e9", stat: "170%",   headline: "Smarter Scheduling",    description: "Patients book in under 2 minutes. 44.5% of bookings happen after hours — automatically." },
  { icon: Brain,      color: "#7c3bed", stat: "1000+",  headline: "AI Does the Paperwork", description: "Intake forms, prescription refills, prior auths — automated. 1000+ staff hours saved weekly." },
  { icon: Heart,      color: "#38bdf8", stat: "46.5%",  headline: "Fewer Claim Denials",   description: "Pre-visit eligibility checks and real-time benefit verification eliminate failures early." },
  { icon: TrendingUp, color: "#0ea5e9", stat: "$5M+",   headline: "Revenue Impact",        description: "Higher bookings, saved staff time, improved margins — $5M+ revenue impact per practice annually." },
  { icon: Clock,      color: "#3c83f6", stat: "2 min",  headline: "Instant Onboarding",    description: "Up and running in days, not months. White glove support and direct EHR integration." },
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
      <div style={{ height: "120px", overflow: "hidden", position: "relative" }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="flex items-stretch gap-5 h-full absolute w-full"
          >
            <div className="flex items-center justify-center shrink-0">
              <Icon size={56} style={{ color: slide.color }} />
            </div>
            <div className="flex flex-col justify-center">
              <div className="flex items-baseline gap-[10px] mb-2">
                <span style={{ fontSize: "32px", fontWeight: 800, color: slide.color, lineHeight: 1, letterSpacing: "-0.02em" }}>{slide.stat}</span>
                <span style={{ fontSize: "16px", fontWeight: 600, color: "#f8fafc", lineHeight: 1 }}>{slide.headline}</span>
              </div>
              <p style={{ fontSize: "13px", color: "#9ca3af", lineHeight: 1.55, margin: 0, maxWidth: "300px" }}>{slide.description}</p>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
      <div className="flex items-center gap-[6px] mt-5">
        {slides.map((s, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            className="h-[6px] rounded-full border-0 cursor-pointer p-0 transition-all duration-300"
            style={{ width: i === active ? "20px" : "6px", background: i === active ? s.color : "#1d2839" }}
          />
        ))}
      </div>
    </>
  );
}

export default function LoginPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { pathname } = useLocation();
  const isRegister = pathname === "/register";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLocalLoading] = useState(false);
  const [error, setLocalError] = useState("");

  useEffect(() => {
    setName(""); setEmail(""); setPassword(""); setLocalError("");
  }, [isRegister]);

  const validate = () => {
    if (isRegister && !name.trim()) { setLocalError("Full name is required"); return false; }
    if (!email) { setLocalError("Email is required"); return false; }
    if (!/\S+@\S+\.\S+/.test(email)) { setLocalError("Enter a valid email"); return false; }
    if (!password) { setLocalError("Password is required"); return false; }
    if (password.length < 6) { setLocalError("Password must be at least 6 characters"); return false; }
    return true;
  };

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLocalError("");
    if (!validate()) return;
    setLocalLoading(true);
    dispatch(setLoading(true));
    try {
      if (isRegister) {
        const result = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(result.user, { displayName: name });
        showWelcomeNotification(name);
      } else {
        const result = await signInWithEmailAndPassword(auth, email, password);
        await registerServiceWorker();
        showWelcomeNotification(result.user.displayName || result.user.email || "Doctor");
      }
      navigate("/dashboard");
    } catch (err: unknown) {
      const code = (err as { code?: string }).code || "";
      const messages: Record<string, string> = {
        "auth/user-not-found": "No account found with this email.",
        "auth/wrong-password": "Incorrect password. Please try again.",
        "auth/invalid-credential": "Invalid email or password.",
        "auth/email-already-in-use": "An account with this email already exists.",
        "auth/weak-password": "Password must be at least 6 characters.",
        "auth/too-many-requests": "Too many attempts. Please try again later.",
        "auth/network-request-failed": "Network error. Check your connection.",
      };
      const msg = messages[code] || (isRegister ? "Registration failed. Please try again." : "Login failed. Please try again.");
      setLocalError(msg);
      dispatch(setError(msg));
    } finally {
      setLocalLoading(false);
    }
  };

  return (
    <div className="dot-grid min-h-screen flex bg-bg-primary">

      {/* ── Left Panel — always dark ── */}
      <motion.div
        initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="hidden lg:flex"
        style={{ flexDirection: "column", width: "52%", position: "relative", overflow: "hidden", background: "#0c111d", borderRight: "1px solid #1d2839" }}
      >
        <div style={{ position: "absolute", top: "-80px", left: "-80px", width: "400px", height: "400px", borderRadius: "50%", opacity: 0.07, filter: "blur(80px)", background: "#3c83f6", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: "-80px", right: "-60px", width: "350px", height: "350px", borderRadius: "50%", opacity: 0.05, filter: "blur(80px)", background: "#0ea5e9", pointerEvents: "none" }} />

        <div style={{ padding: "40px 48px 0", position: "relative", zIndex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{ width: "36px", height: "36px", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--gradient-primary)", flexShrink: 0 }}>
              <Activity size={18} color="white" />
            </div>
            <span className="gradient-text" style={{ fontSize: "18px", fontWeight: 700 }}>MedCare</span>
          </div>
        </div>

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
        className="flex-1 flex items-center justify-center p-8"
      >
        <div className="w-full max-w-[400px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={isRegister ? "register" : "login"}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
            >
              <div className="mb-7">
                <h2 className="text-[26px] font-bold text-text-primary mb-[6px] tracking-[-0.01em]">
                  {isRegister ? "Join MedCare" : "Welcome back"}
                </h2>
                <p className="text-sm text-text-secondary">
                  {isRegister ? "Sign up for MedCare" : "Sign in to your MedCare account"}
                </p>
              </div>

              <form onSubmit={handleSubmit} className="flex flex-col gap-[14px]">

                {isRegister && (
                  <div className="flex flex-col gap-[6px]">
                    <label className="text-[13px] font-medium text-text-secondary">Full Name</label>
                    <div className="relative">
                      <User size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary" />
                      <input
                        type="text"
                        placeholder="Dr. Jane Smith"
                        value={name}
                        onChange={(e) => { setName(e.target.value); setLocalError(""); }}
                        className="w-full bg-bg-secondary border border-border-primary rounded-[12px] py-3 px-4 pl-[38px] text-sm text-text-primary outline-none font-sans transition-colors duration-200 focus:border-accent-blue box-border"
                      />
                    </div>
                  </div>
                )}

                <div className="flex flex-col gap-[6px]">
                  <label className="text-[13px] font-medium text-text-secondary">Email Address</label>
                  <div className="relative">
                    <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary" />
                    <input
                      type="email"
                      placeholder="doctor@medcare.com"
                      value={email}
                      onChange={(e) => { setEmail(e.target.value); setLocalError(""); }}
                      className="w-full bg-bg-secondary border border-border-primary rounded-[12px] py-3 px-4 pl-[38px] text-sm text-text-primary outline-none font-sans transition-colors duration-200 focus:border-accent-blue box-border"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-[6px]">
                  <div className="flex items-center justify-between">
                    <label className="text-[13px] font-medium text-text-secondary">Password</label>
                    {!isRegister && (
                      <button
                        type="button"
                        className="text-xs text-accent-blue bg-transparent border-0 cursor-pointer font-sans p-0"
                      >
                        Forgot password?
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary" />
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => { setPassword(e.target.value); setLocalError(""); }}
                      className="w-full bg-bg-secondary border border-border-primary rounded-[12px] py-3 px-4 pl-[38px] pr-[38px] text-sm text-text-primary outline-none font-sans transition-colors duration-200 focus:border-accent-blue box-border"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 bg-transparent border-0 cursor-pointer text-text-tertiary flex items-center p-0"
                    >
                      {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </div>

                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-2 py-[10px] px-[14px] rounded-[10px] text-[13px] bg-[rgba(239,68,68,0.08)] border border-[rgba(239,68,68,0.2)] text-accent-red"
                  >
                    ⚠️ {error}
                  </motion.div>
                )}

                <Button
                  type="submit"
                  loading={loading}
                  className="w-full mt-[6px]"
                  style={{ padding: "13px", fontSize: "14px", borderRadius: "12px", background: "var(--gradient-primary)", border: "none", color: "white", fontWeight: 600, cursor: loading ? "not-allowed" : "pointer", fontFamily: "inherit" }}
                >
                  {isRegister ? "Create Account" : "Sign In to MedCare"}
                </Button>
              </form>

              <p className="text-center text-[13px] text-text-secondary mt-5">
                {isRegister ? "Already have an account? " : "Don't have an account? "}
                <Link to={isRegister ? "/login" : "/register"} className="text-accent-blue no-underline font-semibold">
                  {isRegister ? "Sign in" : "Create one"}
                </Link>
              </p>

            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
