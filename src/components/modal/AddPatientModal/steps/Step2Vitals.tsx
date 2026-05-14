import { motion } from "framer-motion";
import { memo } from "react";

import { cn } from "@/utils";

import { Field } from "../Field";
import { getInputCls } from "../helpers";
import type { StepProps } from "../types";

interface Props extends StepProps {
  nextId: string;
}

export const Step2Vitals = memo(({ register, errors, nextId }: Props): React.ReactElement => (
  <motion.div
    key="s2"
    initial={{ opacity: 0, x: 20 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: -20 }}
    transition={{ duration: 0.18 }}
    className="flex flex-col gap-4"
  >
    <div className="grid grid-cols-2 gap-4">
      <Field label="Heart Rate (bpm)" error={errors.heartRate?.message}>
        <input
          type="number"
          {...register("heartRate")}
          placeholder="72"
          className={getInputCls(!!errors.heartRate)}
        />
      </Field>
      <Field label="Blood Pressure" error={errors.bloodPressure?.message}>
        <input
          {...register("bloodPressure")}
          placeholder="120/80"
          className={getInputCls(!!errors.bloodPressure)}
        />
      </Field>
    </div>
    <div className="grid grid-cols-2 gap-4">
      <Field label="Temperature (°F)" error={errors.temperature?.message}>
        <input
          type="number"
          step="0.1"
          {...register("temperature")}
          placeholder="98.6"
          className={getInputCls(!!errors.temperature)}
        />
      </Field>
      <Field label="Oxygen Saturation (%)" error={errors.oxygenSat?.message}>
        <input
          type="number"
          min={0}
          max={100}
          {...register("oxygenSat")}
          placeholder="98"
          className={getInputCls(!!errors.oxygenSat)}
        />
      </Field>
    </div>
    <Field label="Weight (kg)" error={errors.weight?.message}>
      <input
        type="number"
        {...register("weight")}
        placeholder="70"
        className={cn(getInputCls(!!errors.weight), "max-w-[calc(50%-8px)]")}
      />
    </Field>
    <div className="py-3 px-4 bg-bg-tertiary rounded-[12px]">
      <p className="text-xs text-text-secondary">
        Patient ID <strong className="text-text-primary">{nextId}</strong> will be assigned on
        creation.
      </p>
    </div>
  </motion.div>
));
