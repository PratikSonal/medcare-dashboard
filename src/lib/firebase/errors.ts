const FIREBASE_ERRORS: Record<string, string> = {
  "auth/user-not-found": "No account found with this email.",
  "auth/wrong-password": "Incorrect password. Please try again.",
  "auth/invalid-credential": "Invalid email or password.",
  "auth/email-already-in-use": "An account with this email already exists.",
  "auth/invalid-email": "Please enter a valid email address.",
  "auth/weak-password": "Password must be at least 6 characters.",
  "auth/too-many-requests": "Too many attempts. Please try again later.",
  "auth/network-request-failed": "Network error. Check your connection.",
};

export const getFirebaseErrorMessage = (code: string, fallback: string): string =>
  FIREBASE_ERRORS[code] ?? fallback;
