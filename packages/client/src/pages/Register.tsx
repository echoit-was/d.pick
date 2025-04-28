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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Divider,
} from '@mui/material';
import { LockOutlined as LockOutlinedIcon } from '@mui/icons-material';

function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: '',
    company: '',
  });
  const [errors, setErrors] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
    const { name, value } = e.target as { name: string; value: string };
    setFormData({
      ...formData,
      [name]: value,
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

    // 이름 검증
    if (!formData.name.trim()) {
      newErrors.name = '이름을 입력해주세요';
      valid = false;
    }

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
    } else if (formData.password.length < 8) {
      newErrors.password = '비밀번호는 8자 이상이어야 합니다';
      valid = false;
    }

    // 비밀번호 확인 검증
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = '비밀번호 확인을 입력해주세요';
      valid = false;
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = '비밀번호가 일치하지 않습니다';
      valid = false;
    }

    // 역할 검증
    if (!formData.role) {
      newErrors.role = '역할을 선택해주세요';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      // API 호출 코드 (여기서는 생략)
      console.log('회원가입 정보:', formData);
      
      // 회원가입 성공 시 로그인 페이지로 이동
      setTimeout(() => {
        navigate('/login');
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
          maxWidth: 600,
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
            D.PICK 회원가입
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            IT 인력 아웃소싱 관리 시스템
          </Typography>
        </Box>

        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                name="name"
                label="이름"
                variant="outlined"
                fullWidth
                value={formData.name}
                onChange={handleChange}
                error={!!errors.name}
                helperText={errors.name}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="email"
                label="이메일"
                variant="outlined"
                fullWidth
                type="email"
                value={formData.email}
                onChange={handleChange}
                error={!!errors.email}
                helperText={errors.email}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="password"
                label="비밀번호"
                variant="outlined"
                fullWidth
                type="password"
                value={formData.password}
                onChange={handleChange}
                error={!!errors.password}
                helperText={errors.password || '8자 이상의 비밀번호를 입력하세요'}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="confirmPassword"
                label="비밀번호 확인"
                variant="outlined"
                fullWidth
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth error={!!errors.role} required>
                <InputLabel id="role-label">역할</InputLabel>
                <Select
                  labelId="role-label"
                  id="role"
                  name="role"
                  value={formData.role}
                  label="역할"
                  onChange={handleChange}
                >
                  <MenuItem value="client">클라이언트</MenuItem>
                  <MenuItem value="project_manager">프로젝트 관리자</MenuItem>
                  <MenuItem value="resource_manager">인력 관리자</MenuItem>
                  <MenuItem value="developer">개발자</MenuItem>
                </Select>
                {errors.role && <FormHelperText>{errors.role}</FormHelperText>}
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="company"
                label="소속 회사명 (선택사항)"
                variant="outlined"
                fullWidth
                value={formData.company}
                onChange={handleChange}
              />
            </Grid>
          </Grid>

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            회원가입
          </Button>

          <Divider sx={{ my: 2 }} />
          
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body2">
              이미 계정이 있으신가요?{' '}
              <Link component={RouterLink} to="/login" variant="body2">
                로그인
              </Link>
            </Typography>
          </Box>
        </form>
      </Paper>
    </Box>
  );
}

export default Register; 