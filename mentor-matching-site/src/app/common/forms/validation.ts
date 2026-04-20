export const nullNumber = (value: any) => {
  return value === undefined || value === null || value < 0;
}

export const nullString = (value: any) => {
  return value === undefined || value === null || value === "";
}

// General email validation — any domain, just needs valid format.
// Use this for contact emails. OSU login email validation is handled separately in auth.
export const isValidEmail = (value: any): boolean => {
  if (!value || typeof value !== 'string') return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(value.trim());
}
