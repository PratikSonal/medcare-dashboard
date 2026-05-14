import { memo, useCallback, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff, Mail, Lock, User, AlertCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/Button";
import { AuthInput } from "@/components/ui/AuthInput";
import { useAuth } from "@/hooks/useAuth";
import { registerSchema } from "@/lib/validators";
import type { RegisterFields } from "@/lib/validators";

export const RegisterForm = memo((): React.ReactElement => {
  const { register: registerUser, isLoading, error, clearError } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFields>({
    resolver: zodResolver(registerSchema),
    mode: "onTouched",
  });

  const onSubmit = useCallback(async (data: RegisterFields): Promise<void> => {
    clearError();
    await registerUser(data.name, data.email, data.password);
  }, [clearError, registerUser]);

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
            Join MedCare
          </h2>
          <p className="text-sm text-text-secondary">Create your account to get started</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-[14px]" noValidate>
          <AuthInput
            inputId="name"
            label="Full Name"
            icon={User}
            type="text"
            placeholder="Dr. Jane Smith"
            autoComplete="name"
            error={errors.name?.message}
            {...register("name")}
          />

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
            placeholder="Min. 6 characters"
            autoComplete="new-password"
            error={errors.password?.message}
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
                className="flex items-center gap-2 py-[10px] px-[14px] rounded-[10px] text-[13px] bg-[rgba(239,68,68,0.08)] border border-[rgba(239,68,68,0.2)] text-accent-red"
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
            Create Account
          </Button>
        </form>

        <p className="text-center text-[13px] text-text-secondary mt-5">
          Already have an account?{" "}
          <Link to="/login" className="text-accent-blue no-underline font-semibold">
            Sign in
          </Link>
        </p>
      </div>
    </motion.div>
  );
});
