import { useMemo } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/hooks/useAppDispatch";
import { setSelectedPatient, setFilterStatus } from "@/features/patients/patientsSlice";
import { item } from "../constants";

export const CriticalBanner = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const patients = useAppSelector(s => s.patients.patients);
  const criticalPatients = useMemo(() => patients.filter(p => p.status === "Critical"), [patients]);

  if (criticalPatients.length === 0) return null;

  return (
    <motion.div
      variants={item}
      className="mb-6 px-5 py-4 rounded-16 bg-[rgba(239,68,68,0.06)] border border-[rgba(239,68,68,0.25)]"
      style={{ animation: "alert-pulse 3s ease-in-out infinite" }}
    >
      <div className="flex items-center gap-2 mb-3">
        <AlertTriangle size={14} className="text-accent-red shrink-0" />
        <p className="text-[13px] font-semibold text-accent-red">
          {criticalPatients.length} Critical Patient{criticalPatients.length > 1 ? "s" : ""} —
          Immediate Attention Required
        </p>
        <button
          onClick={() => {
            dispatch(setFilterStatus("Critical"));
            navigate("/patients");
          }}
          className="ml-auto flex items-center gap-[3px] text-xs text-accent-red bg-transparent border-0 cursor-pointer font-sans font-medium shrink-0"
        >
          View all <ChevronRight size={13} />
        </button>
      </div>
      <div className="flex flex-wrap gap-[10px]">
        {criticalPatients.map((p, i) => (
          <motion.div
            key={p.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.09, duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
            whileHover={{ x: 4, y: -2, transition: { duration: 0.22, ease: "easeOut" } }}
            onClick={() => dispatch(setSelectedPatient(p))}
            className="flex items-center gap-[10px] px-[14px] py-[10px] rounded-12 bg-[rgba(239,68,68,0.08)] border border-[rgba(239,68,68,0.2)] cursor-pointer flex-1 min-w-[220px] transition-colors duration-200 hover:bg-[rgba(239,68,68,0.14)]"
            style={{ boxShadow: "0 2px 8px rgba(239,68,68,0.12), 0 1px 3px rgba(239,68,68,0.08)" }}
          >
            <div className="relative w-8 h-8 shrink-0">
              <div
                className="absolute inset-0 rounded-full bg-accent-red"
                style={{ animation: "ping-red 2s ease-out infinite" }}
              />
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold text-white bg-accent-red relative z-10">
                {p.avatar}
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-semibold text-text-primary overflow-hidden text-ellipsis whitespace-nowrap">
                {p.name}
              </p>
              <p className="text-[11px] text-text-tertiary overflow-hidden text-ellipsis whitespace-nowrap">
                {p.diagnosis} · {p.department}
              </p>
            </div>
            <ChevronRight size={14} className="text-accent-red shrink-0" />
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};
