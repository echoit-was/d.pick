import express from 'express';
import { Project, Announcement, generateId } from '../../../../shared/dist/src/index';

const router = express.Router();

// 프로젝트 목록 가져오기
// GET /api/projects
router.get('/', (req, res) => {
  // 임시 데이터 (실제 구현 시에는 데이터베이스 연동 필요)
  const projects: Project[] = [
    {
      id: '1',
      title: '웹 서비스 리뉴얼',
      description: '기존 웹 서비스의 디자인 및 기능 개선 프로젝트',
      startDate: '2023-10-01',
      endDate: '2024-05-31',
      status: 'inProgress',
      type: '자사',
      team: ['1', '3', '5'],
      totalMMRequired: 20,
      confirmedMM: 15,
      inDiscussionMM: 5,
      announcements: [],
      createdAt: '2023-09-01T00:00:00Z',
      updatedAt: '2024-04-01T00:00:00Z',
    },
    {
      id: '2',
      title: '모바일 앱 개발',
      description: '안드로이드 및 iOS 모바일 애플리케이션 개발',
      startDate: '2024-01-15',
      endDate: '2024-07-31',
      status: 'inProgress',
      type: '타사',
      team: ['2', '4', '6'],
      totalMMRequired: 18,
      confirmedMM: 12,
      inDiscussionMM: 0,
      announcements: [],
      createdAt: '2023-12-01T00:00:00Z',
      updatedAt: '2024-03-15T00:00:00Z',
    },
    {
      id: '3',
      title: '데이터 분석 시스템',
      description: '고객 데이터 분석 및 시각화 시스템 개발',
      startDate: '2024-08-01',
      endDate: '2025-02-28',
      status: 'planned',
      type: '자사',
      team: [],
      totalMMRequired: 24,
      confirmedMM: 8,
      inDiscussionMM: 10,
      announcements: [],
      createdAt: '2024-03-01T00:00:00Z',
      updatedAt: '2024-04-01T00:00:00Z',
    },
    {
      id: '4',
      title: '클라우드 마이그레이션',
      description: '온프레미스 시스템을 클라우드로 마이그레이션하는 프로젝트',
      startDate: undefined,
      endDate: undefined,
      status: 'recruiting',
      type: '자사',
      team: [],
      totalMMRequired: 30,
      confirmedMM: 0,
      inDiscussionMM: 5,
      announcements: [
        {
          id: '1',
          projectId: '4',
          sentDate: '2024-04-10',
          channel: 'email',
          content: '클라우드 마이그레이션 프로젝트에 참여할 인프라 엔지니어를 모집합니다.',
          recipients: ['dev1@example.com', 'dev2@example.com'],
          createdAt: '2024-04-10T10:00:00Z',
        }
      ],
      createdAt: '2024-04-01T00:00:00Z',
      updatedAt: '2024-04-10T00:00:00Z',
    }
  ];
  
  res.json(projects);
});

// 프로젝트 필터링 (상태별)
// GET /api/projects/status/:status
router.get('/status/:status', (req, res) => {
  const { status } = req.params;
  
  // 임시 데이터 (실제 구현 시에는 데이터베이스 쿼리 필요)
  const projects: Project[] = [
    {
      id: '1',
      title: '웹 서비스 리뉴얼',
      description: '기존 웹 서비스의 디자인 및 기능 개선 프로젝트',
      startDate: '2023-10-01',
      endDate: '2024-05-31',
      status: 'inProgress',
      type: '자사',
      team: ['1', '3', '5'],
      totalMMRequired: 20,
      confirmedMM: 15,
      inDiscussionMM: 5,
      announcements: [],
      createdAt: '2023-09-01T00:00:00Z',
      updatedAt: '2024-04-01T00:00:00Z',
    }
  ].filter(p => p.status === status);
  
  res.json(projects);
});

// 프로젝트 상세 정보 가져오기
// GET /api/projects/:id
router.get('/:id', (req, res) => {
  // 임시 데이터 (실제 구현 시에는 데이터베이스 연동 필요)
  const project: Project = {
    id: req.params.id,
    title: '웹 서비스 리뉴얼',
    description: '기존 웹 서비스의 디자인 및 기능 개선 프로젝트',
    startDate: '2023-10-01',
    endDate: '2024-05-31',
    status: 'inProgress',
    type: '자사',
    team: ['1', '3', '5'],
    totalMMRequired: 20,
    confirmedMM: 15,
    inDiscussionMM: 5,
    announcements: [],
    createdAt: '2023-09-01T00:00:00Z',
    updatedAt: '2024-04-01T00:00:00Z',
  };
  
  res.json(project);
});

// 프로젝트 추가
// POST /api/projects
router.post('/', (req, res) => {
  const newProject: Project = {
    ...req.body,
    id: generateId(),
    announcements: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  
  // 실제 구현 시에는 데이터베이스에 저장
  res.status(201).json(newProject);
});

// 프로젝트 정보 수정
// PUT /api/projects/:id
router.put('/:id', (req, res) => {
  const updatedProject: Project = {
    ...req.body,
    id: req.params.id,
    updatedAt: new Date().toISOString(),
  };
  
  // 실제 구현 시에는 데이터베이스에서 업데이트
  res.json(updatedProject);
});

// 프로젝트 삭제
// DELETE /api/projects/:id
router.delete('/:id', (req, res) => {
  // 실제 구현 시에는 데이터베이스에서 삭제
  res.status(204).end();
});

// 프로젝트 공고 추가
// POST /api/projects/:id/announcements
router.post('/:id/announcements', (req, res) => {
  const newAnnouncement: Announcement = {
    id: generateId(),
    projectId: req.params.id,
    sentDate: new Date().toISOString().split('T')[0],
    channel: req.body.channel,
    content: req.body.content,
    recipients: req.body.recipients || [],
    createdAt: new Date().toISOString(),
  };
  
  // 실제 구현 시에는 데이터베이스에 저장
  res.status(201).json(newAnnouncement);
});

// 프로젝트 공고 목록 가져오기
// GET /api/projects/:id/announcements
router.get('/:id/announcements', (req, res) => {
  // 임시 데이터 (실제 구현 시에는 데이터베이스 연동 필요)
  const announcements: Announcement[] = [
    {
      id: '1',
      projectId: req.params.id,
      sentDate: '2024-04-10',
      channel: 'email',
      content: '프로젝트에 참여할 개발자를 모집합니다.',
      recipients: ['dev1@example.com', 'dev2@example.com'],
      createdAt: '2024-04-10T10:00:00Z',
    }
  ];
  
  res.json(announcements);
});

// 프로젝트에 개발자 추가
// POST /api/projects/:id/team
router.post('/:id/team', (req, res) => {
  const { developerId } = req.body;
  
  // 실제 구현 시에는 데이터베이스에서 프로젝트 팀 업데이트
  // 그리고 개발자 currentProjects 필드도 업데이트해야 함
  
  res.status(200).json({ message: '개발자가 프로젝트에 추가되었습니다.' });
});

// 프로젝트에서 개발자 제거
// DELETE /api/projects/:id/team/:developerId
router.delete('/:id/team/:developerId', (req, res) => {
  // 실제 구현 시에는 데이터베이스에서 프로젝트 팀 업데이트
  // 그리고 개발자 currentProjects 필드도 업데이트해야 함
  
  res.status(200).json({ message: '개발자가 프로젝트에서 제거되었습니다.' });
});

export default router; 