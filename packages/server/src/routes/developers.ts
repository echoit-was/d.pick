import express from 'express';
import { Developer, generateId } from '../../../../shared/dist/src/index';

const router = express.Router();

// 개발자 목록 가져오기
// GET /api/developers
router.get('/', (req, res) => {
  // 임시 데이터 (실제 구현 시에는 데이터베이스 연동 필요)
  const developers: Developer[] = [
    {
      id: '1',
      name: '홍길동',
      birthDate: '1990-01-15',
      email: 'hong@example.com',
      phone: '010-1234-5678',
      skills: ['JavaScript', 'React', 'Node.js'],
      experienceYears: 5,
      level: '중급',
      type: '프론트엔드개발자',
      currentProjects: ['1'],
      projectStartDate: '2023-10-01',
      projectEndDate: '2024-05-31',
      contacts: [
        {
          id: '1',
          developerId: '1',
          contactDate: '2023-09-15',
          memo: '프로젝트 참여 문의 - 긍정적 반응',
          createdAt: '2023-09-15T09:30:00Z',
        }
      ],
      nextProjects: [],
      expectedStartDate: '',
      paymentDate: '2024-05-05',
      expectedSalary: 5000000,
      paymentStatus: '미지급',
      createdAt: '2023-09-01T00:00:00Z',
      updatedAt: '2024-04-01T00:00:00Z',
    },
    {
      id: '2',
      name: '김영희',
      birthDate: '1988-05-20',
      email: 'kim@example.com',
      phone: '010-9876-5432',
      skills: ['Java', 'Spring', 'MySQL'],
      experienceYears: 8,
      level: '고급',
      type: '백엔드개발자',
      currentProjects: ['2'],
      projectStartDate: '2024-01-15',
      projectEndDate: '2024-07-31',
      contacts: [
        {
          id: '2',
          developerId: '2',
          contactDate: '2023-12-20',
          memo: '프로젝트 참여 확정',
          createdAt: '2023-12-20T14:20:00Z',
        }
      ],
      nextProjects: ['3'],
      expectedStartDate: '2024-08-01',
      paymentDate: '2024-05-10',
      expectedSalary: 7000000,
      paymentStatus: '미지급',
      createdAt: '2023-12-01T00:00:00Z',
      updatedAt: '2024-04-01T00:00:00Z',
    }
  ];
  
  res.json(developers);
});

// 개발자 상세 정보 가져오기
// GET /api/developers/:id
router.get('/:id', (req, res) => {
  // 임시 데이터 (실제 구현 시에는 데이터베이스 연동 필요)
  const developer: Developer = {
    id: req.params.id,
    name: '홍길동',
    birthDate: '1990-01-15',
    email: 'hong@example.com',
    phone: '010-1234-5678',
    skills: ['JavaScript', 'React', 'Node.js'],
    experienceYears: 5,
    level: '중급',
    type: '프론트엔드개발자',
    currentProjects: ['1'],
    projectStartDate: '2023-10-01',
    projectEndDate: '2024-05-31',
    contacts: [
      {
        id: '1',
        developerId: req.params.id,
        contactDate: '2023-09-15',
        memo: '프로젝트 참여 문의 - 긍정적 반응',
        createdAt: '2023-09-15T09:30:00Z',
      }
    ],
    nextProjects: [],
    expectedStartDate: '',
    paymentDate: '2024-05-05',
    expectedSalary: 5000000,
    paymentStatus: '미지급',
    createdAt: '2023-09-01T00:00:00Z',
    updatedAt: '2024-04-01T00:00:00Z',
  };
  
  res.json(developer);
});

// 개발자 추가
// POST /api/developers
router.post('/', (req, res) => {
  const newDeveloper: Developer = {
    ...req.body,
    id: generateId(),
    contacts: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  
  // 실제 구현 시에는 데이터베이스에 저장
  res.status(201).json(newDeveloper);
});

// 개발자 정보 수정
// PUT /api/developers/:id
router.put('/:id', (req, res) => {
  const updatedDeveloper: Developer = {
    ...req.body,
    id: req.params.id,
    updatedAt: new Date().toISOString(),
  };
  
  // 실제 구현 시에는 데이터베이스에서 업데이트
  res.json(updatedDeveloper);
});

// 개발자 삭제
// DELETE /api/developers/:id
router.delete('/:id', (req, res) => {
  // 실제 구현 시에는 데이터베이스에서 삭제
  res.status(204).end();
});

// 개발자 연락 기록 추가
// POST /api/developers/:id/contacts
router.post('/:id/contacts', (req, res) => {
  const newContact = {
    id: generateId(),
    developerId: req.params.id,
    contactDate: req.body.contactDate || new Date().toISOString().split('T')[0],
    memo: req.body.memo || '',
    createdAt: new Date().toISOString(),
  };
  
  // 실제 구현 시에는 데이터베이스에 저장
  res.status(201).json(newContact);
});

// 개발자 연락 기록 가져오기
// GET /api/developers/:id/contacts
router.get('/:id/contacts', (req, res) => {
  // 임시 데이터 (실제 구현 시에는 데이터베이스 연동 필요)
  const contacts = [
    {
      id: '1',
      developerId: req.params.id,
      contactDate: '2023-09-15',
      memo: '프로젝트 참여 문의 - 긍정적 반응',
      createdAt: '2023-09-15T09:30:00Z',
    },
    {
      id: '2',
      developerId: req.params.id,
      contactDate: '2023-09-25',
      memo: '계약 조건 협의',
      createdAt: '2023-09-25T14:15:00Z',
    }
  ];
  
  res.json(contacts);
});

export default router; 