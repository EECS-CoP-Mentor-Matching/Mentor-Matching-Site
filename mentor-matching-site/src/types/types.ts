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

export interface DbWriteResult {
  message: string
  success: boolean
  docId: string
}

export interface DbDeleteResult {
  message: string
  success: boolean
  docId: string
}

export interface DbUpdateResult {
  message: string
  success: boolean
  docId: string
}

export interface DbReadResult<T> {
  message: string
  success: boolean
  data: T
  docId: string
}

export interface DocItem<T> {
  docId: string
  data: T
}

export interface DbReadResults<T> {
  message: string
  success: boolean
  results: DocItem<T>[]
}