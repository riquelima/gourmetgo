
import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { User, Role } from '../types';
import { supabaseService } from '../services/supabaseService'; // Mocked service
import { USER_ROLES_CONFIG } from '../constants';

interface AuthContextType {
  user: User | null;
  login: (email: string, pass: string) => Promise<User | null>;
  logout: () => Promise<void>;
  loadingAuth: boolean;
  authError: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loadingAuth, setLoadingAuth] = useState<boolean>(true);
  const [authError, setAuthError] = useState<string | null>(null);

  const checkCurrentUser = useCallback(async () => {
    setLoadingAuth(true);
    setAuthError(null);
    try {
      const currentUser = await supabaseService.getCurrentUser();
      setUser(currentUser);
    } catch (error) {
      console.error("Error checking current user:", error);
      setUser(null); // Ensure user is null on error
    } finally {
      setLoadingAuth(false);
    }
  }, []);

  useEffect(() => {
    checkCurrentUser();
  }, [checkCurrentUser]);

  const login = async (email: string, pass: string): Promise<User | null> => {
    setLoadingAuth(true);
    setAuthError(null);
    try {
      const loggedInUser = await supabaseService.signInWithEmail(email, pass);
      setUser(loggedInUser);
      if (loggedInUser) {
        // For demonstration, you might store a token or session info here
        // In a real Supabase app, the client library handles session persistence.
        localStorage.setItem('gourmetgo-user-role', loggedInUser.role); // Example for persistence if needed
      }
      return loggedInUser;
    } catch (error: any) {
      console.error("Login failed:", error.message);
      setAuthError(error.message || "Login failed. Please check your credentials.");
      setUser(null);
      return null;
    } finally {
      setLoadingAuth(false);
    }
  };

  const logout = async () => {
    setLoadingAuth(true);
    setAuthError(null);
    try {
      await supabaseService.signOut();
      setUser(null);
      localStorage.removeItem('gourmetgo-user-role'); // Clear any stored role
    } catch (error: any) {
      console.error("Logout failed:", error.message);
      setAuthError(error.message || "Logout failed.");
    } finally {
      setLoadingAuth(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loadingAuth, authError }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};