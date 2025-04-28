import React from 'react';
import { 
  Grid, 
  Paper, 
  Typography, 
  Box, 
  Card, 
  CardContent, 
  CardHeader, 
  List, 
  ListItem, 
  ListItemText, 
  Divider,
  Avatar,
  LinearProgress,
  CircularProgress,
  IconButton
} from '@mui/material';
import { 
  Assignment as TaskIcon, 
  BarChart as ChartIcon, 
  People as TeamIcon, 
  Event as EventIcon,
  MoreVert as MoreIcon,
  ArrowUpward as UpIcon,
  ArrowDownward as DownIcon
} from '@mui/icons-material';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  ArcElement,
  Title, 
  Tooltip, 
  Legend 
} from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';

// Chart.js 등록
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

export default function Dashboard() {
  // 프로젝트 진행 상황 차트 데이터
  const projectChartData = {
    labels: ['프로젝트 A', '프로젝트 B', '프로젝트 C', '프로젝트 D'],
    datasets: [
      {
        label: '진행률 (%)',
        data: [75, 45, 90, 30],
        backgroundColor: [
          'rgba(54, 162, 235, 0.8)',
          'rgba(255, 99, 132, 0.8)',
          'rgba(75, 192, 192, 0.8)',
          'rgba(255, 159, 64, 0.8)',
        ],
        borderColor: [
          'rgba(54, 162, 235, 1)',
          'rgba(255, 99, 132, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(255, 159, 64, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  // 작업 상태 차트 데이터
  const taskStatusData = {
    labels: ['할 일', '진행 중', '검토 중', '완료'],
    datasets: [
      {
        data: [12, 8, 3, 15],
        backgroundColor: [
          '#3498db',
          '#f39c12',
          '#9b59b6',
          '#2ecc71',
        ],
        borderWidth: 0,
      },
    ],
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Typography variant="h4" gutterBottom>
        대시보드
      </Typography>
      
      {/* 개요 카드 */}
      <Grid container spacing={3} mb={3}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ bgcolor: 'primary.main', width: 56, height: 56 }}>
                  <TaskIcon fontSize="large" />
                </Avatar>
                <Box sx={{ textAlign: 'right' }}>
                  <Typography variant="h4">38</Typography>
                  <Typography variant="body2" color="text.secondary">작업</Typography>
                </Box>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                <UpIcon fontSize="small" color="success" />
                <Typography variant="caption" color="success.main">12% 증가</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ bgcolor: 'secondary.main', width: 56, height: 56 }}>
                  <ChartIcon fontSize="large" />
                </Avatar>
                <Box sx={{ textAlign: 'right' }}>
                  <Typography variant="h4">5</Typography>
                  <Typography variant="body2" color="text.secondary">프로젝트</Typography>
                </Box>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                <UpIcon fontSize="small" color="success" />
                <Typography variant="caption" color="success.main">2개 추가</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ bgcolor: 'info.main', width: 56, height: 56 }}>
                  <TeamIcon fontSize="large" />
                </Avatar>
                <Box sx={{ textAlign: 'right' }}>
                  <Typography variant="h4">12</Typography>
                  <Typography variant="body2" color="text.secondary">팀원</Typography>
                </Box>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                <UpIcon fontSize="small" color="success" />
                <Typography variant="caption" color="success.main">1명 추가</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ bgcolor: 'warning.main', width: 56, height: 56 }}>
                  <EventIcon fontSize="large" />
                </Avatar>
                <Box sx={{ textAlign: 'right' }}>
                  <Typography variant="h4">8</Typography>
                  <Typography variant="body2" color="text.secondary">예정된 일정</Typography>
                </Box>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                <DownIcon fontSize="small" color="error" />
                <Typography variant="caption" color="error.main">3개 지남</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      
      {/* 차트 및 목록 */}
      <Grid container spacing={3}>
        {/* 프로젝트 진행률 */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="h6">프로젝트 진행률</Typography>
              <IconButton size="small">
                <MoreIcon />
              </IconButton>
            </Box>
            <Bar 
              data={projectChartData} 
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    display: false,
                  },
                  title: {
                    display: false,
                  },
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    max: 100,
                    ticks: {
                      callback: function(value) {
                        return value + '%';
                      }
                    }
                  }
                }
              }} 
            />
          </Paper>
        </Grid>
        
        {/* 작업 상태 */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="h6">작업 상태</Typography>
              <IconButton size="small">
                <MoreIcon />
              </IconButton>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80%' }}>
              <Pie 
                data={taskStatusData} 
                options={{
                  responsive: true,
                  plugins: {
                    legend: {
                      position: 'bottom',
                    },
                  },
                }} 
              />
            </Box>
          </Paper>
        </Grid>
        
        {/* 최근 활동 */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 0, height: '100%' }}>
            <CardHeader title="최근 활동" />
            <Divider />
            <List sx={{ p: 0 }}>
              <ListItem>
                <ListItemText 
                  primary="김철수가 '디자인 검토' 작업을 완료했습니다" 
                  secondary="15분 전"
                />
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemText 
                  primary="이영희가 '데이터베이스 설계' 작업에 댓글을 남겼습니다" 
                  secondary="1시간 전"
                />
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemText 
                  primary="새 프로젝트 '모바일 앱 리뉴얼'이 생성되었습니다" 
                  secondary="3시간 전"
                />
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemText 
                  primary="박지민이 '사용자 테스트' 작업을 시작했습니다" 
                  secondary="5시간 전"
                />
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemText 
                  primary="주간 회의가 예정되어 있습니다" 
                  secondary="내일 오전 10:00"
                />
              </ListItem>
            </List>
          </Paper>
        </Grid>
        
        {/* 다가오는 마감일 */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 0, height: '100%' }}>
            <CardHeader title="다가오는 마감일" />
            <Divider />
            <List>
              <ListItem>
                <ListItemText 
                  primary="API 개발 완료" 
                  secondary="프로젝트: 웹 서비스 개선"
                />
                <Box sx={{ minWidth: 100 }}>
                  <Typography variant="caption" color="error.main">오늘 마감</Typography>
                  <LinearProgress 
                    variant="determinate" 
                    value={80} 
                    sx={{ 
                      height: 8, 
                      borderRadius: 5, 
                      mt: 1
                    }}
                  />
                </Box>
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemText 
                  primary="사용자 인터페이스 디자인" 
                  secondary="프로젝트: 모바일 앱 리뉴얼"
                />
                <Box sx={{ minWidth: 100 }}>
                  <Typography variant="caption">내일 마감</Typography>
                  <LinearProgress 
                    variant="determinate" 
                    value={45} 
                    sx={{ 
                      height: 8, 
                      borderRadius: 5, 
                      mt: 1
                    }}
                  />
                </Box>
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemText 
                  primary="사용자 테스트" 
                  secondary="프로젝트: 웹 서비스 개선"
                />
                <Box sx={{ minWidth: 100 }}>
                  <Typography variant="caption">3일 후 마감</Typography>
                  <LinearProgress 
                    variant="determinate" 
                    value={10} 
                    sx={{ 
                      height: 8, 
                      borderRadius: 5, 
                      mt: 1 
                    }}
                  />
                </Box>
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemText 
                  primary="최종 보고서 작성" 
                  secondary="프로젝트: 포털 개편"
                />
                <Box sx={{ minWidth: 100 }}>
                  <Typography variant="caption">1주일 후 마감</Typography>
                  <LinearProgress 
                    variant="determinate" 
                    value={0} 
                    sx={{ 
                      height: 8, 
                      borderRadius: 5, 
                      mt: 1 
                    }}
                  />
                </Box>
              </ListItem>
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
} 