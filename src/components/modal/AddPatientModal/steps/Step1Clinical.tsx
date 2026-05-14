import { memo, useCallback } from "react";
import { motion } from "framer-motion";
import { Field } from "../Field";
import { getInputCls } from "../helpers";
import { DEPARTMENTS, DOCTORS, STATUSES, STATUS_COLORS } from "../constants";
import type { StepProps } from "../types";
import type { PatientStatus } from "@/features/patients/types";

interface StatusPillProps {
  status: PatientStatus;
  isSelected: boolean;
  color: string;
  onSelect: (status: PatientStatus) => void;
}

const StatusPill = memo(({ status, isSelected, color, onSelect }: StatusPillProps): React.ReactElement => {
  const handleClick = useCallback(() => onSelect(status), [status, onSelect]);
  return (
    <button
      type="button"
      onClick={handleClick}
      className="py-[7px] px-[14px] rounded-[10px] text-xs font-semibold cursor-pointer font-sans transition-all duration-150"
      style={{
        border: `1px solid ${isSelected ? color : "var(--border-primary)"}`,
        background: isSelected ? `${color}18` : "var(--bg-secondary)",
        color: isSelected ? color : "var(--text-secondary)",
      }}
    >
      {status}
    </button>
  );
});

interface Props extends StepProps {
  onSelectStatus: (status: PatientStatus) => void;
}

export const Step1Clinical = memo(({ form, errors, set, onSelectStatus }: Props): React.ReactElement => (
  <motion.div
    key="s1"
    initial={{ opacity: 0, x: 20 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: -20 }}
    transition={{ duration: 0.18 }}
    className="flex flex-col gap-4"
  >
    <Field label="Status">
      <div className="flex gap-2 flex-wrap">
        {STATUSES.map(status => (
          <StatusPill
            key={status}
            status={status}
            isSelected={form.status === status}
            color={STATUS_COLORS[status]}
            onSelect={onSelectStatus}
          />
        ))}
      </div>
    </Field>
    <Field label="Diagnosis" error={errors.diagnosis}>
      <input
        value={form.diagnosis}
        onChange={set("diagnosis")}
        placeholder="e.g. Type 2 Diabetes"
        className={getInputCls("diagnosis", errors)}
      />
    </Field>
    <div className="grid grid-cols-2 gap-4">
      <Field label="Department">
        <select value={form.department} onChange={set("department")} className={getInputCls("department", errors)}>
          {DEPARTMENTS.map(dept => (
            <option key={dept}>{dept}</option>
          ))}
        </select>
      </Field>
      <Field label="Attending Doctor">
        <select value={form.doctor} onChange={set("doctor")} className={getInputCls("doctor", errors)}>
          {DOCTORS.map(doctor => (
            <option key={doctor}>{doctor}</option>
          ))}
        </select>
      </Field>
    </div>
    <div className="grid grid-cols-2 gap-4">
      <Field label="Admission Date">
        <input
          type="date"
          value={form.admissionDate}
          onChange={set("admissionDate")}
          className={getInputCls("admissionDate", errors)}
        />
      </Field>
      <Field label="Tags (comma-separated)">
        <input
          value={form.tags}
          onChange={set("tags")}
          placeholder="Diabetic, High BP"
          className={getInputCls("tags", errors)}
        />
      </Field>
    </div>
  </motion.div>
));
