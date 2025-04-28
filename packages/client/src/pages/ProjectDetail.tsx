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
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Card,
  CardContent,
  CardHeader,
  Avatar,
  Tooltip,
  Alert,
  LinearProgress,
  CircularProgress,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  FormHelperText,
  InputAdornment
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Send as SendIcon,
  Add as AddIcon,
  Email as EmailIcon,
  Message as MessageIcon,
  CalendarToday as CalendarIcon,
  Person as PersonIcon,
  AttachMoney as MoneyIcon,
  AssignmentInd as ResumeIcon,
  Comment as CommentIcon,
  Work as WorkIcon,
  Check as CheckIcon,
  RadioButtonUnchecked as RadioButtonUncheckedIcon,
  Phone as PhoneIcon
} from '@mui/icons-material';
import { Developer, DeveloperLevel } from './Developers';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';

// 개발자 투입 정보 인터페이스
interface DeveloperAssignment {
  id: string;
  developerId: string;
  name: string;
  role: string;
  level: DeveloperLevel;
  email: string;
  monthlyCost: number; // 월 비용
  assignedDate: string; // 투입일
  endDate?: string; // 철수 예정일
  experienceYears: number; // 연차
  skills: string[]; // 기술 스택
  resumeUrl?: string; // 이력서 URL
  notes?: string; // 메모
}

// 포지션 요구사항 인터페이스
interface PositionRequirement {
  id: string;
  role: string;
  count: number;
  filled: number;
  minimumLevel?: DeveloperLevel;
}

// 프로젝트 상세 정보 인터페이스
interface ProjectDetailInfo {
  id: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  status: string;
  client: string;
  budget: string;
  totalManMonth: number; // 총 맨먼스
  filledManMonth: number; // 채워진 맨먼스
  progressPercentage: number; // 진행률
  totalCost: number; // 총 비용
  assignedDevelopers: DeveloperAssignment[]; // 투입된 개발자
  pendingDevelopers: DeveloperAssignment[]; // 투입 예정 개발자
  requiredPositions: PositionRequirement[]; // 필요 포지션
}

// 임시 데이터 (실제로는 API에서 가져와야 함)
const mockProject: ProjectDetailInfo = {
  id: '1',
  name: 'SAP ERP S/4HANA 구축 프로젝트',
  description: '대기업 그룹사 SAP ERP S/4HANA 신규 구축 프로젝트입니다. 프로젝트 진행에 필요한 다양한 기술 전문가를 찾고 있습니다.',
  startDate: '2024-01-15',
  endDate: '2025-07-31',
  status: '진행중',
  client: '대기업 그룹사',
  budget: '1,200,000,000원',
  totalManMonth: 30,
  filledManMonth: 25,
  progressPercentage: 83, // 진행률
  totalCost: 125000000, // 총 인건비
  assignedDevelopers: [
    { 
      id: '1',
      developerId: '101',
      name: '김개발',
      role: '백엔드 개발자',
      level: '고급',
      email: 'kim@example.com',
      monthlyCost: 9500000,
      assignedDate: '2024-01-15', 
      experienceYears: 8,
      skills: ['SAP ERP', 'ABAP', 'S/4HANA'],
      resumeUrl: '/resumes/kim_resume.pdf',
      notes: 'SAP 프로젝트 경험 다수 보유'
    },
    { 
      id: '2',
      developerId: '102', 
      name: '이디자인',
      role: '프론트엔드 개발자',
      level: '중급',
      email: 'lee@example.com',
      monthlyCost: 7000000,
      assignedDate: '2024-01-20',
      experienceYears: 5,
      skills: ['SAP Fiori', 'UI5', 'JavaScript'],
      resumeUrl: '/resumes/lee_resume.pdf'
    },
    { 
      id: '3',
      developerId: '103',
      name: '박매니저',
      role: '프론트엔드PM',
      level: '특급',
      email: 'park@example.com',
      monthlyCost: 12000000,
      assignedDate: '2024-01-15',
      experienceYears: 12,
      skills: ['SAP PM', 'Fiori', 'UI5', 'PM'],
      notes: '대형 프로젝트 PM 경험 다수'
    },
  ],
  pendingDevelopers: [
    { 
      id: '4',
      developerId: '104',
      name: '최분석',
      role: '컨설턴트',
      level: '특급',
      email: 'choi@example.com',
      monthlyCost: 13000000,
      assignedDate: '2024-05-01',
      experienceYears: 15,
      skills: ['SAP 컨설팅', 'S/4HANA', 'BTP'],
      resumeUrl: '/resumes/choi_resume.pdf',
      notes: 'SAP 컨설팅 전문가'
    },
  ],
  requiredPositions: [
    { id: '1', role: '백엔드 개발자', count: 2, filled: 1, minimumLevel: '중급' },
    { id: '2', role: '프론트엔드 개발자', count: 3, filled: 1, minimumLevel: '초급' },
    { id: '3', role: '프론트엔드PM', count: 1, filled: 1, minimumLevel: '고급' },
    { id: '4', role: '컨설턴트', count: 1, filled: 0, minimumLevel: '특급' },
  ],
};

function ProjectDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState<ProjectDetailInfo>(mockProject);
  const [isLoading, setIsLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [emailDialogOpen, setEmailDialogOpen] = useState(false);
  const [messageDialogOpen, setMessageDialogOpen] = useState(false);
  const [emailContent, setEmailContent] = useState({
    subject: '',
    body: '',
  });
  const [messageContent, setMessageContent] = useState('');
  const [selectedDeveloper, setSelectedDeveloper] = useState<Developer | null>(null);
  const [developerDetailOpen, setDeveloperDetailOpen] = useState(false);
  const [availableDevelopers, setAvailableDevelopers] = useState<Developer[]>([]);
  const [monthlyCost, setMonthlyCost] = useState<number>(0);
  const [developerNotes, setDeveloperNotes] = useState<string>('');

  // 화폐 포맷 함수
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW' })
      .format(amount);
  };
  
  // 날짜 포맷 함수
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return format(date, 'yyyy년 MM월 dd일', { locale: ko });
    } catch (error) {
      return dateString;
    }
  };

  useEffect(() => {
    // 실제 구현에서는 여기서 API 호출
    setIsLoading(true);
    setTimeout(() => {
      // 임시 로딩 시뮬레이션
      setIsLoading(false);
    }, 1000);
    
    // 가용 개발자 목록 가져오기 (실제로는 API 호출)
    // 임시 데이터
    const mockAvailableDevelopers: Developer[] = [
      {
        id: '201',
        name: '정개발',
        birthDate: '1988-05-12',
        email: 'jung@example.com',
        phone: '010-1234-5678',
        skills: ['SAP ABAP', 'HANA', 'Java'],
        experienceYears: 7,
        level: '중급',
        type: '백엔드개발자',
        currentProjects: [],
        projectStartDate: '',
        projectEndDate: '',
        contacts: [],
        nextProjects: [],
        expectedStartDate: '',
        paymentDate: '2024-05-30',
        expectedSalary: 8000000,
        paymentStatus: '미지급',
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-04-01T00:00:00Z'
      },
      {
        id: '202',
        name: '한디자인',
        birthDate: '1990-10-25',
        email: 'han@example.com',
        phone: '010-9876-5432',
        skills: ['UI5', 'Fiori', 'HTML', 'CSS', 'JavaScript'],
        experienceYears: 5,
        level: '중급',
        type: '프론트엔드개발자',
        currentProjects: [],
        projectStartDate: '',
        projectEndDate: '',
        contacts: [],
        nextProjects: [],
        expectedStartDate: '',
        paymentDate: '2024-05-30',
        expectedSalary: 7000000,
        paymentStatus: '미지급',
        createdAt: '2024-02-01T00:00:00Z',
        updatedAt: '2024-04-01T00:00:00Z'
      },
      {
        id: '203',
        name: '이선임',
        birthDate: '1982-03-18',
        email: 'lee@example.com',
        phone: '010-5555-1234',
        skills: ['SAP Consulting', 'BTP', 'S/4HANA', 'PM'],
        experienceYears: 12,
        level: '특급',
        type: '컨설턴트',
        currentProjects: [],
        projectStartDate: '',
        projectEndDate: '',
        contacts: [],
        nextProjects: [],
        expectedStartDate: '',
        paymentDate: '2024-05-30',
        expectedSalary: 13000000,
        paymentStatus: '미지급',
        createdAt: '2024-01-15T00:00:00Z',
        updatedAt: '2024-04-01T00:00:00Z'
      }
    ];
    
    setAvailableDevelopers(mockAvailableDevelopers);
  }, [id]);

  const handleAddDeveloper = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedDeveloper(null);
    setMonthlyCost(0);
    setDeveloperNotes('');
  };

  const handleDeveloperSelect = (developer: Developer) => {
    setSelectedDeveloper(developer);
    // 기본 비용으로 예상 월급여 설정
    setMonthlyCost(developer.expectedSalary);
  };

  const handleCostChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMonthlyCost(Number(e.target.value));
  };
  
  const handleNotesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDeveloperNotes(e.target.value);
  };

  const handleViewDeveloperDetails = (developer: Developer) => {
    setSelectedDeveloper(developer);
    setDeveloperDetailOpen(true);
  };

  const handleCloseDeveloperDetails = () => {
    setDeveloperDetailOpen(false);
  };

  const handleAssignDeveloper = () => {
    if (!selectedDeveloper) return;
    
    // 새 개발자 할당 객체 생성
    const newAssignment: DeveloperAssignment = {
      id: `assign-${Date.now()}`,
      developerId: selectedDeveloper.id,
      name: selectedDeveloper.name,
      role: selectedDeveloper.type,
      level: selectedDeveloper.level,
      email: selectedDeveloper.email,
      monthlyCost: monthlyCost,
      assignedDate: new Date().toISOString().split('T')[0], // 오늘 날짜
      experienceYears: selectedDeveloper.experienceYears,
      skills: selectedDeveloper.skills,
      notes: developerNotes || undefined
    };
    
    // 프로젝트에 개발자 추가 (실제로는 API 호출)
    // 여기서는 상태 업데이트로 시뮬레이션
    
    // 프로젝트 상태 업데이트
    setProject(prev => {
      // 해당 역할의 requiredPositions 업데이트
      const updatedPositions = prev.requiredPositions.map(pos => {
        if (pos.role === newAssignment.role && pos.filled < pos.count) {
          return {
            ...pos,
            filled: pos.filled + 1
          };
        }
        return pos;
      });
      
      // 총 비용 계산
      const newTotalCost = prev.totalCost + monthlyCost;
      
      return {
        ...prev,
        assignedDevelopers: [...prev.assignedDevelopers, newAssignment],
        requiredPositions: updatedPositions,
        totalCost: newTotalCost,
        filledManMonth: prev.filledManMonth + 1 // 단순화를 위해 1MM 추가
      };
    });
    
    // 다이얼로그 닫기
    handleCloseDialog();
  };
  
  const handleRemoveDeveloper = (developerId: string) => {
    // 해당 개발자 찾기
    const developerToRemove = project.assignedDevelopers.find(dev => dev.id === developerId);
    
    if (!developerToRemove) return;
    
    // 프로젝트 상태 업데이트
    setProject(prev => {
      // 해당 역할의 requiredPositions 업데이트
      const updatedPositions = prev.requiredPositions.map(pos => {
        if (pos.role === developerToRemove.role && pos.filled > 0) {
          return {
            ...pos,
            filled: pos.filled - 1
          };
        }
        return pos;
      });
      
      // 총 비용 계산
      const newTotalCost = prev.totalCost - developerToRemove.monthlyCost;
      
      return {
        ...prev,
        assignedDevelopers: prev.assignedDevelopers.filter(dev => dev.id !== developerId),
        requiredPositions: updatedPositions,
        totalCost: newTotalCost,
        filledManMonth: prev.filledManMonth - 1 // 단순화를 위해 1MM 감소
      };
    });
  };

  const handleSendEmail = () => {
    setEmailDialogOpen(true);
  };

  const handleSendMessage = () => {
    setMessageDialogOpen(true);
  };
  
  const handleCloseEmailDialog = () => {
    setEmailDialogOpen(false);
  };
  
  const handleCloseMessageDialog = () => {
    setMessageDialogOpen(false);
  };

  const handleSendEmailSubmit = () => {
    // 이메일 전송 로직
    console.log('이메일 전송:', emailContent);
    setEmailDialogOpen(false);
    setEmailContent({ subject: '', body: '' });
  };

  const handleSendMessageSubmit = () => {
    // 문자 메시지 전송 로직
    console.log('문자 메시지 전송:', messageContent);
    setMessageDialogOpen(false);
    setMessageContent('');
  };

  if (isLoading) return <LinearProgress />;

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4" component="h1">
          {project.name}
        </Typography>
        <Box>
          <Button
            variant="contained"
            color="primary"
            startIcon={<EmailIcon />}
            onClick={handleSendEmail}
            sx={{ mr: 1 }}
          >
            이메일 공고
          </Button>
          <Button
            variant="contained"
            color="secondary"
            startIcon={<MessageIcon />}
            onClick={handleSendMessage}
          >
            문자 공고
          </Button>
        </Box>
      </Box>

      {/* 비용 요약 및 진행 상황 */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h6" gutterBottom>총 비용</Typography>
              <Typography variant="h4" color="primary">
                {formatCurrency(project.totalCost)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {project.assignedDevelopers.length}명 투입 중
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h6" gutterBottom>맨먼스</Typography>
              <Typography variant="h4" color="primary">
                {project.filledManMonth} / {project.totalManMonth} MM
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {Math.round((project.filledManMonth / project.totalManMonth) * 100)}% 충원됨
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h6" gutterBottom>프로젝트 진행률</Typography>
              <Box sx={{ position: 'relative', display: 'inline-flex' }}>
                <CircularProgress
                  variant="determinate"
                  value={project.progressPercentage}
                  size={80}
                  thickness={4}
                  sx={{ color: 'success.main' }}
                />
                <Box
                  sx={{
                    top: 0,
                    left: 0,
                    bottom: 0,
                    right: 0,
                    position: 'absolute',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Typography variant="h6" component="div" color="text.secondary">
                    {`${Math.round(project.progressPercentage)}%`}
                  </Typography>
                </Box>
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                {formatDate(project.startDate)} ~ {formatDate(project.endDate)}
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      <Grid container spacing={3}>
        {/* 프로젝트 정보 */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              프로젝트 정보
            </Typography>
            <Divider sx={{ mb: 2 }} />
            
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography variant="subtitle2">클라이언트</Typography>
                <Typography variant="body1" sx={{ mb: 1 }}>{project.client}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="subtitle2">상태</Typography>
                <Chip 
                  label={project.status} 
                  color={project.status === '진행중' ? 'success' : 'default'} 
                  size="small" 
                  sx={{ mb: 1 }}
                />
              </Grid>
              <Grid item xs={6}>
                <Typography variant="subtitle2">시작일</Typography>
                <Typography variant="body1" sx={{ mb: 1 }}>
                  <CalendarIcon fontSize="small" sx={{ verticalAlign: 'middle', mr: 0.5 }} />
                  {formatDate(project.startDate)}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="subtitle2">종료 예정일</Typography>
                <Typography variant="body1" sx={{ mb: 1 }}>
                  <CalendarIcon fontSize="small" sx={{ verticalAlign: 'middle', mr: 0.5 }} />
                  {formatDate(project.endDate)}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="subtitle2">예산</Typography>
                <Typography variant="body1" sx={{ mb: 1 }}>{project.budget}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="subtitle2">총 필요 맨먼스</Typography>
                <Typography variant="body1" sx={{ mb: 1 }}>{project.totalManMonth} MM</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle2">프로젝트 설명</Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  {project.description}
                </Typography>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* 소요 리소스 현황 */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              소요 리소스 현황
            </Typography>
            <Divider sx={{ mb: 2 }} />
            
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>역할</TableCell>
                    <TableCell align="center">필요 인원</TableCell>
                    <TableCell align="center">투입 인원</TableCell>
                    <TableCell align="center">최소 등급</TableCell>
                    <TableCell align="center">상태</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {project.requiredPositions.map((position) => (
                    <TableRow key={position.id}>
                      <TableCell>{position.role}</TableCell>
                      <TableCell align="center">{position.count}</TableCell>
                      <TableCell align="center">{position.filled}</TableCell>
                      <TableCell align="center">{position.minimumLevel || '제한 없음'}</TableCell>
                      <TableCell align="center">
                        {position.filled >= position.count ? (
                          <Chip label="충원 완료" size="small" color="success" />
                        ) : (
                          <Chip 
                            label={`${position.count - position.filled}명 필요`} 
                            size="small" 
                            color="warning"
                          />
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            
            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleAddDeveloper}
              >
                인력 추가
              </Button>
            </Box>
          </Paper>
        </Grid>

        {/* 투입 인력 목록 */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              투입 인력 목록
            </Typography>
            <Divider sx={{ mb: 2 }} />
            
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>이름</TableCell>
                    <TableCell>역할</TableCell>
                    <TableCell>등급</TableCell>
                    <TableCell>투입일</TableCell>
                    <TableCell align="right">월 비용</TableCell>
                    <TableCell align="center">상세보기</TableCell>
                    <TableCell align="center">액션</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {project.assignedDevelopers.map((developer) => (
                    <TableRow key={developer.id}>
                      <TableCell>{developer.name}</TableCell>
                      <TableCell>{developer.role}</TableCell>
                      <TableCell>
                        <Chip 
                          label={developer.level}
                          size="small"
                          color={
                            developer.level === '특급' ? 'error' :
                            developer.level === '고급' ? 'warning' :
                            developer.level === '중급' ? 'info' : 'success'
                          }
                        />
                      </TableCell>
                      <TableCell>{formatDate(developer.assignedDate)}</TableCell>
                      <TableCell align="right">{formatCurrency(developer.monthlyCost)}</TableCell>
                      <TableCell align="center">
                        <IconButton
                          size="small"
                          onClick={() => handleViewDeveloperDetails(developer as unknown as Developer)}
                          color="primary"
                        >
                          <PersonIcon />
                        </IconButton>
                      </TableCell>
                      <TableCell align="center">
                        <IconButton
                          size="small"
                          onClick={() => handleRemoveDeveloper(developer.id)}
                          color="error"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
        
        {project.pendingDevelopers.length > 0 && (
          <Grid item xs={12}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                투입 예정 인력
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>이름</TableCell>
                      <TableCell>역할</TableCell>
                      <TableCell>등급</TableCell>
                      <TableCell>투입 예정일</TableCell>
                      <TableCell align="right">월 비용</TableCell>
                      <TableCell align="center">상세보기</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {project.pendingDevelopers.map((developer) => (
                      <TableRow key={developer.id}>
                        <TableCell>{developer.name}</TableCell>
                        <TableCell>{developer.role}</TableCell>
                        <TableCell>
                          <Chip 
                            label={developer.level}
                            size="small"
                            color={
                              developer.level === '특급' ? 'error' :
                              developer.level === '고급' ? 'warning' :
                              developer.level === '중급' ? 'info' : 'success'
                            }
                          />
                        </TableCell>
                        <TableCell>{formatDate(developer.assignedDate)}</TableCell>
                        <TableCell align="right">{formatCurrency(developer.monthlyCost)}</TableCell>
                        <TableCell align="center">
                          <IconButton
                            size="small"
                            onClick={() => handleViewDeveloperDetails(developer as unknown as Developer)}
                            color="primary"
                          >
                            <PersonIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Grid>
        )}
      </Grid>

      {/* 인력 추가 다이얼로그 */}
      <Dialog 
        open={openDialog} 
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>프로젝트에 인력 추가</DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1" gutterBottom fontWeight="bold">
                가용 인력 목록
              </Typography>
              <TableContainer sx={{ maxHeight: 400 }}>
                <Table stickyHeader size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>이름</TableCell>
                      <TableCell>역할</TableCell>
                      <TableCell>등급</TableCell>
                      <TableCell align="center">연차</TableCell>
                      <TableCell align="center">선택</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {availableDevelopers.map((developer) => (
                      <TableRow 
                        key={developer.id}
                        selected={selectedDeveloper?.id === developer.id}
                        hover
                        onClick={() => handleDeveloperSelect(developer)}
                        sx={{ cursor: 'pointer' }}
                      >
                        <TableCell>{developer.name}</TableCell>
                        <TableCell>{developer.type}</TableCell>
                        <TableCell>
                          <Chip 
                            label={developer.level}
                            size="small"
                            color={
                              developer.level === '특급' ? 'error' :
                              developer.level === '고급' ? 'warning' :
                              developer.level === '중급' ? 'info' : 'success'
                            }
                          />
                        </TableCell>
                        <TableCell align="center">{developer.experienceYears}년</TableCell>
                        <TableCell align="center">
                          <IconButton
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeveloperSelect(developer);
                            }}
                            color={selectedDeveloper?.id === developer.id ? "primary" : "default"}
                          >
                            {selectedDeveloper?.id === developer.id ? 
                              <CheckIcon /> : <RadioButtonUncheckedIcon />}
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
            
            <Grid item xs={12} md={6}>
              {selectedDeveloper ? (
                <>
                  <Typography variant="subtitle1" gutterBottom fontWeight="bold">
                    선택한 인력 정보
                  </Typography>
                  
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle2">인적 정보</Typography>
                    <Grid container spacing={1}>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">이름:</Typography>
                        <Typography variant="body1">{selectedDeveloper.name}</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">역할:</Typography>
                        <Typography variant="body1">{selectedDeveloper.type}</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">등급:</Typography>
                        <Typography variant="body1">{selectedDeveloper.level}</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">연차:</Typography>
                        <Typography variant="body1">{selectedDeveloper.experienceYears}년</Typography>
                      </Grid>
                    </Grid>
                  </Box>
                  
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle2">기술 스택</Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, my: 1 }}>
                      {selectedDeveloper.skills.map((skill, index) => (
                        <Chip key={index} label={skill} size="small" />
                      ))}
                    </Box>
                  </Box>
                  
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle2">월 비용 설정</Typography>
                    <TextField
                      fullWidth
                      type="number"
                      label="월 비용"
                      value={monthlyCost}
                      onChange={handleCostChange}
                      InputProps={{
                        startAdornment: <InputAdornment position="start">₩</InputAdornment>,
                      }}
                      margin="normal"
                      helperText={`기본 예상 월급여: ${formatCurrency(selectedDeveloper.expectedSalary)}`}
                    />
                  </Box>
                  
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle2">메모</Typography>
                    <TextField
                      fullWidth
                      multiline
                      rows={3}
                      label="투입 관련 메모"
                      value={developerNotes}
                      onChange={handleNotesChange}
                      margin="normal"
                      placeholder="인력 투입에 관한 참고사항을 입력하세요"
                    />
                  </Box>
                </>
              ) : (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                  <Typography variant="body1" color="text.secondary">
                    왼쪽에서 인력을 선택하세요
                  </Typography>
                </Box>
              )}
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>취소</Button>
          <Button 
            onClick={handleAssignDeveloper}
            variant="contained"
            disabled={!selectedDeveloper}
          >
            인력 추가
          </Button>
        </DialogActions>
      </Dialog>

      {/* 개발자 상세 정보 다이얼로그 */}
      <Dialog
        open={developerDetailOpen}
        onClose={handleCloseDeveloperDetails}
        maxWidth="md"
        fullWidth
      >
        {selectedDeveloper && (
          <>
            <DialogTitle>
              개발자 상세 정보
            </DialogTitle>
            <DialogContent dividers>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Card variant="outlined">
                    <CardHeader
                      avatar={
                        <Avatar>
                          {selectedDeveloper.name.charAt(0)}
                        </Avatar>
                      }
                      title={selectedDeveloper.name}
                      subheader={`${selectedDeveloper.type} · ${selectedDeveloper.level} · ${selectedDeveloper.experienceYears}년차`}
                    />
                    <CardContent>
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="subtitle2" gutterBottom>연락처 정보</Typography>
                        <Typography variant="body2">
                          <EmailIcon fontSize="small" sx={{ verticalAlign: 'middle', mr: 1 }} />
                          {selectedDeveloper.email}
                        </Typography>
                        <Typography variant="body2">
                          <PhoneIcon fontSize="small" sx={{ verticalAlign: 'middle', mr: 1 }} />
                          {selectedDeveloper.phone}
                        </Typography>
                      </Box>

                      <Divider sx={{ my: 2 }} />
                      
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="subtitle2" gutterBottom>기술 스택</Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                          {selectedDeveloper.skills.map((skill, index) => (
                            <Chip key={index} label={skill} size="small" />
                          ))}
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle1" gutterBottom>경력 및 비용 정보</Typography>
                    <TableContainer component={Paper} variant="outlined">
                      <Table size="small">
                        <TableBody>
                          <TableRow>
                            <TableCell component="th" width="40%">경력 연차</TableCell>
                            <TableCell>{selectedDeveloper.experienceYears}년</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell component="th">예상 월 비용</TableCell>
                            <TableCell>{formatCurrency(selectedDeveloper.expectedSalary)}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell component="th">급여일</TableCell>
                            <TableCell>{formatDate(selectedDeveloper.paymentDate)}</TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Box>
                  
                  <Box>
                    <Typography variant="subtitle1" gutterBottom>이력서 및 문서</Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                      <Button
                        variant="outlined"
                        startIcon={<ResumeIcon />}
                        fullWidth
                        sx={{ justifyContent: 'flex-start' }}
                      >
                        이력서 보기
                      </Button>
                      <Button
                        variant="outlined"
                        startIcon={<WorkIcon />}
                        fullWidth
                        sx={{ justifyContent: 'flex-start' }}
                      >
                        경력 증명서
                      </Button>
                      <Button
                        variant="outlined"
                        startIcon={<CommentIcon />}
                        fullWidth
                        sx={{ justifyContent: 'flex-start' }}
                      >
                        면담 기록
                      </Button>
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDeveloperDetails}>닫기</Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* 이메일 공고 다이얼로그 */}
      <Dialog
        open={emailDialogOpen}
        onClose={handleCloseEmailDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>이메일 공고 작성</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="제목"
            type="text"
            fullWidth
            value={emailContent.subject}
            onChange={(e) => setEmailContent({ ...emailContent, subject: e.target.value })}
          />
          <TextField
            margin="dense"
            label="내용"
            multiline
            rows={8}
            fullWidth
            value={emailContent.body}
            onChange={(e) => setEmailContent({ ...emailContent, body: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEmailDialog}>취소</Button>
          <Button onClick={handleSendEmailSubmit} variant="contained">전송</Button>
        </DialogActions>
      </Dialog>

      {/* 문자 공고 다이얼로그 */}
      <Dialog
        open={messageDialogOpen}
        onClose={handleCloseMessageDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>문자 공고 작성</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="내용"
            multiline
            rows={5}
            fullWidth
            value={messageContent}
            onChange={(e) => setMessageContent(e.target.value)}
            helperText={`${messageContent.length}/90자 (90자 초과 시 분할 전송)`}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseMessageDialog}>취소</Button>
          <Button onClick={handleSendMessageSubmit} variant="contained">전송</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default ProjectDetail; 