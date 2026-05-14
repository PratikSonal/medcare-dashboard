import { motion } from "framer-motion";
import { memo } from "react";

import { BLOOD_GROUPS } from "../constants";
import { Field } from "../Field";
import { getInputCls } from "../helpers";
import type { StepProps } from "../types";

export const Step0Personal = memo(({ register, errors }: StepProps): React.ReactElement => (
  <motion.div
    key="s0"
    initial={{ opacity: 0, x: 20 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: -20 }}
    transition={{ duration: 0.18 }}
    className="flex flex-col gap-4"
  >
    <Field label="Full Name" error={errors.name?.message}>
      <input
        {...register("name")}
        placeholder="e.g. Riya Mehta"
        className={getInputCls(!!errors.name)}
      />
    </Field>
    <div className="grid grid-cols-2 gap-4">
      <Field label="Age" error={errors.age?.message}>
        <input
          type="number"
          min={1}
          max={120}
          {...register("age")}
          placeholder="35"
          className={getInputCls(!!errors.age)}
        />
      </Field>
      <Field label="Gender">
        <select {...register("gender")} className={getInputCls(false)}>
          <option>Male</option>
          <option>Female</option>
          <option>Other</option>
        </select>
      </Field>
    </div>
    <div className="grid grid-cols-2 gap-4">
      <Field label="Blood Group">
        <select {...register("bloodGroup")} className={getInputCls(false)}>
          {BLOOD_GROUPS.map(bg => (
            <option key={bg}>{bg}</option>
          ))}
        </select>
      </Field>
      <Field label="Phone" error={errors.phone?.message}>
        <input
          {...register("phone")}
          placeholder="+91 98765 12345"
          className={getInputCls(!!errors.phone)}
        />
      </Field>
    </div>
    <Field label="Email" error={errors.email?.message}>
      <input
        type="email"
        {...register("email")}
        placeholder="patient@email.com"
        className={getInputCls(!!errors.email)}
      />
    </Field>
    <Field label="Address">
      <input
        {...register("address")}
        placeholder="Street, City"
        className={getInputCls(false)}
      />
    </Field>
  </motion.div>
));
