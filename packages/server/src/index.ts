import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { generateId } from '../../../shared/dist/src/index';
import dotenv from 'dotenv';
import { json, urlencoded } from 'express';

// 라우터 불러오기
import authRoutes from './routes/auth';
import projectRoutes from './routes/projects';
import developerRoutes from './routes/developers';
import settingsRoutes from './routes/settings';

// 환경 변수 설정
dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// 미들웨어
app.use(cors());
app.use(morgan('dev'));
app.use(json());
app.use(urlencoded({ extended: true }));

// API 라우트
app.get('/', (req, res) => {
  res.json({ message: '프리랜서 개발자 관리 시스템 API 서버가 실행 중입니다!' });
});

// 기본 라우터 (하위 호환성 유지)
app.get('/api/todos', (req, res) => {
  const todos = [
    { id: generateId(), title: '할 일 1', completed: false, userId: '1' },
    { id: generateId(), title: '할 일 2', completed: true, userId: '1' }
  ];
  res.json(todos);
});

// PMS API 라우트
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/developers', developerRoutes);
app.use('/api/settings', settingsRoutes);

// 오류 처리 미들웨어
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({
    message: '서버 오류가 발생했습니다',
    error: process.env.NODE_ENV === 'production' ? {} : err
  });
});

// 서버 시작
app.listen(PORT, () => {
  console.log(`프리랜서 개발자 관리 시스템 API 서버가 http://localhost:${PORT} 에서 실행 중입니다`);
}); 