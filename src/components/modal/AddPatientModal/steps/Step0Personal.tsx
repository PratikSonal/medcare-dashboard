import { memo } from "react";
import { motion } from "framer-motion";
import { Field } from "../Field";
import { getInputCls } from "../helpers";
import { BLOOD_GROUPS } from "../constants";
import type { StepProps } from "../types";

export const Step0Personal = memo(({ form, errors, set }: StepProps): React.ReactElement => (
  <motion.div
    key="s0"
    initial={{ opacity: 0, x: 20 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: -20 }}
    transition={{ duration: 0.18 }}
    className="flex flex-col gap-4"
  >
    <Field label="Full Name" error={errors.name}>
      <input
        value={form.name}
        onChange={set("name")}
        placeholder="e.g. Riya Mehta"
        className={getInputCls("name", errors)}
      />
    </Field>
    <div className="grid grid-cols-2 gap-4">
      <Field label="Age" error={errors.age}>
        <input
          type="number"
          min={1}
          max={120}
          value={form.age}
          onChange={set("age")}
          placeholder="35"
          className={getInputCls("age", errors)}
        />
      </Field>
      <Field label="Gender">
        <select value={form.gender} onChange={set("gender")} className={getInputCls("gender", errors)}>
          <option>Male</option>
          <option>Female</option>
          <option>Other</option>
        </select>
      </Field>
    </div>
    <div className="grid grid-cols-2 gap-4">
      <Field label="Blood Group">
        <select value={form.bloodGroup} onChange={set("bloodGroup")} className={getInputCls("bloodGroup", errors)}>
          {BLOOD_GROUPS.map(bg => (
            <option key={bg}>{bg}</option>
          ))}
        </select>
      </Field>
      <Field label="Phone" error={errors.phone}>
        <input
          value={form.phone}
          onChange={set("phone")}
          placeholder="+91 98765 12345"
          className={getInputCls("phone", errors)}
        />
      </Field>
    </div>
    <Field label="Email">
      <input
        type="email"
        value={form.email}
        onChange={set("email")}
        placeholder="patient@email.com"
        className={getInputCls("email", errors)}
      />
    </Field>
    <Field label="Address">
      <input
        value={form.address}
        onChange={set("address")}
        placeholder="Street, City"
        className={getInputCls("address", errors)}
      />
    </Field>
  </motion.div>
));
