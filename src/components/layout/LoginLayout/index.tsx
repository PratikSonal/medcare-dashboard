import { LeftPanel } from "./LeftPanel";

export const LoginLayout = ({ children }: React.PropsWithChildren): React.ReactElement => (
  <div className="dot-grid min-h-screen flex bg-bg-primary">
    <LeftPanel />
    {children}
  </div>
);
