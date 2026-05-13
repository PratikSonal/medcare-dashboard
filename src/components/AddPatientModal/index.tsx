import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Check } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/hooks/useAppDispatch";
import { addPatient } from "@/features/patients/patientsSlice";
import { addToast } from "@/features/ui/uiSlice";
import { cn } from "@/lib/utils";
import type { FormData, FieldProps, AddPatientModalProps } from "./types";
import {
  DEPARTMENTS,
  DOCTORS,
  BLOOD_GROUPS,
  STATUSES,
  STATUS_COLORS,
  STEPS,
  defaultForm,
} from "./constants";
import { validateStep, buildPatient, getNextId } from "./helpers";

const Field = ({ label, error, children }: FieldProps) => {
  return (
    <div>
      <label
        className={cn(
          "block text-[11px] font-semibold uppercase tracking-[0.04em] mb-[6px]",
          error ? "text-[#ef4444]" : "text-text-tertiary",
        )}
      >
        {label}
        {error && <span className="text-[#ef4444]"> *</span>}
      </label>
      {children}
    </div>
  );
};

export const AddPatientModal = ({ onClose }: AddPatientModalProps) => {
  const dispatch = useAppDispatch();
  const patients = useAppSelector(s => s.patients.patients);
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormData>(defaultForm);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, boolean>>>({});

  const inputCls = (field: keyof FormData) =>
    cn(
      "w-full bg-bg-secondary rounded-[10px] py-[9px] px-3 text-[13px] text-text-primary outline-none font-sans box-border transition-colors duration-150 focus:border-accent-blue",
      errors[field] ? "border border-[#ef4444]" : "border border-border-primary",
    );

  const set =
    (field: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      setForm(f => ({ ...f, [field]: e.target.value }));
      setErrors(err => ({ ...err, [field]: false }));
    };

  const validate = (s: number): boolean => {
    const e = validateStep(s, form);
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const next = () => {
    if (validate(step)) setStep(s => s + 1);
  };
  const back = () => setStep(s => s - 1);

  const submit = () => {
    if (!validate(2)) return;
    const maxId = Math.max(...patients.map(p => parseInt(p.id.slice(1))));
    const patient = buildPatient(form, maxId);
    dispatch(addPatient(patient));
    dispatch(addToast({ message: `${patient.name} added successfully`, type: "success" }));
    onClose();
  };

  const nextId = getNextId(patients);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-[rgba(0,0,0,0.6)] backdrop-blur-[4px] z-[1000] flex items-center justify-center p-6"
      onClick={e => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 12 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 12 }}
        transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
        className="w-full max-w-[540px] bg-bg-card rounded-[24px] border border-border-primary shadow-[0_24px_80px_rgba(0,0,0,0.3)] flex flex-col overflow-hidden"
        style={{ maxHeight: "calc(100vh - 48px)" }}
      >
        {/* Header */}
        <div className="py-6 px-6 pb-5 border-b border-border-primary shrink-0">
          <div className="flex items-start justify-between mb-5">
            <div>
              <h2 className="text-[18px] font-bold text-text-primary">Add New Patient</h2>
              <p className="text-[13px] text-text-secondary mt-[2px]">
                Step {step + 1} of 3 — {STEPS[step].label} Info
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-[6px] rounded-[10px] bg-bg-tertiary border-0 cursor-pointer text-text-tertiary flex"
            >
              <X size={16} />
            </button>
          </div>

          {/* Step Indicator */}
          <div className="flex items-center">
            {STEPS.map((s, i) => {
              const Icon = s.icon;
              const done = step > i;
              const active = step === i;
              return (
                <div key={i} className={cn("flex items-center", i < STEPS.length - 1 && "flex-1")}>
                  <div className="flex flex-col items-center gap-1">
                    <div
                      className={cn(
                        "w-8 h-8 rounded-full flex items-center justify-center transition-all duration-[250ms]",
                        done
                          ? "bg-[#0ea5e9] border-2 border-[#0ea5e9]"
                          : active
                            ? "bg-[rgba(60,131,246,0.12)] border-2 border-[#3c83f6]"
                            : "bg-bg-tertiary border-2 border-border-primary",
                      )}
                    >
                      {done ? (
                        <Check size={14} color="white" strokeWidth={3} />
                      ) : (
                        <Icon size={14} color={active ? "#3c83f6" : "var(--text-tertiary)"} />
                      )}
                    </div>
                    <span
                      className={cn(
                        "text-[10px] font-semibold tracking-[0.03em]",
                        active ? "text-[#3c83f6]" : done ? "text-[#0ea5e9]" : "text-text-tertiary",
                      )}
                    >
                      {s.label}
                    </span>
                  </div>
                  {i < STEPS.length - 1 && (
                    <div
                      className={cn(
                        "flex-1 h-[2px] mb-[18px] mx-[6px] transition-[background] duration-[250ms]",
                        step > i ? "bg-[#0ea5e9]" : "bg-border-primary",
                      )}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Form */}
        <div className="flex-1 overflow-y-auto p-6">
          <AnimatePresence mode="wait">
            {step === 0 && (
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
                    className={inputCls("name")}
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
                      className={inputCls("age")}
                    />
                  </Field>
                  <Field label="Gender">
                    <select
                      value={form.gender}
                      onChange={set("gender")}
                      className={inputCls("gender")}
                    >
                      <option>Male</option>
                      <option>Female</option>
                      <option>Other</option>
                    </select>
                  </Field>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Field label="Blood Group">
                    <select
                      value={form.bloodGroup}
                      onChange={set("bloodGroup")}
                      className={inputCls("bloodGroup")}
                    >
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
                      className={inputCls("phone")}
                    />
                  </Field>
                </div>
                <Field label="Email">
                  <input
                    type="email"
                    value={form.email}
                    onChange={set("email")}
                    placeholder="patient@email.com"
                    className={inputCls("email")}
                  />
                </Field>
                <Field label="Address">
                  <input
                    value={form.address}
                    onChange={set("address")}
                    placeholder="Street, City"
                    className={inputCls("address")}
                  />
                </Field>
              </motion.div>
            )}

            {step === 1 && (
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
                    {STATUSES.map(s => (
                      <button
                        key={s}
                        onClick={() => setForm(f => ({ ...f, status: s }))}
                        className="py-[7px] px-[14px] rounded-[10px] text-xs font-semibold cursor-pointer font-sans transition-all duration-150"
                        style={{
                          border: `1px solid ${form.status === s ? STATUS_COLORS[s] : "var(--border-primary)"}`,
                          background:
                            form.status === s ? `${STATUS_COLORS[s]}18` : "var(--bg-secondary)",
                          color: form.status === s ? STATUS_COLORS[s] : "var(--text-secondary)",
                        }}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </Field>
                <Field label="Diagnosis" error={errors.diagnosis}>
                  <input
                    value={form.diagnosis}
                    onChange={set("diagnosis")}
                    placeholder="e.g. Type 2 Diabetes"
                    className={inputCls("diagnosis")}
                  />
                </Field>
                <div className="grid grid-cols-2 gap-4">
                  <Field label="Department">
                    <select
                      value={form.department}
                      onChange={set("department")}
                      className={inputCls("department")}
                    >
                      {DEPARTMENTS.map(d => (
                        <option key={d}>{d}</option>
                      ))}
                    </select>
                  </Field>
                  <Field label="Attending Doctor">
                    <select
                      value={form.doctor}
                      onChange={set("doctor")}
                      className={inputCls("doctor")}
                    >
                      {DOCTORS.map(d => (
                        <option key={d}>{d}</option>
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
                      className={inputCls("admissionDate")}
                    />
                  </Field>
                  <Field label="Tags (comma-separated)">
                    <input
                      value={form.tags}
                      onChange={set("tags")}
                      placeholder="Diabetic, High BP"
                      className={inputCls("tags")}
                    />
                  </Field>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="s2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.18 }}
                className="flex flex-col gap-4"
              >
                <div className="grid grid-cols-2 gap-4">
                  <Field label="Heart Rate (bpm)" error={errors.heartRate}>
                    <input
                      type="number"
                      value={form.heartRate}
                      onChange={set("heartRate")}
                      placeholder="72"
                      className={inputCls("heartRate")}
                    />
                  </Field>
                  <Field label="Blood Pressure" error={errors.bloodPressure}>
                    <input
                      value={form.bloodPressure}
                      onChange={set("bloodPressure")}
                      placeholder="120/80"
                      className={inputCls("bloodPressure")}
                    />
                  </Field>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Field label="Temperature (°F)" error={errors.temperature}>
                    <input
                      type="number"
                      step="0.1"
                      value={form.temperature}
                      onChange={set("temperature")}
                      placeholder="98.6"
                      className={inputCls("temperature")}
                    />
                  </Field>
                  <Field label="Oxygen Saturation (%)" error={errors.oxygenSat}>
                    <input
                      type="number"
                      min={0}
                      max={100}
                      value={form.oxygenSat}
                      onChange={set("oxygenSat")}
                      placeholder="98"
                      className={inputCls("oxygenSat")}
                    />
                  </Field>
                </div>
                <Field label="Weight (kg)" error={errors.weight}>
                  <input
                    type="number"
                    value={form.weight}
                    onChange={set("weight")}
                    placeholder="70"
                    className={cn(inputCls("weight"), "max-w-[calc(50%-8px)]")}
                  />
                </Field>
                <div className="py-3 px-4 bg-bg-tertiary rounded-[12px]">
                  <p className="text-xs text-text-secondary">
                    Patient ID <strong className="text-text-primary">{nextId}</strong> will be
                    assigned on creation.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="py-4 px-6 pb-6 border-t border-border-primary flex justify-between shrink-0">
          <button
            onClick={step === 0 ? onClose : back}
            className="py-[10px] px-5 rounded-[12px] text-[13px] font-medium border border-border-primary bg-transparent text-text-secondary cursor-pointer font-sans"
          >
            {step === 0 ? "Cancel" : "← Back"}
          </button>
          <button
            onClick={step < 2 ? next : submit}
            className={cn(
              "py-[10px] px-6 rounded-[12px] text-[13px] font-semibold border-0 text-white cursor-pointer font-sans shadow-[0_4px_14px_rgba(60,131,246,0.3)]",
              step < 2 ? "bg-accent-blue" : "bg-accent-cyan",
            )}
          >
            {step < 2 ? "Next →" : "+ Add Patient"}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
