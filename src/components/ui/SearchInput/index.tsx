import { memo } from "react";
import { Search, X } from "lucide-react";
import { cn } from "@/utils";
import type { SearchInputProps } from "./types";

export const SearchInput = memo(({
  value,
  onChange,
  placeholder = "Search...",
  width,
}: SearchInputProps): React.ReactElement => (
  <div className={cn("relative", !width && "flex-1")} style={width ? { width } : undefined}>
    <Search
      size={15}
      className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary pointer-events-none"
    />
    <input
      value={value}
      onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange(e.target.value)}
      placeholder={placeholder}
      className={cn(
        "w-full bg-bg-secondary border border-border-primary rounded-12",
        "py-[10px] pr-9 pl-[38px] text-[13px] text-text-primary",
        "outline-none font-sans transition-colors duration-200",
        "focus:border-accent-blue placeholder:text-text-tertiary",
      )}
    />
    {value && (
      <button
        type="button"
        onClick={() => onChange("")}
        className="absolute right-[10px] top-1/2 -translate-y-1/2 flex p-[2px] bg-transparent border-0 cursor-pointer text-text-tertiary"
      >
        <X size={14} />
      </button>
    )}
  </div>
));
