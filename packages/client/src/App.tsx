import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { createTheme, ThemeProvider, CssBaseline } from '@mui/material';
import { koKR } from '@mui/material/locale';

// 레이아웃 컴포넌트
import Layout from './components/layout/Layout';

// 페이지 컴포넌트
import Dashboard from './pages/Dashboard';
import Projects from './pages/Projects';
import ProjectDetail from './pages/ProjectDetail';
import Developers from './pages/Developers';
import Tasks from './pages/Tasks';
import TaskDetail from './pages/TaskDetail';
import Calendar from './pages/Calendar';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import Login from './pages/Login';
import Register from './pages/Register';

// 설정 관련 페이지
import EmailSettings from './pages/settings/EmailSettings';
import SmsSettings from './pages/settings/SmsSettings';
import UserSettings from './pages/settings/UserSettings';
import BillingSettings from './pages/settings/BillingSettings';

// 컨텍스트 프로바이더
import { AuthProvider } from './contexts/AuthContext';
import { ThemeModeProvider } from './contexts/ThemeModeContext';

function App() {
  const [darkMode, setDarkMode] = useState(false);
  
  // 테마 설정
  const theme = createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
      primary: {
        main: '#5661F3', // 모던한 블루 컬러
        light: '#818AF8',
        dark: '#3843E0',
      },
      secondary: {
        main: '#FF6B6B', // 생동감 있는 코랄 컬러
        light: '#FF9C9C',
        dark: '#E54B4B',
      },
      background: {
        default: darkMode ? '#121212' : '#FBFBFD',
        paper: darkMode ? '#1E1E1E' : '#FFFFFF',
      },
      text: {
        primary: darkMode ? '#F2F2F2' : '#303135',
        secondary: darkMode ? '#A0A0A0' : '#595D6E',
      },
      error: {
        main: '#F5554A',
      },
      warning: {
        main: '#FFB547',
      },
      info: {
        main: '#4A9FF5',
      },
      success: {
        main: '#3EBD93',
      },
    },
    typography: {
      fontFamily: '"Pretendard", "Noto Sans KR", "Roboto", "Helvetica", "Arial", sans-serif',
      h1: { fontWeight: 600, fontSize: '2.5rem' },
      h2: { fontWeight: 600, fontSize: '2rem' },
      h3: { fontWeight: 600, fontSize: '1.75rem' },
      h4: { fontWeight: 600, fontSize: '1.5rem' },
      h5: { fontWeight: 600, fontSize: '1.25rem' },
      h6: { fontWeight: 600, fontSize: '1rem' },
      subtitle1: { fontSize: '1rem', lineHeight: 1.5 },
      subtitle2: { fontSize: '0.875rem', fontWeight: 500 },
      body1: { fontSize: '1rem', lineHeight: 1.5 },
      body2: { fontSize: '0.875rem', lineHeight: 1.5 },
      button: { fontWeight: 500, textTransform: 'none' },
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: '8px',
            padding: '8px 16px',
            fontWeight: 500,
            boxShadow: 'none',
          },
          contained: {
            '&:hover': {
              boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
            },
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            borderRadius: '12px',
            boxShadow: darkMode 
              ? '0px 4px 20px rgba(0, 0, 0, 0.5)' 
              : '0px 2px 10px rgba(0, 0, 0, 0.05)',
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: '12px',
            overflow: 'hidden',
          },
        },
      },
      MuiTableContainer: {
        styleOverrides: {
          root: {
            borderRadius: '12px',
          },
        },
      },
      MuiTableCell: {
        styleOverrides: {
          head: {
            fontWeight: 600,
            backgroundColor: darkMode ? '#1E1E1E' : '#F7F8FB',
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            borderRadius: '6px',
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            boxShadow: 'none',
            borderBottom: darkMode 
              ? '1px solid rgba(255, 255, 255, 0.1)' 
              : '1px solid rgba(0, 0, 0, 0.08)',
          },
        },
      },
      MuiDrawer: {
        styleOverrides: {
          paper: {
            borderRight: darkMode 
              ? '1px solid rgba(255, 255, 255, 0.1)' 
              : '1px solid rgba(0, 0, 0, 0.08)',
          },
        },
      },
      MuiListItemButton: {
        styleOverrides: {
          root: {
            borderRadius: '8px',
            margin: '4px 8px',
            '&.Mui-selected': {
              backgroundColor: darkMode 
                ? 'rgba(86, 97, 243, 0.2)' 
                : 'rgba(86, 97, 243, 0.08)',
              '&:hover': {
                backgroundColor: darkMode 
                  ? 'rgba(86, 97, 243, 0.3)' 
                  : 'rgba(86, 97, 243, 0.12)',
              },
            },
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            '& .MuiOutlinedInput-root': {
              borderRadius: '8px',
            },
          },
        },
      },
      MuiAvatar: {
        styleOverrides: {
          root: {
            backgroundColor: '#5661F3',
          },
        },
      },
    },
  }, koKR);

  // 인증 상태 체크 (임시, AuthContext에서 실제 구현 필요)
  const isAuthenticated = true;

  return (
    <ThemeModeProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              {/* 인증이 필요한 라우트 */}
              <Route path="/" element={
                isAuthenticated ? <Layout toggleDarkMode={() => setDarkMode(!darkMode)} /> : <Navigate to="/login" />
              }>
                <Route index element={<Dashboard />} />
                <Route path="projects" element={<Projects />} />
                <Route path="projects/:id" element={<ProjectDetail />} />
                <Route path="developers" element={<Developers />} />
                <Route path="tasks" element={<Tasks />} />
                <Route path="tasks/:id" element={<TaskDetail />} />
                <Route path="calendar" element={<Calendar />} />
                <Route path="reports" element={<Reports />} />
                
                {/* 설정 라우트 */}
                <Route path="settings" element={<Navigate to="/settings/email" replace />} />
                <Route path="settings/email" element={<EmailSettings />} />
                <Route path="settings/sms" element={<SmsSettings />} />
                <Route path="settings/users" element={<UserSettings />} />
                <Route path="settings/billing" element={<BillingSettings />} />
              </Route>

              {/* 404 페이지 */}
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </ThemeProvider>
    </ThemeModeProvider>
  );
}

export default App; 