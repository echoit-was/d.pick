import React, { useState, useEffect } from 'react';
import { 
  Box, Typography, Button, Grid, Paper, Tabs, Tab, 
  Card, CardContent, CardActions, Divider, IconButton,
  TextField, InputAdornment, Menu, MenuItem,
  Dialog, DialogTitle, DialogContent, DialogActions,
  FormControl, InputLabel, Select, Chip, Avatar,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  SelectChangeEvent
} from '@mui/material';
import { 
  Add as AddIcon, 
  Search as SearchIcon,
  FilterList as FilterIcon,
  MoreVert as MoreIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Email as EmailIcon,
  Message as MessageIcon,
  People as PeopleIcon,
  DateRange as DateIcon,
  Assignment as AssignmentIcon,
  PersonAdd as PersonAddIcon
} from '@mui/icons-material';
import { Project, ProjectType } from '../../../../shared/dist/src/index';
import { useAuth } from '../contexts/AuthContext';
import { Developer } from './Developers';
import ProjectDeveloperAssignment from '../components/ProjectDeveloperAssignment';
import { Link as RouterLink, useNavigate } from 'react-router-dom';

// 프로젝트 상태별 색상
const getStatusColor = (status: Project['status']) => {
  switch(status) {
    case 'recruiting': return '#f44336'; // 빨강 - 모집 중
    case 'inProgress': return '#4caf50'; // 초록 - 진행 중
    case 'planned': return '#2196f3';    // 파랑 - 계획 중
    case 'completed': return '#9e9e9e';  // 회색 - 완료됨
    default: return '#9e9e9e';
  }
};

// 프로젝트 상태 한글 표시
const getStatusLabel = (status: Project['status']) => {
  switch(status) {
    case 'recruiting': return '모집 중';
    case 'inProgress': return '진행 중';
    case 'planned': return '계획 중';
    case 'completed': return '완료됨';
    default: return '알 수 없음';
  }
};

// 프로젝트 타입 색상
const getTypeColor = (type: ProjectType) => {
  return type === '자사' ? '#3f51b5' : '#ff9800';
};

export default function Projects() {
  const [tabValue, setTabValue] = useState(0);
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [filterMenuAnchor, setFilterMenuAnchor] = useState<null | HTMLElement>(null);
  const [actionMenuAnchor, setActionMenuAnchor] = useState<null | HTMLElement>(null);
  const [currentProjectId, setCurrentProjectId] = useState<string | null>(null);
  const [openAnnouncementDialog, setOpenAnnouncementDialog] = useState(false);
  const [announcementType, setAnnouncementType] = useState<'email' | 'sms'>('email');
  const [announcementContent, setAnnouncementContent] = useState('');
  const [filterOptions, setFilterOptions] = useState({
    type: [] as ProjectType[],
  });
  const [openDeveloperAssignment, setOpenDeveloperAssignment] = useState(false);
  const [availableDevelopers, setAvailableDevelopers] = useState<Developer[]>([]);
  
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // 편집 권한 확인 (admin, 프로젝트관리자만 가능)
  const canEdit = user?.role === 'admin' || user?.role === '프로젝트관리자';
  // 공고 관리 권한 확인 (admin, 공고관리자만 가능)
  const canManageAnnouncements = user?.role === 'admin' || user?.role === '공고관리자';
  
  // 데이터 로드
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        // 실제 구현에서는 API 호출
        // const response = await fetch('/api/projects');
        // const data = await response.json();
        
        // 임시 데이터
        const mockData: Project[] = [
          {
            id: '1',
            title: 'SAP ERP S/4HANA 구축 프로젝트',
            description: '대기업 그룹사 SAP ERP S/4HANA 신규 구축',
            startDate: '2024-01-15',
            endDate: '2025-07-31',
            status: 'inProgress',
            type: '자사',
            team: ['1', '3', '5'],
            totalMMRequired: 30,
            confirmedMM: 25,
            inDiscussionMM: 5,
            announcements: [],
            createdAt: '2023-12-01T00:00:00Z',
            updatedAt: '2024-04-01T00:00:00Z',
          },
          {
            id: '2',
            title: 'SAP SCM 시스템 구축',
            description: '제조업체 공급망 관리 시스템 구축',
            startDate: '2024-03-20',
            endDate: '2025-02-28',
            status: 'recruiting',
            type: '자사',
            team: ['2', '4'],
            totalMMRequired: 18,
            confirmedMM: 12,
            inDiscussionMM: 6,
            announcements: [],
            createdAt: '2024-02-01T00:00:00Z',
            updatedAt: '2024-03-15T00:00:00Z',
          },
          {
            id: '3',
            title: 'SAP HCM 인사관리 시스템 개선',
            description: '기존 HR 시스템 업그레이드 및 기능 개선',
            startDate: '2024-08-01',
            endDate: '2025-01-31',
            status: 'planned',
            type: '자사',
            team: [],
            totalMMRequired: 12,
            confirmedMM: 5,
            inDiscussionMM: 3,
            announcements: [],
            createdAt: '2024-03-01T00:00:00Z',
            updatedAt: '2024-04-01T00:00:00Z',
          },
          {
            id: '4',
            title: 'SAP Fiori UI 개발',
            description: '기존 SAP 시스템의 사용자 인터페이스 개선',
            startDate: '2025-02-01',
            endDate: '2025-06-30',
            status: 'planned',
            type: '자사',
            team: [],
            totalMMRequired: 15,
            confirmedMM: 0,
            inDiscussionMM: 5,
            announcements: [
              {
                id: '1',
                projectId: '4',
                sentDate: '2025-01-10',
                channel: 'email',
                content: 'SAP Fiori UI 개발 프로젝트에 참여할 프론트엔드 개발자를 모집합니다.',
                recipients: ['dev1@example.com', 'dev2@example.com'],
                createdAt: '2025-01-10T10:00:00Z',
              }
            ],
            createdAt: '2024-12-01T00:00:00Z',
            updatedAt: '2025-01-10T00:00:00Z',
          },
          {
            id: '5',
            title: 'SAP BW/4HANA 데이터 마이그레이션',
            description: '레거시 데이터웨어하우스에서 BW/4HANA로 마이그레이션',
            startDate: '2024-02-15',
            endDate: '2024-12-31',
            status: 'inProgress',
            type: '타사',
            team: ['6', '7', '8'],
            totalMMRequired: 24,
            confirmedMM: 20,
            inDiscussionMM: 0,
            announcements: [],
            createdAt: '2024-01-01T00:00:00Z',
            updatedAt: '2024-02-10T00:00:00Z',
          },
          {
            id: '6',
            title: 'SAP SuccessFactors 구현',
            description: '클라우드 기반 인적 자원 관리 시스템 구축',
            startDate: '2025-05-01',
            endDate: '2026-01-31',
            status: 'planned',
            type: '자사',
            team: [],
            totalMMRequired: 18,
            confirmedMM: 0,
            inDiscussionMM: 0,
            announcements: [],
            createdAt: '2024-08-01T00:00:00Z',
            updatedAt: '2024-08-01T00:00:00Z',
          },
          {
            id: '7',
            title: 'SAP 보안 감사 및 개선',
            description: '기존 SAP 시스템의 보안 취약점 점검 및 개선',
            startDate: '2024-03-01',
            endDate: '2024-06-30',
            status: 'recruiting',
            type: '타사',
            team: ['9'],
            totalMMRequired: 8,
            confirmedMM: 3,
            inDiscussionMM: 2,
            announcements: [],
            createdAt: '2024-02-01T00:00:00Z',
            updatedAt: '2024-02-20T00:00:00Z',
          },
          {
            id: '8',
            title: 'SAP Commerce Cloud 구축',
            description: 'B2B 전자상거래 플랫폼 구축',
            startDate: '2023-08-15',
            endDate: '2025-01-15',
            status: 'inProgress',
            type: '자사',
            team: ['10', '11', '12'],
            totalMMRequired: 36,
            confirmedMM: 30,
            inDiscussionMM: 0,
            announcements: [],
            createdAt: '2023-07-01T00:00:00Z',
            updatedAt: '2023-08-10T00:00:00Z',
          },
          {
            id: '9',
            title: 'SAP 유지보수 및 운영',
            description: '금융기관 SAP 시스템 유지보수 및 운영',
            startDate: '2023-11-01',
            endDate: '2024-02-29',
            status: 'completed',
            type: '타사',
            team: ['13', '14'],
            totalMMRequired: 12,
            confirmedMM: 12,
            inDiscussionMM: 0,
            announcements: [],
            createdAt: '2023-10-01T00:00:00Z',
            updatedAt: '2024-03-01T00:00:00Z',
          },
          {
            id: '10',
            title: 'SAP Ariba 구현',
            description: '구매 및 조달 프로세스 자동화 시스템 구축',
            startDate: '2025-06-01',
            endDate: '2026-03-31',
            status: 'planned',
            type: '자사',
            team: [],
            totalMMRequired: 20,
            confirmedMM: 0,
            inDiscussionMM: 0,
            announcements: [],
            createdAt: '2024-08-01T00:00:00Z',
            updatedAt: '2024-08-01T00:00:00Z',
          },
          {
            id: '11',
            title: 'SAP IBP 수요 계획 시스템',
            description: '제조업체 수요 예측 및 계획 시스템 구축',
            startDate: '2024-07-01',
            endDate: '2025-04-30',
            status: 'planned',
            type: '타사',
            team: [],
            totalMMRequired: 16,
            confirmedMM: 6,
            inDiscussionMM: 4,
            announcements: [],
            createdAt: '2024-02-01T00:00:00Z',
            updatedAt: '2024-03-01T00:00:00Z',
          },
          {
            id: '12',
            title: 'UiPath RPA 구현',
            description: '업무 자동화를 위한 RPA 솔루션 구축',
            startDate: '2024-05-01',
            endDate: '2024-12-31',
            status: 'planned',
            type: '자사',
            team: [],
            totalMMRequired: 10,
            confirmedMM: 5,
            inDiscussionMM: 2,
            announcements: [],
            createdAt: '2024-03-01T00:00:00Z',
            updatedAt: '2024-04-01T00:00:00Z',
          },
          {
            id: '13',
            title: 'Outsystems 애플리케이션 개발',
            description: '저코드 플랫폼을 활용한 업무 애플리케이션 개발',
            startDate: '2023-09-01',
            endDate: '2024-02-28',
            status: 'completed',
            type: '자사',
            team: ['15', '16'],
            totalMMRequired: 14,
            confirmedMM: 14,
            inDiscussionMM: 0,
            announcements: [],
            createdAt: '2023-08-01T00:00:00Z',
            updatedAt: '2024-03-01T00:00:00Z',
          },
          {
            id: '14',
            title: 'Brity Works AI 기반 업무 자동화',
            description: 'AI 기반 RPA 솔루션 도입 및 구현',
            startDate: '2025-03-01',
            endDate: '2025-09-30',
            status: 'planned',
            type: '타사',
            team: [],
            totalMMRequired: 12,
            confirmedMM: 0,
            inDiscussionMM: 0,
            announcements: [],
            createdAt: '2024-09-01T00:00:00Z',
            updatedAt: '2024-09-01T00:00:00Z',
          },
          {
            id: '15',
            title: 'SAP CAP 기반 확장 애플리케이션 개발',
            description: 'SAP Cloud Application Programming 모델 기반 확장 개발',
            startDate: '2024-04-01',
            endDate: '2025-01-31',
            status: 'recruiting',
            type: '자사',
            team: ['17'],
            totalMMRequired: 12,
            confirmedMM: 4,
            inDiscussionMM: 2,
            announcements: [
              {
                id: '2',
                projectId: '15',
                sentDate: '2024-03-15',
                channel: 'email',
                content: 'SAP CAP 개발 경험이 있는 클라우드 개발자를 모집합니다.',
                recipients: ['dev3@example.com', 'dev4@example.com'],
                createdAt: '2024-03-15T10:00:00Z',
              }
            ],
            createdAt: '2024-02-01T00:00:00Z',
            updatedAt: '2024-03-15T00:00:00Z',
          }
        ];
        
        setProjects(mockData);
        setFilteredProjects(mockData);
        setLoading(false);
      } catch (error) {
        console.error('프로젝트 데이터를 불러오는 중 오류 발생:', error);
        setLoading(false);
      }
    };
    
    fetchProjects();
  }, []);
  
  // 검색 및 필터링
  useEffect(() => {
    let result = [...projects];
    
    // 검색어 필터링
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(project => 
        project.title.toLowerCase().includes(query) ||
        project.description.toLowerCase().includes(query)
      );
    }
    
    // 탭 필터링
    if (tabValue === 1) {
      // 진행 중인 프로젝트
      result = result.filter(project => project.status === 'inProgress');
    } else if (tabValue === 2) {
      // 모집 중인 프로젝트
      result = result.filter(project => project.status === 'recruiting');
    } else if (tabValue === 3) {
      // 예정된 프로젝트
      result = result.filter(project => project.status === 'planned');
    }
    
    // 타입 필터링
    if (filterOptions.type.length > 0) {
      result = result.filter(project => filterOptions.type.includes(project.type));
    }
    
    setFilteredProjects(result);
  }, [projects, searchQuery, tabValue, filterOptions]);
  
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };
  
  const handleAddProject = () => {
    setSelectedProject(null);
    setOpenDialog(true);
  };
  
  const handleEditProject = (project: Project) => {
    setSelectedProject(project);
    setOpenDialog(true);
    handleCloseActionMenu();
  };
  
  const handleDeleteProject = (projectId: string) => {
    // 실제 구현에서는 API 호출
    // await fetch(`/api/projects/${projectId}`, { method: 'DELETE' });
    
    setProjects(projects.filter(p => p.id !== projectId));
    handleCloseActionMenu();
  };
  
  const handleOpenFilterMenu = (event: React.MouseEvent<HTMLElement>) => {
    setFilterMenuAnchor(event.currentTarget);
  };
  
  const handleCloseFilterMenu = () => {
    setFilterMenuAnchor(null);
  };
  
  const handleOpenActionMenu = (event: React.MouseEvent<HTMLElement>, projectId: string) => {
    setCurrentProjectId(projectId);
    setActionMenuAnchor(event.currentTarget);
  };
  
  const handleCloseActionMenu = () => {
    setActionMenuAnchor(null);
    setCurrentProjectId(null);
  };
  
  const handleOpenAnnouncementDialog = (type: 'email' | 'sms') => {
    setAnnouncementType(type);
    setAnnouncementContent('');
    setOpenAnnouncementDialog(true);
    handleCloseActionMenu();
  };
  
  const handleSendAnnouncement = async () => {
    if (!currentProjectId || !announcementContent.trim()) {
      setOpenAnnouncementDialog(false);
      return;
    }
    
    // 실제 구현에서는 API 호출
    // const response = await fetch(`/api/projects/${currentProjectId}/announcements`, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ 
    //     channel: announcementType,
    //     content: announcementContent 
    //   })
    // });
    // const newAnnouncement = await response.json();
    
    // 임시 데이터
    const newAnnouncement = {
      id: Date.now().toString(),
      projectId: currentProjectId,
      sentDate: new Date().toISOString().split('T')[0],
      channel: announcementType,
      content: announcementContent,
      recipients: [], // 실제 구현에서는 수신자 목록 필요
      createdAt: new Date().toISOString(),
    };
    
    setProjects(projects.map(project => {
      if (project.id === currentProjectId) {
        return {
          ...project,
          announcements: [...project.announcements, newAnnouncement]
        };
      }
      return project;
    }));
    
    setOpenAnnouncementDialog(false);
  };
  
  const handleFilterChange = (value: ProjectType) => {
    setFilterOptions(prev => {
      const types = prev.type.includes(value)
        ? prev.type.filter(t => t !== value)
        : [...prev.type, value];
        
      return { ...prev, type: types };
    });
  };
  
  // 진행 상황 퍼센트 계산
  const calculateProgress = (project: Project) => {
    return Math.round((project.confirmedMM / project.totalMMRequired) * 100);
  };
  
  // 개발자 배정 관련 함수들
  const handleOpenDeveloperAssignment = (project: Project) => {
    setSelectedProject(project);
    // 실제 구현에서는 API 호출
    // 여기서는 임시 데이터 사용
    const mockDevelopers: Developer[] = [
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
        currentProjects: [],
        contacts: [],
        nextProjects: [],
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
        currentProjects: [],
        contacts: [],
        nextProjects: [],
        paymentDate: '2024-04-18',
        expectedSalary: 7000000,
        paymentStatus: '미지급',
        createdAt: '2023-12-01T00:00:00Z',
        updatedAt: '2024-04-01T00:00:00Z',
      },
      {
        id: '3',
        name: '박지민',
        birthDate: '1992-11-03',
        email: 'park@example.com',
        phone: '010-5555-6666',
        skills: ['Python', 'Django', 'React'],
        experienceYears: 3,
        level: '초급',
        type: '프론트엔드개발자',
        currentProjects: [],
        contacts: [],
        nextProjects: [],
        paymentDate: '2024-04-17',
        expectedSalary: 3800000,
        paymentStatus: '미지급',
        createdAt: '2024-01-15T00:00:00Z',
        updatedAt: '2024-04-05T00:00:00Z',
      }
    ];
    
    setAvailableDevelopers(mockDevelopers);
    setOpenDeveloperAssignment(true);
    
    if (actionMenuAnchor) {
      handleCloseActionMenu();
    }
  };
  
  const handleCloseDeveloperAssignment = () => {
    setOpenDeveloperAssignment(false);
    setSelectedProject(null);
  };
  
  const handleAssignDevelopers = (project: Project, selectedDevelopers: Developer[]) => {
    if (!project) return;
    
    // 실제 구현에서는 API 호출
    // 여기서는 프로젝트 상태 업데이트
    const updatedProjects = projects.map(p => {
      if (p.id === project.id) {
        return {
          ...p,
          team: [...p.team, ...selectedDevelopers.map(dev => dev.id)],
          confirmedMM: p.confirmedMM + selectedDevelopers.length,
          updatedAt: new Date().toISOString()
        };
      }
      return p;
    });
    
    setProjects(updatedProjects);
    
    // 알림 표시 또는 다른 피드백
    console.log(`${selectedDevelopers.length}명의 개발자가 ${project.title}에 배정되었습니다.`);
  };
  
  const handleProjectClick = (projectId: string) => {
    navigate(`/projects/${projectId}`);
  };
  
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        프로젝트 관리
      </Typography>
      
      {/* 검색 및 필터 영역 */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            placeholder="프로젝트 이름 또는 설명으로 검색"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        <Grid item container xs={12} md={6} justifyContent="flex-end" spacing={1}>
          <Grid item>
            <Button
              variant="outlined"
              startIcon={<FilterIcon />}
              onClick={handleOpenFilterMenu}
            >
              필터
            </Button>
            <Menu
              anchorEl={filterMenuAnchor}
              open={Boolean(filterMenuAnchor)}
              onClose={handleCloseFilterMenu}
            >
              <Box sx={{ px: 2, py: 1 }}>
                <Typography variant="subtitle2">프로젝트 타입</Typography>
                {(['자사', '타사'] as ProjectType[]).map(type => (
                  <MenuItem 
                    key={type} 
                    onClick={() => handleFilterChange(type)}
                    sx={{ 
                      bgcolor: filterOptions.type.includes(type) 
                        ? 'action.selected' 
                        : 'transparent' 
                    }}
                  >
                    <Chip 
                      label={type} 
                      size="small" 
                      style={{ 
                        backgroundColor: getTypeColor(type),
                        color: 'white'
                      }} 
                    />
                  </MenuItem>
                ))}
              </Box>
            </Menu>
          </Grid>
          {canEdit && (
            <Grid item>
              <Button
                variant="contained"
                color="primary"
                startIcon={<AddIcon />}
                onClick={handleAddProject}
              >
                프로젝트 추가
              </Button>
            </Grid>
          )}
        </Grid>
      </Grid>
      
      {/* 탭 메뉴 */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab label="전체" />
          <Tab label="진행 중" />
          <Tab label="모집 중" />
          <Tab label="계획 중" />
        </Tabs>
      </Box>
      
      {/* 프로젝트 목록 */}
      {loading ? (
        <Typography align="center">데이터를 불러오는 중...</Typography>
      ) : filteredProjects.length === 0 ? (
        <Typography align="center">검색 결과가 없습니다.</Typography>
      ) : (
        <Grid container spacing={3}>
          {filteredProjects.map((project) => (
            <Grid item xs={12} md={6} lg={4} key={project.id}>
              <Card 
                sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column',
                  cursor: 'pointer',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 6
                  } 
                }}
                onClick={() => handleProjectClick(project.id)}
              >
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="h6" component="div">
                      {project.title}
                    </Typography>
                    <Box>
                      <Chip 
                        label={getStatusLabel(project.status)}
                        size="small"
                        sx={{ 
                          backgroundColor: getStatusColor(project.status),
                          color: 'white',
                          fontWeight: 'bold',
                          mr: 1
                        }} 
                      />
                      <Chip 
                        label={project.type}
                        size="small"
                        sx={{ 
                          backgroundColor: getTypeColor(project.type),
                          color: 'white'
                        }} 
                      />
                    </Box>
                  </Box>
                  
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {project.description}
                  </Typography>
                  
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" component="div" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <DateIcon fontSize="small" sx={{ mr: 1 }} />
                      시작일: {project.startDate || '미정'}
                    </Typography>
                    <Typography variant="body2" component="div" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <DateIcon fontSize="small" sx={{ mr: 1 }} />
                      종료예정일: {project.endDate || '미정'}
                    </Typography>
                    <Typography variant="body2" component="div" sx={{ display: 'flex', alignItems: 'center' }}>
                      <PeopleIcon fontSize="small" sx={{ mr: 1 }} />
                      인원: {project.team.length} / {project.totalMMRequired} MM
                    </Typography>
                  </Box>
                  
                  <Box sx={{ mb: 1 }}>
                    <Typography variant="body2" gutterBottom>
                      진행 상황: {calculateProgress(project)}%
                    </Typography>
                    <Box
                      sx={{
                        height: 8,
                        borderRadius: 5,
                        bgcolor: 'grey.300',
                        position: 'relative',
                        overflow: 'hidden',
                      }}
                    >
                      <Box
                        sx={{
                          position: 'absolute',
                          left: 0,
                          top: 0,
                          height: '100%',
                          width: `${calculateProgress(project)}%`,
                          bgcolor: 'primary.main',
                        }}
                      />
                    </Box>
                  </Box>
                  
                  <Box>
                    <Typography variant="body2">
                      <strong>확정 인원:</strong> {project.confirmedMM} MM
                    </Typography>
                    <Typography variant="body2">
                      <strong>논의 중 인원:</strong> {project.inDiscussionMM} MM
                    </Typography>
                    <Typography variant="body2">
                      <strong>추가 필요 인원:</strong> {Math.max(0, project.totalMMRequired - project.confirmedMM - project.inDiscussionMM)} MM
                    </Typography>
                  </Box>
                </CardContent>
                
                <Divider />
                
                <CardActions>
                  {project.status === 'recruiting' && canManageAnnouncements && (
                    <>
                      <Button
                        size="small"
                        startIcon={<EmailIcon />}
                        onClick={(e) => {
                          setCurrentProjectId(project.id);
                          handleOpenAnnouncementDialog('email');
                        }}
                      >
                        이메일 공고
                      </Button>
                      <Button
                        size="small"
                        startIcon={<MessageIcon />}
                        onClick={(e) => {
                          setCurrentProjectId(project.id);
                          handleOpenAnnouncementDialog('sms');
                        }}
                      >
                        SMS 공고
                      </Button>
                    </>
                  )}
                  <Box sx={{ flexGrow: 1 }} />
                  <IconButton 
                    onClick={(e) => handleOpenActionMenu(e, project.id)}
                    disabled={!canEdit}
                  >
                    <MoreIcon />
                  </IconButton>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
      
      {/* 액션 메뉴 */}
      <Menu
        anchorEl={actionMenuAnchor}
        open={Boolean(actionMenuAnchor)}
        onClose={handleCloseActionMenu}
      >
        <MenuItem onClick={() => {
          if (currentProjectId) {
            const project = projects.find(p => p.id === currentProjectId);
            if (project) {
              handleEditProject(project);
            }
          }
        }}>
          <EditIcon fontSize="small" sx={{ mr: 1 }} />
          프로젝트 정보 수정
        </MenuItem>
        <MenuItem onClick={() => {
          if (currentProjectId) {
            const project = projects.find(p => p.id === currentProjectId);
            if (project) {
              handleOpenDeveloperAssignment(project);
            }
          }
        }}>
          <PersonAddIcon fontSize="small" sx={{ mr: 1 }} />
          인원 배정
        </MenuItem>
        <MenuItem onClick={() => {
          if (currentProjectId) {
            handleOpenAnnouncementDialog('email');
          }
        }}>
          <EmailIcon fontSize="small" sx={{ mr: 1 }} />
          이메일 공고 발송
        </MenuItem>
        <MenuItem onClick={() => {
          if (currentProjectId) {
            handleOpenAnnouncementDialog('sms');
          }
        }}>
          <MessageIcon fontSize="small" sx={{ mr: 1 }} />
          SMS 공고 발송
        </MenuItem>
        <MenuItem onClick={() => {
          if (currentProjectId) {
            handleDeleteProject(currentProjectId);
          }
        }}
        sx={{ color: 'error.main' }}
        >
          <DeleteIcon fontSize="small" sx={{ mr: 1 }} />
          프로젝트 삭제
        </MenuItem>
      </Menu>
      
      {/* 공고 발송 대화상자 */}
      <Dialog 
        open={openAnnouncementDialog} 
        onClose={() => setOpenAnnouncementDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {announcementType === 'email' ? '이메일 공고 작성' : 'SMS 공고 작성'}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="공고 내용"
            fullWidth
            multiline
            rows={announcementType === 'email' ? 10 : 4}
            value={announcementContent}
            onChange={(e) => setAnnouncementContent(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAnnouncementDialog(false)}>취소</Button>
          <Button onClick={handleSendAnnouncement} variant="contained" color="primary">
            발송하기
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* 프로젝트 추가/수정 대화상자 (실제 구현 필요) */}
      <Dialog 
        open={openDialog} 
        onClose={() => setOpenDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {selectedProject ? '프로젝트 정보 수정' : '프로젝트 추가'}
        </DialogTitle>
        <DialogContent>
          <Typography color="text.secondary">
            프로젝트 {selectedProject ? '수정' : '추가'} 폼 구현 필요
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>취소</Button>
          <Button variant="contained" color="primary">
            저장
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* 개발자 배정 다이얼로그 */}
      {selectedProject && (
        <ProjectDeveloperAssignment
          open={openDeveloperAssignment}
          onClose={handleCloseDeveloperAssignment}
          onAssign={handleAssignDevelopers}
          project={selectedProject}
          availableDevelopers={availableDevelopers}
        />
      )}
    </Box>
  );
} 