import { memo } from "react";
import { Check } from "lucide-react";
import { cn } from "@/utils";
import { STEPS } from "./constants";

interface Props {
  step: number;
}

export const StepIndicator = memo(({ step }: Props): React.ReactElement => (
  <div className="flex items-center">
    {STEPS.map((stepDef, i) => {
      const Icon = stepDef.icon;
      const done = step > i;
      const active = step === i;
      return (
        <div key={i} className={cn("flex items-center", i < STEPS.length - 1 && "flex-1")}>
          <div className="flex flex-col items-center gap-1">
            <div
              className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center transition-all duration-[250ms]",
                done
                  ? "bg-accent-cyan border-2 border-accent-cyan"
                  : active
                    ? "bg-[rgba(60,131,246,0.12)] border-2 border-accent-blue"
                    : "bg-bg-tertiary border-2 border-border-primary",
              )}
            >
              {done ? (
                <Check size={14} color="white" strokeWidth={3} />
              ) : (
                <Icon size={14} color={active ? "var(--accent-blue)" : "var(--text-tertiary)"} />
              )}
            </div>
            <span
              className={cn(
                "text-[10px] font-semibold tracking-[0.03em]",
                active ? "text-accent-blue" : done ? "text-accent-cyan" : "text-text-tertiary",
              )}
            >
              {stepDef.label}
            </span>
          </div>
          {i < STEPS.length - 1 && (
            <div
              className={cn(
                "flex-1 h-[2px] mb-[18px] mx-[6px] transition-[background] duration-[250ms]",
                step > i ? "bg-accent-cyan" : "bg-border-primary",
              )}
            />
          )}
        </div>
      );
    })}
  </div>
));
