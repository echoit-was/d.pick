import { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  TextField,
  Button,
  Link,
  Paper,
  Grid,
  Avatar,
  FormControlLabel,
  Checkbox,
  Divider,
} from '@mui/material';
import { LockOutlined as LockOutlinedIcon } from '@mui/icons-material';

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });
  const [errors, setErrors] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, checked } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'rememberMe' ? checked : value,
    });

    // 입력값이 변경되면 해당 필드의 오류 메시지 초기화
    if (errors[name as keyof typeof errors]) {
      setErrors({
        ...errors,
        [name]: '',
      });
    }
  };

  const validateForm = () => {
    let valid = true;
    const newErrors = { ...errors };

    // 이메일 검증
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!formData.email.trim()) {
      newErrors.email = '이메일을 입력해주세요';
      valid = false;
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = '유효한 이메일 주소를 입력해주세요';
      valid = false;
    }

    // 비밀번호 검증
    if (!formData.password) {
      newErrors.password = '비밀번호를 입력해주세요';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      // 실제 구현에서는 API 호출하여 로그인 처리
      console.log('로그인 정보:', formData);
      
      // 임시 로그인 성공 처리
      setTimeout(() => {
        // 원래는 API 응답으로 받은 토큰과 사용자 정보를 저장해야 함
        localStorage.setItem('isAuthenticated', 'true');
        navigate('/');
      }, 1000);
    }
  };

  return (
    <Box
      sx={{
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'background.default',
        p: 2,
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: 4,
          maxWidth: 500,
          width: '100%',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            mb: 3,
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'primary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            D.PICK 로그인
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            IT 인력 아웃소싱 관리 시스템
          </Typography>
        </Box>

        <form onSubmit={handleSubmit}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="이메일 주소"
            name="email"
            autoComplete="email"
            autoFocus
            value={formData.email}
            onChange={handleChange}
            error={!!errors.email}
            helperText={errors.email}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="비밀번호"
            type="password"
            id="password"
            autoComplete="current-password"
            value={formData.password}
            onChange={handleChange}
            error={!!errors.password}
            helperText={errors.password}
          />
          <FormControlLabel
            control={
              <Checkbox 
                name="rememberMe" 
                color="primary" 
                checked={formData.rememberMe}
                onChange={handleChange}
              />
            }
            label="로그인 상태 유지"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            로그인
          </Button>
          <Grid container>
            <Grid item xs>
              <Link component={RouterLink} to="/forgot-password" variant="body2">
                비밀번호 찾기
              </Link>
            </Grid>
            <Grid item>
              <Link component={RouterLink} to="/register" variant="body2">
                {"계정이 없으신가요? 회원가입"}
              </Link>
            </Grid>
          </Grid>

          <Divider sx={{ my: 3 }} />

          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              © {new Date().getFullYear()} D.PICK. All rights reserved.
            </Typography>
          </Box>
        </form>
      </Paper>
    </Box>
  );
}

export default Login; 