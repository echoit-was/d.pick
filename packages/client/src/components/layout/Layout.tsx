import { useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Avatar,
  Menu,
  MenuItem,
  Badge,
  useTheme,
  Tooltip,
  Collapse
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  ViewKanban as ProjectsIcon,
  People as DevelopersIcon,
  Assignment as TasksIcon,
  CalendarMonth as CalendarIcon,
  BarChart as ReportsIcon,
  Settings as SettingsIcon,
  Notifications as NotificationsIcon,
  AccountCircle,
  ChevronLeft as ChevronLeftIcon,
  Brightness4 as DarkModeIcon,
  Brightness7 as LightModeIcon,
  ExpandLess,
  ExpandMore,
  Email as EmailIcon,
  Sms as SmsIcon,
  CreditCard as CreditCardIcon,
  ManageAccounts as ManageAccountsIcon
} from '@mui/icons-material';

const drawerWidth = 260;

interface LayoutProps {
  toggleDarkMode: () => void;
}

export default function Layout({ toggleDarkMode }: LayoutProps) {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(true);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [notificationsAnchorEl, setNotificationsAnchorEl] = useState<null | HTMLElement>(null);
  const [settingsOpen, setSettingsOpen] = useState(false);

  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleNotificationsOpen = (event: React.MouseEvent<HTMLElement>) => {
    setNotificationsAnchorEl(event.currentTarget);
  };

  const handleNotificationsClose = () => {
    setNotificationsAnchorEl(null);
  };

  const handleSettingsClick = () => {
    setSettingsOpen(!settingsOpen);
  };

  const navigateTo = (path: string) => {
    navigate(path);
  };

  const menuItems = [
    { text: '대시보드', icon: <DashboardIcon />, path: '/' },
    { text: '프로젝트', icon: <ProjectsIcon />, path: '/projects' },
    { text: '인원 관리', icon: <DevelopersIcon />, path: '/developers' },
    { text: '작업', icon: <TasksIcon />, path: '/tasks' },
    { text: '캘린더', icon: <CalendarIcon />, path: '/calendar' },
    { text: '보고서', icon: <ReportsIcon />, path: '/reports' },
  ];

  const settingsItems = [
    { text: '이메일 설정', icon: <EmailIcon />, path: '/settings/email' },
    { text: 'SMS 설정', icon: <SmsIcon />, path: '/settings/sms' },
    { text: '사용자 관리', icon: <ManageAccountsIcon />, path: '/settings/users' },
    { text: '결제 설정', icon: <CreditCardIcon />, path: '/settings/billing' },
  ];

  // 현재 경로가 메뉴 아이템과 일치하는지 확인
  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  // 설정 관련 경로인지 확인
  const isSettingsActive = () => {
    return location.pathname.startsWith('/settings');
  };

  // 컴포넌트 마운트 시 및 경로 변경 시, 현재 경로가 설정 메뉴라면 설정 드롭다운 열기
  useState(() => {
    if (isSettingsActive()) {
      setSettingsOpen(true);
    }
  });

  return (
    <Box sx={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      <AppBar 
        position="fixed" 
        sx={{ 
          zIndex: theme.zIndex.drawer + 1,
          transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
          ...(open && {
            marginLeft: drawerWidth,
            width: `calc(100% - ${drawerWidth}px)`,
            transition: theme.transitions.create(['width', 'margin'], {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
          }),
          backgroundColor: theme.palette.background.paper,
          color: theme.palette.text.primary,
        }}
        elevation={0}
      >
        <Toolbar sx={{ minHeight: '70px' }}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerToggle}
            edge="start"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h5" noWrap component="div" sx={{ flexGrow: 1, fontWeight: 600 }}>
            D.PICK
          </Typography>
          <Typography variant="subtitle2" sx={{ mr: 2, color: theme.palette.text.secondary }}>
            IT 인력 아웃소싱 관리 시스템
          </Typography>

          <Tooltip title={theme.palette.mode === 'dark' ? '라이트 모드로 전환' : '다크 모드로 전환'}>
            <IconButton 
              color="inherit" 
              onClick={toggleDarkMode}
              sx={{ 
                backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.04)',
                mr: 1
              }}
            >
              {theme.palette.mode === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
            </IconButton>
          </Tooltip>

          <Tooltip title="알림">
            <IconButton
              color="inherit"
              onClick={handleNotificationsOpen}
              sx={{ 
                backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.04)',
                mr: 1
              }}
            >
              <Badge badgeContent={4} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>
          </Tooltip>
          
          <Menu
            anchorEl={notificationsAnchorEl}
            open={Boolean(notificationsAnchorEl)}
            onClose={handleNotificationsClose}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            PaperProps={{
              elevation: 3,
              sx: { 
                mt: 1,
                minWidth: 300,
                borderRadius: '12px',
                overflow: 'hidden',
              }
            }}
          >
            <Box sx={{ p: 2, borderBottom: `1px solid ${theme.palette.divider}` }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>알림</Typography>
            </Box>
            <MenuItem sx={{ py: 1.5 }}>
              <Box>
                <Typography variant="body2">프로젝트 A에 새 댓글이 있습니다</Typography>
                <Typography variant="caption" color="text.secondary">방금 전</Typography>
              </Box>
            </MenuItem>
            <MenuItem sx={{ py: 1.5 }}>
              <Box>
                <Typography variant="body2">작업 B가 완료되었습니다</Typography>
                <Typography variant="caption" color="text.secondary">10분 전</Typography>
              </Box>
            </MenuItem>
            <MenuItem sx={{ py: 1.5 }}>
              <Box>
                <Typography variant="body2">회의가 30분 후에 시작됩니다</Typography>
                <Typography variant="caption" color="text.secondary">30분 전</Typography>
              </Box>
            </MenuItem>
            <Divider />
            <MenuItem sx={{ justifyContent: 'center' }}>
              <Typography variant="body2" color="primary">모든 알림 보기</Typography>
            </MenuItem>
          </Menu>

          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              padding: '6px 16px',
              borderRadius: '40px',
              backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.04)',
              cursor: 'pointer',
            }}
            onClick={handleProfileMenuOpen}
          >
            <Avatar 
              sx={{ 
                width: 32, 
                height: 32, 
                fontWeight: 500,
                backgroundColor: theme.palette.primary.main,
              }}
            >
              K
            </Avatar>
            <Typography variant="body2" sx={{ fontWeight: 500 }}>김민준</Typography>
          </Box>
          
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleProfileMenuClose}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            PaperProps={{
              elevation: 3,
              sx: { 
                mt: 1,
                minWidth: 180,
                borderRadius: '12px',
                overflow: 'hidden',
              }
            }}
          >
            <MenuItem onClick={handleProfileMenuClose}>
              <Typography variant="body2">프로필</Typography>
            </MenuItem>
            <MenuItem onClick={handleProfileMenuClose}>
              <Typography variant="body2">계정 설정</Typography>
            </MenuItem>
            <Divider />
            <MenuItem onClick={handleProfileMenuClose}>
              <Typography variant="body2" color="error">로그아웃</Typography>
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        open={open}
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: 'border-box',
            borderRight: `1px solid ${theme.palette.divider}`,
            backgroundColor: theme.palette.background.paper,
            color: theme.palette.text.primary,
          },
        }}
      >
        <Box>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              padding: theme.spacing(0, 1),
              ...theme.mixins.toolbar,
              justifyContent: 'flex-end',
              minHeight: '70px',
            }}
          >
            <IconButton onClick={handleDrawerToggle}>
              <ChevronLeftIcon />
            </IconButton>
          </Box>
          <Divider />
          <List component="nav" sx={{ px: 2, pt: 1 }}>
            {menuItems.map((item) => (
              <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
                <ListItemButton
                  onClick={() => navigateTo(item.path)}
                  selected={isActive(item.path)}
                  sx={{
                    borderRadius: '8px',
                    mb: 0.5,
                  }}
                >
                  <ListItemIcon 
                    sx={{ 
                      minWidth: 40,
                      color: isActive(item.path) ? theme.palette.primary.main : theme.palette.text.secondary,
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText 
                    primary={item.text} 
                    primaryTypographyProps={{
                      fontWeight: isActive(item.path) ? 600 : 400,
                    }}
                  />
                </ListItemButton>
              </ListItem>
            ))}

            {/* 설정 메뉴 */}
            <ListItem disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                onClick={handleSettingsClick}
                selected={isSettingsActive()}
                sx={{
                  borderRadius: '8px',
                  mb: 0.5,
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 40,
                    color: isSettingsActive() ? theme.palette.primary.main : theme.palette.text.secondary,
                  }}
                >
                  <SettingsIcon />
                </ListItemIcon>
                <ListItemText
                  primary="설정"
                  primaryTypographyProps={{
                    fontWeight: isSettingsActive() ? 600 : 400,
                  }}
                />
                {settingsOpen ? <ExpandLess /> : <ExpandMore />}
              </ListItemButton>
            </ListItem>

            {/* 설정 하위 메뉴 */}
            <Collapse in={settingsOpen} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                {settingsItems.map((item) => (
                  <ListItem key={item.text} disablePadding sx={{ ml: 2 }}>
                    <ListItemButton
                      onClick={() => navigateTo(item.path)}
                      selected={isActive(item.path)}
                      sx={{
                        borderRadius: '8px',
                        py: 0.75,
                      }}
                    >
                      <ListItemIcon
                        sx={{
                          minWidth: 35,
                          color: isActive(item.path) ? theme.palette.primary.main : theme.palette.text.secondary,
                        }}
                      >
                        {item.icon}
                      </ListItemIcon>
                      <ListItemText
                        primary={item.text}
                        primaryTypographyProps={{
                          variant: 'body2',
                          fontWeight: isActive(item.path) ? 600 : 400,
                        }}
                      />
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            </Collapse>
          </List>
        </Box>
      </Drawer>
      
      {/* Main content */}
      <Box component="main" sx={{ flexGrow: 1, p: 0, overflow: 'auto' }}>
        <Box sx={{ minHeight: '70px' }} /> {/* Toolbar spacer */}
        <Outlet />
      </Box>
    </Box>
  );
} 