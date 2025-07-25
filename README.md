# LAMS Backend - Clean Architecture with DDD

## 📋 프로젝트 개요

LAMS (Leave and Attendance Management System) 백엔드는 Clean Architecture와 Domain-Driven Design (DDD) 원칙을 따라 구축된 출근 및 휴가 관리 시스템입니다.

## 🏗️ 아키텍처 구조

### Clean Architecture 4-Layer 구조

```
┌─────────────────────────────────────────────────────────────┐
│                   Presentation Layer                        │
│              (Controllers, DTOs, Swagger)                   │
├─────────────────────────────────────────────────────────────┤
│                   Business Layer                            │
│                (Mappers, Business Logic)                    │
├─────────────────────────────────────────────────────────────┤
│                   Domain Layer                              │
│         (Entities, Commands, Queries, Services)             │
├─────────────────────────────────────────────────────────────┤
│                 Infrastructure Layer                        │
│            (External Services, Messaging)                   │
└─────────────────────────────────────────────────────────────┘
```

### 폴더 구조

```
src/
├── interfaces/                    # Presentation Layer
│   └── http/
│       ├── controllers/           # REST API 컨트롤러
│       └── dtos/                  # 요청/응답 DTO
│           ├── annual-leave/
│           ├── attendance-type/
│           ├── daily-attendance/
│           ├── monthly-attendance/
│           ├── department/
│           ├── employee/
│           └── ...
│
├── business/                      # Business Layer
│   ├── annual-leave/
│   │   └── mappers/               # 엔티티-DTO 매핑
│   ├── attendance/
│   │   ├── attendance-type/
│   │   ├── daily-attendance/
│   │   ├── monthly-attendance/
│   │   └── used-attendance/
│   └── ...
│
├── domain/                        # Domain Layer
│   ├── annual-leave/
│   │   ├── entities/              # 도메인 엔티티
│   │   ├── commands/              # 명령 객체
│   │   ├── queries/               # 쿼리 객체
│   │   └── services/              # 도메인 서비스
│   ├── attendance/
│   │   ├── attendance-type/
│   │   ├── daily-attendance/
│   │   ├── monthly-attendance/
│   │   └── used-attendance/
│   ├── organization/
│   │   ├── department/
│   │   └── employee/
│   └── ...
│
├── infrastructure/                # Infrastructure Layer
│   ├── messaging/
│   │   ├── events/                # 도메인 이벤트
│   │   ├── listeners/             # 이벤트 리스너
│   │   ├── processors/            # 이벤트 프로세서
│   │   └── emitters/              # 이벤트 발행자
│   └── external-services/         # 외부 서비스 연동
│
└── shared/                        # 공통 모듈
    ├── common/                    # 공통 데코레이터, 가드, 필터
    ├── types/                     # 타입 정의
    ├── utils/                     # 유틸리티 함수
    └── dtos/                      # 공통 DTO
```

## 🎯 주요 도메인

### 1. Annual Leave (연차 관리)

- 직원별 연차 생성, 조회, 수정, 삭제
- 연차 사용 내역 추적
- 잔여 연차 계산

### 2. Attendance (출근 관리)

- **Attendance Type**: 출근 유형 관리
- **Daily Attendance**: 일일 출근 관리
- **Monthly Attendance**: 월별 출근 집계
- **Used Attendance**: 사용된 출근 내역

### 3. Organization (조직 관리)

- **Department**: 부서 관리
- **Employee**: 직원 관리
- 조직도 관리

### 4. 기타 도메인

- **Event Info**: 이벤트 정보 관리
- **File**: 파일 관리
- **Excel**: 엑셀 처리
- **Holiday**: 공휴일 관리
- **Snapshot**: 데이터 스냅샷
- **Approval**: 승인 관리
- **System Variables**: 시스템 변수
- **User**: 사용자 관리
- **Notification**: 알림 관리

## 🚀 시작하기

### 전제 조건

- Node.js 18+
- pnpm
- PostgreSQL/MySQL

### 설치

```bash
# 의존성 설치
pnpm install

# 환경 변수 설정
cp .env.example .env

# 데이터베이스 마이그레이션
pnpm run migration:run

# 개발 서버 실행
pnpm run start:dev
```

### API 문서

개발 서버 실행 후 다음 URL에서 Swagger API 문서를 확인할 수 있습니다:

```
http://localhost:3000/api/docs
```

## 📚 API 엔드포인트

### Annual Leave API

- `GET /api/v1/annual-leave` - 연차 목록 조회
- `GET /api/v1/annual-leave/:id` - 연차 상세 조회
- `POST /api/v1/annual-leave` - 연차 생성
- `PUT /api/v1/annual-leave/:id` - 연차 수정
- `DELETE /api/v1/annual-leave/:id` - 연차 삭제

### Attendance API

- `GET /api/v1/attendance-type` - 출근 유형 목록
- `GET /api/v1/daily-attendance` - 일일 출근 기록
- `GET /api/v1/monthly-attendance` - 월별 출근 집계
- `GET /api/v1/used-attendance` - 사용된 출근 내역

### Organization API

- `GET /api/v1/department` - 부서 목록
- `GET /api/v1/employee` - 직원 목록
- `GET /api/v1/organization` - 조직도

## 🛠️ 개발 가이드

### 새로운 도메인 추가

1. **도메인 디렉토리 생성**

```bash
mkdir -p src/domain/new-domain/{entities,commands,queries,services}
```

2. **엔티티 생성**

```typescript
// src/domain/new-domain/entities/new-domain.entity.ts
@Entity()
export class NewDomainEntity {
  // 엔티티 정의
}
```

3. **DTO 생성**

```bash
mkdir -p src/interfaces/http/dtos/new-domain/{requests,responses}
```

4. **컨트롤러 생성**

```typescript
// src/interfaces/http/controllers/new-domain.controller.ts
@ApiTags('new-domain')
@Controller({ path: 'new-domain', version: '1' })
export class NewDomainController {
  // 컨트롤러 로직
}
```

5. **매퍼 생성**

```typescript
// src/business/new-domain/mappers/new-domain.mapper.ts
export class NewDomainMapper {
  // 매핑 로직
}
```

### 코딩 컨벤션

1. **파일 명명 규칙**
   - 파일명: `kebab-case`
   - 클래스명: `PascalCase`
   - 변수/함수명: `camelCase`

2. **Swagger 문서화**
   - 모든 API 엔드포인트에 `@ApiOperation` 추가
   - 모든 DTO에 `@ApiProperty` 추가
   - 응답 스키마 정의

3. **에러 처리**
   - 공통 에러 응답 DTO 사용
   - 적절한 HTTP 상태 코드 사용
   - 에러 메시지 한국어 지원

## 🧪 테스트

```bash
# 단위 테스트
pnpm run test

# E2E 테스트
pnpm run test:e2e

# 테스트 커버리지
pnpm run test:cov
```

## 📦 빌드 및 배포

```bash
# 프로덕션 빌드
pnpm run build

# 프로덕션 실행
pnpm run start:prod
```

## 🤝 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다. 자세한 내용은 `LICENSE` 파일을 참조하세요.

## 📞 문의

프로젝트에 대한 문의사항이 있으시면 이슈를 생성해 주세요.
