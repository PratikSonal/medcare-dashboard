import { memo, useCallback, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/hooks/useAppDispatch";
import { addPatient } from "@/features/patients/patientsSlice";
import { addToast } from "@/features/ui/uiSlice";
import { cn } from "@/utils";
import type { RootState } from "@/store";
import type { Patient } from "@/features/patients/types";
import type { PatientStatus } from "@/features/patients/types";
import type { FormData, AddPatientModalProps } from "./types";
import { STEPS, defaultForm } from "./constants";
import { validateStep, buildPatient, getNextId } from "./helpers";
import { StepIndicator } from "./StepIndicator";
import { Step0Personal } from "./steps/Step0Personal";
import { Step1Clinical } from "./steps/Step1Clinical";
import { Step2Vitals } from "./steps/Step2Vitals";

export const AddPatientModal = memo(({ onClose }: AddPatientModalProps): React.ReactElement => {
  const dispatch = useAppDispatch();
  const patients = useAppSelector((s: RootState) => s.patients.patients);
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormData>(defaultForm);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, boolean>>>({});

  const set = useCallback(
    (field: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      setForm(f => ({ ...f, [field]: e.target.value }));
      setErrors(err => ({ ...err, [field]: false }));
    },
    [],
  );

  const validate = useCallback(
    (stepIndex: number): boolean => {
      const e = validateStep(stepIndex, form);
      setErrors(e);
      return Object.keys(e).length === 0;
    },
    [form],
  );

  const back = useCallback((): void => setStep(s => s - 1), []);

  const next = useCallback((): void => {
    if (validate(step)) setStep(s => s + 1);
  }, [validate, step]);

  const submit = useCallback((): void => {
    if (!validate(2)) return;
    const maxId = Math.max(...patients.map((patient: Patient) => parseInt(patient.id.slice(1), 10)));
    const patient = buildPatient(form, maxId);
    dispatch(addPatient(patient));
    dispatch(addToast({ message: `${patient.name} added successfully`, type: "success" }));
    onClose();
  }, [validate, patients, form, dispatch, onClose]);

  const handleBackOrClose = useCallback((): void => {
    if (step === 0) onClose();
    else back();
  }, [step, onClose, back]);

  const handleNextOrSubmit = useCallback((): void => {
    if (step < 2) next();
    else submit();
  }, [step, next, submit]);

  const handleSelectStatus = useCallback((status: PatientStatus) => {
    setForm(f => ({ ...f, status }));
  }, []);

  const handleOverlayClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (e.target === e.currentTarget) onClose();
    },
    [onClose],
  );

  const nextId = getNextId(patients);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-[rgba(0,0,0,0.6)] backdrop-blur-[4px] z-[1000] flex items-end sm:items-center justify-center sm:p-6"
      onClick={handleOverlayClick}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 12 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 12 }}
        transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
        className="w-full sm:max-w-[540px] bg-bg-card rounded-t-[24px] sm:rounded-[24px] border border-border-primary shadow-[0_24px_80px_rgba(0,0,0,0.3)] flex flex-col overflow-hidden max-h-[92vh]"
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
              type="button"
              onClick={onClose}
              className="p-[6px] rounded-[10px] bg-bg-tertiary border-0 cursor-pointer text-text-tertiary flex"
            >
              <X size={16} />
            </button>
          </div>
          <StepIndicator step={step} />
        </div>

        {/* Form */}
        <div className="flex-1 overflow-y-auto p-6">
          <AnimatePresence mode="wait">
            {step === 0 && <Step0Personal key="s0" form={form} errors={errors} set={set} />}
            {step === 1 && (
              <Step1Clinical
                key="s1"
                form={form}
                errors={errors}
                set={set}
                onSelectStatus={handleSelectStatus}
              />
            )}
            {step === 2 && (
              <Step2Vitals key="s2" form={form} errors={errors} set={set} nextId={nextId} />
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="py-4 px-6 pb-6 border-t border-border-primary flex justify-between shrink-0">
          <button
            type="button"
            onClick={handleBackOrClose}
            className="py-[10px] px-5 rounded-[12px] text-[13px] font-medium border border-border-primary bg-transparent text-text-secondary cursor-pointer font-sans"
          >
            {step === 0 ? "Cancel" : "← Back"}
          </button>
          <button
            type="button"
            onClick={handleNextOrSubmit}
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
});
