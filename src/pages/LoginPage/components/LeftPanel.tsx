import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Activity } from "lucide-react";
import { slides } from "../constants";

const FeatureCarousel = () => {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setActive(p => (p + 1) % slides.length), 3000);
    return () => clearInterval(t);
  }, []);

  const slide = slides[active];
  const Icon = slide.icon;

  return (
    <>
      <div style={{ height: "120px", overflow: "hidden", position: "relative" }}>
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
                  style={{
                    fontSize: "32px",
                    fontWeight: 800,
                    color: slide.color,
                    lineHeight: 1,
                    letterSpacing: "-0.02em",
                  }}
                >
                  {slide.stat}
                </span>
                <span
                  style={{ fontSize: "16px", fontWeight: 600, color: "#f8fafc", lineHeight: 1 }}
                >
                  {slide.headline}
                </span>
              </div>
              <p
                style={{
                  fontSize: "13px",
                  color: "#9ca3af",
                  lineHeight: 1.55,
                  margin: 0,
                  maxWidth: "300px",
                }}
              >
                {slide.description}
              </p>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
      <div className="flex items-center gap-[6px] mt-5">
        {slides.map((s, i) => (
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

export const LeftPanel = () => (
  <motion.div
    initial={{ opacity: 0, x: -40 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.5 }}
    className="hidden lg:flex"
    style={{
      flexDirection: "column",
      width: "52%",
      position: "relative",
      overflow: "hidden",
      background: "#0c111d",
      borderRight: "1px solid #1d2839",
    }}
  >
    <div
      style={{
        position: "absolute",
        top: "-80px",
        left: "-80px",
        width: "400px",
        height: "400px",
        borderRadius: "50%",
        opacity: 0.07,
        filter: "blur(80px)",
        background: "var(--accent-blue)",
        pointerEvents: "none",
      }}
    />
    <div
      style={{
        position: "absolute",
        bottom: "-80px",
        right: "-60px",
        width: "350px",
        height: "350px",
        borderRadius: "50%",
        opacity: 0.05,
        filter: "blur(80px)",
        background: "var(--accent-cyan)",
        pointerEvents: "none",
      }}
    />

    <div style={{ padding: "40px 48px 0", position: "relative", zIndex: 1 }}>
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <div
          style={{
            width: "36px",
            height: "36px",
            borderRadius: "10px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "var(--gradient-primary)",
            flexShrink: 0,
          }}
        >
          <Activity size={18} color="white" />
        </div>
        <span className="gradient-text" style={{ fontSize: "18px", fontWeight: 700 }}>
          MedCare
        </span>
      </div>
    </div>

    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "0 48px",
        position: "relative",
        zIndex: 1,
      }}
    >
      <div className="glow-line" style={{ marginBottom: "20px", width: "56px" }} />
      <h1
        style={{
          fontSize: "36px",
          fontWeight: 800,
          color: "#f8fafc",
          lineHeight: 1.2,
          marginBottom: "12px",
          letterSpacing: "-0.02em",
        }}
      >
        Healthcare Intelligence
        <br />
        <span className="gradient-text">Reimagined</span>
      </h1>
      <p
        style={{
          color: "#9ca3af",
          fontSize: "14px",
          lineHeight: 1.7,
          marginBottom: "40px",
          maxWidth: "340px",
        }}
      >
        A unified platform for modern healthcare teams — monitor patients, schedule appointments,
        and deliver exceptional care.
      </p>
      <FeatureCarousel />
    </div>

    <div style={{ padding: "0 48px 40px", position: "relative", zIndex: 1 }}>
      <p
        style={{
          fontSize: "12px",
          color: "#4b5563",
          display: "flex",
          alignItems: "center",
          gap: "0",
        }}
      >
        HIPAA Certified
        <span
          style={{
            display: "inline-block",
            width: "3px",
            height: "3px",
            borderRadius: "50%",
            background: "#4b5563",
            margin: "0 10px",
          }}
        />
        SOC 2 Type II
        <span
          style={{
            display: "inline-block",
            width: "3px",
            height: "3px",
            borderRadius: "50%",
            background: "#4b5563",
            margin: "0 10px",
          }}
        />
        FHIR Ready
      </p>
    </div>
  </motion.div>
);
