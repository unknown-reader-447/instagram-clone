// Simple file-based storage for login credentials
// This simulates storing data in a file database

export interface LoginCredential {
  id: string;
  email: string;
  password: string;
  timestamp: string;
  verified: boolean;
}

// Get stored credentials from localStorage (simulating file storage)
export const getStoredCredentials = (): LoginCredential[] => {
  if (typeof window === 'undefined') return [];
  
  try {
    const stored = localStorage.getItem('loginCredentials');
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error reading stored credentials:', error);
    return [];
  }
};

// Store new login credentials
export const storeLoginCredentials = (email: string, password: string): LoginCredential => {
  const credential: LoginCredential = {
    id: generateId(),
    email,
    password,
    timestamp: new Date().toISOString(),
    verified: true
  };

  if (typeof window !== 'undefined') {
    try {
      const existing = getStoredCredentials();
      
      // Check if email already exists, update if it does
      const existingIndex = existing.findIndex(cred => cred.email === email);
      if (existingIndex >= 0) {
        existing[existingIndex] = credential;
      } else {
        existing.push(credential);
      }
      
      localStorage.setItem('loginCredentials', JSON.stringify(existing));
      
      // Also store current user session
      localStorage.setItem('userEmail', email);
      localStorage.setItem('user', JSON.stringify({
        id: credential.id,
        email: email,
        verified: true,
        loginTime: credential.timestamp
      }));
      
    } catch (error) {
      console.error('Error storing credentials:', error);
    }
  }

  return credential;
};

// Check if email exists in stored credentials
export const findCredentialByEmail = (email: string): LoginCredential | null => {
  const credentials = getStoredCredentials();
  return credentials.find(cred => cred.email === email) || null;
};

// Generate a simple ID
const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// Clear all stored credentials (for testing/reset)
export const clearStoredCredentials = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('loginCredentials');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('user');
  }
};

// Get all stored credentials (for debugging)
export const getAllCredentials = (): LoginCredential[] => {
  return getStoredCredentials();
};
