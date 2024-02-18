export interface DropDownOption {
  label: string,
  id: number | string
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  imageUrl?: string; // Optional property for the profile image URL
}

export interface ErrorLog {
  component: string
  errorMessage: string
}

export interface DbResult {
  message: string
  success: boolean
  docId?: string
}