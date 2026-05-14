export const registerServiceWorker = async (): Promise<ServiceWorkerRegistration | undefined> => {
  if ("serviceWorker" in navigator) {
    try {
      const reg = await navigator.serviceWorker.register("/sw.js");
      if (import.meta.env.DEV) console.log("[MedCare SW] Registered:", reg.scope);
      return reg;
    } catch (err) {
      if (import.meta.env.DEV) console.error("[MedCare SW] Registration failed:", err);
    }
  }
};

export const requestNotificationPermission = async (): Promise<boolean> => {
  if (!("Notification" in window)) return false;
  if (Notification.permission === "granted") return true;
  if (Notification.permission === "denied") return false;
  const permission = await Notification.requestPermission();
  return permission === "granted";
};

export const showLocalNotification = (title: string, body: string, icon = "/favicon.svg"): void => {
  if (Notification.permission !== "granted") return;
  new Notification(title, { body, icon });
};

export const showWelcomeNotification = async (userName: string): Promise<void> => {
  const granted = await requestNotificationPermission();
  if (!granted) return;
  setTimeout(() => {
    showLocalNotification(
      "Welcome back to MedCare!",
      `Good to see you, ${userName}. You have 2 critical alerts today.`,
    );
  }, 1500);
};

export const showPatientAlertNotification = async (patientName: string, alertType: string): Promise<void> => {
  const granted = await requestNotificationPermission();
  if (!granted) return;
  showLocalNotification(
    `Patient Alert — ${patientName}`,
    `${alertType} — Immediate attention required.`,
  );
};

export const showDailySummaryNotification = async (totalPatients: number, critical: number): Promise<void> => {
  const granted = await requestNotificationPermission();
  if (!granted) return;
  showLocalNotification(
    "Daily Summary — MedCare",
    `${totalPatients} active patients today. ${critical} require critical attention.`,
  );
};
