import { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  Divider,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormHelperText,
  Collapse,
  ListItemButton,
  ListItemIcon,
  SelectChangeEvent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip
} from '@mui/material';
import {
  Save as SaveIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Email as EmailIcon,
  Sms as SmsIcon,
  CreditCard as CreditCardIcon,
  Security as SecurityIcon,
  AccountCircle as AccountCircleIcon,
  ExpandLess,
  ExpandMore,
  Settings as SettingsIcon,
  MoveToInbox as InboxIcon
} from '@mui/icons-material';
import { useNavigate, Routes, Route, useLocation } from 'react-router-dom';

function Settings() {
  const [emailSettings, setEmailSettings] = useState({
    smtpServer: 'smtp.gmail.com',
    port: '587',
    username: 'example@gmail.com',
    password: '',
    fromName: 'D.PICK 관리자',
    fromEmail: 'noreply@dpick.com',
    useSSL: true
  });
  const [smsSettings, setSmsSettings] = useState({
    provider: 'navercloud',
    apiKey: '',
    secretKey: '',
    senderId: 'D.PICK',
    useVerification: true
  });
  const [openDialog, setOpenDialog] = useState(false);
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    role: 'viewer'
  });
  
  // 설정 메뉴 관리 상태
  const [openSettings, setOpenSettings] = useState({
    email: false,
    sms: false,
    users: false,
    billing: false
  });
  
  // 현재 선택된 설정 페이지
  const [selectedSetting, setSelectedSetting] = useState<string | null>(null);
  
  const navigate = useNavigate();
  const location = useLocation();

  // 임시 사용자 목록
  const [users, setUsers] = useState([
    { id: 1, name: '김관리자', email: 'admin@example.com', role: 'admin' },
    { id: 2, name: '이프로젝트', email: 'project@example.com', role: 'project_manager' },
    { id: 3, name: '박리소스', email: 'resource@example.com', role: 'resource_manager' },
    { id: 4, name: '최열람', email: 'viewer@example.com', role: 'viewer' },
  ]);

  // 메뉴 토글 핸들러
  const handleToggle = (menu: keyof typeof openSettings) => {
    setOpenSettings({
      ...openSettings,
      [menu]: !openSettings[menu]
    });
    
    if (!openSettings[menu]) {
      setSelectedSetting(menu);
    } else {
      setSelectedSetting(null);
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEmailSettings({
      ...emailSettings,
      [name]: value
    });
  };

  const handleEmailToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmailSettings({
      ...emailSettings,
      useSSL: e.target.checked
    });
  };

  const handleSmsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSmsSettings({
      ...smsSettings,
      [name]: value
    });
  };

  const handleSmsToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSmsSettings({
      ...smsSettings,
      useVerification: e.target.checked
    });
  };

  const handleSmsProviderChange = (e: SelectChangeEvent) => {
    setSmsSettings({
      ...smsSettings,
      provider: e.target.value
    });
  };

  const handleAddUser = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleNewUserChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewUser({
      ...newUser,
      [name]: value
    });
  };

  const handleRoleChange = (e: SelectChangeEvent) => {
    setNewUser({
      ...newUser,
      role: e.target.value
    });
  };

  const handleSaveUser = () => {
    setUsers([
      ...users,
      {
        id: Date.now(),
        name: newUser.name,
        email: newUser.email,
        role: newUser.role
      }
    ]);
    setNewUser({ name: '', email: '', role: 'viewer' });
    setOpenDialog(false);
  };

  const handleDeleteUser = (userId: number) => {
    setUsers(users.filter(user => user.id !== userId));
  };

  const getRoleName = (role: string) => {
    switch (role) {
      case 'admin':
        return '관리자';
      case 'project_manager':
        return '프로젝트 관리자';
      case 'resource_manager':
        return '리소스 관리자';
      case 'viewer':
        return '열람자';
      case 'announcement_manager':
        return '공고 관리자';
      default:
        return role;
    }
  };

  // 이메일 설정 렌더 함수
  const renderEmailSettings = () => (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        이메일 서버 설정
      </Typography>
      <Typography variant="body2" color="text.secondary" paragraph>
        이메일 발송에 사용될 SMTP 서버 정보를 설정합니다.
      </Typography>
      <Divider sx={{ mb: 3 }} />

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="SMTP 서버"
            name="smtpServer"
            value={emailSettings.smtpServer}
            onChange={handleEmailChange}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="포트"
            name="port"
            value={emailSettings.port}
            onChange={handleEmailChange}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="사용자명"
            name="username"
            value={emailSettings.username}
            onChange={handleEmailChange}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="비밀번호"
            name="password"
            type="password"
            value={emailSettings.password}
            onChange={handleEmailChange}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="발신자 이름"
            name="fromName"
            value={emailSettings.fromName}
            onChange={handleEmailChange}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="발신자 이메일"
            name="fromEmail"
            value={emailSettings.fromEmail}
            onChange={handleEmailChange}
          />
        </Grid>
        <Grid item xs={12}>
          <FormControlLabel
            control={<Switch checked={emailSettings.useSSL} onChange={handleEmailToggle} />}
            label="SSL 사용"
          />
        </Grid>
        <Grid item xs={12}>
          <Button
            variant="contained"
            startIcon={<SaveIcon />}
            sx={{ mt: 2 }}
          >
            설정 저장
          </Button>
          <Button
            variant="outlined"
            sx={{ mt: 2, ml: 2 }}
          >
            테스트 이메일 보내기
          </Button>
        </Grid>
      </Grid>
    </Paper>
  );

  // SMS 설정 렌더 함수
  const renderSmsSettings = () => (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        SMS 발송 설정
      </Typography>
      <Typography variant="body2" color="text.secondary" paragraph>
        SMS 발송에 사용될 서비스 설정을 구성합니다.
      </Typography>
      <Divider sx={{ mb: 3 }} />

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel>서비스 제공자</InputLabel>
            <Select
              value={smsSettings.provider}
              label="서비스 제공자"
              onChange={handleSmsProviderChange}
            >
              <MenuItem value="navercloud">네이버 클라우드</MenuItem>
              <MenuItem value="aws_sns">AWS SNS</MenuItem>
              <MenuItem value="coolsms">쿨SMS</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="API 키"
            name="apiKey"
            value={smsSettings.apiKey}
            onChange={handleSmsChange}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Secret 키"
            name="secretKey"
            type="password"
            value={smsSettings.secretKey}
            onChange={handleSmsChange}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="발신자 ID"
            name="senderId"
            value={smsSettings.senderId}
            onChange={handleSmsChange}
          />
        </Grid>
        <Grid item xs={12}>
          <FormControlLabel
            control={<Switch checked={smsSettings.useVerification} onChange={handleSmsToggle} />}
            label="발송 전 인증번호 검증"
          />
        </Grid>
        <Grid item xs={12}>
          <Button
            variant="contained"
            startIcon={<SaveIcon />}
            sx={{ mt: 2 }}
          >
            설정 저장
          </Button>
          <Button
            variant="outlined"
            sx={{ mt: 2, ml: 2 }}
          >
            테스트 SMS 보내기
          </Button>
        </Grid>
      </Grid>
    </Paper>
  );

  // 사용자 관리 렌더 함수
  const renderUserManagement = () => (
    <Paper sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">
          사용자 관리
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAddUser}
        >
          사용자 추가
        </Button>
      </Box>
      <Typography variant="body2" color="text.secondary" paragraph>
        D.PICK 시스템에 접근할 수 있는 사용자를 관리합니다.
      </Typography>
      <Divider sx={{ mb: 3 }} />

      <List>
        {users.map(user => (
          <ListItem
            key={user.id}
            secondaryAction={
              <IconButton edge="end" aria-label="delete" onClick={() => handleDeleteUser(user.id)}>
                <DeleteIcon />
              </IconButton>
            }
          >
            <ListItemText
              primary={user.name}
              secondary={
                <Box component="span">
                  {user.email} • {getRoleName(user.role)}
                </Box>
              }
            />
          </ListItem>
        ))}
      </List>
    </Paper>
  );

  // 결제 설정 렌더 함수
  const renderBillingSettings = () => (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        결제 설정
      </Typography>
      <Typography variant="body2" color="text.secondary" paragraph>
        서비스 이용 요금 결제를 위한 설정을 관리합니다.
      </Typography>
      <Divider sx={{ mb: 3 }} />

      <Box sx={{ mb: 4 }}>
        <Typography variant="subtitle1" gutterBottom fontWeight={500}>
          현재 구독 상태
        </Typography>
        <Card>
          <CardContent>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  구독 플랜
                </Typography>
                <Typography variant="body1">
                  비즈니스 플랜
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  갱신 예정일
                </Typography>
                <Typography variant="body1">
                  2024년 12월 31일
                </Typography>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Box>

      <Box sx={{ mb: 4 }}>
        <Typography variant="subtitle1" gutterBottom fontWeight={500}>
          결제 방법
        </Typography>
        <Card>
          <CardContent>
            <Grid container spacing={2} alignItems="center">
              <Grid item>
                <CreditCardIcon fontSize="large" />
              </Grid>
              <Grid item xs>
                <Typography variant="body1">
                  신용카드 (1234 **** **** 5678)
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  만료일: 12/25
                </Typography>
              </Grid>
              <Grid item>
                <Button variant="outlined" size="small">
                  변경
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Box>

      <Box>
        <Typography variant="subtitle1" gutterBottom fontWeight={500}>
          청구 내역
        </Typography>
        <TableContainer component={Paper} variant="outlined">
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>날짜</TableCell>
                <TableCell>설명</TableCell>
                <TableCell align="right">금액</TableCell>
                <TableCell align="right">상태</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>2024-04-01</TableCell>
                <TableCell>비즈니스 플랜 월 구독</TableCell>
                <TableCell align="right">₩150,000</TableCell>
                <TableCell align="right">
                  <Chip label="결제 완료" size="small" color="success" />
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>2024-03-01</TableCell>
                <TableCell>비즈니스 플랜 월 구독</TableCell>
                <TableCell align="right">₩150,000</TableCell>
                <TableCell align="right">
                  <Chip label="결제 완료" size="small" color="success" />
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Paper>
  );

  // 현재 선택된 설정 페이지 렌더링
  const renderSelectedSetting = () => {
    switch(selectedSetting) {
      case 'email':
        return renderEmailSettings();
      case 'sms':
        return renderSmsSettings();
      case 'users':
        return renderUserManagement();
      case 'billing':
        return renderBillingSettings();
      default:
        return (
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="body1" color="text.secondary">
              왼쪽 메뉴에서 설정 항목을 선택하세요.
            </Typography>
          </Paper>
        );
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        설정
      </Typography>

      <Grid container spacing={3}>
        {/* 설정 메뉴 */}
        <Grid item xs={12} md={3}>
          <Paper sx={{ mb: { xs: 3, md: 0 }}}>
            <List component="nav" aria-label="설정 메뉴" sx={{ p: 1 }}>
              {/* 이메일 설정 */}
              <ListItemButton onClick={() => handleToggle('email')}>
                <ListItemIcon>
                  <EmailIcon />
                </ListItemIcon>
                <ListItemText primary="이메일 설정" />
                {openSettings.email ? <ExpandLess /> : <ExpandMore />}
              </ListItemButton>
              
              {/* SMS 설정 */}
              <ListItemButton onClick={() => handleToggle('sms')}>
                <ListItemIcon>
                  <SmsIcon />
                </ListItemIcon>
                <ListItemText primary="SMS 설정" />
                {openSettings.sms ? <ExpandLess /> : <ExpandMore />}
              </ListItemButton>
              
              {/* 사용자 관리 */}
              <ListItemButton onClick={() => handleToggle('users')}>
                <ListItemIcon>
                  <AccountCircleIcon />
                </ListItemIcon>
                <ListItemText primary="사용자 관리" />
                {openSettings.users ? <ExpandLess /> : <ExpandMore />}
              </ListItemButton>
              
              {/* 결제 설정 */}
              <ListItemButton onClick={() => handleToggle('billing')}>
                <ListItemIcon>
                  <CreditCardIcon />
                </ListItemIcon>
                <ListItemText primary="결제 설정" />
                {openSettings.billing ? <ExpandLess /> : <ExpandMore />}
              </ListItemButton>
            </List>
          </Paper>
        </Grid>
        
        {/* 설정 콘텐츠 */}
        <Grid item xs={12} md={9}>
          {renderSelectedSetting()}
        </Grid>
      </Grid>

      {/* 사용자 추가 다이얼로그 */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>사용자 추가</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="이름"
                name="name"
                value={newUser.name}
                onChange={handleNewUserChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="이메일"
                name="email"
                value={newUser.email}
                onChange={handleNewUserChange}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>역할</InputLabel>
                <Select
                  value={newUser.role}
                  label="역할"
                  onChange={handleRoleChange}
                >
                  <MenuItem value="admin">관리자</MenuItem>
                  <MenuItem value="project_manager">프로젝트 관리자</MenuItem>
                  <MenuItem value="resource_manager">리소스 관리자</MenuItem>
                  <MenuItem value="announcement_manager">공고 관리자</MenuItem>
                  <MenuItem value="viewer">열람자</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>취소</Button>
          <Button onClick={handleSaveUser} variant="contained">추가</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default Settings; 