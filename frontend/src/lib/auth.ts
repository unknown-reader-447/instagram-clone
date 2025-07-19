// Authentication utility functions

export interface User {
  id: string;
  email: string;
  username: string;
  fullName: string;
  createdAt: string;
  updatedAt: string;
}

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  const user = localStorage.getItem('user');
  const userEmail = localStorage.getItem('userEmail');
  
  return !!(user && userEmail);
};

// Get current user from localStorage
export const getCurrentUser = (): User | null => {
  if (typeof window === 'undefined') return null;
  
  const userData = localStorage.getItem('user');
  if (!userData) return null;
  
  try {
    return JSON.parse(userData) as User;
  } catch (error) {
    console.error('Error parsing user data:', error);
    return null;
  }
};

// Get user email from localStorage
export const getUserEmail = (): string | null => {
  if (typeof window === 'undefined') return null;
  
  return localStorage.getItem('userEmail');
};

// Set user data in localStorage
export const setUserData = (user: User): void => {
  if (typeof window === 'undefined') return;
  
  localStorage.setItem('user', JSON.stringify(user));
  localStorage.setItem('userEmail', user.email);
};

// Clear user data from localStorage
export const clearUserData = (): void => {
  if (typeof window === 'undefined') return;
  
  localStorage.removeItem('user');
  localStorage.removeItem('userEmail');
};

// Logout function
export const logout = async (): Promise<void> => {
  const userEmail = getUserEmail();
  
  if (userEmail) {
    try {
      await fetch('http://localhost:5000/api/auth/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: userEmail }),
      });
    } catch (error) {
      console.error('Logout API error:', error);
    }
  }
  
  clearUserData();
};

// Login function - stores credentials using Upstash Redis storage
export const login = async (email: string, password: string): Promise<{ success: boolean; message: string; user?: User }> => {
  try {
    const response = await fetch('/api/auth/store-login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (data.success && data.user) {
      setUserData(data.user);
    }

    return data;
  } catch (error) {
    console.error('Login error:', error);
    return {
      success: false,
      message: 'Failed to store login credentials. Please try again.'
    };
  }
};

// Verify user credentials against stored data
export const verifyUser = async (email: string, password: string): Promise<{ success: boolean; message: string; user?: User }> => {
  try {
    const response = await fetch('/api/auth/verify-user', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (data.success && data.user) {
      setUserData(data.user);
    }

    return data;
  } catch (error) {
    console.error('Verification error:', error);
    return {
      success: false,
      message: 'Failed to verify credentials. Please try again.'
    };
  }
};

// Register function - stores credentials using Upstash Redis storage
export const register = async (userData: {
  email: string;
  username: string;
  fullName: string;
  password: string;
}): Promise<{ success: boolean; message: string; user?: User }> => {
  try {
    const response = await fetch('/api/auth/store-register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    const data = await response.json();

    if (data.success && data.user) {
      setUserData(data.user);
    }

    return data;
  } catch (error) {
    console.error('Registration error:', error);
    return {
      success: false,
      message: 'Failed to store registration data. Please try again.'
    };
  }
};

// Reset password function
export const resetPassword = async (email: string, newPassword: string): Promise<{ success: boolean; message: string }> => {
  try {
    const response = await fetch('http://localhost:5000/api/auth/reset-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, newPassword }),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Password reset error:', error);
    return {
      success: false,
      message: 'Network error. Please try again.'
    };
  }
};

// Check if user exists (for forgot password flow)
export const checkUserExists = async (email: string): Promise<boolean> => {
  try {
    // Try to login with dummy password to check if user exists
    const response = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password: 'dummy_password_check' }),
    });

    // If we get 401, user exists but password is wrong (which is what we want)
    // If we get 404 or user not found message, user doesn't exist
    if (response.status === 401) {
      return true;
    }
    
    const data = await response.json();
    return !data.message.toLowerCase().includes('not found');
  } catch (error) {
    console.error('User check error:', error);
    return false;
  }
};
