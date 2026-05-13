export type Theme = "dark" | "light";
export type ViewMode = "grid" | "list";

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: "info" | "warning" | "success" | "error";
  timestamp: string;
  read: boolean;
}

export interface Toast {
  id: string;
  message: string;
  type: "success" | "error" | "info";
}
