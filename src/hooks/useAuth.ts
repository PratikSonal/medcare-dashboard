import { FirebaseError } from "firebase/app";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { setError,setUser } from "@/features/auth/authSlice";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { auth } from "@/lib/firebase";
import { getFirebaseErrorMessage } from "@/lib/firebase/errors";
import { registerServiceWorker,showWelcomeNotification } from "@/services/notifications";

interface UseAuthReturn {
  signIn: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  isLoading: boolean;
  error: string | null;
  clearError: () => void;
}

export const useAuth = (): UseAuthReturn => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setLocalError] = useState<string | null>(null);

  const clearError = (): void => setLocalError(null);

  const signIn = async (email: string, password: string): Promise<void> => {
    setLocalError(null);
    setIsLoading(true);
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      dispatch(setUser({
        uid: result.user.uid,
        email: result.user.email,
        displayName: result.user.displayName,
      }));
      await registerServiceWorker();
      showWelcomeNotification(result.user.displayName || result.user.email || "Doctor");
      navigate("/dashboard");
    } catch (err) {
      const code = err instanceof FirebaseError ? err.code : "";
      const msg = getFirebaseErrorMessage(code, "Login failed. Please try again.");
      setLocalError(msg);
      dispatch(setError(msg));
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string): Promise<void> => {
    setLocalError(null);
    setIsLoading(true);
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(result.user, { displayName: name });
      dispatch(setUser({
        uid: result.user.uid,
        email: result.user.email,
        displayName: name,
      }));
      showWelcomeNotification(name);
      navigate("/dashboard");
    } catch (err) {
      const code = err instanceof FirebaseError ? err.code : "";
      const msg = getFirebaseErrorMessage(code, "Registration failed. Please try again.");
      setLocalError(msg);
      dispatch(setError(msg));
    } finally {
      setIsLoading(false);
    }
  };

  return { signIn, register, isLoading, error, clearError };
};
