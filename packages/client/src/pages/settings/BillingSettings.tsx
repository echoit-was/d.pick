import { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  Divider,
  Card,
  CardContent,
  CardActions,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Snackbar,
  Alert,
  FormHelperText,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';
import {
  CreditCard as CreditCardIcon,
  Receipt as ReceiptIcon,
  Delete as DeleteIcon,
  Add as AddIcon
} from '@mui/icons-material';

interface PaymentMethod {
  id: number;
  type: string;
  name: string;
  last4: string;
  expMonth: number;
  expYear: number;
  isDefault: boolean;
}

interface PaymentHistory {
  id: number;
  date: string;
  amount: number;
  description: string;
  status: 'completed' | 'pending' | 'failed';
}

export default function BillingSettings() {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([
    {
      id: 1,
      type: 'card',
      name: '신한카드',
      last4: '4567',
      expMonth: 12,
      expYear: 2026,
      isDefault: true
    },
    {
      id: 2,
      type: 'card',
      name: '현대카드',
      last4: '8901',
      expMonth: 9,
      expYear: 2025,
      isDefault: false
    }
  ]);

  const [paymentHistory, setPaymentHistory] = useState<PaymentHistory[]>([
    {
      id: 1,
      date: '2023-10-01',
      amount: 150000,
      description: '월 구독 요금',
      status: 'completed'
    },
    {
      id: 2,
      date: '2023-09-01',
      amount: 150000,
      description: '월 구독 요금',
      status: 'completed'
    },
    {
      id: 3,
      date: '2023-08-01',
      amount: 150000,
      description: '월 구독 요금',
      status: 'completed'
    }
  ]);

  const [newCard, setNewCard] = useState({
    cardNumber: '',
    cardName: '',
    expMonth: '',
    expYear: '',
    cvc: ''
  });
  
  const [errors, setErrors] = useState({
    cardNumber: '',
    cardName: '',
    expMonth: '',
    expYear: '',
    cvc: ''
  });

  const [billingPlan, setBillingPlan] = useState('monthly');
  const [openAddCardDialog, setOpenAddCardDialog] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error'
  });

  const handleNewCardChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // 카드번호 자동 포맷팅 (4자리마다 공백)
    if (name === 'cardNumber') {
      const formattedValue = value.replace(/\s/g, '').replace(/(.{4})/g, '$1 ').trim();
      setNewCard({
        ...newCard,
        [name]: formattedValue
      });
    } else {
      setNewCard({
        ...newCard,
        [name]: value
      });
    }
    
    // 에러 초기화
    if (errors[name as keyof typeof errors]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const handlePlanChange = (e: SelectChangeEvent) => {
    setBillingPlan(e.target.value);
  };
  
  const handleOpenAddCardDialog = () => {
    setOpenAddCardDialog(true);
    setNewCard({
      cardNumber: '',
      cardName: '',
      expMonth: '',
      expYear: '',
      cvc: ''
    });
    setErrors({
      cardNumber: '',
      cardName: '',
      expMonth: '',
      expYear: '',
      cvc: ''
    });
  };
  
  const handleCloseAddCardDialog = () => {
    setOpenAddCardDialog(false);
  };
  
  const validateCardForm = (): boolean => {
    const newErrors = {
      cardNumber: '',
      cardName: '',
      expMonth: '',
      expYear: '',
      cvc: ''
    };
    
    let isValid = true;
    
    // 카드 번호 검증
    const cardNumberWithoutSpaces = newCard.cardNumber.replace(/\s/g, '');
    if (!cardNumberWithoutSpaces) {
      newErrors.cardNumber = '카드 번호를 입력해주세요';
      isValid = false;
    } else if (!/^\d{16}$/.test(cardNumberWithoutSpaces)) {
      newErrors.cardNumber = '유효한 16자리 카드 번호를 입력해주세요';
      isValid = false;
    }
    
    // 카드 소유자 이름 검증
    if (!newCard.cardName) {
      newErrors.cardName = '카드 소유자 이름을 입력해주세요';
      isValid = false;
    }
    
    // 만료 월 검증
    if (!newCard.expMonth) {
      newErrors.expMonth = '만료 월을 입력해주세요';
      isValid = false;
    } else {
      const month = parseInt(newCard.expMonth, 10);
      if (isNaN(month) || month < 1 || month > 12) {
        newErrors.expMonth = '1-12 사이의 값을 입력해주세요';
        isValid = false;
      }
    }
    
    // 만료 연도 검증
    const currentYear = new Date().getFullYear() % 100; // 2자리 연도
    if (!newCard.expYear) {
      newErrors.expYear = '만료 연도를 입력해주세요';
      isValid = false;
    } else {
      const year = parseInt(newCard.expYear, 10);
      if (isNaN(year) || year < currentYear) {
        newErrors.expYear = `${currentYear} 이상의 값을 입력해주세요`;
        isValid = false;
      }
    }
    
    // CVC 검증
    if (!newCard.cvc) {
      newErrors.cvc = 'CVC를 입력해주세요';
      isValid = false;
    } else if (!/^\d{3,4}$/.test(newCard.cvc)) {
      newErrors.cvc = '3-4자리 CVC 코드를 입력해주세요';
      isValid = false;
    }
    
    setErrors(newErrors);
    return isValid;
  };

  const handleAddCard = async () => {
    if (!validateCardForm()) {
      return;
    }
    
    setProcessing(true);
    
    try {
      // 여기서는 실제 API 호출을 시뮬레이션
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // 카드 추가 성공 처리
      const newCardNumber = newCard.cardNumber.replace(/\s/g, '');
      const last4 = newCardNumber.substring(newCardNumber.length - 4);
      
      const card: PaymentMethod = {
        id: Date.now(),
        type: 'card',
        name: getCardType(newCardNumber),
        last4,
        expMonth: parseInt(newCard.expMonth),
        expYear: parseInt(newCard.expYear),
        isDefault: paymentMethods.length === 0 // 첫 번째 카드면 기본으로 설정
      };
      
      setPaymentMethods([...paymentMethods, card]);
      setSnackbar({
        open: true,
        message: '새 카드가 성공적으로 추가되었습니다.',
        severity: 'success'
      });
      setOpenAddCardDialog(false);
    } catch (error) {
      setSnackbar({
        open: true,
        message: '카드 추가 중 오류가 발생했습니다.',
        severity: 'error'
      });
    } finally {
      setProcessing(false);
    }
  };
  
  const handleDeleteCard = (cardId: number) => {
    setPaymentMethods(paymentMethods.filter(card => card.id !== cardId));
  };
  
  const handleSetDefault = (cardId: number) => {
    setPaymentMethods(paymentMethods.map(card => ({
      ...card,
      isDefault: card.id === cardId
    })));
  };
  
  const handleCloseSnackbar = () => {
    setSnackbar({
      ...snackbar,
      open: false
    });
  };
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW' })
      .format(amount);
  };
  
  const getCardType = (cardNumber: string): string => {
    const firstDigit = cardNumber.charAt(0);
    const firstTwoDigits = cardNumber.substring(0, 2);
    
    if (firstDigit === '4') return '비자카드';
    if (/^5[1-5]/.test(firstTwoDigits)) return '마스터카드';
    if (firstTwoDigits === '35') return 'JCB카드';
    if (firstTwoDigits === '36' || firstTwoDigits === '38') return '다이너스클럽';
    if (firstTwoDigits === '34' || firstTwoDigits === '37') return '아메리칸익스프레스';
    if (firstDigit === '9') return '신한카드';
    if (firstDigit === '6') return '현대카드';
    
    return '신용카드';
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        결제 관리
      </Typography>
      
      {/* 구독 정보 */}
      <Paper sx={{ p: 3, mt: 3 }}>
        <Typography variant="h6" gutterBottom>
          구독 정보
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          현재 구독 상태 및 요금제를 확인하고 관리할 수 있습니다.
        </Typography>
        <Divider sx={{ mb: 3 }} />
        
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6" color="primary" gutterBottom>
                  현재 요금제: 프리미엄
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 'bold', mb: 2 }}>
                  {billingPlan === 'monthly' ? '150,000원 / 월' : '1,620,000원 / 년'}
                </Typography>
                <List>
                  <ListItem>
                    <ListItemText primary="다음 결제일" secondary="2024년 6월 1일" />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="결제 방식" secondary={
                      paymentMethods.find(m => m.isDefault)
                        ? `${paymentMethods.find(m => m.isDefault)?.name} (${paymentMethods.find(m => m.isDefault)?.last4})`
                        : "등록된 결제 수단 없음"
                    } />
                  </ListItem>
                </List>
              </CardContent>
              <CardActions>
                <Button size="small">요금제 변경</Button>
                <Button size="small" color="error">구독 취소</Button>
              </CardActions>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <FormControl fullWidth sx={{ mb: 3 }}>
              <InputLabel id="billing-plan-label">결제 주기</InputLabel>
              <Select
                labelId="billing-plan-label"
                id="billing-plan"
                value={billingPlan}
                label="결제 주기"
                onChange={handlePlanChange}
              >
                <MenuItem value="monthly">월간 요금제 (150,000원/월)</MenuItem>
                <MenuItem value="yearly">연간 요금제 (1,620,000원/년, 10% 할인)</MenuItem>
              </Select>
              <FormHelperText>
                연간 요금제를 선택하면 10% 할인됩니다.
              </FormHelperText>
            </FormControl>
            
            <Box>
              <Typography variant="body1" gutterBottom>
                프리미엄 요금제 포함 사항:
              </Typography>
              <List dense>
                <ListItem>
                  <ListItemText primary="무제한 프로젝트 관리" />
                </ListItem>
                <ListItem>
                  <ListItemText primary="무제한 개발자 리소스 관리" />
                </ListItem>
                <ListItem>
                  <ListItemText primary="무제한 이메일 발송" />
                </ListItem>
                <ListItem>
                  <ListItemText primary="월 500건 SMS 발송" />
                </ListItem>
                <ListItem>
                  <ListItemText primary="고급 보고서 및 분석" />
                </ListItem>
                <ListItem>
                  <ListItemText primary="우선 기술 지원" />
                </ListItem>
              </List>
            </Box>
          </Grid>
        </Grid>
      </Paper>
      
      {/* 결제 수단 */}
      <Paper sx={{ p: 3, mt: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">
            결제 수단
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleOpenAddCardDialog}
          >
            카드 추가
          </Button>
        </Box>
        <Typography variant="body2" color="text.secondary" paragraph>
          결제에 사용할 신용카드 또는 체크카드를 관리합니다.
        </Typography>
        <Divider sx={{ mb: 3 }} />
        
        <List>
          {paymentMethods.length > 0 ? (
            paymentMethods.map(method => (
              <ListItem
                key={method.id}
                secondaryAction={
                  <Box>
                    {!method.isDefault && (
                      <Button
                        size="small"
                        onClick={() => handleSetDefault(method.id)}
                        sx={{ mr: 1 }}
                      >
                        기본으로 설정
                      </Button>
                    )}
                    <IconButton 
                      edge="end" 
                      aria-label="delete" 
                      onClick={() => handleDeleteCard(method.id)}
                      disabled={method.isDefault}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                }
                divider
              >
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <CreditCardIcon sx={{ mr: 1 }} />
                      {method.name} •••• {method.last4}
                      {method.isDefault && (
                        <Chip 
                          label="기본" 
                          size="small" 
                          color="primary" 
                          sx={{ ml: 1 }} 
                        />
                      )}
                    </Box>
                  }
                  secondary={`만료: ${method.expMonth}/${method.expYear}`}
                />
              </ListItem>
            ))
          ) : (
            <ListItem>
              <ListItemText
                primary="등록된 결제 수단이 없습니다"
                secondary="오른쪽 상단의 '카드 추가' 버튼을 클릭하여 결제 수단을 등록하세요."
              />
            </ListItem>
          )}
        </List>
      </Paper>
      
      {/* 결제 내역 */}
      <Paper sx={{ p: 3, mt: 3 }}>
        <Typography variant="h6" gutterBottom>
          결제 내역
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          지난 결제 내역을 확인합니다.
        </Typography>
        <Divider sx={{ mb: 3 }} />
        
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>날짜</TableCell>
                <TableCell>내용</TableCell>
                <TableCell>금액</TableCell>
                <TableCell>상태</TableCell>
                <TableCell align="right">영수증</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paymentHistory.map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell>{new Date(payment.date).toLocaleDateString('ko-KR')}</TableCell>
                  <TableCell>{payment.description}</TableCell>
                  <TableCell>{formatCurrency(payment.amount)}</TableCell>
                  <TableCell>
                    {payment.status === 'completed' && <Chip label="완료" color="success" size="small" />}
                    {payment.status === 'pending' && <Chip label="대기중" color="warning" size="small" />}
                    {payment.status === 'failed' && <Chip label="실패" color="error" size="small" />}
                  </TableCell>
                  <TableCell align="right">
                    <IconButton size="small">
                      <ReceiptIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
      
      {/* 카드 추가 다이얼로그 */}
      <Dialog open={openAddCardDialog} onClose={handleCloseAddCardDialog} maxWidth="sm" fullWidth>
        <DialogTitle>카드 추가</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="카드 번호"
                name="cardNumber"
                value={newCard.cardNumber}
                onChange={handleNewCardChange}
                placeholder="1234 5678 9012 3456"
                error={!!errors.cardNumber}
                helperText={errors.cardNumber}
                inputProps={{ maxLength: 19 }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="카드 소유자 이름"
                name="cardName"
                value={newCard.cardName}
                onChange={handleNewCardChange}
                error={!!errors.cardName}
                helperText={errors.cardName}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="만료 월 (MM)"
                name="expMonth"
                value={newCard.expMonth}
                onChange={handleNewCardChange}
                placeholder="MM"
                error={!!errors.expMonth}
                helperText={errors.expMonth}
                inputProps={{ maxLength: 2 }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="만료 년도 (YY)"
                name="expYear"
                value={newCard.expYear}
                onChange={handleNewCardChange}
                placeholder="YY"
                error={!!errors.expYear}
                helperText={errors.expYear}
                inputProps={{ maxLength: 2 }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="CVC"
                name="cvc"
                value={newCard.cvc}
                onChange={handleNewCardChange}
                type="password"
                error={!!errors.cvc}
                helperText={errors.cvc}
                inputProps={{ maxLength: 4 }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAddCardDialog}>취소</Button>
          <Button 
            onClick={handleAddCard}
            variant="contained"
            disabled={processing}
          >
            {processing ? <CircularProgress size={24} /> : '카드 추가'}
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* 알림창 */}
      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
} 