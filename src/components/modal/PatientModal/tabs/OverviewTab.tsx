import { memo } from "react";
import { motion } from "framer-motion";
import { Heart, Thermometer, Wind, Activity, Phone, Mail, MapPin } from "lucide-react";
import { formatDate, cn } from "@/utils";
import type { Patient } from "@/features/patients/types";
import type { VitalBadgeProps } from "../types";

const VitalBadge = memo(({ icon, label, value, alert = false }: VitalBadgeProps): React.ReactElement => (
  <motion.div
    whileHover={{ scale: 1.1, transition: { duration: 0.2, ease: "easeOut" } }}
    className={cn(
      "flex flex-col items-center p-3 rounded-[12px] cursor-default",
      alert
        ? "bg-[rgba(239,68,68,0.08)] border border-[rgba(239,68,68,0.2)]"
        : "bg-bg-tertiary border border-border-primary",
    )}
  >
    <div className={cn(alert ? "text-accent-red" : "text-accent-blue")}>{icon}</div>
    <p className="text-[10px] text-text-tertiary mt-1 text-center">{label}</p>
    <p className="text-xs font-bold text-text-primary mt-[2px] text-center">{value}</p>
  </motion.div>
));

interface Props {
  patient: Patient;
}

export const OverviewTab = memo(({ patient }: Props): React.ReactElement => (
  <motion.div
    key="overview"
    initial={{ opacity: 0, y: 8 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0 }}
    className="flex flex-col gap-6"
  >
    <div className="grid grid-cols-2 gap-3">
      {[
        { label: "Diagnosis", value: patient.diagnosis },
        { label: "Department", value: patient.department },
        { label: "Attending Doctor", value: patient.doctor },
        { label: "Admitted On", value: formatDate(patient.admissionDate) },
      ].map(({ label, value }) => (
        <div key={label} className="glass-card rounded-[14px] p-[14px]">
          <p className="text-[11px] text-text-tertiary mb-1">{label}</p>
          <p className="text-sm font-semibold text-text-primary">{value}</p>
        </div>
      ))}
    </div>

    <div>
      <h3 className="text-sm font-semibold text-text-primary mb-3">Current Vitals</h3>
      <div className="grid grid-cols-5 gap-2">
        <VitalBadge
          icon={<Heart size={16} />}
          label="Heart Rate"
          value={`${patient.vitals.heartRate} bpm`}
          alert={patient.vitals.heartRate > 100}
        />
        <VitalBadge
          icon={<Activity size={16} />}
          label="BP"
          value={patient.vitals.bloodPressure}
          alert={parseInt(patient.vitals.bloodPressure, 10) > 140}
        />
        <VitalBadge
          icon={<Thermometer size={16} />}
          label="Temp"
          value={`${patient.vitals.temperature}°F`}
          alert={patient.vitals.temperature > 100}
        />
        <VitalBadge
          icon={<Wind size={16} />}
          label="O₂ Sat"
          value={`${patient.vitals.oxygenSat}%`}
          alert={patient.vitals.oxygenSat < 93}
        />
        <VitalBadge
          icon={<Activity size={16} />}
          label="Weight"
          value={`${patient.vitals.weight}kg`}
        />
      </div>
    </div>

    <div>
      <h3 className="text-sm font-semibold text-text-primary mb-3">Contact Information</h3>
      <div className="flex flex-col gap-[10px]">
        {[
          { icon: <Phone size={14} />, text: patient.phone },
          { icon: <Mail size={14} />, text: patient.email },
          { icon: <MapPin size={14} />, text: patient.address },
        ].map(({ icon, text }) => (
          <div key={text} className="flex items-center gap-[10px] text-[13px] text-text-secondary">
            <span className="text-accent-blue">{icon}</span>
            {text}
          </div>
        ))}
      </div>
    </div>
  </motion.div>
));
