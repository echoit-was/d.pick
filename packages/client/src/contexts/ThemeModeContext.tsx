import React, { createContext, useContext, useState, useEffect } from 'react';

interface ThemeModeContextType {
  darkMode: boolean;
  toggleDarkMode: () => void;
}

const ThemeModeContext = createContext<ThemeModeContextType | undefined>(undefined);

export const useThemeMode = () => {
  const context = useContext(ThemeModeContext);
  if (context === undefined) {
    throw new Error('useThemeMode must be used within a ThemeModeProvider');
  }
  return context;
};

export const ThemeModeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 로컬 스토리지에서 테마 설정 가져오기, 기본값은 시스템 설정 기반
  const [darkMode, setDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('darkMode');
    if (savedTheme !== null) {
      return savedTheme === 'true';
    }
    
    // 시스템 설정 확인
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // 테마 변경 감지
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      if (localStorage.getItem('darkMode') === null) {
        setDarkMode(e.matches);
      }
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // 테마 변경 시 로컬 스토리지에 저장
  useEffect(() => {
    localStorage.setItem('darkMode', darkMode.toString());
    document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(prevMode => !prevMode);
  };

  const value = {
    darkMode,
    toggleDarkMode
  };

  return (
    <ThemeModeContext.Provider value={value}>
      {children}
    </ThemeModeContext.Provider>
  );
}; 