import express from 'express';
import { ApiSetting, BillingInfo, generateId } from '../../../../shared/dist/src/index';

const router = express.Router();

// API 설정 가져오기
// GET /api/settings/api
router.get('/api', (req, res) => {
  // 임시 데이터 (실제 구현 시에는 데이터베이스 연동 필요)
  const apiSettings: ApiSetting = {
    id: '1',
    smtpServer: 'smtp.example.com',
    smtpPort: 587,
    smtpUsername: 'user@example.com',
    smtpPassword: '*****', // 실제로는 암호화해서 저장해야 함
    smsApiUrl: 'https://api.sms-service.com',
    smsApiKey: 'api_key_example',
    smsApiSecret: '*****', // 실제로는 암호화해서 저장해야 함
    updatedAt: '2024-04-01T00:00:00Z',
  };
  
  res.json(apiSettings);
});

// API 설정 업데이트
// PUT /api/settings/api
router.put('/api', (req, res) => {
  const updatedSettings: ApiSetting = {
    ...req.body,
    id: '1', // 단일 설정 레코드 가정
    updatedAt: new Date().toISOString(),
  };
  
  // 실제 구현 시에는 데이터베이스에서 업데이트
  res.json(updatedSettings);
});

// 이메일 전송 테스트
// POST /api/settings/test-email
router.post('/test-email', (req, res) => {
  const { to, subject, content } = req.body;
  
  // 실제 구현 시에는 이메일 전송 로직 추가
  // 예: nodemailer 라이브러리 사용
  
  res.json({
    success: true,
    message: `이메일이 ${to}로 전송되었습니다.`,
  });
});

// SMS 전송 테스트
// POST /api/settings/test-sms
router.post('/test-sms', (req, res) => {
  const { to, message } = req.body;
  
  // 실제 구현 시에는 SMS 전송 로직 추가
  // 예: 알리고, 네이버 클라우드 플랫폼 등의 API 사용
  
  res.json({
    success: true,
    message: `SMS가 ${to}로 전송되었습니다.`,
  });
});

// 결제 정보 가져오기
// GET /api/settings/billing
router.get('/billing', (req, res) => {
  // 임시 데이터 (실제 구현 시에는 데이터베이스 연동 필요)
  const billingInfo: BillingInfo = {
    id: '1',
    cardNumber: '****-****-****-1234',
    cardholderName: '홍길동',
    expiryDate: '12/26',
    billingAddress: '서울시 강남구',
    currentBalance: 1000000,
    transactions: [
      {
        id: '1',
        amount: 500000,
        type: 'charge',
        description: '최초 충전',
        date: '2024-03-15T00:00:00Z',
      },
      {
        id: '2',
        amount: 500000,
        type: 'charge',
        description: '추가 충전',
        date: '2024-04-01T00:00:00Z',
      }
    ],
    updatedAt: '2024-04-01T00:00:00Z',
  };
  
  res.json(billingInfo);
});

// 결제 정보 업데이트
// PUT /api/settings/billing
router.put('/billing', (req, res) => {
  const updatedBilling: BillingInfo = {
    ...req.body,
    id: '1', // 단일 결제 정보 레코드 가정
    updatedAt: new Date().toISOString(),
  };
  
  // 실제 구현 시에는 데이터베이스에서 업데이트
  res.json(updatedBilling);
});

// 충전하기
// POST /api/settings/billing/charge
router.post('/billing/charge', (req, res) => {
  const { amount, cardDetails } = req.body;
  
  // 실제 구현 시에는 결제 처리 로직 추가
  // 예: 아임포트, 토스페이먼츠 등의 결제 API 사용
  
  const transaction = {
    id: generateId(),
    amount: amount,
    type: 'charge',
    description: '요금 충전',
    date: new Date().toISOString(),
  };
  
  res.json({
    success: true,
    message: `${amount}원이 충전되었습니다.`,
    transaction,
  });
});

// 결제 내역 가져오기
// GET /api/settings/billing/transactions
router.get('/billing/transactions', (req, res) => {
  // 임시 데이터 (실제 구현 시에는 데이터베이스 연동 필요)
  const transactions = [
    {
      id: '1',
      amount: 500000,
      type: 'charge',
      description: '최초 충전',
      date: '2024-03-15T00:00:00Z',
    },
    {
      id: '2',
      amount: 500000,
      type: 'charge',
      description: '추가 충전',
      date: '2024-04-01T00:00:00Z',
    },
    {
      id: '3',
      amount: 100000,
      type: 'payment',
      description: 'SMS 발송 비용',
      date: '2024-04-10T00:00:00Z',
    }
  ];
  
  res.json(transactions);
});

export default router; 