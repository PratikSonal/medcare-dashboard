import { motion } from "framer-motion";
import { memo, useCallback } from "react";
import { Controller } from "react-hook-form";

import type { PatientStatus } from "@/features/patients/types";

import { DEPARTMENTS, DOCTORS, STATUS_COLORS, STATUSES } from "../constants";
import { Field } from "../Field";
import { getInputCls } from "../helpers";
import type { StepProps } from "../types";

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

export const Step1Clinical = memo(({ register, control, errors }: StepProps): React.ReactElement => (
  <motion.div
    key="s1"
    initial={{ opacity: 0, x: 20 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: -20 }}
    transition={{ duration: 0.18 }}
    className="flex flex-col gap-4"
  >
    <Field label="Status">
      <Controller
        name="status"
        control={control}
        render={({ field }) => (
          <div className="flex gap-2 flex-wrap">
            {STATUSES.map(status => (
              <StatusPill
                key={status}
                status={status}
                isSelected={field.value === status}
                color={STATUS_COLORS[status]}
                onSelect={field.onChange}
              />
            ))}
          </div>
        )}
      />
    </Field>
    <Field label="Diagnosis" error={errors.diagnosis?.message}>
      <input
        {...register("diagnosis")}
        placeholder="e.g. Type 2 Diabetes"
        className={getInputCls(!!errors.diagnosis)}
      />
    </Field>
    <div className="grid grid-cols-2 gap-4">
      <Field label="Department">
        <select {...register("department")} className={getInputCls(false)}>
          {DEPARTMENTS.map(dept => (
            <option key={dept}>{dept}</option>
          ))}
        </select>
      </Field>
      <Field label="Attending Doctor">
        <select {...register("doctor")} className={getInputCls(false)}>
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
          {...register("admissionDate")}
          className={getInputCls(false)}
        />
      </Field>
      <Field label="Tags (comma-separated)">
        <input
          {...register("tags")}
          placeholder="Diabetic, High BP"
          className={getInputCls(false)}
        />
      </Field>
    </div>
  </motion.div>
));
