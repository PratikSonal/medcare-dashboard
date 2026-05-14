import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Activity } from "lucide-react";
import { slides } from "./constants";
import type { Slide } from "./types";

const FeatureCarousel = (): React.ReactElement => {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setActive(p => (p + 1) % slides.length), 3000);
    return () => clearInterval(t);
  }, []);

  const slide = slides[active];
  const Icon = slide.icon;

  return (
    <>
      <div className="h-[120px] overflow-hidden relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="flex items-stretch gap-5 h-full absolute w-full"
          >
            <div className="flex items-center justify-center shrink-0">
              <Icon size={56} style={{ color: slide.color }} />
            </div>
            <div className="flex flex-col justify-center">
              <div className="flex items-baseline gap-[10px] mb-2">
                <span
                  className="text-[32px] font-extrabold leading-none tracking-[-0.02em]"
                  style={{ color: slide.color }}
                >
                  {slide.stat}
                </span>
                <span className="text-[16px] font-semibold leading-none text-[#f8fafc]">
                  {slide.headline}
                </span>
              </div>
              <p className="text-[13px] leading-[1.55] m-0 max-w-[300px] text-[#9ca3af]">
                {slide.description}
              </p>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
      <div className="flex items-center gap-[6px] mt-5">
        {slides.map((s: Slide, i: number) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            className="h-[6px] rounded-full border-0 cursor-pointer p-0 transition-all duration-300"
            style={{
              width: i === active ? "20px" : "6px",
              background: i === active ? s.color : "#1d2839",
            }}
          />
        ))}
      </div>
    </>
  );
};

export const LeftPanel = (): React.ReactElement => (
  <motion.div
    initial={{ opacity: 0, x: -40 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.5 }}
    className="hidden lg:flex flex-col w-[52%] relative overflow-hidden bg-[#0c111d] border-r border-[#1d2839]"
  >
    <div className="absolute -top-[80px] -left-[80px] w-[400px] h-[400px] rounded-full opacity-[0.07] blur-[80px] pointer-events-none bg-accent-blue" />
    <div className="absolute -bottom-[80px] -right-[60px] w-[350px] h-[350px] rounded-full opacity-[0.05] blur-[80px] pointer-events-none bg-accent-cyan" />

    <div className="pt-[40px] px-[48px] relative z-[1]">
      <div className="flex items-center gap-[10px]">
        <div className="w-9 h-9 rounded-[10px] flex items-center justify-center shrink-0 bg-gradient-primary">
          <Activity size={18} color="white" />
        </div>
        <span className="gradient-text text-[18px] font-bold">MedCare</span>
      </div>
    </div>

    <div className="flex-1 flex flex-col justify-center px-[48px] relative z-[1]">
      <div className="glow-line mb-5 w-14" />
      <h1 className="text-[36px] font-extrabold leading-[1.2] mb-3 tracking-[-0.02em] text-[#f8fafc]">
        Healthcare Intelligence
        <br />
        <span className="gradient-text">Reimagined</span>
      </h1>
      <p className="text-[14px] leading-[1.7] mb-[40px] max-w-[340px] text-[#9ca3af]">
        A unified platform for modern healthcare teams — monitor patients, schedule appointments,
        and deliver exceptional care.
      </p>
      <FeatureCarousel />
    </div>

    <div className="pb-[40px] px-[48px] relative z-[1]">
      <p className="text-[11px] flex items-center text-[#4b5563]">
        HIPAA Certified
        <span className="inline-block w-[3px] h-[3px] rounded-full mx-[10px] bg-[#4b5563]" />
        SOC 2 Type II
        <span className="inline-block w-[3px] h-[3px] rounded-full mx-[10px] bg-[#4b5563]" />
        FHIR Ready
      </p>
    </div>
  </motion.div>
);
