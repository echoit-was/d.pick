import { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
  SelectChangeEvent
} from '@mui/material';
import { 
  Add as AddIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

export default function UserSettings() {
  const [users, setUsers] = useState<User[]>([
    { id: 1, name: '김관리자', email: 'admin@example.com', role: 'admin' },
    { id: 2, name: '이프로젝트', email: 'project@example.com', role: 'project_manager' },
    { id: 3, name: '박리소스', email: 'resource@example.com', role: 'resource_manager' },
    { id: 4, name: '최열람', email: 'viewer@example.com', role: 'viewer' },
  ]);
  
  const [openDialog, setOpenDialog] = useState(false);
  const [newUser, setNewUser] = useState<Omit<User, 'id'>>({
    name: '',
    email: '',
    role: 'viewer'
  });

  const handleAddUser = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setNewUser({ name: '', email: '', role: 'viewer' });
  };

  const handleNewUserChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewUser({
      ...newUser,
      [name]: value
    });
  };

  const handleRoleChange = (e: SelectChangeEvent) => {
    setNewUser({
      ...newUser,
      role: e.target.value
    });
  };

  const handleSaveUser = () => {
    // 유효성 검사
    if (!newUser.name || !newUser.email) return;
    
    setUsers([
      ...users,
      {
        id: Date.now(),
        ...newUser
      }
    ]);
    
    handleCloseDialog();
  };

  const handleDeleteUser = (userId: number) => {
    setUsers(users.filter(user => user.id !== userId));
  };

  const getRoleName = (role: string) => {
    switch (role) {
      case 'admin':
        return '관리자';
      case 'project_manager':
        return '프로젝트 관리자';
      case 'resource_manager':
        return '리소스 관리자';
      case 'announcement_manager':
        return '공고 관리자';
      case 'viewer':
        return '열람자';
      default:
        return role;
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        사용자 관리
      </Typography>
      
      <Paper sx={{ p: 3, mt: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">
            사용자 목록
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAddUser}
          >
            사용자 추가
          </Button>
        </Box>
        <Typography variant="body2" color="text.secondary" paragraph>
          D.PICK 시스템에 접근할 수 있는 사용자를 관리합니다.
        </Typography>
        <Divider sx={{ mb: 3 }} />

        <List>
          {users.map(user => (
            <ListItem
              key={user.id}
              secondaryAction={
                <IconButton 
                  edge="end" 
                  aria-label="delete" 
                  onClick={() => handleDeleteUser(user.id)}
                  color="error"
                >
                  <DeleteIcon />
                </IconButton>
              }
              divider
            >
              <ListItemText
                primary={user.name}
                secondary={
                  <Box component="span">
                    {user.email} • {getRoleName(user.role)}
                  </Box>
                }
              />
            </ListItem>
          ))}
        </List>
      </Paper>

      {/* 사용자 추가 다이얼로그 */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>사용자 추가</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="이름"
                name="name"
                value={newUser.name}
                onChange={handleNewUserChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="이메일"
                name="email"
                type="email"
                value={newUser.email}
                onChange={handleNewUserChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>역할</InputLabel>
                <Select
                  value={newUser.role}
                  label="역할"
                  onChange={handleRoleChange}
                >
                  <MenuItem value="admin">관리자</MenuItem>
                  <MenuItem value="project_manager">프로젝트 관리자</MenuItem>
                  <MenuItem value="resource_manager">리소스 관리자</MenuItem>
                  <MenuItem value="announcement_manager">공고 관리자</MenuItem>
                  <MenuItem value="viewer">열람자</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>취소</Button>
          <Button onClick={handleSaveUser} variant="contained">추가</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
} 