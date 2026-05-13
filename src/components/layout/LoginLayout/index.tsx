import { LeftPanel } from "./LeftPanel";

export const LoginLayout = ({ children }: React.PropsWithChildren) => (
  <div className="dot-grid min-h-screen flex bg-bg-primary">
    <LeftPanel />
    {children}
  </div>
);
