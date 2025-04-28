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
  FormControlLabel,
  Switch,
  Divider,
  SelectChangeEvent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
  CircularProgress
} from '@mui/material';
import { Save as SaveIcon } from '@mui/icons-material';

export default function SmsSettings() {
  const [smsSettings, setSmsSettings] = useState({
    provider: 'navercloud',
    apiKey: '',
    secretKey: '',
    senderId: 'D.PICK',
    useVerification: true
  });

  const [testSmsDialog, setTestSmsDialog] = useState(false);
  const [testPhoneNumber, setTestPhoneNumber] = useState('');
  const [testMessage, setTestMessage] = useState('D.PICK SMS 테스트 메시지입니다.');
  const [sending, setSending] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error'
  });

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

  const handleSaveSettings = () => {
    // 여기서 API 호출 또는 상태 업데이트
    console.log('저장된 SMS 설정:', smsSettings);
    // TODO: 실제 API 호출 구현
    setSnackbar({
      open: true,
      message: 'SMS 설정이 저장되었습니다.',
      severity: 'success'
    });
  };

  const handleOpenTestDialog = () => {
    setTestSmsDialog(true);
    setTestPhoneNumber('');
    setTestMessage('D.PICK SMS 테스트 메시지입니다.');
  };

  const handleCloseTestDialog = () => {
    setTestSmsDialog(false);
  };

  const handleTestPhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTestPhoneNumber(e.target.value);
  };

  const handleTestMessageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTestMessage(e.target.value);
  };

  const handleSendTestSms = async () => {
    if (!testPhoneNumber) return;
    
    setSending(true);
    
    try {
      // API 호출을 시뮬레이션 (실제로는 서버에 요청을 보냄)
      // const response = await fetch('/api/sms/test', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     ...smsSettings,
      //     recipient: testPhoneNumber,
      //     message: testMessage
      //   })
      // });
      
      // 테스트용 타임아웃
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // 성공 시
      setSnackbar({
        open: true,
        message: `테스트 SMS가 ${testPhoneNumber}로 성공적으로 발송되었습니다.`,
        severity: 'success'
      });
      
      setTestSmsDialog(false);
    } catch (error) {
      // 실패 시
      setSnackbar({
        open: true,
        message: '테스트 SMS 발송에 실패했습니다. 설정을 확인해주세요.',
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
        SMS 설정
      </Typography>
      
      <Paper sx={{ p: 3, mt: 3 }}>
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
              테스트 SMS 보내기
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* 테스트 SMS 발송 대화상자 */}
      <Dialog open={testSmsDialog} onClose={handleCloseTestDialog} maxWidth="sm" fullWidth>
        <DialogTitle>테스트 SMS 발송</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" paragraph>
            현재 구성된 SMS 설정으로 테스트 메시지를 발송합니다.
          </Typography>
          <TextField
            fullWidth
            label="수신 전화번호"
            value={testPhoneNumber}
            onChange={handleTestPhoneChange}
            margin="normal"
            required
            placeholder="010-1234-5678"
            error={testPhoneNumber === ''}
            helperText={testPhoneNumber === '' ? '전화번호를 입력해주세요' : ''}
          />
          <TextField
            fullWidth
            label="메시지 내용"
            value={testMessage}
            onChange={handleTestMessageChange}
            margin="normal"
            multiline
            rows={3}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseTestDialog}>취소</Button>
          <Button 
            onClick={handleSendTestSms} 
            variant="contained" 
            color="primary"
            disabled={sending || !testPhoneNumber}
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