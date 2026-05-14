import { memo } from "react";
import { motion } from "framer-motion";
import { Activity, Heart } from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { getStatusBg, getStatusColor } from "@/features/patients/utils";
import { formatDate, cn } from "@/utils";
import type { PatientCardProps, PatientGridProps } from "./types";
import { container, item } from "../constants";

const PatientCard = memo(({ patient, onPatientClick }: PatientCardProps): React.ReactElement => {
  const isCritical = patient.status === "Critical";
  return (
    <motion.div
      variants={item}
      onClick={() => onPatientClick(patient)}
      whileHover={{ y: -3, transition: { duration: 0.2 } }}
      className={cn(
        "glass-card rounded-20 p-5 cursor-pointer relative overflow-hidden",
        isCritical && "border-[rgba(239,68,68,0.4)]",
      )}
    >
      {isCritical && (
        <div
          className="absolute top-3 right-3 w-2 h-2 rounded-full bg-accent-red"
          style={{ animation: "pulse 2s ease-in-out infinite" }}
        />
      )}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.15] [background:var(--gradient-card)]"
      />
      <div className="relative">
        <div className="flex items-start gap-3 mb-[14px]">
          <Avatar initials={patient.avatar} size={44} radius="14px" />
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <h3 className="text-sm font-semibold text-text-primary overflow-hidden text-ellipsis whitespace-nowrap">
                {patient.name}
              </h3>
              <span
                className="text-[11px] font-medium py-[2px] px-2 rounded-[8px] shrink-0"
                style={{
                  background: getStatusBg(patient.status),
                  color: getStatusColor(patient.status),
                }}
              >
                {patient.status}
              </span>
            </div>
            <p className="text-[11px] text-text-tertiary mt-[2px]">
              {patient.id} · {patient.age}y · {patient.gender}
            </p>
          </div>
        </div>
        <div className="flex flex-col gap-[6px] mb-[14px]">
          <div className="flex items-center gap-2 text-xs text-text-secondary">
            <Activity size={12} className="text-accent-blue shrink-0" />
            <span className="overflow-hidden text-ellipsis whitespace-nowrap">
              {patient.diagnosis}
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs text-text-secondary">
            <Heart size={12} className="text-accent-cyan shrink-0" />
            <span className="overflow-hidden text-ellipsis whitespace-nowrap">
              {patient.department}
            </span>
          </div>
        </div>
        <div className="flex items-center justify-between pt-3 border-t border-border-primary">
          <span className="text-[11px] text-text-tertiary overflow-hidden text-ellipsis whitespace-nowrap flex-1">
            {patient.doctor}
          </span>
          <span className="text-[11px] text-text-tertiary shrink-0 ml-2">
            {formatDate(patient.lastVisit)}
          </span>
        </div>
        {patient.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-[10px]">
            {patient.tags.slice(0, 2).map(tag => (
              <span
                key={tag}
                className="text-[10px] py-[2px] px-2 rounded-full bg-bg-tertiary text-text-tertiary"
              >
                {tag}
              </span>
            ))}
            {patient.tags.length > 2 && (
              <span className="text-[10px] py-[2px] px-2 rounded-full bg-bg-tertiary text-text-tertiary">
                +{patient.tags.length - 2}
              </span>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
});

export const PatientGrid = memo(({ filteredPatients, onPatientClick }: PatientGridProps): React.ReactElement => (
  <motion.div
    key="grid"
    variants={container}
    initial="hidden"
    animate="show"
    exit={{ opacity: 0 }}
    className="grid grid-cols-[repeat(auto-fill,minmax(260px,1fr))] gap-4"
  >
    {filteredPatients.map(patient => (
      <PatientCard key={patient.id} patient={patient} onPatientClick={onPatientClick} />
    ))}
  </motion.div>
));
