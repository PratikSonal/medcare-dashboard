import { useEffect } from "react";
import { useAppSelector } from "./useAppDispatch";
import type { RootState } from "@/store";

export const useThemeSync = (): void => {
  const theme = useAppSelector((s: RootState) => s.ui.theme);
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("medcare-theme", theme);
  }, [theme]);
};
