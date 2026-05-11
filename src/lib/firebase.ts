import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: "AIzaSyCosGpZTOSKpiRRoi2HHg9xVmy-qdQEpSw",
  authDomain: "medcare-dashboard.firebaseapp.com",
  projectId: "medcare-dashboard",
  storageBucket: "medcare-dashboard.firebasestorage.app",
  messagingSenderId: "267133596195",
  appId: "1:267133596195:web:6cfe5e4dffa4cb85ce7796",
  measurementId: "G-VRL533H0TN"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const analytics = getAnalytics(app);
export default app;
