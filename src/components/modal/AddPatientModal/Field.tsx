import { memo } from "react";

import { cn } from "@/utils";

import type { FieldProps } from "./types";

export const Field = memo(({ label, error, children }: FieldProps): React.ReactElement => (
  <div>
    <label
      className={cn(
        "block text-[11px] font-semibold uppercase tracking-[0.04em] mb-[6px]",
        error ? "text-accent-red" : "text-text-tertiary",
      )}
    >
      {label}
    </label>
    {children}
    {error && <p className="text-[11px] text-accent-red mt-1">{error}</p>}
  </div>
));
