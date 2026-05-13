const EMAIL_REGEX = /\S+@\S+\.\S+/;

export const isValidEmail = (email: string): boolean => EMAIL_REGEX.test(email);

export const validateLoginForm = (email: string, password: string): string | null => {
  if (!email) return "Email is required";
  if (!isValidEmail(email)) return "Enter a valid email";
  if (!password) return "Password is required";
  if (password.length < 6) return "Password must be at least 6 characters";
  return null;
};

export const validateRegisterForm = (
  name: string,
  email: string,
  password: string,
): string | null => {
  if (!name.trim()) return "Full name is required";
  return validateLoginForm(email, password);
};
