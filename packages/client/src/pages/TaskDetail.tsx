import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Divider,
  Chip,
  Card,
  CardContent,
  Avatar,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  ListItemSecondaryAction,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  LinearProgress
} from '@mui/material';
import {
  Save as SaveIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  ArrowBack as ArrowBackIcon,
  Add as AddIcon,
  AssignmentInd as AssignmentIndIcon,
  CalendarToday as CalendarIcon,
  Person as PersonIcon,
  Comment as CommentIcon,
  Send as SendIcon
} from '@mui/icons-material';

// 임시 데이터
const mockTask = {
  id: '1',
  title: '프론트엔드 개발자 3명 섭외',
  description: '인공지능 기반 문서 자동화 시스템 프로젝트에 필요한 프론트엔드 개발자 3명을 섭외해야 합니다. React와 TypeScript 경험자 우대.',
  project: {
    id: '1',
    name: '인공지능 기반 문서 자동화 시스템'
  },
  assignee: {
    id: '1',
    name: '김담당'
  },
  dueDate: '2024-06-30',
  status: '진행중',
  priority: '높음',
  createdAt: '2024-06-01',
  updatedAt: '2024-06-10',
  comments: [
    {
      id: '1',
      author: {
        id: '1',
        name: '김담당'
      },
      content: '지인 중에 React 경험자가 있어서 연락해보겠습니다.',
      createdAt: '2024-06-05T10:30:00'
    },
    {
      id: '2',
      author: {
        id: '2',
        name: '박매니저'
      },
      content: '인력 포털에도 올려놓았으니 연락 올 것으로 예상합니다.',
      createdAt: '2024-06-07T14:15:00'
    }
  ],
  attachments: [
    {
      id: '1',
      name: '프론트엔드_개발자_요구사항.pdf',
      type: 'application/pdf',
      size: '1.2MB',
      uploadedAt: '2024-06-01T09:45:00'
    }
  ]
};

function TaskDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [task, setTask] = useState(mockTask);
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTask, setEditedTask] = useState(mockTask);
  const [newComment, setNewComment] = useState('');
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);

  useEffect(() => {
    // API 호출 시뮬레이션
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 800);
  }, [id]);

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    setEditedTask(task);
  };

  const handleTaskChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditedTask({
      ...editedTask,
      [name]: value
    });
  };

  const handleSelectChange = (e: React.ChangeEvent<{ name?: string; value: unknown }>) => {
    const { name, value } = e.target;
    setEditedTask({
      ...editedTask,
      [name as string]: value
    });
  };

  const handleSave = () => {
    // API 호출해서 저장하는 로직
    setTask(editedTask);
    setIsEditing(false);
  };

  const handleDelete = () => {
    setConfirmDialogOpen(true);
  };

  const confirmDelete = () => {
    // API 호출해서 삭제하는 로직
    setConfirmDialogOpen(false);
    navigate('/tasks');
  };

  const handleCommentSubmit = () => {
    if (!newComment.trim()) return;

    const newCommentObj = {
      id: `temp-${Date.now()}`,
      author: {
        id: '1',
        name: '김담당' // 현재 로그인한 사용자 정보를 사용해야 함
      },
      content: newComment,
      createdAt: new Date().toISOString()
    };

    setTask({
      ...task,
      comments: [...task.comments, newCommentObj]
    });

    setNewComment('');
  };

  // 우선순위 색상 설정
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case '높음': return 'error';
      case '중간': return 'warning';
      case '낮음': return 'info';
      default: return 'default';
    }
  };

  // 상태 색상 설정
  const getStatusColor = (status: string) => {
    switch (status) {
      case '진행중': return 'primary';
      case '대기중': return 'warning';
      case '완료': return 'success';
      default: return 'default';
    }
  };

  // 날짜 포맷 함수
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit' 
    };
    return new Date(dateString).toLocaleDateString('ko-KR', options);
  };

  if (isLoading) return <LinearProgress />;

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <IconButton onClick={() => navigate('/tasks')} sx={{ mr: 1 }}>
          <ArrowBackIcon />
        </IconButton>
        {!isEditing ? (
          <Typography variant="h4" component="h1">
            {task.title}
          </Typography>
        ) : (
          <TextField
            fullWidth
            name="title"
            value={editedTask.title}
            onChange={handleTaskChange}
            variant="standard"
            sx={{ fontSize: '2rem' }}
          />
        )}
      </Box>

      <Grid container spacing={3}>
        {/* 업무 정보 */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="h6">업무 정보</Typography>
              {!isEditing ? (
                <Button
                  startIcon={<EditIcon />}
                  variant="outlined"
                  onClick={handleEditToggle}
                >
                  수정
                </Button>
              ) : (
                <Box>
                  <Button
                    startIcon={<SaveIcon />}
                    variant="contained"
                    onClick={handleSave}
                    sx={{ mr: 1 }}
                  >
                    저장
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={handleEditToggle}
                  >
                    취소
                  </Button>
                </Box>
              )}
            </Box>
            <Divider sx={{ mb: 2 }} />

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2">프로젝트</Typography>
                {!isEditing ? (
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    {task.project.name}
                  </Typography>
                ) : (
                  <FormControl fullWidth size="small" sx={{ mb: 2 }}>
                    <InputLabel id="project-label">프로젝트</InputLabel>
                    <Select
                      labelId="project-label"
                      name="project"
                      value={editedTask.project.id}
                      label="프로젝트"
                      onChange={handleSelectChange}
                    >
                      <MenuItem value={task.project.id}>{task.project.name}</MenuItem>
                      {/* 다른 프로젝트 목록 */}
                    </Select>
                  </FormControl>
                )}
              </Grid>

              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2">담당자</Typography>
                {!isEditing ? (
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    {task.assignee.name}
                  </Typography>
                ) : (
                  <FormControl fullWidth size="small" sx={{ mb: 2 }}>
                    <InputLabel id="assignee-label">담당자</InputLabel>
                    <Select
                      labelId="assignee-label"
                      name="assignee"
                      value={editedTask.assignee.id}
                      label="담당자"
                      onChange={handleSelectChange}
                    >
                      <MenuItem value={task.assignee.id}>{task.assignee.name}</MenuItem>
                      {/* 다른 담당자 목록 */}
                    </Select>
                  </FormControl>
                )}
              </Grid>

              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2">상태</Typography>
                {!isEditing ? (
                  <Chip 
                    label={task.status} 
                    color={getStatusColor(task.status)} 
                    size="small" 
                    sx={{ mb: 2 }}
                  />
                ) : (
                  <FormControl fullWidth size="small" sx={{ mb: 2 }}>
                    <InputLabel id="status-label">상태</InputLabel>
                    <Select
                      labelId="status-label"
                      name="status"
                      value={editedTask.status}
                      label="상태"
                      onChange={handleSelectChange}
                    >
                      <MenuItem value="대기중">대기중</MenuItem>
                      <MenuItem value="진행중">진행중</MenuItem>
                      <MenuItem value="완료">완료</MenuItem>
                    </Select>
                  </FormControl>
                )}
              </Grid>

              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2">우선순위</Typography>
                {!isEditing ? (
                  <Chip 
                    label={task.priority} 
                    color={getPriorityColor(task.priority)} 
                    size="small" 
                    sx={{ mb: 2 }}
                  />
                ) : (
                  <FormControl fullWidth size="small" sx={{ mb: 2 }}>
                    <InputLabel id="priority-label">우선순위</InputLabel>
                    <Select
                      labelId="priority-label"
                      name="priority"
                      value={editedTask.priority}
                      label="우선순위"
                      onChange={handleSelectChange}
                    >
                      <MenuItem value="높음">높음</MenuItem>
                      <MenuItem value="중간">중간</MenuItem>
                      <MenuItem value="낮음">낮음</MenuItem>
                    </Select>
                  </FormControl>
                )}
              </Grid>

              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2">마감일</Typography>
                {!isEditing ? (
                  <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <CalendarIcon fontSize="small" sx={{ mr: 0.5, color: 'text.secondary' }} />
                    {task.dueDate}
                  </Typography>
                ) : (
                  <TextField
                    fullWidth
                    name="dueDate"
                    type="date"
                    value={editedTask.dueDate}
                    onChange={handleTaskChange}
                    size="small"
                    sx={{ mb: 2 }}
                  />
                )}
              </Grid>

              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2">생성일</Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  {task.createdAt}
                </Typography>
              </Grid>

              <Grid item xs={12}>
                <Typography variant="subtitle2">설명</Typography>
                {!isEditing ? (
                  <Typography variant="body1" paragraph>
                    {task.description}
                  </Typography>
                ) : (
                  <TextField
                    fullWidth
                    name="description"
                    value={editedTask.description}
                    onChange={handleTaskChange}
                    multiline
                    rows={4}
                    sx={{ mb: 2 }}
                  />
                )}
              </Grid>
            </Grid>

            {!isEditing && (
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                <Button
                  color="error"
                  startIcon={<DeleteIcon />}
                  onClick={handleDelete}
                >
                  삭제
                </Button>
              </Box>
            )}
          </Paper>

          {/* 첨부 파일 */}
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              첨부 파일
            </Typography>
            <Divider sx={{ mb: 2 }} />

            {task.attachments.length > 0 ? (
              <List>
                {task.attachments.map((file) => (
                  <ListItem key={file.id}>
                    <ListItemText
                      primary={file.name}
                      secondary={`${file.type} | ${file.size} | 업로드: ${file.uploadedAt}`}
                    />
                    <ListItemSecondaryAction>
                      <IconButton edge="end">
                        <DeleteIcon />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
              </List>
            ) : (
              <Typography variant="body2" color="text.secondary">
                첨부된 파일이 없습니다.
              </Typography>
            )}

            <Box sx={{ mt: 2 }}>
              <Button
                variant="outlined"
                startIcon={<AddIcon />}
                component="label"
              >
                파일 첨부
                <input
                  type="file"
                  hidden
                />
              </Button>
            </Box>
          </Paper>
        </Grid>

        {/* 댓글 섹션 */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              댓글
            </Typography>
            <Divider sx={{ mb: 2 }} />

            <List>
              {task.comments.map((comment) => (
                <ListItem key={comment.id} alignItems="flex-start" sx={{ px: 0 }}>
                  <ListItemAvatar>
                    <Avatar>
                      <PersonIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="subtitle2">
                          {comment.author.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {formatDate(comment.createdAt)}
                        </Typography>
                      </Box>
                    }
                    secondary={
                      <Typography
                        variant="body2"
                        color="text.primary"
                        sx={{ mt: 1, whiteSpace: 'pre-wrap' }}
                      >
                        {comment.content}
                      </Typography>
                    }
                  />
                </ListItem>
              ))}
            </List>

            <Box sx={{ mt: 2 }}>
              <TextField
                fullWidth
                placeholder="댓글 추가..."
                multiline
                rows={3}
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                sx={{ mb: 1 }}
              />
              <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                  variant="contained"
                  endIcon={<SendIcon />}
                  onClick={handleCommentSubmit}
                  disabled={!newComment.trim()}
                >
                  댓글 추가
                </Button>
              </Box>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* 삭제 확인 다이얼로그 */}
      <Dialog
        open={confirmDialogOpen}
        onClose={() => setConfirmDialogOpen(false)}
      >
        <DialogTitle>업무 삭제 확인</DialogTitle>
        <DialogContent>
          정말로 이 업무를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDialogOpen(false)}>취소</Button>
          <Button onClick={confirmDelete} color="error">삭제</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default TaskDetail; 