import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (name: string, email: string, password: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 실제 구현에서는 토큰 검증 로직이 필요
    const checkAuth = async () => {
      try {
        // 로컬 스토리지에서 토큰 확인
        const token = localStorage.getItem('token');
        
        if (token) {
          // 서버에 토큰 유효성 검증 요청을 보내고 사용자 정보 받아오기
          // 예시 코드이므로 실제 서버 연동은 구현 필요
          setUser({
            id: '1',
            name: '홍길동',
            email: 'user@example.com',
            role: 'admin'
          });
        }
      } catch (error) {
        console.error('인증 확인 오류:', error);
        localStorage.removeItem('token');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      // 실제 구현에서는 API 호출이 필요
      // const response = await fetch('/api/auth/login', ...);
      
      // 임시 로그인 로직
      if (email === 'user@example.com' && password === 'password') {
        const mockUser = {
          id: '1',
          name: '홍길동',
          email,
          role: 'admin'
        };
        
        setUser(mockUser);
        localStorage.setItem('token', 'mock-jwt-token');
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('로그인 오류:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      setIsLoading(true);
      // 실제 구현에서는 API 호출이 필요
      // const response = await fetch('/api/auth/register', ...);
      
      // 임시 회원가입 로직
      const mockUser = {
        id: '1',
        name,
        email,
        role: 'member'
      };
      
      setUser(mockUser);
      localStorage.setItem('token', 'mock-jwt-token');
      return true;
    } catch (error) {
      console.error('회원가입 오류:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    register
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}; 