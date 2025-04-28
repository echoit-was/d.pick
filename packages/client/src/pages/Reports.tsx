import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Card,
  CardContent,
  LinearProgress,
  Divider,
  TextField
} from '@mui/material';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

// 임시 데이터
const resourceData = [
  { name: '프론트엔드 개발자', value: 12 },
  { name: '백엔드 개발자', value: 15 },
  { name: '프론트엔드 PM', value: 4 },
  { name: '백엔드 PM', value: 3 },
  { name: 'PO', value: 2 },
  { name: '컨설턴트', value: 6 },
];

const projectStatusData = [
  { name: '진행중', value: 8 },
  { name: '계약 진행중', value: 3 },
  { name: '완료', value: 15 },
  { name: '보류', value: 2 },
];

const monthlyIncomeData = [
  { month: '1월', income: 120000000 },
  { month: '2월', income: 150000000 },
  { month: '3월', income: 180000000 },
  { month: '4월', income: 220000000 },
  { month: '5월', income: 250000000 },
  { month: '6월', income: 270000000 },
];

const monthlyExpenseData = [
  { month: '1월', salary: 90000000, operation: 15000000 },
  { month: '2월', salary: 110000000, operation: 15000000 },
  { month: '3월', salary: 130000000, operation: 15000000 },
  { month: '4월', salary: 160000000, operation: 16000000 },
  { month: '5월', salary: 180000000, operation: 16000000 },
  { month: '6월', salary: 190000000, operation: 16000000 },
];

const topDevelopersData = [
  { id: 1, name: '김개발', role: '백엔드 개발자', level: '특급', projects: 5, income: 45000000 },
  { id: 2, name: '이프론트', role: '프론트엔드 개발자', level: '고급', projects: 4, income: 40000000 },
  { id: 3, name: '박매니저', role: '프론트엔드PM', level: '특급', projects: 3, income: 38000000 },
  { id: 4, name: '최분석', role: '컨설턴트', level: '고급', projects: 3, income: 35000000 },
  { id: 5, name: '정백엔드', role: '백엔드 개발자', level: '중급', projects: 4, income: 32000000 },
];

// 색상 배열
const COLORS = ['#3f51b5', '#f50057', '#4caf50', '#ff9800', '#2196f3', '#9c27b0'];

// 형식화 함수
const formatMoney = (amount: number) => {
  return new Intl.NumberFormat('ko-KR', { 
    style: 'currency', 
    currency: 'KRW',
    maximumFractionDigits: 0 
  }).format(amount);
};

function Reports() {
  const [isLoading, setIsLoading] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [year, setYear] = useState('2024');
  const [period, setPeriod] = useState('half1');

  useEffect(() => {
    setIsLoading(true);
    // API 호출 시뮬레이션
    setTimeout(() => {
      setIsLoading(false);
    }, 800);
  }, [year, period]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleYearChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setYear(event.target.value as string);
  };

  const handlePeriodChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setPeriod(event.target.value as string);
  };

  // 수익 계산
  const calculateProfit = (incomeData: any[], expenseData: any[]) => {
    return incomeData.map((item, index) => ({
      month: item.month,
      profit: item.income - (expenseData[index].salary + expenseData[index].operation)
    }));
  };

  const profitData = calculateProfit(monthlyIncomeData, monthlyExpenseData);

  if (isLoading) return <LinearProgress />;

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          리포트
        </Typography>

        <Box sx={{ display: 'flex', gap: 2 }}>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel id="year-select-label">연도</InputLabel>
            <Select
              labelId="year-select-label"
              value={year}
              label="연도"
              onChange={handleYearChange}
            >
              <MenuItem value="2022">2022년</MenuItem>
              <MenuItem value="2023">2023년</MenuItem>
              <MenuItem value="2024">2024년</MenuItem>
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel id="period-select-label">기간</InputLabel>
            <Select
              labelId="period-select-label"
              value={period}
              label="기간"
              onChange={handlePeriodChange}
            >
              <MenuItem value="half1">상반기 (1월-6월)</MenuItem>
              <MenuItem value="half2">하반기 (7월-12월)</MenuItem>
              <MenuItem value="full">전체 (1월-12월)</MenuItem>
            </Select>
          </FormControl>

          <Button variant="contained">
            PDF 내보내기
          </Button>
        </Box>
      </Box>

      <Paper sx={{ mb: 3 }}>
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="report tabs">
          <Tab label="수익 분석" />
          <Tab label="리소스 현황" />
          <Tab label="프로젝트 현황" />
        </Tabs>
      </Paper>

      {/* 수익 분석 탭 */}
      {tabValue === 0 && (
        <Grid container spacing={3}>
          {/* 요약 카드 */}
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  총 수입
                </Typography>
                <Typography variant="h4" color="primary">
                  {formatMoney(monthlyIncomeData.reduce((acc, curr) => acc + curr.income, 0))}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  총 지출
                </Typography>
                <Typography variant="h4" color="error">
                  {formatMoney(monthlyExpenseData.reduce((acc, curr) => acc + curr.salary + curr.operation, 0))}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  순이익
                </Typography>
                <Typography variant="h4" color="success">
                  {formatMoney(profitData.reduce((acc, curr) => acc + curr.profit, 0))}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* 월별 수입 차트 */}
          <Grid item xs={12}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                월별 수입/지출/이익
              </Typography>
              <Box sx={{ height: 400 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={monthlyIncomeData.map((item, index) => ({
                      month: item.month,
                      수입: item.income,
                      지출: monthlyExpenseData[index].salary + monthlyExpenseData[index].operation,
                      이익: profitData[index].profit
                    }))}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value) => formatMoney(value as number)} />
                    <Legend />
                    <Bar dataKey="수입" fill="#3f51b5" />
                    <Bar dataKey="지출" fill="#f50057" />
                    <Bar dataKey="이익" fill="#4caf50" />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </Paper>
          </Grid>

          {/* 지출 내역 */}
          <Grid item xs={12}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                지출 내역 세부 정보
              </Typography>
              <TableContainer>
                <Table sx={{ minWidth: 650 }}>
                  <TableHead>
                    <TableRow>
                      <TableCell>월</TableCell>
                      <TableCell align="right">인력 비용</TableCell>
                      <TableCell align="right">운영 비용</TableCell>
                      <TableCell align="right">총 지출</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {monthlyExpenseData.map((row) => (
                      <TableRow key={row.month}>
                        <TableCell component="th" scope="row">
                          {row.month}
                        </TableCell>
                        <TableCell align="right">{formatMoney(row.salary)}</TableCell>
                        <TableCell align="right">{formatMoney(row.operation)}</TableCell>
                        <TableCell align="right">{formatMoney(row.salary + row.operation)}</TableCell>
                      </TableRow>
                    ))}
                    <TableRow>
                      <TableCell component="th" scope="row" sx={{ fontWeight: 'bold' }}>
                        합계
                      </TableCell>
                      <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                        {formatMoney(monthlyExpenseData.reduce((acc, curr) => acc + curr.salary, 0))}
                      </TableCell>
                      <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                        {formatMoney(monthlyExpenseData.reduce((acc, curr) => acc + curr.operation, 0))}
                      </TableCell>
                      <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                        {formatMoney(monthlyExpenseData.reduce((acc, curr) => acc + curr.salary + curr.operation, 0))}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Grid>
        </Grid>
      )}

      {/* 리소스 현황 탭 */}
      {tabValue === 1 && (
        <Grid container spacing={3}>
          {/* 리소스 분포 차트 */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3, height: '100%' }}>
              <Typography variant="h6" gutterBottom>
                리소스 분포
              </Typography>
              <Box sx={{ height: 400, display: 'flex', justifyContent: 'center' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={resourceData}
                      cx="50%"
                      cy="50%"
                      labelLine={true}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={130}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {resourceData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `${value}명`} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
            </Paper>
          </Grid>

          {/* 상위 리소스 */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3, height: '100%' }}>
              <Typography variant="h6" gutterBottom>
                상위 수익 리소스
              </Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>이름</TableCell>
                      <TableCell>역할</TableCell>
                      <TableCell>등급</TableCell>
                      <TableCell align="right">프로젝트 수</TableCell>
                      <TableCell align="right">수익 기여</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {topDevelopersData.map((developer) => (
                      <TableRow key={developer.id}>
                        <TableCell component="th" scope="row">
                          {developer.name}
                        </TableCell>
                        <TableCell>{developer.role}</TableCell>
                        <TableCell>{developer.level}</TableCell>
                        <TableCell align="right">{developer.projects}</TableCell>
                        <TableCell align="right">{formatMoney(developer.income)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Grid>

          {/* 리소스 현황 통계 */}
          <Grid item xs={12}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                리소스 현황 통계
              </Typography>
              <Box sx={{ height: 400 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={[
                      { level: '초급', 프론트엔드: 5, 백엔드: 6, PM: 1, 컨설턴트: 0, PO: 0 },
                      { level: '중급', 프론트엔드: 4, 백엔드: 5, PM: 2, 컨설턴트: 2, PO: 1 },
                      { level: '고급', 프론트엔드: 2, 백엔드: 3, PM: 2, 컨설턴트: 3, PO: 0 },
                      { level: '특급', 프론트엔드: 1, 백엔드: 1, PM: 2, 컨설턴트: 1, PO: 1 },
                    ]}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="level" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="프론트엔드" fill="#3f51b5" />
                    <Bar dataKey="백엔드" fill="#f50057" />
                    <Bar dataKey="PM" fill="#4caf50" />
                    <Bar dataKey="컨설턴트" fill="#ff9800" />
                    <Bar dataKey="PO" fill="#2196f3" />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      )}

      {/* 프로젝트 현황 탭 */}
      {tabValue === 2 && (
        <Grid container spacing={3}>
          {/* 프로젝트 상태 차트 */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3, height: '100%' }}>
              <Typography variant="h6" gutterBottom>
                프로젝트 상태
              </Typography>
              <Box sx={{ height: 400, display: 'flex', justifyContent: 'center' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={projectStatusData}
                      cx="50%"
                      cy="50%"
                      labelLine={true}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={130}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {projectStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `${value}개`} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
            </Paper>
          </Grid>

          {/* 프로젝트 리소스 통계 */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3, height: '100%' }}>
              <Typography variant="h6" gutterBottom>
                프로젝트 리소스 분포
              </Typography>
              <Box sx={{ height: 400 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={[
                      { name: '소형 (1-3인)', count: 10 },
                      { name: '중형 (4-7인)', count: 8 },
                      { name: '대형 (8-12인)', count: 5 },
                      { name: '초대형 (13인 이상)', count: 2 },
                    ]}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="count" fill="#3f51b5" name="프로젝트 수" />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </Paper>
          </Grid>

          {/* 프로젝트 월별 시작/종료 */}
          <Grid item xs={12}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                월별 프로젝트 시작/종료
              </Typography>
              <Box sx={{ height: 400 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={[
                      { month: '1월', 시작: 2, 종료: 1 },
                      { month: '2월', 시작: 3, 종료: 2 },
                      { month: '3월', 시작: 1, 종료: 3 },
                      { month: '4월', 시작: 4, 종료: 2 },
                      { month: '5월', 시작: 2, 종료: 3 },
                      { month: '6월', 시작: 3, 종료: 4 },
                    ]}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="시작" fill="#3f51b5" />
                    <Bar dataKey="종료" fill="#f50057" />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      )}
    </Box>
  );
}

export default Reports; 