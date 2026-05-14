export const PageLoader = (): React.ReactElement => (
  <div className="flex items-center justify-center min-h-[60vh]">
    <div
      className="w-9 h-9 rounded-full animate-spin"
      style={{
        background:
          "conic-gradient(from 0deg, transparent 0deg, var(--accent-blue) 200deg, var(--accent-cyan) 280deg, transparent 360deg)",
        WebkitMask:
          "radial-gradient(farthest-side, transparent calc(100% - 3px), white calc(100% - 3px))",
        mask: "radial-gradient(farthest-side, transparent calc(100% - 3px), white calc(100% - 3px))",
      }}
    />
  </div>
);
