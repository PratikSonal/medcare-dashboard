import { useState, useEffect, useCallback } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { Eye, EyeOff, Mail, Lock, User } from "lucide-react";
import { auth } from "@/lib/firebase";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { setError, setLoading } from "@/features/auth/authSlice";
import { showWelcomeNotification, registerServiceWorker } from "@/lib/notifications";
import { Button } from "@/components/ui/Button";

const ERROR_MESSAGES: Record<string, string> = {
  "auth/user-not-found": "No account found with this email.",
  "auth/wrong-password": "Incorrect password. Please try again.",
  "auth/invalid-credential": "Invalid email or password.",
  "auth/email-already-in-use": "An account with this email already exists.",
  "auth/weak-password": "Password must be at least 6 characters.",
  "auth/too-many-requests": "Too many attempts. Please try again later.",
  "auth/network-request-failed": "Network error. Check your connection.",
};

export const AuthForm = () => {
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
    setName("");
    setEmail("");
    setPassword("");
    setLocalError("");
  }, [isRegister]);

  const validate = useCallback(() => {
    if (isRegister && !name.trim()) {
      setLocalError("Full name is required");
      return false;
    }
    if (!email) {
      setLocalError("Email is required");
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setLocalError("Enter a valid email");
      return false;
    }
    if (!password) {
      setLocalError("Password is required");
      return false;
    }
    if (password.length < 6) {
      setLocalError("Password must be at least 6 characters");
      return false;
    }
    return true;
  }, [isRegister, name, email, password]);

  const handleSubmit = useCallback(
    async (e: React.SyntheticEvent<HTMLFormElement>) => {
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
        const msg =
          ERROR_MESSAGES[code] ||
          (isRegister
            ? "Registration failed. Please try again."
            : "Login failed. Please try again.");
        setLocalError(msg);
        dispatch(setError(msg));
      } finally {
        setLocalLoading(false);
      }
    },
    [validate, isRegister, name, email, password, navigate, dispatch],
  );

  return (
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
                    <User
                      size={15}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary"
                    />
                    <input
                      type="text"
                      placeholder="Dr. Jane Smith"
                      value={name}
                      onChange={e => {
                        setName(e.target.value);
                        setLocalError("");
                      }}
                      className="w-full bg-bg-secondary border border-border-primary rounded-[12px] py-3 px-4 pl-[38px] text-sm text-text-primary outline-none font-sans transition-colors duration-200 focus:border-accent-blue box-border"
                    />
                  </div>
                </div>
              )}

              <div className="flex flex-col gap-[6px]">
                <label className="text-[13px] font-medium text-text-secondary">Email Address</label>
                <div className="relative">
                  <Mail
                    size={15}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary"
                  />
                  <input
                    type="email"
                    placeholder="doctor@medcare.com"
                    value={email}
                    onChange={e => {
                      setEmail(e.target.value);
                      setLocalError("");
                    }}
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
                  <Lock
                    size={15}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary"
                  />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={e => {
                      setPassword(e.target.value);
                      setLocalError("");
                    }}
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
                style={{
                  padding: "13px",
                  fontSize: "14px",
                  borderRadius: "12px",
                  background: "var(--gradient-primary)",
                  border: "none",
                  color: "white",
                  fontWeight: 600,
                  cursor: loading ? "not-allowed" : "pointer",
                  fontFamily: "inherit",
                }}
              >
                {isRegister ? "Create Account" : "Sign In to MedCare"}
              </Button>
            </form>

            <p className="text-center text-[13px] text-text-secondary mt-5">
              {isRegister ? "Already have an account? " : "Don't have an account? "}
              <Link
                to={isRegister ? "/login" : "/register"}
                className="text-accent-blue no-underline font-semibold"
              >
                {isRegister ? "Sign in" : "Create one"}
              </Link>
            </p>
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  );
};
