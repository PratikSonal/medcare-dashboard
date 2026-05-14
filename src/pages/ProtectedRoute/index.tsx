import { Navigate } from "react-router-dom";
import { useEffect } from "react";
import { Activity } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/hooks/useAppDispatch";
import { setUser } from "@/features/auth/authSlice";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import type { User } from "firebase/auth";
import type { RootState } from "@/store";

export const ProtectedRoute = ({ children }: React.PropsWithChildren): React.ReactElement => {
  const { isAuthenticated, isLoading } = useAppSelector((s: RootState) => s.auth);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user: User | null) => {
      if (user) {
        dispatch(
          setUser({
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL,
          }),
        );
      } else {
        dispatch(setUser(null));
      }
    });
    return () => unsub();
  }, [dispatch]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center dot-grid bg-bg-primary">
        <div className="flex flex-col items-center gap-4">
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center animate-pulse"
            style={{ background: "var(--gradient-primary)" }}
          >
            <Activity size={20} stroke="white" strokeWidth={2} />
          </div>
          <p className="text-sm text-text-secondary animate-pulse">Loading MedCare...</p>
        </div>
      </div>
    );
  }

  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};
