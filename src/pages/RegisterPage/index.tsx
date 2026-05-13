import { motion } from "framer-motion";
import { Activity } from "lucide-react";
import { RegisterCard } from "./components/RegisterCard";

const RegisterPage = () => (
  <div
    className="min-h-screen flex items-center justify-center p-6 font-sans"
    style={{ background: "#070d1a" }}
  >
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
      className="w-full max-w-[420px]"
    >
      <div className="flex items-center gap-[10px] mb-9 justify-center">
        <div
          style={{
            width: "32px",
            height: "32px",
            borderRadius: "8px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#1d4ed8",
          }}
        >
          <Activity size={16} color="#bfdbfe" />
        </div>
        <span
          style={{ fontSize: "16px", fontWeight: 600, color: "#e2e8f0", letterSpacing: "-0.01em" }}
        >
          MedCare
        </span>
      </div>

      <RegisterCard />

      <div className="text-center mt-5 flex items-center justify-center gap-4">
        {["HIPAA", "SOC 2", "FDA Ready"].map(b => (
          <span key={b} className="text-[11px] font-medium" style={{ color: "#1e3a5f" }}>
            {b}
          </span>
        ))}
      </div>
    </motion.div>
  </div>
);

export default RegisterPage;
