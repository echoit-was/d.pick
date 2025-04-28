import { useState, useEffect, ReactNode } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  LinearProgress,
  SelectChangeEvent
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  ArrowForward as ArrowForwardIcon,
  Add as AddIcon,
  Event as EventIcon,
  Person as PersonIcon,
  Description as DescriptionIcon
} from '@mui/icons-material';

// 날짜 관련 유틸리티 함수
const getDaysInMonth = (year: number, month: number) => {
  return new Date(year, month + 1, 0).getDate();
};

const getFirstDayOfMonth = (year: number, month: number) => {
  return new Date(year, month, 1).getDay();
};

// 이벤트 타입 정의
interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end?: Date;
  allDay?: boolean;
  type: 'project' | 'resource' | 'payment';
  description?: string;
  color?: string;
}

// 임시 데이터
const generateMockEvents = (): CalendarEvent[] => {
  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth();

  return [
    {
      id: '1',
      title: '인공지능 프로젝트 시작',
      start: new Date(currentYear, currentMonth, 10),
      end: new Date(currentYear, currentMonth, 10),
      type: 'project',
      description: '인공지능 기반 문서 자동화 시스템 프로젝트 시작',
      color: '#3f51b5'
    },
    {
      id: '2',
      title: '프론트엔드 개발자 미팅',
      start: new Date(currentYear, currentMonth, 15),
      end: new Date(currentYear, currentMonth, 15),
      type: 'resource',
      description: '프론트엔드 개발자 인터뷰 및 평가',
      color: '#f50057'
    },
    {
      id: '3',
      title: '개발자 급여 지급',
      start: new Date(currentYear, currentMonth, 25),
      end: new Date(currentYear, currentMonth, 25),
      type: 'payment',
      description: '6월 프리랜서 개발자 급여 지급',
      color: '#4caf50'
    },
    {
      id: '4',
      title: '프로젝트 마감일',
      start: new Date(currentYear, currentMonth + 1, 5),
      end: new Date(currentYear, currentMonth + 1, 5),
      type: 'project',
      description: '클라우드 기반 ERP 시스템 프로젝트 마감',
      color: '#ff9800'
    }
  ];
};

function Calendar() {
  const [date, setDate] = useState(new Date());
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [newEvent, setNewEvent] = useState<Partial<CalendarEvent>>({
    title: '',
    start: new Date(),
    type: 'project',
    description: ''
  });

  useEffect(() => {
    setIsLoading(true);
    // API 호출 시뮬레이션
    setTimeout(() => {
      setEvents(generateMockEvents());
      setIsLoading(false);
    }, 800);
  }, []);

  const handlePrevMonth = () => {
    setDate(prevDate => {
      const year = prevDate.getMonth() === 0 ? prevDate.getFullYear() - 1 : prevDate.getFullYear();
      const month = prevDate.getMonth() === 0 ? 11 : prevDate.getMonth() - 1;
      return new Date(year, month, 1);
    });
  };

  const handleNextMonth = () => {
    setDate(prevDate => {
      const year = prevDate.getMonth() === 11 ? prevDate.getFullYear() + 1 : prevDate.getFullYear();
      const month = prevDate.getMonth() === 11 ? 0 : prevDate.getMonth() + 1;
      return new Date(year, month, 1);
    });
  };

  const handleAddEvent = () => {
    setSelectedEvent(null);
    setNewEvent({
      title: '',
      start: new Date(),
      type: 'project',
      description: ''
    });
    setDialogOpen(true);
  };

  const handleEventClick = (event: CalendarEvent) => {
    setSelectedEvent(event);
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  const handleSaveEvent = () => {
    if (selectedEvent) {
      // 이벤트 수정 로직
    } else {
      // 새 이벤트 추가 로직
      const eventToAdd: CalendarEvent = {
        id: `temp-${Date.now()}`,
        title: newEvent.title || '',
        start: newEvent.start || new Date(),
        type: (newEvent.type as 'project' | 'resource' | 'payment') || 'project',
        description: newEvent.description,
        color: newEvent.type === 'project' ? '#3f51b5' : 
               newEvent.type === 'resource' ? '#f50057' : '#4caf50'
      };
      setEvents([...events, eventToAdd]);
    }
    setDialogOpen(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewEvent({
      ...newEvent,
      [name]: value
    });
  };

  const handleSelectChange = (e: SelectChangeEvent<'project' | 'resource' | 'payment'>, child: ReactNode) => {
    setNewEvent({
      ...newEvent,
      type: e.target.value as 'project' | 'resource' | 'payment'
    });
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewEvent({
      ...newEvent,
      start: new Date(e.target.value)
    });
  };

  // 캘린더 렌더링 로직
  const renderCalendar = () => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);
    
    const monthName = date.toLocaleString('ko-KR', { month: 'long' });
    
    // 날짜 그리드 생성
    const days = [];
    
    // 빈 칸 채우기 (이전 달)
    for (let i = 0; i < firstDay; i++) {
      days.push(<Box key={`empty-${i}`} sx={{ p: 1, borderBottom: '1px solid #eee', borderRight: '1px solid #eee', height: 120, bgcolor: '#f5f5f5' }}></Box>);
    }
    
    // 현재 달의 날짜 채우기
    for (let day = 1; day <= daysInMonth; day++) {
      const currentDate = new Date(year, month, day);
      
      // 해당 날짜의 이벤트 찾기
      const dayEvents = events.filter(event => {
        const eventDate = new Date(event.start);
        return eventDate.getDate() === day && 
               eventDate.getMonth() === month && 
               eventDate.getFullYear() === year;
      });
      
      days.push(
        <Box 
          key={`day-${day}`} 
          sx={{ 
            p: 1, 
            borderBottom: '1px solid #eee', 
            borderRight: '1px solid #eee', 
            height: 120,
            bgcolor: new Date().getDate() === day && 
                    new Date().getMonth() === month && 
                    new Date().getFullYear() === year ? 
                    '#e3f2fd' : 'white',
            overflow: 'hidden'
          }}
        >
          <Typography variant="body2" sx={{ mb: 1, fontWeight: 'bold' }}>
            {day}
          </Typography>
          
          {dayEvents.map(event => (
            <Chip
              key={event.id}
              label={event.title}
              size="small"
              sx={{ 
                mb: 0.5, 
                bgcolor: event.color || '#3f51b5', 
                color: 'white',
                width: '100%',
                justifyContent: 'flex-start',
                cursor: 'pointer'
              }}
              onClick={() => handleEventClick(event)}
            />
          ))}
        </Box>
      );
    }
    
    return days;
  };

  if (isLoading) return <LinearProgress />;

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          일정 관리
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAddEvent}
        >
          일정 추가
        </Button>
      </Box>

      <Paper sx={{ p: 2, mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <IconButton onClick={handlePrevMonth}>
            <ArrowBackIcon />
          </IconButton>
          
          <Typography variant="h5">
            {date.getFullYear()}년 {date.getMonth() + 1}월
          </Typography>
          
          <IconButton onClick={handleNextMonth}>
            <ArrowForwardIcon />
          </IconButton>
        </Box>

        <Grid container sx={{ borderTop: '1px solid #eee', borderLeft: '1px solid #eee' }}>
          {/* 요일 헤더 */}
          {['일', '월', '화', '수', '목', '금', '토'].map((day, index) => (
            <Grid key={day} item xs={12/7} sx={{ p: 1, borderBottom: '1px solid #eee', borderRight: '1px solid #eee', bgcolor: '#f5f5f5', textAlign: 'center' }}>
              <Typography variant="subtitle2" color={index === 0 ? 'error' : index === 6 ? 'primary' : 'inherit'}>
                {day}
              </Typography>
            </Grid>
          ))}
          
          {/* 날짜 그리드 */}
          {renderCalendar()}
        </Grid>
      </Paper>

      {/* 이벤트 추가/수정 다이얼로그 */}
      <Dialog open={dialogOpen} onClose={handleDialogClose} fullWidth maxWidth="sm">
        <DialogTitle>
          {selectedEvent ? '일정 수정' : '새 일정 추가'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1 }}>
            <TextField
              fullWidth
              label="제목"
              name="title"
              value={selectedEvent ? selectedEvent.title : newEvent.title}
              onChange={handleInputChange}
              margin="normal"
              disabled={!!selectedEvent}
            />
            
            {!selectedEvent && (
              <FormControl fullWidth margin="normal">
                <InputLabel id="event-type-label">일정 타입</InputLabel>
                <Select<'project' | 'resource' | 'payment'>
                  labelId="event-type-label"
                  name="type"
                  value={newEvent.type || 'project'}
                  label="일정 타입"
                  onChange={(e) => handleSelectChange(e, null)}
                >
                  <MenuItem value="project">프로젝트</MenuItem>
                  <MenuItem value="resource">인력 관리</MenuItem>
                  <MenuItem value="payment">급여 지급</MenuItem>
                </Select>
              </FormControl>
            )}
            
            {!selectedEvent && (
              <TextField
                fullWidth
                label="날짜"
                type="date"
                name="start"
                value={newEvent.start ? newEvent.start.toISOString().split('T')[0] : ''}
                onChange={handleDateChange}
                margin="normal"
                InputLabelProps={{
                  shrink: true,
                }}
              />
            )}
            
            <TextField
              fullWidth
              label="설명"
              name="description"
              value={selectedEvent ? selectedEvent.description : newEvent.description}
              onChange={handleInputChange}
              margin="normal"
              multiline
              rows={4}
              disabled={!!selectedEvent}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>취소</Button>
          {selectedEvent ? (
            <Button onClick={handleDialogClose} color="primary">
              닫기
            </Button>
          ) : (
            <Button onClick={handleSaveEvent} color="primary">
              저장
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default Calendar; 