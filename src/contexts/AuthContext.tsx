'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { apiService } from '@/lib/api';

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (token: string, userData: User) => void;
  logout: () => void;
  isAdminRoute: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  const isAdminRoute = pathname.startsWith('/admin');

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('admin_user');

      if (token && userData) {
        try {
          const parsedUser = JSON.parse(userData);
          apiService.setAuthToken(token);
          setUser(parsedUser);
          setIsAuthenticated(true);
        } catch (error) {
          console.error('Erro ao carregar dados do usuário:', error);
          localStorage.removeItem('token');
          localStorage.removeItem('admin_user');
          apiService.removeAuthToken();
        }
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const login = (token: string, userData: User) => {
    console.log('AuthContext: Login called with token:', token);
    localStorage.setItem('token', token);
    localStorage.setItem('admin_user', JSON.stringify(userData));
    apiService.setAuthToken(token);
    setUser(userData);
    setIsAuthenticated(true);
    console.log('AuthContext: isAuthenticated set to true');
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('admin_user');
    apiService.removeAuthToken();
    setUser(null);
    setIsAuthenticated(false);
    router.push('/admin/login');
  };

  // Redirecionar para login se tentar acessar admin sem autenticação
  useEffect(() => {
    if (!isLoading && isAdminRoute && !isAuthenticated && pathname !== '/admin/login') {
      router.push('/admin/login');
    }
  }, [isLoading, isAdminRoute, isAuthenticated, pathname, router]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        login,
        logout,
        isAdminRoute,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
