import { useState, useId } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { AuthInput } from "@/components/ui/AuthInput";
import { useAuth } from "@/hooks/useAuth";
import { loginSchema } from "@/lib/validators";

export const LoginForm = (): React.ReactElement => {
  const { signIn, isLoading, error, clearError } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  const emailId = useId();
  const passwordId = useId();

  const displayError = validationError ?? error;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const result = loginSchema.safeParse({ email, password });
    if (!result.success) {
      setValidationError(result.error.issues[0].message);
      return;
    }
    setValidationError(null);
    await signIn(email, password);
  };

  const handleChange = (setter: (v: string) => void) => (e: React.ChangeEvent<HTMLInputElement>): void => {
    setter(e.target.value);
    setValidationError(null);
    clearError();
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="flex-1 flex items-center justify-center p-8"
    >
      <div className="w-full max-w-[400px]">
        <div className="mb-7">
          <h2 className="text-[26px] font-bold text-text-primary mb-[6px] tracking-[-0.01em]">
            Welcome back
          </h2>
          <p className="text-sm text-text-secondary">Sign in to your MedCare account</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-[14px]" noValidate>
          <AuthInput
            inputId={emailId}
            label="Email Address"
            icon={Mail}
            type="email"
            placeholder="doctor@medcare.com"
            value={email}
            onChange={handleChange(setEmail)}
            autoComplete="email"
          />

          <AuthInput
            inputId={passwordId}
            label="Password"
            icon={Lock}
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            value={password}
            onChange={handleChange(setPassword)}
            autoComplete="current-password"
            headerRight={
              <button
                type="button"
                className="text-xs text-accent-blue bg-transparent border-0 cursor-pointer font-sans p-0"
              >
                Forgot password?
              </button>
            }
            rightElement={
              <button
                type="button"
                aria-label={showPassword ? "Hide password" : "Show password"}
                onClick={() => setShowPassword(v => !v)}
                className="bg-transparent border-0 cursor-pointer text-text-tertiary flex items-center p-0"
              >
                {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            }
          />

          <AnimatePresence>
            {displayError && (
              <motion.p
                key="error"
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                className="flex items-center gap-2 py-[10px] px-[14px] rounded-[10px] text-[13px] bg-[rgba(239,68,68,0.08)] border border-[rgba(239,68,68,0.2)] text-accent-red"
                role="alert"
              >
                ⚠️ {displayError}
              </motion.p>
            )}
          </AnimatePresence>

          <Button
            type="submit"
            loading={isLoading}
            className="w-full mt-[6px] p-[13px] text-[14px] rounded-12 font-semibold"
            style={{ background: "var(--gradient-primary)" }}
          >
            Sign In to MedCare
          </Button>
        </form>

        <p className="text-center text-[13px] text-text-secondary mt-5">
          Don&apos;t have an account?{" "}
          <Link to="/register" className="text-accent-blue no-underline font-semibold">
            Create one
          </Link>
        </p>
      </div>
    </motion.div>
  );
};
