import { motion } from "framer-motion";
import { Avatar } from "@/components/ui/Avatar";
import { getStatusBg, getStatusColor } from "@/features/patients/utils";
import { formatDate } from "@/utils";
import type { PatientListRowProps, PatientListViewProps } from "./types";
import { container, item } from "../constants";

const PatientListRow = ({ patient, onClick }: PatientListRowProps) => (
  <motion.tr
    variants={item}
    onClick={onClick}
    whileHover={{ x: 4, transition: { duration: 0.3, ease: "easeOut" } }}
    className="cursor-pointer border-b border-border-primary transition-colors duration-200 hover:bg-bg-tertiary"
  >
    <td className="py-[14px] px-4">
      <div className="flex items-center gap-[10px]">
        <Avatar initials={patient.avatar} size={36} radius="10px" />
        <div>
          <p className="text-sm font-medium text-text-primary">{patient.name}</p>
          <p className="text-[11px] text-text-tertiary">{patient.id}</p>
        </div>
      </div>
    </td>
    <td className="py-[14px] px-4 text-[13px] text-text-secondary">
      {patient.age}y · {patient.gender}
    </td>
    <td className="py-[14px] px-4 text-[13px] text-text-secondary">{patient.diagnosis}</td>
    <td className="py-[14px] px-4 text-[13px] text-text-secondary">{patient.department}</td>
    <td className="py-[14px] px-4 text-[13px] text-text-secondary">{patient.doctor}</td>
    <td className="py-[14px] px-4">
      <span
        className="text-xs font-medium py-1 px-[10px] rounded-[8px]"
        style={{ background: getStatusBg(patient.status), color: getStatusColor(patient.status) }}
      >
        {patient.status}
      </span>
    </td>
    <td className="py-[14px] px-4 text-[13px] text-text-secondary">
      {formatDate(patient.lastVisit)}
    </td>
  </motion.tr>
);

export const PatientListView = ({ filteredPatients, onPatientClick }: PatientListViewProps) => (
  <motion.div
    key="list"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="glass-card rounded-20 overflow-hidden"
  >
    <table className="w-full border-collapse">
      <thead className="bg-bg-tertiary border-b border-border-primary">
        <tr>
          {[
            "Patient",
            "Age / Gender",
            "Diagnosis",
            "Department",
            "Doctor",
            "Status",
            "Last Visit",
          ].map(h => (
            <th
              key={h}
              className="text-left py-3 px-4 text-[11px] font-semibold text-text-tertiary uppercase tracking-[0.05em]"
            >
              {h}
            </th>
          ))}
        </tr>
      </thead>
      <motion.tbody variants={container} initial="hidden" animate="show">
        {filteredPatients.map(p => (
          <PatientListRow key={p.id} patient={p} onClick={() => onPatientClick(p)} />
        ))}
      </motion.tbody>
    </table>
  </motion.div>
);
