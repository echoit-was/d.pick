import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Chip,
  IconButton,
  TextField,
  InputAdornment,
  Tabs,
  Tab,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Checkbox,
  FormControl,
  InputLabel,
  Select,
  LinearProgress
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  FilterList as FilterListIcon,
  MoreVert as MoreVertIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  Assignment as AssignmentIcon,
  CalendarToday as CalendarIcon,
  People as PeopleIcon,
  Sort as SortIcon
} from '@mui/icons-material';

// 임시 데이터
const mockTasks = [
  {
    id: '1',
    title: '프론트엔드 개발자 3명 섭외',
    project: '인공지능 기반 문서 자동화 시스템',
    assignee: '김담당',
    dueDate: '2024-06-30',
    status: '진행중',
    priority: '높음',
  },
  {
    id: '2',
    title: '백엔드 개발자 2명 섭외',
    project: '인공지능 기반 문서 자동화 시스템',
    assignee: '박매니저',
    dueDate: '2024-06-25',
    status: '진행중',
    priority: '높음',
  },
  {
    id: '3',
    title: '프론트엔드PM 계약 완료',
    project: '인공지능 기반 문서 자동화 시스템',
    assignee: '이사장',
    dueDate: '2024-06-20',
    status: '완료',
    priority: '중간',
  },
  {
    id: '4',
    title: '개발자 급여 지급',
    project: '클라우드 기반 ERP 시스템',
    assignee: '최경리',
    dueDate: '2024-06-10',
    status: '완료',
    priority: '높음',
  },
  {
    id: '5',
    title: '컨설턴트 2명 미팅 일정 조율',
    project: '금융권 보안 강화 프로젝트',
    assignee: '김담당',
    dueDate: '2024-07-05',
    status: '대기중',
    priority: '중간',
  },
];

function Tasks() {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState(mockTasks);
  const [tabValue, setTabValue] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [filterAnchorEl, setFilterAnchorEl] = useState(null);
  const [sortAnchorEl, setSortAnchorEl] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedPriority, setSelectedPriority] = useState('all');

  useEffect(() => {
    // API 호출 시뮬레이션
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 800);
  }, []);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleTaskClick = (taskId) => {
    navigate(`/tasks/${taskId}`);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleFilterClick = (event) => {
    setFilterAnchorEl(event.currentTarget);
  };

  const handleFilterClose = () => {
    setFilterAnchorEl(null);
  };

  const handleSortClick = (event) => {
    setSortAnchorEl(event.currentTarget);
  };

  const handleSortClose = () => {
    setSortAnchorEl(null);
  };

  const handleFilterStatusChange = (event) => {
    setSelectedStatus(event.target.value);
  };

  const handleFilterPriorityChange = (event) => {
    setSelectedPriority(event.target.value);
  };

  // 필터링된 작업 목록
  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.project.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.assignee.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = selectedStatus === 'all' || task.status === selectedStatus;
    const matchesPriority = selectedPriority === 'all' || task.priority === selectedPriority;
    
    // 탭 값에 따라 필터링
    if (tabValue === 0) return matchesSearch && matchesStatus && matchesPriority; // 전체
    if (tabValue === 1) return matchesSearch && task.status === '진행중' && matchesPriority; // 진행중
    if (tabValue === 2) return matchesSearch && task.status === '대기중' && matchesPriority; // 대기중
    if (tabValue === 3) return matchesSearch && task.status === '완료' && matchesPriority; // 완료
    
    return false;
  });

  // 우선순위 색상 설정
  const getPriorityColor = (priority) => {
    switch (priority) {
      case '높음': return 'error';
      case '중간': return 'warning';
      case '낮음': return 'info';
      default: return 'default';
    }
  };

  // 상태 색상 설정
  const getStatusColor = (status) => {
    switch (status) {
      case '진행중': return 'primary';
      case '대기중': return 'warning';
      case '완료': return 'success';
      default: return 'default';
    }
  };

  if (isLoading) return <LinearProgress />;

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4" component="h1">
          업무 관리
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate('/tasks/new')}
        >
          새 업무 추가
        </Button>
      </Box>

      <Paper sx={{ mb: 3 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={handleTabChange} aria-label="task tabs">
            <Tab label="전체" />
            <Tab label="진행중" />
            <Tab label="대기중" />
            <Tab label="완료" />
          </Tabs>
        </Box>
      </Paper>

      <Box sx={{ display: 'flex', mb: 3, alignItems: 'center', justifyContent: 'space-between' }}>
        <TextField
          placeholder="업무 검색..."
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={handleSearchChange}
          sx={{ width: '40%' }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
        <Box>
          <Button
            variant="outlined"
            startIcon={<FilterListIcon />}
            onClick={handleFilterClick}
            sx={{ mr: 1 }}
          >
            필터
          </Button>
          <Button
            variant="outlined"
            startIcon={<SortIcon />}
            onClick={handleSortClick}
          >
            정렬
          </Button>
        </Box>
      </Box>

      {/* 필터 메뉴 */}
      <Menu
        anchorEl={filterAnchorEl}
        open={Boolean(filterAnchorEl)}
        onClose={handleFilterClose}
        PaperProps={{
          sx: { width: 250, p: 1 }
        }}
      >
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel id="status-filter-label">상태</InputLabel>
          <Select
            labelId="status-filter-label"
            id="status-filter"
            value={selectedStatus}
            label="상태"
            onChange={handleFilterStatusChange}
            size="small"
          >
            <MenuItem value="all">모든 상태</MenuItem>
            <MenuItem value="진행중">진행중</MenuItem>
            <MenuItem value="대기중">대기중</MenuItem>
            <MenuItem value="완료">완료</MenuItem>
          </Select>
        </FormControl>
        
        <FormControl fullWidth>
          <InputLabel id="priority-filter-label">우선순위</InputLabel>
          <Select
            labelId="priority-filter-label"
            id="priority-filter"
            value={selectedPriority}
            label="우선순위"
            onChange={handleFilterPriorityChange}
            size="small"
          >
            <MenuItem value="all">모든 우선순위</MenuItem>
            <MenuItem value="높음">높음</MenuItem>
            <MenuItem value="중간">중간</MenuItem>
            <MenuItem value="낮음">낮음</MenuItem>
          </Select>
        </FormControl>
      </Menu>

      {/* 정렬 메뉴 */}
      <Menu
        anchorEl={sortAnchorEl}
        open={Boolean(sortAnchorEl)}
        onClose={handleSortClose}
      >
        <MenuItem onClick={handleSortClose}>
          <ListItemText>마감일 (오름차순)</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleSortClose}>
          <ListItemText>마감일 (내림차순)</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleSortClose}>
          <ListItemText>우선순위 (높은순)</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleSortClose}>
          <ListItemText>우선순위 (낮은순)</ListItemText>
        </MenuItem>
      </Menu>

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="tasks table">
          <TableHead>
            <TableRow>
              <TableCell>업무명</TableCell>
              <TableCell>프로젝트</TableCell>
              <TableCell>담당자</TableCell>
              <TableCell>마감일</TableCell>
              <TableCell>상태</TableCell>
              <TableCell>우선순위</TableCell>
              <TableCell align="center">액션</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredTasks.length > 0 ? (
              filteredTasks.map((task) => (
                <TableRow
                  key={task.id}
                  hover
                  onClick={() => handleTaskClick(task.id)}
                  sx={{ cursor: 'pointer' }}
                >
                  <TableCell component="th" scope="row">
                    {task.title}
                  </TableCell>
                  <TableCell>{task.project}</TableCell>
                  <TableCell>{task.assignee}</TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <CalendarIcon fontSize="small" sx={{ mr: 0.5, color: 'text.secondary' }} />
                      {task.dueDate}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={task.status} 
                      color={getStatusColor(task.status)} 
                      size="small" 
                    />
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={task.priority} 
                      color={getPriorityColor(task.priority)} 
                      size="small" 
                    />
                  </TableCell>
                  <TableCell align="center">
                    <IconButton 
                      size="small" 
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/tasks/${task.id}`);
                      }}
                    >
                      <VisibilityIcon fontSize="small" />
                    </IconButton>
                    <IconButton 
                      size="small" 
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/tasks/${task.id}/edit`);
                      }}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton 
                      size="small" 
                      onClick={(e) => {
                        e.stopPropagation();
                        // 삭제 로직
                      }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  <Typography variant="body1" sx={{ py: 2 }}>
                    검색 결과가 없습니다.
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

export default Tasks; 