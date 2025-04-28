// 공유 타입 정의
export interface User {
  id: string;
  name: string;
  email: string;
  profileImage?: string;
  role: 'admin' | '프로젝트관리자' | '리소스관리자' | '열람자' | '공고관리자';
}

export type DeveloperLevel = '초급' | '중급' | '고급' | '특급';
export type DeveloperType = '프론트엔드개발자' | '백엔드개발자' | '컨설턴트' | '프론트엔드PM' | '백엔드PM' | 'PO';
export type ProjectType = '자사' | '타사';
export type PaymentStatus = '미지급' | '지급예정' | '지급완료';

export interface Developer {
  id: string;
  name: string;
  birthDate: string;
  email: string;
  phone: string;
  skills: string[]; // 개발 언어
  experienceYears: number; // 연차
  level: DeveloperLevel; // 등급
  type: DeveloperType; // 타입
  currentProjects: string[]; // 현재 참여 중인 프로젝트 ID
  projectStartDate?: string; // 프로젝트 시작일
  projectEndDate?: string; // 프로젝트 마감 예정일
  contacts: Contact[]; // 연락 기록
  nextProjects: string[]; // 다음 프로젝트 ID
  expectedStartDate?: string; // 투입 예정일
  paymentDate: string; // 급여일
  expectedSalary: number; // 당월 예정 급여
  paymentStatus: PaymentStatus; // 지급 여부
  createdAt: string;
  updatedAt: string;
}

export interface Contact {
  id: string;
  developerId: string;
  contactDate: string;
  memo: string;
  createdAt: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  startDate?: string; // 시작일 또는 예정일
  endDate?: string; // 종료예정일
  status: 'recruiting' | 'inProgress' | 'planned' | 'completed';
  type: ProjectType; // 자사/타사 구분
  team: string[]; // 참여 개발자 ID
  totalMMRequired: number; // 총 필요 맨먼스
  confirmedMM: number; // 투입확정 맨먼스
  inDiscussionMM: number; // 논의 중인 맨먼스
  announcements: Announcement[]; // 프로젝트 공고 히스토리
  createdAt: string;
  updatedAt: string;
}

export interface Announcement {
  id: string;
  projectId: string;
  sentDate: string;
  channel: 'email' | 'sms';
  content: string;
  recipients: string[]; // 수신자 리스트
  createdAt: string;
}

export interface ApiSetting {
  id: string;
  smtpServer: string;
  smtpPort: number;
  smtpUsername: string;
  smtpPassword: string;
  smsApiUrl: string;
  smsApiKey: string;
  smsApiSecret: string;
  updatedAt: string;
}

export interface BillingInfo {
  id: string;
  cardNumber: string; // 마스킹된 번호
  cardholderName: string;
  expiryDate: string;
  billingAddress: string;
  currentBalance: number;
  transactions: Transaction[];
  updatedAt: string;
}

export interface Transaction {
  id: string;
  amount: number;
  type: 'charge' | 'payment';
  description: string;
  date: string;
}

export interface Task {
  id: string;
  projectId: string;
  title: string;
  description: string;
  status: 'todo' | 'inProgress' | 'review' | 'done';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assigneeId?: string;
  creatorId: string;
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
  comments?: Comment[];
}

export interface Comment {
  id: string;
  taskId: string;
  userId: string;
  content: string;
  createdAt: string;
}

// 기존 Todo 인터페이스 (하위 호환성 유지)
export interface Todo {
  id: string;
  title: string;
  completed: boolean;
  userId: string;
}

// 공유 유틸리티 함수
export function formatDate(date: Date): string {
  return date.toISOString().split('T')[0];
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 15);
}

export function getStatusColor(status: Task['status']): string {
  const colors = {
    todo: '#3498db',
    inProgress: '#f39c12',
    review: '#9b59b6',
    done: '#2ecc71'
  };
  return colors[status];
}

export function getPriorityLabel(priority: Task['priority']): string {
  const labels = {
    low: '낮음',
    medium: '중간',
    high: '높음',
    urgent: '긴급'
  };
  return labels[priority];
} 