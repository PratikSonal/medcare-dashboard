import { Activity } from "lucide-react";
import { Navigate } from "react-router-dom";

import { useAppSelector } from "@/hooks/useAppDispatch";
import type { RootState } from "@/store";

export const ProtectedRoute = ({ children }: React.PropsWithChildren): React.ReactElement => {
  const { isAuthenticated, isLoading } = useAppSelector((s: RootState) => s.auth);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center dot-grid bg-bg-primary">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center animate-pulse [background:var(--gradient-primary)]">
            <Activity size={20} color="white" />
          </div>
          <p className="text-sm text-text-secondary animate-pulse">Loading MedCare...</p>
        </div>
      </div>
    );
  }

  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};
