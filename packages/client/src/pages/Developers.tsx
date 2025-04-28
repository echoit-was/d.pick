import React, { useState, useEffect } from 'react';
import { 
  Box, Typography, Button, Grid, Paper, Tabs, Tab, 
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Chip, IconButton, TextField, InputAdornment, Menu, MenuItem,
  Dialog, DialogTitle, DialogContent, DialogActions,
  FormControl, InputLabel, Select, Avatar, Divider, SelectChangeEvent
} from '@mui/material';
import { 
  Add as AddIcon, 
  Search as SearchIcon,
  MoreVert as MoreIcon,
  FilterList as FilterIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  AttachMoney as MoneyIcon
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import DeveloperAddForm from '../components/DeveloperAddForm';

// 타입 정의
export type DeveloperLevel = '초급' | '중급' | '고급' | '특급';
export type DeveloperType = '프론트엔드개발자' | '백엔드개발자' | '컨설턴트' | '프론트엔드PM' | '백엔드PM' | 'PO';
export type PaymentStatus = '미지급' | '지급예정' | '지급완료';

export interface Contact {
  id: string;
  developerId: string;
  contactDate: string;
  memo: string;
  createdAt: string;
}

export interface Resume {
  id: string;
  developerId: string;
  title: string;
  filePath: string;
  uploadDate: string;
  reviewStatus: 'pending' | 'reviewed' | 'approved' | 'rejected';
  reviewComments?: string;
  reviewedBy?: string;
  reviewedAt?: string;
}

export interface Developer {
  id: string;
  name: string;
  birthDate: string;
  email: string;
  phone: string;
  skills: string[]; // 개발 언어
  experienceYears: number; // 연차
  level: DeveloperLevel; // 등급
  type: DeveloperType; // 타입
  currentProjects: string[]; // 현재 참여 중인 프로젝트 ID
  projectStartDate?: string; // 프로젝트 시작일
  projectEndDate?: string; // 프로젝트 마감 예정일
  contacts: Contact[]; // 연락 기록
  nextProjects: string[]; // 다음 프로젝트 ID
  expectedStartDate?: string; // 투입 예정일
  paymentDate: string; // 급여일
  expectedSalary: number; // 당월 예정 급여
  paymentStatus: PaymentStatus; // 지급 여부
  resumes?: Resume[]; // 이력서 목록
  createdAt: string;
  updatedAt: string;
}

// 레벨별 색상 설정
const getLevelColor = (level: DeveloperLevel) => {
  switch(level) {
    case '초급': return '#4caf50';
    case '중급': return '#2196f3';
    case '고급': return '#ff9800';
    case '특급': return '#f44336';
    default: return '#9e9e9e';
  }
};

// 타입별 색상 설정
const getTypeColor = (type: DeveloperType) => {
  switch(type) {
    case '프론트엔드개발자': return '#3f51b5';
    case '백엔드개발자': return '#009688';
    case '컨설턴트': return '#9c27b0';
    case '프론트엔드PM': return '#673ab7';
    case '백엔드PM': return '#00bcd4';
    case 'PO': return '#ff5722';
    default: return '#9e9e9e';
  }
};

// 현재 날짜로부터 n일 이내인지 확인하는 함수
const isWithinDays = (dateString: string, days: number) => {
  if (!dateString) return false;
  
  const today = new Date();
  const targetDate = new Date(dateString);
  const diffTime = targetDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays >= 0 && diffDays <= days;
};

export default function Developers() {
  const [tabValue, setTabValue] = useState(0);
  const [developers, setDevelopers] = useState<Developer[]>([]);
  const [filteredDevelopers, setFilteredDevelopers] = useState<Developer[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedDeveloper, setSelectedDeveloper] = useState<Developer | null>(null);
  const [contactDialogOpen, setContactDialogOpen] = useState(false);
  const [contactMemo, setContactMemo] = useState('');
  const [filterMenuAnchor, setFilterMenuAnchor] = useState<null | HTMLElement>(null);
  const [actionMenuAnchor, setActionMenuAnchor] = useState<null | HTMLElement>(null);
  const [currentDevId, setCurrentDevId] = useState<string | null>(null);
  const [filterOptions, setFilterOptions] = useState({
    level: [] as DeveloperLevel[],
    type: [] as DeveloperType[],
    paymentSoon: false
  });
  const [resumeDialogOpen, setResumeDialogOpen] = useState(false);
  const [selectedResume, setSelectedResume] = useState<Resume | null>(null);
  const [resumeComment, setResumeComment] = useState('');
  const [resumeStatus, setResumeStatus] = useState<Resume['reviewStatus']>('pending');
  const [openAddForm, setOpenAddForm] = useState(false);
  
  const { user } = useAuth();
  
  // 편집 권한 확인 (admin, 리소스관리자만 가능)
  const canEdit = user?.role === 'admin' || user?.role === '리소스관리자';
  
  // 데이터 로드
  useEffect(() => {
    const fetchDevelopers = async () => {
      try {
        // 실제 구현에서는 API 호출
        // const response = await fetch('/api/developers');
        // const data = await response.json();
        
        // 임시 데이터
        const mockData: Developer[] = [
          {
            id: '1',
            name: '홍길동',
            birthDate: '1990-01-15',
            email: 'hong@example.com',
            phone: '010-1234-5678',
            skills: ['JavaScript', 'React', 'Node.js', 'SAP Fiori'],
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
            resumes: [
              {
                id: '1',
                developerId: '1',
                title: '홍길동_이력서_2023.pdf',
                filePath: '/uploads/resumes/hong_resume_2023.pdf',
                uploadDate: '2023-08-20',
                reviewStatus: 'approved',
                reviewComments: '리액트 경험이 풍부하고 포트폴리오가 좋습니다.',
                reviewedBy: '김관리자',
                reviewedAt: '2023-08-22'
              }
            ],
            createdAt: '2023-09-01T00:00:00Z',
            updatedAt: '2024-04-01T00:00:00Z',
          },
          {
            id: '2',
            name: '김영희',
            birthDate: '1988-05-20',
            email: 'kim@example.com',
            phone: '010-9876-5432',
            skills: ['Java', 'Spring', 'MySQL', 'SAP ABAP'],
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
            paymentDate: '2024-04-18',
            expectedSalary: 7000000,
            paymentStatus: '미지급',
            resumes: [
              {
                id: '2',
                developerId: '2',
                title: '김영희_이력서_2023.pdf',
                filePath: '/uploads/resumes/kim_resume_2023.pdf',
                uploadDate: '2023-11-10',
                reviewStatus: 'approved',
                reviewComments: '자바, 스프링 경험이 풍부하며 대규모 프로젝트 경험 있음',
                reviewedBy: '박리소스',
                reviewedAt: '2023-11-12'
              }
            ],
            createdAt: '2023-12-01T00:00:00Z',
            updatedAt: '2024-04-01T00:00:00Z',
          },
          {
            id: '3',
            name: '박지민',
            birthDate: '1992-11-03',
            email: 'park@example.com',
            phone: '010-5555-6666',
            skills: ['Python', 'Django', 'React', 'AI'],
            experienceYears: 3,
            level: '초급',
            type: '프론트엔드개발자',
            currentProjects: [],
            projectStartDate: undefined,
            projectEndDate: undefined,
            contacts: [],
            nextProjects: ['4'],
            expectedStartDate: '2024-05-01',
            paymentDate: '2024-04-17',
            expectedSalary: 3800000,
            paymentStatus: '미지급',
            resumes: [
              {
                id: '3',
                developerId: '3',
                title: '박지민_이력서_2024.pdf',
                filePath: '/uploads/resumes/park_resume_2024.pdf',
                uploadDate: '2024-03-05',
                reviewStatus: 'pending',
                reviewComments: '',
              }
            ],
            createdAt: '2024-01-15T00:00:00Z',
            updatedAt: '2024-04-05T00:00:00Z',
          },
          {
            id: '4',
            name: '이재원',
            birthDate: '1985-07-25',
            email: 'lee@example.com',
            phone: '010-3333-4444',
            skills: ['SAP HANA', 'SAP S/4HANA', 'SAP BW'],
            experienceYears: 12,
            level: '특급',
            type: '컨설턴트',
            currentProjects: ['5'],
            projectStartDate: '2024-02-15',
            projectEndDate: '2024-12-31',
            contacts: [
              {
                id: '3',
                developerId: '4',
                contactDate: '2024-01-10',
                memo: 'SAP 전문가로 데이터 마이그레이션 경험 풍부',
                createdAt: '2024-01-10T11:30:00Z',
              }
            ],
            nextProjects: [],
            expectedStartDate: '',
            paymentDate: '2024-04-20',
            expectedSalary: 10000000,
            paymentStatus: '미지급',
            resumes: [
              {
                id: '4',
                developerId: '4',
                title: '이재원_이력서_2024.pdf',
                filePath: '/uploads/resumes/lee_resume_2024.pdf',
                uploadDate: '2024-01-05',
                reviewStatus: 'approved',
                reviewComments: 'SAP 분야 최고 전문가, 높은 급여 요구하나 역량 충분',
                reviewedBy: '정책임',
                reviewedAt: '2024-01-08'
              }
            ],
            createdAt: '2024-01-05T00:00:00Z',
            updatedAt: '2024-02-10T00:00:00Z',
          },
          {
            id: '5',
            name: '최민수',
            birthDate: '1991-03-14',
            email: 'choi@example.com',
            phone: '010-7777-8888',
            skills: ['Outsystems', 'Java', 'SQL'],
            experienceYears: 5,
            level: '중급',
            type: '백엔드개발자',
            currentProjects: ['13'],
            projectStartDate: '2023-09-01',
            projectEndDate: '2024-02-28',
            contacts: [],
            nextProjects: ['12'],
            expectedStartDate: '2024-05-01',
            paymentDate: '2024-04-25',
            expectedSalary: 6000000,
            paymentStatus: '미지급',
            resumes: [
              {
                id: '5',
                developerId: '5',
                title: '최민수_이력서_2023.pdf',
                filePath: '/uploads/resumes/choi_resume_2023.pdf',
                uploadDate: '2023-07-15',
                reviewStatus: 'approved',
                reviewComments: 'Outsystems 전문가, 로우코드 개발 경험 다수',
                reviewedBy: '김관리자',
                reviewedAt: '2023-07-20'
              }
            ],
            createdAt: '2023-07-15T00:00:00Z',
            updatedAt: '2024-02-28T00:00:00Z',
          },
          {
            id: '6',
            name: '장미영',
            birthDate: '1989-09-22',
            email: 'jang@example.com',
            phone: '010-2222-3333',
            skills: ['UiPath', 'Python', 'VBA'],
            experienceYears: 6,
            level: '중급',
            type: '컨설턴트',
            currentProjects: [],
            projectStartDate: undefined,
            projectEndDate: undefined,
            contacts: [
              {
                id: '4',
                developerId: '6',
                contactDate: '2024-03-05',
                memo: 'UiPath RPA 구현 프로젝트 참여 제안',
                createdAt: '2024-03-05T14:00:00Z',
              }
            ],
            nextProjects: ['12'],
            expectedStartDate: '2024-05-01',
            paymentDate: '2024-04-15',
            expectedSalary: 5500000,
            paymentStatus: '미지급',
            resumes: [
              {
                id: '6',
                developerId: '6',
                title: '장미영_이력서_2024.pdf',
                filePath: '/uploads/resumes/jang_resume_2024.pdf',
                uploadDate: '2024-02-10',
                reviewStatus: 'approved',
                reviewComments: 'RPA 전문가, 자동화 프로세스 구현 능력 뛰어남',
                reviewedBy: '박리소스',
                reviewedAt: '2024-02-15'
              }
            ],
            createdAt: '2024-02-10T00:00:00Z',
            updatedAt: '2024-03-05T00:00:00Z',
          },
          {
            id: '7',
            name: '강현우',
            birthDate: '1987-12-05',
            email: 'kang@example.com',
            phone: '010-8888-9999',
            skills: ['Brity Works', 'AI', 'Python', 'Machine Learning'],
            experienceYears: 7,
            level: '고급',
            type: '백엔드개발자',
            currentProjects: [],
            projectStartDate: undefined,
            projectEndDate: undefined,
            contacts: [],
            nextProjects: ['14'],
            expectedStartDate: '2025-03-01',
            paymentDate: '2024-04-30',
            expectedSalary: 8000000,
            paymentStatus: '미지급',
            resumes: [
              {
                id: '7',
                developerId: '7',
                title: '강현우_이력서_2024.pdf',
                filePath: '/uploads/resumes/kang_resume_2024.pdf',
                uploadDate: '2024-02-20',
                reviewStatus: 'approved',
                reviewComments: 'AI 기술과 RPA 솔루션 연계 경험 있음, 매우 역량 높음',
                reviewedBy: '정책임',
                reviewedAt: '2024-02-25'
              }
            ],
            createdAt: '2024-02-20T00:00:00Z',
            updatedAt: '2024-02-25T00:00:00Z',
          }
        ];
        
        setDevelopers(mockData);
        setFilteredDevelopers(mockData);
        setLoading(false);
      } catch (error) {
        console.error('개발자 데이터를 불러오는 중 오류 발생:', error);
        setLoading(false);
      }
    };
    
    fetchDevelopers();
  }, []);
  
  // 검색 및 필터링
  useEffect(() => {
    let result = [...developers];
    
    // 검색어 필터링
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(dev => 
        dev.name.toLowerCase().includes(query) ||
        dev.email.toLowerCase().includes(query) ||
        dev.phone.includes(query) ||
        dev.skills.some((skill: string) => skill.toLowerCase().includes(query))
      );
    }
    
    // 탭 필터링
    if (tabValue === 1) {
      // 현재 프로젝트 있음
      result = result.filter(dev => dev.currentProjects.length > 0);
    } else if (tabValue === 2) {
      // 프로젝트 대기 중
      result = result.filter(dev => dev.currentProjects.length === 0);
    }
    
    // 레벨 필터링
    if (filterOptions.level.length > 0) {
      result = result.filter(dev => filterOptions.level.includes(dev.level));
    }
    
    // 타입 필터링
    if (filterOptions.type.length > 0) {
      result = result.filter(dev => filterOptions.type.includes(dev.type));
    }
    
    // 급여일 임박 필터링
    if (filterOptions.paymentSoon) {
      result = result.filter(dev => 
        isWithinDays(dev.paymentDate, 3) && dev.paymentStatus === '미지급'
      );
    }
    
    setFilteredDevelopers(result);
  }, [developers, searchQuery, tabValue, filterOptions]);
  
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };
  
  const handleAddDeveloper = () => {
    setSelectedDeveloper(null);
    setOpenAddForm(true);
  };
  
  const handleEditDeveloper = (developer: Developer) => {
    setSelectedDeveloper(developer);
    setOpenAddForm(true);
    handleCloseActionMenu();
  };
  
  const handleCloseAddForm = () => {
    setOpenAddForm(false);
    setSelectedDeveloper(null);
  };
  
  const handleSaveDeveloper = (developerData: Partial<Developer>) => {
    // 실제 구현에서는 API 호출
    if (selectedDeveloper) {
      // 수정
      const updatedDevelopers = developers.map(dev => 
        dev.id === selectedDeveloper.id 
          ? { ...dev, ...developerData, updatedAt: new Date().toISOString() } 
          : dev
      );
      setDevelopers(updatedDevelopers);
    } else {
      // 추가
      const newDeveloper: Developer = {
        id: Date.now().toString(),
        name: developerData.name || '',
        birthDate: developerData.birthDate || '',
        email: developerData.email || '',
        phone: developerData.phone || '',
        skills: developerData.skills || [],
        experienceYears: developerData.experienceYears || 0,
        level: developerData.level as DeveloperLevel || '초급',
        type: developerData.type as DeveloperType || '프론트엔드개발자',
        currentProjects: developerData.currentProjects || [],
        projectStartDate: developerData.projectStartDate,
        projectEndDate: developerData.projectEndDate,
        contacts: developerData.contacts || [],
        nextProjects: developerData.nextProjects || [],
        expectedStartDate: developerData.expectedStartDate,
        paymentDate: developerData.paymentDate || '',
        expectedSalary: developerData.expectedSalary || 0,
        paymentStatus: developerData.paymentStatus as PaymentStatus || '미지급',
        resumes: developerData.resumes || [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      setDevelopers([...developers, newDeveloper]);
    }
    
    handleCloseAddForm();
  };
  
  const handleDeleteDeveloper = (developerId: string) => {
    // 실제 구현에서는 API 호출
    // await fetch(`/api/developers/${developerId}`, { method: 'DELETE' });
    
    setDevelopers(developers.filter(dev => dev.id !== developerId));
    handleCloseActionMenu();
  };
  
  const handleAddContact = (developerId: string) => {
    setCurrentDevId(developerId);
    setContactMemo('');
    setContactDialogOpen(true);
    handleCloseActionMenu();
  };
  
  const handleSaveContact = async () => {
    if (!currentDevId || !contactMemo.trim()) {
      setContactDialogOpen(false);
      return;
    }
    
    // 실제 구현에서는 API 호출
    // const response = await fetch(`/api/developers/${currentDevId}/contacts`, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ memo: contactMemo })
    // });
    // const newContact = await response.json();
    
    // 임시 데이터
    const newContact = {
      id: Date.now().toString(),
      developerId: currentDevId,
      contactDate: new Date().toISOString().split('T')[0],
      memo: contactMemo,
      createdAt: new Date().toISOString(),
    };
    
    setDevelopers(developers.map(dev => {
      if (dev.id === currentDevId) {
        return {
          ...dev,
          contacts: [...dev.contacts, newContact]
        };
      }
      return dev;
    }));
    
    setContactDialogOpen(false);
  };
  
  const handleOpenFilterMenu = (event: React.MouseEvent<HTMLElement>) => {
    setFilterMenuAnchor(event.currentTarget);
  };
  
  const handleCloseFilterMenu = () => {
    setFilterMenuAnchor(null);
  };
  
  const handleOpenActionMenu = (event: React.MouseEvent<HTMLElement>, developerId: string) => {
    setCurrentDevId(developerId);
    setActionMenuAnchor(event.currentTarget);
  };
  
  const handleCloseActionMenu = () => {
    setActionMenuAnchor(null);
    setCurrentDevId(null);
  };
  
  const handleFilterChange = (type: 'level' | 'type', value: DeveloperLevel | DeveloperType) => {
    setFilterOptions(prev => {
      if (type === 'level') {
        const levels = prev.level.includes(value as DeveloperLevel)
          ? prev.level.filter(l => l !== value)
          : [...prev.level, value as DeveloperLevel];
          
        return { ...prev, level: levels };
      } else {
        const types = prev.type.includes(value as DeveloperType)
          ? prev.type.filter(t => t !== value)
          : [...prev.type, value as DeveloperType];
          
        return { ...prev, type: types };
      }
    });
  };
  
  const handleTogglePaymentFilter = () => {
    setFilterOptions(prev => ({
      ...prev,
      paymentSoon: !prev.paymentSoon
    }));
  };
  
  const getLevelChip = (level: DeveloperLevel) => (
    <Chip 
      label={level} 
      size="small" 
      style={{ 
        backgroundColor: getLevelColor(level),
        color: 'white',
        fontWeight: 'bold'
      }} 
    />
  );
  
  const getTypeChip = (type: DeveloperType) => (
    <Chip 
      label={type} 
      size="small" 
      style={{ 
        backgroundColor: getTypeColor(type),
        color: 'white'
      }} 
    />
  );
  
  // 이력서 관리 함수
  const handleOpenResumeDialog = (resume: Resume) => {
    setSelectedResume(resume);
    setResumeComment(resume.reviewComments || '');
    setResumeStatus(resume.reviewStatus);
    setResumeDialogOpen(true);
  };
  
  const handleCloseResumeDialog = () => {
    setResumeDialogOpen(false);
    setSelectedResume(null);
    setResumeComment('');
  };
  
  const handleResumeStatusChange = (event: SelectChangeEvent<Resume['reviewStatus']>) => {
    setResumeStatus(event.target.value as Resume['reviewStatus']);
  };
  
  const handleResumeCommentChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setResumeComment(event.target.value);
  };
  
  const handleSaveResumeReview = () => {
    if (!selectedResume) return;
    
    // 실제 구현에서는 API 호출
    // await fetch(`/api/resumes/${selectedResume.id}/review`, {
    //   method: 'PATCH',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ 
    //     status: resumeStatus, 
    //     comments: resumeComment,
    //     reviewedBy: user?.id,
    //   })
    // });
    
    // 데이터 업데이트
    const updatedDevelopers = developers.map(dev => {
      if (dev.resumes) {
        const updatedResumes = dev.resumes.map(resume => {
          if (resume.id === selectedResume.id) {
            return {
              ...resume,
              reviewStatus: resumeStatus,
              reviewComments: resumeComment,
              reviewedBy: user?.name,
              reviewedAt: new Date().toISOString(),
            };
          }
          return resume;
        });
        
        return {
          ...dev,
          resumes: updatedResumes,
        };
      }
      return dev;
    });
    
    setDevelopers(updatedDevelopers);
    handleCloseResumeDialog();
  };

  // 이력서 업로드 함수
  const handleUploadResume = (developerId: string) => {
    // 실제 구현에서는 파일 업로드 처리
    console.log('이력서 업로드:', developerId);
    
    // 임시로 업로드된 것처럼 처리
    const newResume: Resume = {
      id: Date.now().toString(),
      developerId,
      title: `새_이력서_${new Date().toISOString().split('T')[0]}.pdf`,
      filePath: '/uploads/resumes/new_resume.pdf',
      uploadDate: new Date().toISOString().split('T')[0],
      reviewStatus: 'pending',
    };
    
    // 데이터 업데이트
    const updatedDevelopers = developers.map(dev => {
      if (dev.id === developerId) {
        return {
          ...dev,
          resumes: [...(dev.resumes || []), newResume],
        };
      }
      return dev;
    });
    
    setDevelopers(updatedDevelopers);
  };
  
  // 개발자를 프로젝트에 배정하는 함수
  const handleAssignToProject = (developerId: string, projectId: string) => {
    const updatedDevelopers = developers.map(dev => {
      if (dev.id === developerId) {
        return {
          ...dev,
          currentProjects: [...dev.currentProjects, projectId],
          updatedAt: new Date().toISOString()
        };
      }
      return dev;
    });
    
    setDevelopers(updatedDevelopers);
    handleCloseActionMenu();
  };
  
  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" fontWeight={600}>
          개발자 관리
        </Typography>
        {canEdit && (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            sx={{ borderRadius: '8px', px: 3 }}
            onClick={handleAddDeveloper}
          >
            개발자 추가
          </Button>
        )}
      </Box>
      
      {/* 검색 및 필터 영역 */}
      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid item xs={12} md={8}>
          <TextField
            fullWidth
            placeholder="이름, 이메일, 전화번호, 스킬로 검색"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: 'text.secondary' }} />
                </InputAdornment>
              ),
            }}
            size="small"
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px' } }}
          />
        </Grid>
        <Grid item container xs={12} md={4} justifyContent="flex-end" spacing={1}>
          <Grid item>
            <Button
              variant="outlined"
              startIcon={<FilterIcon />}
              onClick={handleOpenFilterMenu}
              sx={{ height: '40px', borderRadius: '8px' }}
            >
              필터
            </Button>
            <Menu
              anchorEl={filterMenuAnchor}
              open={Boolean(filterMenuAnchor)}
              onClose={handleCloseFilterMenu}
              sx={{ mt: 1 }}
              PaperProps={{
                elevation: 3,
                sx: { borderRadius: '12px', width: 280 }
              }}
            >
              <Box sx={{ px: 2, py: 1 }}>
                <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>레벨</Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.8 }}>
                  {(['초급', '중급', '고급', '특급'] as DeveloperLevel[]).map(level => (
                    <Chip 
                      key={level}
                      label={level}
                      size="small"
                      onClick={() => handleFilterChange('level', level)}
                      style={{ 
                        backgroundColor: filterOptions.level.includes(level) 
                          ? getLevelColor(level) 
                          : 'transparent',
                        color: filterOptions.level.includes(level) 
                          ? 'white' 
                          : 'inherit',
                        border: `1px solid ${filterOptions.level.includes(level) ? 'transparent' : '#e0e0e0'}`,
                        fontWeight: filterOptions.level.includes(level) ? 600 : 400,
                      }}
                    />
                  ))}
                </Box>
                
                <Divider sx={{ my: 2 }} />
                
                <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>타입</Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.8 }}>
                  {(['프론트엔드개발자', '백엔드개발자', '컨설턴트', '프론트엔드PM', '백엔드PM', 'PO'] as DeveloperType[]).map(type => (
                    <Chip 
                      key={type}
                      label={type}
                      size="small"
                      onClick={() => handleFilterChange('type', type)}
                      style={{ 
                        backgroundColor: filterOptions.type.includes(type) 
                          ? getTypeColor(type) 
                          : 'transparent',
                        color: filterOptions.type.includes(type) 
                          ? 'white' 
                          : 'inherit',
                        border: `1px solid ${filterOptions.type.includes(type) ? 'transparent' : '#e0e0e0'}`,
                        fontWeight: filterOptions.type.includes(type) ? 600 : 400,
                        marginBottom: '4px'
                      }}
                    />
                  ))}
                </Box>
                
                <Divider sx={{ my: 2 }} />
                
                <FormControl fullWidth>
                  <Chip 
                    icon={<MoneyIcon sx={{ color: filterOptions.paymentSoon ? 'inherit' : 'text.secondary' }} />}
                    label="급여일 임박 (3일 이내)" 
                    color={filterOptions.paymentSoon ? "primary" : "default"}
                    variant={filterOptions.paymentSoon ? "filled" : "outlined"}
                    onClick={handleTogglePaymentFilter}
                    sx={{ width: '100%', justifyContent: 'flex-start' }}
                  />
                </FormControl>
              </Box>
            </Menu>
          </Grid>
        </Grid>
      </Grid>
      
      {/* 탭 메뉴 */}
      <Box sx={{ mb: 3 }}>
        <Tabs 
          value={tabValue} 
          onChange={handleTabChange}
          TabIndicatorProps={{ sx: { backgroundColor: 'primary.main', height: 3, borderRadius: '2px' } }}
          sx={{ 
            '& .MuiTab-root': { 
              textTransform: 'none', 
              fontWeight: 500,
              fontSize: '0.95rem',
              minWidth: 100,
            },
            '& .Mui-selected': { fontWeight: 600 }
          }}
        >
          <Tab label="전체" />
          <Tab label="프로젝트 진행 중" />
          <Tab label="프로젝트 대기 중" />
        </Tabs>
      </Box>
      
      {/* 개발자 목록 테이블 */}
      <TableContainer 
        component={Paper} 
        sx={{ 
          boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.05)', 
          borderRadius: '12px',
          overflow: 'hidden',
        }}
      >
        <Table>
          <TableHead>
            <TableRow sx={{ '& .MuiTableCell-head': { fontSize: '0.875rem', fontWeight: 600 } }}>
              <TableCell>이름</TableCell>
              <TableCell>연락처</TableCell>
              <TableCell>정보</TableCell>
              <TableCell>프로젝트</TableCell>
              <TableCell>급여</TableCell>
              <TableCell>이력서</TableCell>
              <TableCell align="right">작업</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
                    <Typography variant="body1" color="text.secondary" sx={{ mb: 1 }}>
                      데이터를 불러오는 중...
                    </Typography>
                    {/* 여기에 로딩 인디케이터를 추가할 수 있습니다 */}
                  </Box>
                </TableCell>
              </TableRow>
            ) : filteredDevelopers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
                    <Typography variant="body1" color="text.secondary" sx={{ mb: 1 }}>
                      검색 결과가 없습니다.
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      다른 검색어나 필터를 사용해보세요.
                    </Typography>
                  </Box>
                </TableCell>
              </TableRow>
            ) : (
              filteredDevelopers.map((developer) => (
                <TableRow 
                  key={developer.id}
                  sx={{ 
                    '&:hover': { 
                      backgroundColor: 'action.hover'
                    }
                  }}
                >
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Avatar 
                        sx={{ 
                          mr: 2, 
                          width: 40, 
                          height: 40, 
                          bgcolor: 'primary.main',
                          fontSize: '1rem'
                        }}
                      >
                        {developer.name.charAt(0)}
                      </Avatar>
                      <Box>
                        <Typography variant="body1" fontWeight={500}>{developer.name}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          {developer.birthDate}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <EmailIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary', fontSize: '1rem' }} />
                        <Typography variant="body2">{developer.email}</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <PhoneIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary', fontSize: '1rem' }} />
                        <Typography variant="body2">{developer.phone}</Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                      <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                        {getLevelChip(developer.level)}
                        {getTypeChip(developer.type)}
                      </Box>
                      <Typography variant="body2">
                        경력: {developer.experienceYears}년
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {developer.skills.map((skill: string) => (
                          <Chip 
                            key={skill} 
                            label={skill} 
                            size="small" 
                            variant="outlined" 
                            sx={{ fontSize: '0.7rem', height: '22px' }}
                          />
                        ))}
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    {developer.currentProjects.length > 0 ? (
                      <Box>
                        <Typography variant="body2" sx={{ mb: 0.5, color: 'success.main', fontWeight: 500 }}>
                          현재 프로젝트: {developer.currentProjects.length}개
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          시작일: {developer.projectStartDate || '미정'}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          종료예정일: {developer.projectEndDate || '미정'}
                        </Typography>
                      </Box>
                    ) : developer.nextProjects.length > 0 ? (
                      <Box>
                        <Typography variant="body2" sx={{ mb: 0.5, color: 'info.main', fontWeight: 500 }}>
                          예정 프로젝트: {developer.nextProjects.length}개
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          투입예정일: {developer.expectedStartDate || '미정'}
                        </Typography>
                      </Box>
                    ) : (
                      <Typography variant="body2" sx={{ color: 'text.secondary', fontStyle: 'italic' }}>
                        프로젝트 없음
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell>
                    <Box>
                      <Typography variant="body2" fontWeight={600} color="primary.main">
                        {developer.expectedSalary.toLocaleString()}원
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                        지급일: {developer.paymentDate}
                      </Typography>
                      <Chip 
                        label={developer.paymentStatus} 
                        size="small" 
                        color={
                          developer.paymentStatus === '지급완료' 
                            ? 'success' 
                            : developer.paymentStatus === '지급예정' 
                              ? 'warning' 
                              : 'error'
                        }
                        sx={{ height: '22px', fontSize: '0.7rem' }}
                      />
                    </Box>
                  </TableCell>
                  <TableCell>
                    {developer.resumes && developer.resumes.length > 0 ? (
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                        {developer.resumes.map(resume => (
                          <Chip
                            key={resume.id}
                            label={resume.title.length > 15 ? resume.title.substring(0, 15) + '...' : resume.title}
                            size="small"
                            onClick={() => handleOpenResumeDialog(resume)}
                            color={
                              resume.reviewStatus === 'approved' ? 'success' :
                              resume.reviewStatus === 'rejected' ? 'error' :
                              resume.reviewStatus === 'reviewed' ? 'info' : 'default'
                            }
                          />
                        ))}
                        {canEdit && (
                          <Button 
                            size="small" 
                            variant="outlined" 
                            onClick={() => handleUploadResume(developer.id)}
                          >
                            추가
                          </Button>
                        )}
                      </Box>
                    ) : (
                      <Box>
                        <Typography variant="body2" color="text.secondary">이력서 없음</Typography>
                        {canEdit && (
                          <Button 
                            size="small" 
                            variant="outlined" 
                            onClick={() => handleUploadResume(developer.id)}
                          >
                            업로드
                          </Button>
                        )}
                      </Box>
                    )}
                  </TableCell>
                  <TableCell align="right">
                    <IconButton 
                      onClick={(e) => handleOpenActionMenu(e, developer.id)}
                      disabled={!canEdit}
                      size="small"
                      sx={{ 
                        bgcolor: 'action.hover',
                        '&:hover': { bgcolor: 'action.selected' }
                      }}
                    >
                      <MoreIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
      
      {/* 액션 메뉴 */}
      <Menu
        anchorEl={actionMenuAnchor}
        open={Boolean(actionMenuAnchor)}
        onClose={handleCloseActionMenu}
        PaperProps={{
          elevation: 3,
          sx: { 
            minWidth: 150,
            borderRadius: '12px',
            overflow: 'hidden',
            mt: 1
          }
        }}
      >
        <MenuItem onClick={() => {
          if (currentDevId) {
            handleAddContact(currentDevId);
            handleCloseActionMenu();
          }
        }}>
          <PhoneIcon fontSize="small" sx={{ mr: 1 }} />
          연락 기록 추가
        </MenuItem>
        <MenuItem onClick={() => {
          if (currentDevId) {
            const developer = developers.find(dev => dev.id === currentDevId);
            if (developer) {
              handleEditDeveloper(developer);
            }
          }
        }}>
          <EditIcon fontSize="small" sx={{ mr: 1 }} />
          개발자 정보 수정
        </MenuItem>
        <MenuItem onClick={() => {
          if (currentDevId) {
            handleDeleteDeveloper(currentDevId);
          }
        }}>
          <DeleteIcon fontSize="small" sx={{ mr: 1 }} />
          개발자 삭제
        </MenuItem>
      </Menu>
      
      {/* 연락 기록 추가 대화상자 */}
      <Dialog 
        open={contactDialogOpen} 
        onClose={() => setContactDialogOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: { borderRadius: '12px' }
        }}
      >
        <DialogTitle sx={{ pb: 1, fontWeight: 600 }}>연락 기록 추가</DialogTitle>
        <DialogContent dividers>
          <TextField
            autoFocus
            margin="dense"
            label="연락 내용"
            fullWidth
            multiline
            rows={4}
            value={contactMemo}
            onChange={(e) => setContactMemo(e.target.value)}
            placeholder="연락 내용을 입력하세요"
            sx={{ mt: 1 }}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button 
            onClick={() => setContactDialogOpen(false)}
            variant="outlined"
            sx={{ borderRadius: '8px', px: 3 }}
          >
            취소
          </Button>
          <Button 
            onClick={handleSaveContact} 
            variant="contained" 
            color="primary"
            sx={{ borderRadius: '8px', px: 3 }}
          >
            저장
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* 개발자 추가/수정 폼 */}
      <DeveloperAddForm
        open={openAddForm}
        onClose={handleCloseAddForm}
        onSave={handleSaveDeveloper}
        initialData={selectedDeveloper || undefined}
        isEdit={!!selectedDeveloper}
      />
      
      {/* 이력서 상세 및 검토 다이얼로그 */}
      <Dialog open={resumeDialogOpen} onClose={handleCloseResumeDialog} maxWidth="md" fullWidth>
        <DialogTitle>이력서 검토</DialogTitle>
        <DialogContent>
          {selectedResume && (
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Typography variant="h6">{selectedResume.title}</Typography>
                <Typography variant="body2" color="text.secondary">
                  업로드: {selectedResume.uploadDate}
                </Typography>
                <Box sx={{ mt: 2, p: 2, border: '1px solid #ddd', borderRadius: 1 }}>
                  <Typography variant="body2">이력서 파일 경로: {selectedResume.filePath}</Typography>
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    실제 구현에서는 여기에 PDF 뷰어가 표시됩니다.
                  </Typography>
                </Box>
              </Grid>
              
              {canEdit && (
                <>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth>
                      <InputLabel>검토 상태</InputLabel>
                      <Select
                        value={resumeStatus}
                        onChange={handleResumeStatusChange}
                        label="검토 상태"
                      >
                        <MenuItem value="pending">검토 대기</MenuItem>
                        <MenuItem value="reviewed">검토 완료</MenuItem>
                        <MenuItem value="approved">승인</MenuItem>
                        <MenuItem value="rejected">거절</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="검토 의견"
                      multiline
                      rows={4}
                      value={resumeComment}
                      onChange={handleResumeCommentChange}
                    />
                  </Grid>
                </>
              )}
              
              {selectedResume.reviewStatus !== 'pending' && selectedResume.reviewedBy && (
                <Grid item xs={12}>
                  <Box sx={{ mt: 2, p: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
                    <Typography variant="subtitle2">검토 정보</Typography>
                    <Typography variant="body2">검토자: {selectedResume.reviewedBy}</Typography>
                    {selectedResume.reviewedAt && (
                      <Typography variant="body2">검토일: {new Date(selectedResume.reviewedAt).toLocaleDateString()}</Typography>
                    )}
                    {selectedResume.reviewComments && (
                      <Typography variant="body2" sx={{ mt: 1 }}>
                        의견: {selectedResume.reviewComments}
                      </Typography>
                    )}
                  </Box>
                </Grid>
              )}
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseResumeDialog}>취소</Button>
          {canEdit && (
            <Button onClick={handleSaveResumeReview} variant="contained" color="primary">
              저장
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
} 