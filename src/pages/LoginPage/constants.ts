import { Shield, Zap, Brain, Heart, TrendingUp, Clock } from "lucide-react";
import type { Slide } from "./types";

export const slides: Slide[] = [
  {
    icon: Shield,
    color: "var(--accent-blue)",
    stat: "99.9%",
    headline: "Always On",
    description:
      "Round-the-clock monitoring with enterprise-grade uptime SLA and zero workflow interruptions.",
  },
  {
    icon: Zap,
    color: "var(--accent-cyan)",
    stat: "170%",
    headline: "Smarter Scheduling",
    description:
      "Patients book in under 2 minutes. 44.5% of bookings happen after hours — automatically.",
  },
  {
    icon: Brain,
    color: "var(--accent-purple)",
    stat: "1000+",
    headline: "AI Does the Paperwork",
    description:
      "Intake forms, prescription refills, prior auths — automated. 1000+ staff hours saved weekly.",
  },
  {
    icon: Heart,
    color: "#38bdf8",
    stat: "46.5%",
    headline: "Fewer Claim Denials",
    description:
      "Pre-visit eligibility checks and real-time benefit verification eliminate failures early.",
  },
  {
    icon: TrendingUp,
    color: "var(--accent-cyan)",
    stat: "$5M+",
    headline: "Revenue Impact",
    description:
      "Higher bookings, saved staff time, improved margins — $5M+ revenue impact per practice annually.",
  },
  {
    icon: Clock,
    color: "var(--accent-blue)",
    stat: "2 min",
    headline: "Instant Onboarding",
    description:
      "Up and running in days, not months. White glove support and direct EHR integration.",
  },
];
