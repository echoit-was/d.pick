# 프로젝트 관리 시스템 (PMS)

이 프로젝트는 React와 Express 기반의 TypeScript로 개발된 프로젝트 관리 시스템(PMS)입니다. 모노레포 구조로 설계되어 클라이언트와 서버 코드를 효율적으로 관리합니다.

## 주요 기능

### 대시보드
- 프로젝트 및 작업 현황 시각화
- 주요 통계 및 KPI 제공
- 최근 활동 및 다가오는 마감일 목록

### 프로젝트 관리
- 프로젝트 생성, 조회, 수정, 삭제
- 프로젝트 진행 상태 추적
- 팀원 할당 및 관리

### 작업 관리
- 작업 생성 및 할당
- 칸반 보드를 통한 작업 상태 시각화
- 작업 우선순위 및 마감일 설정

### 사용자 관리
- 인증 및 권한 관리
- 사용자 역할 기반 접근 제어
- 개인 프로필 관리

## 기술 스택

### 프론트엔드
- React 18
- TypeScript
- Material UI
- React Router
- Chart.js
- React Beautiful DnD (드래그 앤 드롭)

### 백엔드
- Express
- TypeScript
- MongoDB (Mongoose)
- JWT 인증
- Socket.io (실시간 알림)

### 공통
- TypeScript
- 모노레포 구조 (npm workspaces)

## 프로젝트 구조

```
monorepo-project/
├── packages/
│   ├── client/          # React 프론트엔드
│   │   ├── src/
│   │   │   ├── components/  # UI 컴포넌트
│   │   │   ├── contexts/    # 전역 상태 관리
│   │   │   ├── pages/       # 페이지 컴포넌트
│   │   │   └── utils/       # 유틸리티 함수
│   │   ├── public/          # 정적 파일
│   │   └── ...
│   │
│   └── server/          # Express 백엔드
│       ├── src/
│       │   ├── controllers/ # API 컨트롤러
│       │   ├── models/      # 데이터 모델
│       │   ├── routes/      # API 라우트
│       │   └── utils/       # 유틸리티 함수
│       └── ...
│
├── shared/              # 공유 코드 및 타입
└── package.json         # 루트 패키지 설정
```

## 시작하기

### 의존성 설치

```bash
npm install
```

### 개발 서버 실행

클라이언트와 서버를 동시에 실행:

```bash
npm run dev
```

클라이언트만 실행:

```bash
npm run dev:client
```

서버만 실행:

```bash
npm run dev:server
```

### 빌드

```bash
npm run build
```

## 배포 방법

### 클라이언트 배포
1. Vercel 또는 Netlify와 같은 정적 호스팅 서비스 사용
2. GitHub와 연결하여 자동 배포 설정

### 서버 배포
1. MongoDB Atlas로 데이터베이스 설정
2. Heroku 또는 AWS와 같은 클라우드 서비스에 배포
3. 환경 변수 설정 (데이터베이스 URL, JWT 시크릿 등)

## 기여 방법

1. 이 저장소를 포크합니다
2. 새로운 기능 브랜치를 생성합니다 (`git checkout -b feature/amazing-feature`)
3. 변경 사항을 커밋합니다 (`git commit -m 'Add some amazing feature'`)
4. 브랜치에 푸시합니다 (`git push origin feature/amazing-feature`)
5. Pull Request를 생성합니다

## 라이센스

이 프로젝트는 MIT 라이센스로 배포됩니다. 자세한 내용은 LICENSE 파일을 참조하세요. 