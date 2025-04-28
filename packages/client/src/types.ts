// 작업 관련 타입
export interface Task {
  id: string;
  title: string;
  project: string;
  assignee: string;
  dueDate: string;
  status: '진행중' | '대기중' | '완료';
  priority: '높음' | '중간' | '낮음';
}

// 캘린더 이벤트 타입
export interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end?: Date;
  allDay?: boolean;
  type: 'project' | 'resource' | 'payment';
  description?: string;
  color?: string;
}

// 개발자 타입
export interface Developer {
  id: string;
  name: string;
  email: string;
  phone: string;
  skills: string[];
  level: '초급' | '중급' | '고급' | '특급';
  type: '프론트엔드개발자' | '백엔드개발자' | '컨설턴트' | '프론트엔드PM' | '백엔드PM' | 'PO';
  currentProject?: string;
  projectStartDate?: string;
  projectEndDate?: string;
  nextProject?: string;
  expectedStartDate?: string;
  salary?: number;
  paymentStatus?: '지급예정' | '지급완료';
}

// 프로젝트 타입
export interface Project {
  id: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  status: '준비중' | '진행중' | '완료' | '보류';
  client: string;
  budget: number;
  team: string[];
} 