import React, { useState, useEffect } from 'react';
import {
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  TextField,
  InputAdornment,
  Chip,
  Checkbox,
  IconButton,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Paper,
  SelectChangeEvent,
  CircularProgress
} from '@mui/material';
import {
  Search as SearchIcon,
  Info as InfoIcon,
  FilterList as FilterIcon,
  PersonAdd as PersonAddIcon,
  Close as CloseIcon,
  Person as PersonIcon,
  Code as CodeIcon
} from '@mui/icons-material';
import { Developer, DeveloperLevel, DeveloperType } from '../pages/Developers';
import { Project } from '../../../../shared/dist/src/index';

interface ProjectDeveloperAssignmentProps {
  open: boolean;
  onClose: () => void;
  onAssign: (project: Project, selectedDevelopers: Developer[]) => void;
  project: Project;
  availableDevelopers: Developer[];
}

const ProjectDeveloperAssignment: React.FC<ProjectDeveloperAssignmentProps> = ({
  open,
  onClose,
  onAssign,
  project,
  availableDevelopers
}) => {
  const [selectedDevelopers, setSelectedDevelopers] = useState<Developer[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredDevelopers, setFilteredDevelopers] = useState<Developer[]>([]);
  const [filter, setFilter] = useState<{
    level: DeveloperLevel[];
    type: DeveloperType[];
  }>({
    level: [],
    type: []
  });
  const [loading, setLoading] = useState(false);

  // 필터링 및 검색 적용
  useEffect(() => {
    let result = [...availableDevelopers];
    
    // 검색어 필터링
    if (searchTerm) {
      const query = searchTerm.toLowerCase();
      result = result.filter(dev => 
        dev.name.toLowerCase().includes(query) ||
        dev.skills.some(skill => skill.toLowerCase().includes(query)) ||
        dev.type.toLowerCase().includes(query)
      );
    }
    
    // 레벨 필터링
    if (filter.level.length > 0) {
      result = result.filter(dev => filter.level.includes(dev.level));
    }
    
    // 타입 필터링
    if (filter.type.length > 0) {
      result = result.filter(dev => filter.type.includes(dev.type));
    }
    
    setFilteredDevelopers(result);
  }, [availableDevelopers, searchTerm, filter]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleLevelFilter = (event: SelectChangeEvent<DeveloperLevel[]>) => {
    const { value } = event.target;
    setFilter({
      ...filter,
      level: typeof value === 'string' ? [value as DeveloperLevel] : value as DeveloperLevel[]
    });
  };

  const handleTypeFilter = (event: SelectChangeEvent<DeveloperType[]>) => {
    const { value } = event.target;
    setFilter({
      ...filter,
      type: typeof value === 'string' ? [value as DeveloperType] : value as DeveloperType[]
    });
  };

  const handleToggleDeveloper = (developer: Developer) => {
    if (selectedDevelopers.some(dev => dev.id === developer.id)) {
      setSelectedDevelopers(selectedDevelopers.filter(dev => dev.id !== developer.id));
    } else {
      setSelectedDevelopers([...selectedDevelopers, developer]);
    }
  };

  const handleSubmit = async () => {
    if (selectedDevelopers.length === 0) return;
    
    setLoading(true);
    
    try {
      // 실제 구현에서는 API 호출을 기다림
      await new Promise(resolve => setTimeout(resolve, 800));
      
      onAssign(project, selectedDevelopers);
    } catch (error) {
      console.error('개발자 배정 중 오류 발생:', error);
    } finally {
      setLoading(false);
    }
  };

  const isDeveloperSelected = (id: string) => {
    return selectedDevelopers.some(dev => dev.id === id);
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

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Typography variant="h6">개발자 배정하기</Typography>
        <Typography variant="subtitle2" color="text.secondary">
          {project.title}
        </Typography>
      </DialogTitle>
      
      <DialogContent dividers>
        <Box sx={{ mb: 2 }}>
          <TextField
            fullWidth
            placeholder="이름, 기술, 레벨 등으로 검색"
            value={searchTerm}
            onChange={handleSearch}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            variant="outlined"
            size="small"
          />
        </Box>
        
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          {filteredDevelopers.length === 0 
            ? '조건에 맞는 개발자가 없습니다' 
            : `${filteredDevelopers.length}명의 개발자를 찾았습니다`}
        </Typography>
        
        {selectedDevelopers.length > 0 && (
          <Box sx={{ mb: 2 }}>
            <Divider sx={{ my: 1 }} />
            <Typography variant="body2" color="primary" sx={{ fontWeight: 'medium' }}>
              {selectedDevelopers.length}명의 개발자가 선택됨
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 1 }}>
              {selectedDevelopers.map(dev => (
                <Chip
                  key={dev.id}
                  label={dev.name}
                  onDelete={() => handleToggleDeveloper(dev)}
                  size="small"
                />
              ))}
            </Box>
            <Divider sx={{ my: 1 }} />
          </Box>
        )}
        
        <List sx={{ pt: 0, maxHeight: '50vh', overflow: 'auto' }}>
          {filteredDevelopers.length > 0 ? (
            filteredDevelopers.map(developer => {
              const isSelected = selectedDevelopers.some(dev => dev.id === developer.id);
              
              return (
                <ListItem
                  key={developer.id}
                  onClick={() => handleToggleDeveloper(developer)}
                  button
                  dense
                  divider
                  selected={isSelected}
                  sx={{
                    borderRadius: 1,
                    mb: 0.5,
                    '&.Mui-selected': {
                      backgroundColor: 'rgba(25, 118, 210, 0.08)',
                    }
                  }}
                >
                  <Checkbox
                    edge="start"
                    checked={isSelected}
                    tabIndex={-1}
                    disableRipple
                  />
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: getTypeColor(developer.type) }}>
                      {developer.name.charAt(0)}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Typography variant="body1">{developer.name}</Typography>
                        <Box sx={{ display: 'flex', ml: 1, gap: 0.5 }}>
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
                    }
                    secondary={
                      <Box sx={{ mt: 0.5 }}>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                          {developer.skills.slice(0, 3).map((skill, index) => (
                            <Chip key={index} label={skill} size="small" variant="outlined" />
                          ))}
                          {developer.skills.length > 3 && (
                            <Chip label={`+${developer.skills.length - 3}`} size="small" />
                          )}
                        </Box>
                      </Box>
                    }
                  />
                </ListItem>
              );
            })
          ) : (
            <Box sx={{ p: 2, textAlign: 'center' }}>
              <CodeIcon sx={{ fontSize: 40, color: 'text.secondary', mb: 1 }} />
              <Typography color="text.secondary">
                검색 결과가 없습니다. 다른 검색어를 입력해보세요.
              </Typography>
            </Box>
          )}
        </List>
      </DialogContent>
      
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} color="inherit">
          취소
        </Button>
        <Button
          onClick={handleSubmit}
          color="primary"
          variant="contained"
          disabled={selectedDevelopers.length === 0 || loading}
          startIcon={loading && <CircularProgress size={20} color="inherit" />}
        >
          {loading ? '배정 중...' : `${selectedDevelopers.length}명 배정하기`}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ProjectDeveloperAssignment; 