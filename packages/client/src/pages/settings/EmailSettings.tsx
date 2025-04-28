import { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Grid,
  FormControlLabel,
  Switch,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
  CircularProgress
} from '@mui/material';
import { Save as SaveIcon } from '@mui/icons-material';

export default function EmailSettings() {
  const [emailSettings, setEmailSettings] = useState({
    smtpServer: 'smtp.gmail.com',
    port: '587',
    username: 'example@gmail.com',
    password: '',
    fromName: 'D.PICK 관리자',
    fromEmail: 'noreply@dpick.com',
    useSSL: true
  });

  const [testEmailDialog, setTestEmailDialog] = useState(false);
  const [testEmail, setTestEmail] = useState('');
  const [sending, setSending] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error'
  });

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

  const handleSaveSettings = () => {
    // 여기서 API 호출 또는 상태 업데이트
    console.log('저장된 이메일 설정:', emailSettings);
    // TODO: 실제 API 호출 구현
    setSnackbar({
      open: true,
      message: '이메일 설정이 저장되었습니다.',
      severity: 'success'
    });
  };

  const handleOpenTestDialog = () => {
    setTestEmailDialog(true);
    setTestEmail('');
  };

  const handleCloseTestDialog = () => {
    setTestEmailDialog(false);
  };

  const handleTestEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTestEmail(e.target.value);
  };

  const handleSendTestEmail = async () => {
    if (!testEmail) return;
    
    setSending(true);
    
    try {
      // API 호출을 시뮬레이션 (실제로는 서버에 요청을 보냄)
      // const response = await fetch('/api/email/test', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     ...emailSettings,
      //     recipient: testEmail
      //   })
      // });
      
      // 테스트용 타임아웃
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // 성공 시
      setSnackbar({
        open: true,
        message: `테스트 이메일이 ${testEmail}로 성공적으로 발송되었습니다.`,
        severity: 'success'
      });
      
      setTestEmailDialog(false);
    } catch (error) {
      // 실패 시
      setSnackbar({
        open: true,
        message: '테스트 이메일 발송에 실패했습니다. 설정을 확인해주세요.',
        severity: 'error'
      });
    } finally {
      setSending(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({
      ...snackbar,
      open: false
    });
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        이메일 설정
      </Typography>
      
      <Paper sx={{ p: 3, mt: 3 }}>
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
              onClick={handleSaveSettings}
              sx={{ mt: 2 }}
            >
              설정 저장
            </Button>
            <Button
              variant="outlined"
              sx={{ mt: 2, ml: 2 }}
              onClick={handleOpenTestDialog}
            >
              테스트 이메일 보내기
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* 테스트 이메일 발송 대화상자 */}
      <Dialog open={testEmailDialog} onClose={handleCloseTestDialog} maxWidth="sm" fullWidth>
        <DialogTitle>테스트 이메일 발송</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" paragraph>
            현재 구성된 이메일 설정으로 테스트 이메일을 발송합니다.
          </Typography>
          <TextField
            fullWidth
            label="수신 이메일 주소"
            value={testEmail}
            onChange={handleTestEmailChange}
            margin="normal"
            required
            error={testEmail === ''}
            helperText={testEmail === '' ? '이메일 주소를 입력해주세요' : ''}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseTestDialog}>취소</Button>
          <Button 
            onClick={handleSendTestEmail} 
            variant="contained" 
            color="primary"
            disabled={sending || !testEmail}
          >
            {sending ? <CircularProgress size={24} /> : '발송하기'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* 알림 메시지 */}
      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={6000} 
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
} 