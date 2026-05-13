export async function registerServiceWorker() {
  if ("serviceWorker" in navigator) {
    try {
      const reg = await navigator.serviceWorker.register("/sw.js");
      console.log("[MedCare SW] Registered:", reg.scope);
      return reg;
    } catch (err) {
      console.error("[MedCare SW] Registration failed:", err);
    }
  }
}

export async function requestNotificationPermission(): Promise<boolean> {
  if (!("Notification" in window)) return false;
  if (Notification.permission === "granted") return true;
  if (Notification.permission === "denied") return false;
  const permission = await Notification.requestPermission();
  return permission === "granted";
}

export function showLocalNotification(title: string, body: string, icon = "/favicon.svg") {
  if (Notification.permission !== "granted") return;
  new Notification(title, { body, icon });
}

export async function showWelcomeNotification(userName: string) {
  const granted = await requestNotificationPermission();
  if (!granted) return;
  setTimeout(() => {
    showLocalNotification(
      "Welcome back to MedCare!",
      `Good to see you, ${userName}. You have 2 critical alerts today.`,
    );
  }, 1500);
}

export async function showPatientAlertNotification(patientName: string, alertType: string) {
  const granted = await requestNotificationPermission();
  if (!granted) return;
  showLocalNotification(
    `Patient Alert — ${patientName}`,
    `${alertType} — Immediate attention required.`,
  );
}

export async function showDailySummaryNotification(totalPatients: number, critical: number) {
  const granted = await requestNotificationPermission();
  if (!granted) return;
  showLocalNotification(
    "Daily Summary — MedCare",
    `${totalPatients} active patients today. ${critical} require critical attention.`,
  );
}
