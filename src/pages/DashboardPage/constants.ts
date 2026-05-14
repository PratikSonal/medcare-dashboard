import type { Variants } from "framer-motion";

import { TODAY_DEMO_DATE } from "@/lib/constants";

export const TODAY_DATE = TODAY_DEMO_DATE;
export const DAILY_SUMMARY_DELAY_MS = 5000;

export const container: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};
export const item: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};
