import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence,motion } from "framer-motion";
import { AlertCircle,Eye, EyeOff, Lock, Mail } from "lucide-react";
import { memo, useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";

import { AuthInput } from "@/components/ui/AuthInput";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/hooks/useAuth";
import type { LoginFields } from "@/lib/validators";
import { loginSchema } from "@/lib/validators";

export const LoginForm = memo((): React.ReactElement => {
  const { signIn, isLoading, error, clearError } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFields>({
    resolver: zodResolver(loginSchema),
    mode: "onTouched",
  });

  const onSubmit = useCallback(async (data: LoginFields): Promise<void> => {
    clearError();
    await signIn(data.email, data.password);
  }, [clearError, signIn]);

  const handleTogglePassword = useCallback(() => setShowPassword(v => !v), []);

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

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-[14px]" noValidate>
          <AuthInput
            inputId="email"
            label="Email Address"
            icon={Mail}
            type="email"
            placeholder="doctor@medcare.com"
            autoComplete="email"
            error={errors.email?.message}
            {...register("email")}
          />

          <AuthInput
            inputId="password"
            label="Password"
            icon={Lock}
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            autoComplete="current-password"
            error={errors.password?.message}
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
                onClick={handleTogglePassword}
                className="bg-transparent border-0 cursor-pointer text-text-tertiary flex items-center p-0"
              >
                {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            }
            {...register("password")}
          />

          <AnimatePresence>
            {error && (
              <motion.p
                key="error"
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                className="flex items-center gap-2 py-[10px] px-[14px] rounded-[10px] text-[13px] bg-[var(--accent-red-muted)] border border-[var(--accent-red-border)] text-accent-red"
                role="alert"
              >
                <AlertCircle size={14} />
                {error}
              </motion.p>
            )}
          </AnimatePresence>

          <Button
            type="submit"
            loading={isLoading}
            className="w-full mt-[6px] p-[13px] text-[14px] rounded-12 font-semibold [background:var(--gradient-primary)]"
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
});
