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
    skills: string[];
    experienceYears: number;
    level: DeveloperLevel;
    type: DeveloperType;
    currentProjects: string[];
    projectStartDate?: string;
    projectEndDate?: string;
    contacts: Contact[];
    nextProjects: string[];
    expectedStartDate?: string;
    paymentDate: string;
    expectedSalary: number;
    paymentStatus: PaymentStatus;
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
    startDate?: string;
    endDate?: string;
    status: 'recruiting' | 'inProgress' | 'planned' | 'completed';
    type: ProjectType;
    team: string[];
    totalMMRequired: number;
    confirmedMM: number;
    inDiscussionMM: number;
    announcements: Announcement[];
    createdAt: string;
    updatedAt: string;
}
export interface Announcement {
    id: string;
    projectId: string;
    sentDate: string;
    channel: 'email' | 'sms';
    content: string;
    recipients: string[];
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
    cardNumber: string;
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
export interface Todo {
    id: string;
    title: string;
    completed: boolean;
    userId: string;
}
export declare function formatDate(date: Date): string;
export declare function generateId(): string;
export declare function getStatusColor(status: Task['status']): string;
export declare function getPriorityLabel(priority: Task['priority']): string;
