# Business Layer (비즈니스 계층)

비즈니스 계층은 단순한 DDD(Domain-Driven Design) 아키텍처에서 **Application Layer**에 해당하며, 도메인 계층과 인터페이스 계층 사이의 중재 역할을 담당합니다.

## 📋 목차

-   [아키텍처 개요](#아키텍처-개요)
-   [User 비즈니스 모듈](#user-비즈니스-모듈)
-   [Auth 비즈니스 모듈](#auth-비즈니스-모듈)
-   [디렉토리 구조](#디렉토리-구조)
-   [데이터 플로우](#데이터-플로우)
-   [사용 예시](#사용-예시)

## 🏗️ 아키텍처 개요

### 역할과 책임

-   **도메인 서비스 오케스트레이션**: 복잡한 비즈니스 로직을 위해 여러 도메인 서비스를 조합
-   **DTO ↔ 파라미터 변환**: 인터페이스 계층의 DTO를 도메인 서비스의 파라미터로 변환
-   **트랜잭션 관리**: 비즈니스 단위의 트랜잭션 경계 정의
-   **예외 처리**: 도메인 예외를 적절한 비즈니스 예외로 변환
-   **응답 데이터 매핑**: 도메인 엔티티를 응답 형태로 변환

### 계층 간 의존성

```
Interface Layer (Controllers, DTOs)
        ↓
Business Layer (Services, Mappers)
        ↓
Domain Layer (Entities, Services, Repositories)
```

### 단순한 DDD 특징

-   **CQRS 패턴 제거**: Command와 Query 객체 대신 직접 파라미터 전달
-   **단순한 구조**: 도메인 서비스의 메서드를 직접 호출
-   **최소한의 추상화**: 필요한 경우에만 매퍼 사용
-   **직관적인 API**: 복잡한 패턴 없이 명확한 메서드 시그니처

## 👤 User 비즈니스 모듈

### 구조

```
src/business/user/
├── interfaces/
│   └── user-business.interface.ts    # 비즈니스 서비스 인터페이스
├── mappers/
│   └── user.mapper.ts                # DTO ↔ 파라미터 매핑
├── user.service.ts                   # 사용자 비즈니스 서비스
└── user.module.ts                    # 사용자 비즈니스 모듈
```

### 주요 기능

#### 1. 사용자 관리

-   **사용자 조회**: 전체 사용자 목록, 개별 사용자 조회
-   **사용자 생성**: LAMS 사용자 계정 생성
-   **사용자 업데이트**: 사용자 정보 수정
-   **사용자 삭제**: 사용자 계정 삭제

#### 2. 프로필 관리

-   **프로필 조회**: 현재 로그인한 사용자의 프로필 정보 조회
-   **비밀번호 변경**: 사용자 비밀번호 변경

### 데이터 모델

#### UserEntity (도메인 엔티티)

```typescript
{
  userId: string;           // 사용자 고유 ID
  username: string;         // 사용자명
  email: string;            // 이메일
  password: string;         // 암호화된 비밀번호
  roles: UserRole[];        // 사용자 역할 배열
  isActive: boolean;        // 활성 상태
  isIntegrated: boolean;    // 통합 인증 여부
  type: string;             // 사용자 타입
  createdAt: Date;          // 생성일시
  updatedAt: Date;          // 수정일시
}
```

#### LamsUserEntity (LAMS 사용자 엔티티)

```typescript
{
  ...UserEntity,
  hasAccessAuthority: boolean;        // 접근 권한 여부
  hasReviewAuthority: boolean;        // 검토 권한 여부
  accessableDepartments: Department[]; // 접근 가능한 부서 목록
  reviewableDepartments: Department[]; // 검토 가능한 부서 목록
}
```

### 응답 매핑

#### 사용자 응답 (민감한 정보 제외)

```typescript
{
  userId: string;
  username: string;
  email: string;
  roles: UserRole[];
  isActive: boolean;
  isIntegrated: boolean;
  type: string;
  createdAt: Date;
  updatedAt: Date;
  // password는 응답에서 제외됨
}
```

## 🔐 Auth 비즈니스 모듈

### 구조

```
src/business/auth/
├── interfaces/
│   └── auth-business.interface.ts    # 인증 비즈니스 서비스 인터페이스
├── mappers/
│   └── auth.mapper.ts                # 인증 응답 매핑
├── auth.service.ts                   # 인증 비즈니스 서비스
└── auth.module.ts                    # 인증 비즈니스 모듈
```

### 주요 기능

#### 1. 인증 관리

-   **사용자 로그인**: 사용자명/비밀번호 기반 인증
-   **토큰 검증**: JWT 토큰 유효성 검증
-   **사용자 검증**: 인증 정보 유효성 확인

#### 2. 토큰 관리

-   **토큰 생성**: JWT 토큰 생성 (저장하지 않음)
-   **토큰 검증**: JWT 토큰 검증 및 사용자 정보 추출
-   **토큰 만료 확인**: 토큰 만료 여부 확인

### 데이터 모델

#### AuthPayloadEntity (인증 페이로드)

```typescript
{
  sub: string;              // 사용자 ID (subject)
  username: string;         // 사용자명
  email: string;            // 이메일
  roles: UserRole[];        // 사용자 역할 배열
  isActive: boolean;        // 활성 상태
  iat?: number;             // 토큰 발급 시간
  exp?: number;             // 토큰 만료 시간
}
```

### 응답 매핑

#### 로그인 응답

```typescript
{
  accessToken: string;      // JWT 액세스 토큰
  tokenType: "Bearer";      // 토큰 타입
  user: {                   // 사용자 정보
    userId: string;
    username: string;
    email: string;
    roles: UserRole[];
    isActive: boolean;
  }
}
```

#### 인증 정보 응답

```typescript
{
  userId: string;
  username: string;
  email: string;
  roles: UserRole[];
  isActive: boolean;
}
```

## 📁 디렉토리 구조

```
src/business/
├── user/
│   ├── interfaces/
│   │   └── user-business.interface.ts
│   ├── mappers/
│   │   └── user.mapper.ts
│   ├── user.service.ts
│   └── user.module.ts
├── auth/
│   ├── interfaces/
│   │   └── auth-business.interface.ts
│   ├── mappers/
│   │   └── auth.mapper.ts
│   ├── auth.service.ts
│   └── auth.module.ts
└── README.md
```

## 🔄 데이터 플로우

### 사용자 생성 플로우 (단순화된 구조)

```
1. Controller receives CreateLamsUserDto
2. Business Service maps DTO to parameters
3. Business Service calls Domain Service with parameters
4. Domain Service processes and creates user
5. Business Service maps UserEntity to response format
6. Controller returns response to client
```

### 로그인 플로우 (단순화된 구조)

```
1. Controller receives login credentials
2. Business Service calls Domain Service directly
3. Domain Service validates user and generates token
4. Business Service maps to login response format
5. Controller returns JWT token to client
```

### 토큰 검증 플로우 (단순화된 구조)

```
1. Guard extracts token from request
2. Business Service calls Domain Service for validation
3. Domain Service verifies JWT and returns AuthPayload
4. Business Service returns user information
5. Request proceeds with authenticated user context
```

## 💡 사용 예시

### User Business Service 사용

```typescript
@Injectable()
export class SomeController {
    constructor(
        @Inject('IUserBusinessService')
        private readonly userBusinessService: IUserBusinessService,
    ) {}

    async createUser(dto: CreateLamsUserDto) {
        // 단순한 호출 - Command 객체 없음
        const user = await this.userBusinessService.createLamsUser(dto);
        return { success: true, data: user };
    }

    async getProfile(userId: string) {
        // 직접 파라미터 전달
        const profile = await this.userBusinessService.getUserProfile(userId);
        return { success: true, data: profile };
    }
}
```

### Auth Business Service 사용

```typescript
@Injectable()
export class AuthController {
    constructor(
        @Inject('IAuthBusinessService')
        private readonly authBusinessService: IAuthBusinessService,
    ) {}

    async login(username: string, password: string) {
        // 직접 파라미터 전달 - Command 객체 없음
        const token = await this.authBusinessService.login(username, password);
        return { success: true, accessToken: token };
    }

    async validateToken(token: string) {
        // 단순한 메서드 호출
        const payload = this.authBusinessService.validateToken(token);
        return payload ? { valid: true, user: payload } : { valid: false };
    }
}
```

### Domain Service 직접 사용 (Business Layer에서)

```typescript
@Injectable()
export class UserBusinessService {
    constructor(private readonly userDomainService: UserDomainService) {}

    async createUser(dto: CreateLamsUserDto) {
        // 도메인 서비스 직접 호출 - 간단하고 명확함
        return await this.userDomainService.createLamsUser(dto.username, dto.email, dto.password);
    }

    async findUser(userId: string) {
        // 단순한 파라미터 전달
        return await this.userDomainService.findUserById(userId);
    }
}
```

## 🎯 설계 원칙

### 1. 단순성 (Simplicity)

-   Command/Query 패턴 제거로 복잡성 감소
-   직관적인 메서드 시그니처
-   최소한의 추상화 레이어

### 2. 명확성 (Clarity)

-   메서드명과 파라미터가 의도를 명확히 표현
-   복잡한 객체 구조 없이 직접적인 데이터 전달
-   이해하기 쉬운 코드 구조

### 3. 유지보수성 (Maintainability)

-   적은 파일 수와 간단한 구조
-   디버깅과 테스트가 용이
-   새로운 개발자가 빠르게 이해 가능

### 4. 성능 (Performance)

-   불필요한 객체 생성 최소화
-   직접적인 메서드 호출로 오버헤드 감소
-   메모리 사용량 최적화

## 🔮 향후 확장 계획

### 1. 캐싱 전략

-   Redis를 활용한 사용자 세션 캐싱
-   자주 조회되는 사용자 정보 캐싱

### 2. 이벤트 기반 아키텍처

-   사용자 생성/수정/삭제 이벤트 발행
-   비동기 처리를 통한 성능 최적화

### 3. 감사 로그 (Audit Log)

-   사용자 활동 추적
-   보안 감사를 위한 로그 기록

### 4. 알림 시스템 (Notification)

-   사용자 관련 이벤트 알림
-   실시간 알림 기능 구현

## ⚡ 단순한 DDD vs 복잡한 DDD

### 단순한 DDD (현재 구조)

```typescript
// Business Service
async createUser(dto: CreateUserDto) {
  return await this.domainService.createUser(dto.username, dto.email, dto.password);
}

// Domain Service
async createUser(username: string, email: string, password: string) {
  // 비즈니스 로직 처리
  return await this.repository.create(user);
}
```

### 복잡한 DDD (CQRS 등)

```typescript
// Business Service
async createUser(dto: CreateUserDto) {
  const command = new CreateUserCommand(dto.username, dto.email, dto.password);
  return await this.commandHandler.handle(command);
}

// Command Handler
async handle(command: CreateUserCommand) {
  // 복잡한 처리 로직
  return await this.domainService.createUser(command);
}
```

### 장점 비교

**단순한 DDD:**

-   ✅ 빠른 개발 속도
-   ✅ 낮은 학습 곡선
-   ✅ 적은 코드량
-   ✅ 직관적인 구조

**복잡한 DDD:**

-   ✅ 높은 확장성
-   ✅ 세밀한 제어
-   ✅ 복잡한 비즈니스 로직 처리
-   ❌ 높은 복잡성

---

> **참고**: 이 문서는 단순한 DDD 아키텍처 기반으로 설계된 비즈니스 계층의 구조와 사용법을 설명합니다. Command/Query 패턴을 제거하여 복잡성을 줄이고 개발 생산성을 높였습니다.
