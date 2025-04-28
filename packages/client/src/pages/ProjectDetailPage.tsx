import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Divider,
  Chip,
  Button,
  Card,
  CardContent,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  LinearProgress,
  Tooltip,
  Tab,
  Tabs,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField
} from '@mui/material';
import {
  Person as PersonIcon,
  CalendarToday as CalendarIcon,
  Business as BusinessIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  DeleteOutline as DeleteIcon,
  Add as AddIcon,
  Assignment as AssignmentIcon,
  Group as GroupIcon,
  Email as SendEmailIcon,
  Sms as SendSmsIcon,
  Edit as EditIcon,
  PersonRemove as PersonRemoveIcon,
  ArrowBack as ArrowBackIcon
} from '@mui/icons-material';
import { Project, Developer, DeveloperLevel, DeveloperType } from '../../../../shared/dist/src/index';
import { useAuth } from '../contexts/AuthContext';
import ProjectDeveloperAssignment from '../components/ProjectDeveloperAssignment';

// 인터페이스
interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

// 탭 패널 컴포넌트
function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`project-tabpanel-${index}`}
      aria-labelledby={`project-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

export default function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [project, setProject] = useState<Project | null>(null);
  const [selectedTab, setSelectedTab] = useState(0);
  const [assignedDevelopers, setAssignedDevelopers] = useState<Developer[]>([]);
  const [openAssignDialog, setOpenAssignDialog] = useState(false);
  const [availableDevelopers, setAvailableDevelopers] = useState<Developer[]>([]);
  const [confirmRemoveDialog, setConfirmRemoveDialog] = useState<{
    open: boolean;
    developer?: Developer;
  }>({ open: false });
  
  const { user } = useAuth();
  
  // 편집 권한 확인 (admin, 프로젝트관리자만 가능)
  const canEdit = user?.role === 'admin' || user?.role === '프로젝트관리자';
  
  // 프로젝트 데이터 로드
  useEffect(() => {
    const fetchProject = async () => {
      setLoading(true);
      try {
        // 실제 구현에서는 API 호출
        // const response = await fetch(`/api/projects/${id}`);
        // const data = await response.json();
        
        // 임시 데이터
        const mockProject: Project = {
          id: id || '1',
          title: 'SAP ERP S/4HANA 구축 프로젝트',
          description: '대기업 그룹사 SAP ERP S/4HANA 신규 구축',
          startDate: '2024-01-15',
          endDate: '2025-07-31',
          status: 'inProgress',
          type: '자사',
          team: ['1', '3', '5', '7', '9'],
          totalMMRequired: 30,
          confirmedMM: 25,
          inDiscussionMM: 5,
          announcements: [],
          createdAt: '2023-12-01T00:00:00Z',
          updatedAt: '2024-04-01T00:00:00Z',
        };
        
        setProject(mockProject);
        
        // 개발자 데이터도 로드
        await fetchAssignedDevelopers(mockProject.team);
      } catch (error) {
        console.error('프로젝트 데이터를 불러오는 중 오류 발생:', error);
      } finally {
        setLoading(false);
      }
    };
    
    if (id) {
      fetchProject();
    }
  }, [id]);
  
  // 프로젝트에 배정된 개발자 데이터 로드
  const fetchAssignedDevelopers = async (developerIds: string[]) => {
    try {
      // 실제 구현에서는 API 호출
      // const response = await fetch(`/api/developers?ids=${developerIds.join(',')}`);
      // const data = await response.json();
      
      // 임시 데이터
      const mockDevelopers: Developer[] = [
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
          currentProjects: [id || '1'],
          projectStartDate: '2024-01-15',
          projectEndDate: '2025-07-31',
          contacts: [],
          nextProjects: [],
          paymentDate: '2024-05-05',
          expectedSalary: 5000000,
          paymentStatus: '미지급',
          createdAt: '2023-09-01T00:00:00Z',
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
          currentProjects: [id || '1'],
          projectStartDate: '2024-01-15',
          projectEndDate: '2025-07-31',
          contacts: [],
          nextProjects: [],
          paymentDate: '2024-04-17',
          expectedSalary: 3800000,
          paymentStatus: '미지급',
          createdAt: '2024-01-15T00:00:00Z',
          updatedAt: '2024-04-05T00:00:00Z',
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
          currentProjects: [id || '1'],
          projectStartDate: '2024-01-15',
          projectEndDate: '2025-07-31',
          contacts: [],
          nextProjects: [],
          paymentDate: '2024-04-25',
          expectedSalary: 6000000,
          paymentStatus: '미지급',
          createdAt: '2023-07-15T00:00:00Z',
          updatedAt: '2024-02-28T00:00:00Z',
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
          currentProjects: [id || '1'],
          projectStartDate: '2024-01-15',
          projectEndDate: '2025-07-31',
          contacts: [],
          nextProjects: [],
          paymentDate: '2024-04-30',
          expectedSalary: 8000000,
          paymentStatus: '미지급',
          createdAt: '2024-02-20T00:00:00Z',
          updatedAt: '2024-02-25T00:00:00Z',
        },
        {
          id: '9',
          name: '이재원',
          birthDate: '1985-07-25',
          email: 'lee@example.com',
          phone: '010-3333-4444',
          skills: ['SAP HANA', 'SAP S/4HANA', 'SAP BW'],
          experienceYears: 12,
          level: '특급',
          type: '컨설턴트',
          currentProjects: [id || '1'],
          projectStartDate: '2024-01-15',
          projectEndDate: '2025-07-31',
          contacts: [],
          nextProjects: [],
          paymentDate: '2024-05-15',
          expectedSalary: 10000000,
          paymentStatus: '미지급',
          createdAt: '2024-01-05T00:00:00Z',
          updatedAt: '2024-02-10T00:00:00Z',
        }
      ];
      
      setAssignedDevelopers(mockDevelopers);
    } catch (error) {
      console.error('개발자 데이터를 불러오는 중 오류 발생:', error);
    }
  };
  
  // 탭 변경 핸들러
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setSelectedTab(newValue);
  };
  
  // 개발자 제거 핸들러
  const handleRemoveDeveloper = async (developerId: string) => {
    if (!project) return;
    
    try {
      // 실제 구현에서는 API 호출
      // await fetch(`/api/projects/${project.id}/team/${developerId}`, { method: 'DELETE' });
      
      // 임시 데이터 업데이트
      setProject({
        ...project,
        team: project.team.filter(id => id !== developerId),
        confirmedMM: project.confirmedMM - 1
      });
      
      setAssignedDevelopers(assignedDevelopers.filter(dev => dev.id !== developerId));
    } catch (error) {
      console.error('개발자 제거 중 오류 발생:', error);
    }
  };
  
  // 개발자 추가 다이얼로그 핸들러
  const handleOpenAssignDialog = async () => {
    try {
      // 실제 구현에서는 API 호출로 배정 가능한 개발자 목록 가져오기
      // const response = await fetch('/api/developers/available');
      // const data = await response.json();
      
      // 임시 데이터
      const mockAvailableDevelopers: Developer[] = [
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
          currentProjects: [],
          projectStartDate: undefined,
          projectEndDate: undefined,
          contacts: [],
          nextProjects: [],
          paymentDate: '2024-04-18',
          expectedSalary: 7000000,
          paymentStatus: '미지급',
          createdAt: '2023-12-01T00:00:00Z',
          updatedAt: '2024-04-01T00:00:00Z',
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
          currentProjects: [],
          projectStartDate: undefined,
          projectEndDate: undefined,
          contacts: [],
          nextProjects: [],
          paymentDate: '2024-04-20',
          expectedSalary: 10000000,
          paymentStatus: '미지급',
          createdAt: '2024-01-05T00:00:00Z',
          updatedAt: '2024-02-10T00:00:00Z',
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
          contacts: [],
          nextProjects: [],
          paymentDate: '2024-04-15',
          expectedSalary: 5500000,
          paymentStatus: '미지급',
          createdAt: '2024-02-10T00:00:00Z',
          updatedAt: '2024-03-05T00:00:00Z',
        }
      ];
      
      setAvailableDevelopers(mockAvailableDevelopers);
      setOpenAssignDialog(true);
    } catch (error) {
      console.error('가용 개발자 데이터를 불러오는 중 오류 발생:', error);
    }
  };
  
  // 개발자 추가 핸들러
  const handleAssignDevelopers = async (project: Project, selectedDevelopers: Developer[]) => {
    if (!project) return;
    
    try {
      // 실제 구현에서는 API 호출
      // await fetch(`/api/projects/${project.id}/team`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ developerIds: selectedDevelopers.map(dev => dev.id) })
      // });
      
      // 임시 데이터 업데이트
      const updatedProject = {
        ...project,
        team: [...project.team, ...selectedDevelopers.map(dev => dev.id)],
        confirmedMM: project.confirmedMM + selectedDevelopers.length
      };
      
      setProject(updatedProject);
      setAssignedDevelopers([...assignedDevelopers, ...selectedDevelopers]);
      setOpenAssignDialog(false);
    } catch (error) {
      console.error('개발자 배정 중 오류 발생:', error);
    }
  };
  
  // 개발자 제거 확인 다이얼로그 열기
  const handleOpenRemoveDialog = (developer: Developer) => {
    setConfirmRemoveDialog({
      open: true,
      developer
    });
  };
  
  // 개발자 제거 확인 다이얼로그 닫기
  const handleCloseRemoveDialog = () => {
    setConfirmRemoveDialog({
      open: false
    });
  };
  
  // 개발자 제거 처리
  const handleRemoveDeveloperConfirmed = () => {
    if (!confirmRemoveDialog.developer) return;
    
    // 배정된 개발자 목록에서 제거
    const newAssignedDevelopers = assignedDevelopers.filter(
      dev => dev.id !== confirmRemoveDialog.developer?.id
    );
    setAssignedDevelopers(newAssignedDevelopers);
    
    // 가용 개발자 목록에 추가
    if (confirmRemoveDialog.developer) {
      setAvailableDevelopers([...availableDevelopers, confirmRemoveDialog.developer]);
    }
    
    // 다이얼로그 닫기
    handleCloseRemoveDialog();
  };
  
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
  
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }
  
  if (!project) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">프로젝트를 찾을 수 없습니다.</Alert>
      </Box>
    );
  }
  
  // 진행 상황 퍼센트 계산
  const progressPercent = Math.round((project.confirmedMM / project.totalMMRequired) * 100);
  
  return (
    <Box sx={{ p: 3 }}>
      {/* 프로젝트 헤더 */}
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" component="h1" gutterBottom>
            {project.title}
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            {project.description}
          </Typography>
        </Box>
        <Box>
          <Chip 
            label={
              project.status === 'inProgress' ? '진행 중' : 
              project.status === 'recruiting' ? '모집 중' : 
              project.status === 'planned' ? '계획 중' : '완료됨'
            }
            color={
              project.status === 'inProgress' ? 'primary' : 
              project.status === 'recruiting' ? 'warning' : 
              project.status === 'planned' ? 'info' : 'default'
            }
            sx={{ mr: 1 }}
          />
          <Chip 
            label={project.type}
            color={project.type === '자사' ? 'success' : 'secondary'}
          />
        </Box>
      </Box>
      
      {/* 탭 메뉴 */}
      <Box sx={{ mb: 3 }}>
        <Tabs value={selectedTab} onChange={handleTabChange}>
          <Tab label="프로젝트 정보" icon={<AssignmentIcon />} iconPosition="start" />
          <Tab label="배정된 인원" icon={<GroupIcon />} iconPosition="start" />
        </Tabs>
      </Box>
      
      {/* 프로젝트 정보 탭 */}
      {selectedTab === 0 && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>기본 정보</Typography>
              <Divider sx={{ mb: 2 }} />
              
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="subtitle2">시작일</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5, mb: 1.5 }}>
                    <CalendarIcon fontSize="small" sx={{ color: 'text.secondary', mr: 1 }} />
                    <Typography>{project.startDate || '미정'}</Typography>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2">종료 예정일</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5, mb: 1.5 }}>
                    <CalendarIcon fontSize="small" sx={{ color: 'text.secondary', mr: 1 }} />
                    <Typography>{project.endDate || '미정'}</Typography>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2">프로젝트 타입</Typography>
                  <Typography sx={{ mt: 0.5, mb: 1.5 }}>{project.type}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2">현재 상태</Typography>
                  <Typography sx={{ mt: 0.5, mb: 1.5 }}>
                    {project.status === 'inProgress' ? '진행 중' : 
                     project.status === 'recruiting' ? '모집 중' : 
                     project.status === 'planned' ? '계획 중' : '완료됨'}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle2">설명</Typography>
                  <Typography sx={{ mt: 0.5, mb: 1.5 }}>{project.description}</Typography>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>인원 현황</Typography>
              <Divider sx={{ mb: 2 }} />
              
              <Box sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography variant="body2">투입 인원 현황</Typography>
                  <Typography variant="body2">{project.confirmedMM} / {project.totalMMRequired} MM</Typography>
                </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={progressPercent} 
                  sx={{ height: 10, borderRadius: 5 }}
                />
              </Box>
              
              <Grid container spacing={2}>
                <Grid item xs={4}>
                  <Card variant="outlined" sx={{ textAlign: 'center', p: 1 }}>
                    <Typography variant="subtitle2" color="text.secondary">총 필요 인원</Typography>
                    <Typography variant="h5">{project.totalMMRequired}</Typography>
                  </Card>
                </Grid>
                <Grid item xs={4}>
                  <Card variant="outlined" sx={{ textAlign: 'center', p: 1 }}>
                    <Typography variant="subtitle2" color="text.secondary">투입 확정</Typography>
                    <Typography variant="h5">{project.confirmedMM}</Typography>
                  </Card>
                </Grid>
                <Grid item xs={4}>
                  <Card variant="outlined" sx={{ textAlign: 'center', p: 1 }}>
                    <Typography variant="subtitle2" color="text.secondary">논의 중</Typography>
                    <Typography variant="h5">{project.inDiscussionMM}</Typography>
                  </Card>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        </Grid>
      )}
      
      {/* 배정된 인원 탭 */}
      {selectedTab === 1 && (
        <Paper sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">배정된 인원 ({assignedDevelopers.length}명)</Typography>
            {canEdit && (
              <Button 
                variant="contained" 
                color="primary" 
                startIcon={<AddIcon />}
                onClick={handleOpenAssignDialog}
              >
                개발자 추가
              </Button>
            )}
          </Box>
          <Divider sx={{ mb: 2 }} />
          
          {assignedDevelopers.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 5 }}>
              <Typography variant="body1" color="text.secondary">
                아직 배정된 개발자가 없습니다.
              </Typography>
              {canEdit && (
                <Button 
                  variant="outlined" 
                  startIcon={<AddIcon />} 
                  sx={{ mt: 2 }}
                  onClick={handleOpenAssignDialog}
                >
                  개발자 추가하기
                </Button>
              )}
            </Box>
          ) : (
            <Grid container spacing={2}>
              {assignedDevelopers.map(developer => (
                <Grid item xs={12} md={6} lg={4} key={developer.id}>
                  <Card variant="outlined">
                    <CardContent sx={{ pb: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Avatar sx={{ bgcolor: getTypeColor(developer.type), mr: 2 }}>
                          {developer.name.charAt(0)}
                        </Avatar>
                        <Box>
                          <Typography variant="h6" sx={{ mb: 0 }}>{developer.name}</Typography>
                          <Box sx={{ display: 'flex', gap: 0.5 }}>
                            <Chip 
                              label={developer.type} 
                              size="small" 
                              sx={{ bgcolor: getTypeColor(developer.type), color: 'white' }}
                            />
                            <Chip 
                              label={developer.level} 
                              size="small" 
                              sx={{ bgcolor: getLevelColor(developer.level), color: 'white' }}
                            />
                          </Box>
                        </Box>
                        {canEdit && (
                          <Box sx={{ ml: 'auto' }}>
                            <Tooltip title="개발자 제거">
                              <IconButton 
                                color="error" 
                                size="small"
                                onClick={() => handleOpenRemoveDialog(developer)}
                              >
                                <DeleteIcon />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        )}
                      </Box>
                      
                      <Divider sx={{ my: 1 }} />
                      
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <EmailIcon fontSize="small" sx={{ color: 'text.secondary', mr: 1 }} />
                          <Typography variant="body2">{developer.email}</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <PhoneIcon fontSize="small" sx={{ color: 'text.secondary', mr: 1 }} />
                          <Typography variant="body2">{developer.phone}</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <CalendarIcon fontSize="small" sx={{ color: 'text.secondary', mr: 1 }} />
                          <Typography variant="body2">
                            {developer.projectStartDate || '미정'} ~ {developer.projectEndDate || '미정'}
                          </Typography>
                        </Box>
                      </Box>
                      
                      <Box sx={{ mt: 1.5 }}>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>보유 기술:</Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                          {developer.skills.map((skill, index) => (
                            <Chip key={index} label={skill} size="small" />
                          ))}
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </Paper>
      )}
      
      {/* 개발자 배정 다이얼로그 */}
      {project && (
        <ProjectDeveloperAssignment
          open={openAssignDialog}
          onClose={() => setOpenAssignDialog(false)}
          onAssign={handleAssignDevelopers}
          project={project}
          availableDevelopers={availableDevelopers}
        />
      )}
      
      {/* 개발자 제거 확인 다이얼로그 */}
      <Dialog
        open={confirmRemoveDialog.open}
        onClose={handleCloseRemoveDialog}
      >
        <DialogTitle>개발자 제외 확인</DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            {confirmRemoveDialog.developer?.name} 개발자를 프로젝트에서 제외하시겠습니까?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseRemoveDialog} color="inherit">
            취소
          </Button>
          <Button onClick={handleRemoveDeveloperConfirmed} color="error" variant="contained">
            제외하기
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
} 