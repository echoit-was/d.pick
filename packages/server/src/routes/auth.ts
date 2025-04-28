import express from 'express';
import { User, generateId } from '../../../../shared/dist/src/index';

const router = express.Router();

// 로그인
// POST /api/auth/login
router.post('/login', (req, res) => {
  const { email, password } = req.body;
  
  // 실제 구현에서는 데이터베이스에서 사용자 확인 및 비밀번호 검증 필요
  if (email === 'admin@example.com' && password === 'password') {
    const user: User = {
      id: '1',
      name: '관리자',
      email: 'admin@example.com',
      role: 'admin',
    };
    
    // 실제 구현에서는 JWT 토큰 발급 필요
    res.json({
      user,
      token: 'mock-jwt-token',
    });
  } else {
    res.status(401).json({
      message: '이메일 또는 비밀번호가 올바르지 않습니다.',
    });
  }
});

// 로그아웃 (클라이언트 측에서 토큰 삭제가 주요 동작이지만, 서버 측에서도 처리 가능)
// POST /api/auth/logout
router.post('/logout', (req, res) => {
  // 실제 구현에서는 로그아웃 로직 추가 (토큰 블랙리스트 등)
  res.json({
    message: '성공적으로 로그아웃되었습니다.',
  });
});

// 현재 사용자 정보 가져오기
// GET /api/auth/me
router.get('/me', (req, res) => {
  // 실제 구현에서는 JWT 토큰 검증 및 사용자 정보 조회 필요
  // 여기서는 가상의 데이터 반환
  const user: User = {
    id: '1',
    name: '관리자',
    email: 'admin@example.com',
    role: 'admin',
  };
  
  res.json(user);
});

// 사용자 목록 가져오기 (관리자 전용)
// GET /api/auth/users
router.get('/users', (req, res) => {
  // 실제 구현에서는 JWT 토큰 검증 및 관리자 권한 확인 필요
  
  const users: User[] = [
    {
      id: '1',
      name: '관리자',
      email: 'admin@example.com',
      role: 'admin',
    },
    {
      id: '2',
      name: '프로젝트 매니저',
      email: 'pm@example.com',
      role: '프로젝트관리자',
    },
    {
      id: '3',
      name: '리소스 매니저',
      email: 'rm@example.com',
      role: '리소스관리자',
    },
    {
      id: '4',
      name: '일반 사용자',
      email: 'user@example.com',
      role: '열람자',
    },
  ];
  
  res.json(users);
});

// 사용자 추가 (관리자 전용)
// POST /api/auth/users
router.post('/users', (req, res) => {
  // 실제 구현에서는 JWT 토큰 검증 및 관리자 권한 확인 필요
  
  const newUser: User = {
    ...req.body,
    id: generateId(),
  };
  
  // 실제 구현에서는 데이터베이스에 저장
  res.status(201).json(newUser);
});

// 사용자 정보 수정 (관리자 전용)
// PUT /api/auth/users/:id
router.put('/users/:id', (req, res) => {
  // 실제 구현에서는 JWT 토큰 검증 및 관리자 권한 확인 필요
  
  const updatedUser: User = {
    ...req.body,
    id: req.params.id,
  };
  
  // 실제 구현에서는 데이터베이스에서 업데이트
  res.json(updatedUser);
});

// 사용자 삭제 (관리자 전용)
// DELETE /api/auth/users/:id
router.delete('/users/:id', (req, res) => {
  // 실제 구현에서는 JWT 토큰 검증 및 관리자 권한 확인 필요
  
  // 실제 구현에서는 데이터베이스에서 삭제
  res.status(204).end();
});

export default router; 