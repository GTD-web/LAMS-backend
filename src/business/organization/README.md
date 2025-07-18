# Auth Business Layer

## 개요

Auth Business Layer는 LAMS 백엔드 시스템에서 인증(Authentication) 도메인의 비즈니스 로직을 담당하는 계층입니다. 사용자 로그인, JWT 토큰 관리, 프로필 조회, 비밀번호 변경 등의 인증 관련 기능을 제공합니다.

## 폴더 구조

```
src/business/auth/
├── strategies/
│   └── jwt.strategy.ts              # JWT 전략 구현
├── auth.business.ts                 # 인증 비즈니스 서비스
├── auth-business.module.ts          # 인증 비즈니스 모듈
└── README.md                        # 이 문서
```

## 주요 기능

### 1. 사용자 인증 (Authentication)

-   **로그인**: 이메일과 패스워드로 사용자 인증
-   **토큰 생성**: JWT 토큰 생성 및 반환
-   **토큰 검증**: JWT 토큰 유효성 검증
-   **활성화 상태 검증**: 사용자 계정 활성화 상태 확인

### 2. 프로필 관리 (Profile Management)

-   **프로필 조회**: 현재 로그인한 사용자의 프로필 정보 조회
-   **비밀번호 변경**: 현재 비밀번호 검증 후 새 비밀번호로 변경

### 3. 보안 관리 (Security Management)

-   **JWT 전략**: Passport JWT 전략을 통한 토큰 기반 인증
-   **권한 검증**: 사용자 권한 및 역할 검증
-   **보안 로깅**: 인증 관련 보안 이벤트 로깅

## 서비스 계층 구조

### AuthBusinessService

**주요 메서드**:

-   `login(loginId: string, password: string)`: 사용자 로그인 처리
-   `getProfile(token: string, userId: string)`: 사용자 프로필 조회
-   `verifyToken(token: string)`: JWT 토큰 검증
-   `비밀번호를_변경한다()`: 비밀번호 변경
-   `사용자는_아이디와_패스워드를_검증한다()`: 로그인 정보 검증
-   `사용자의_활성화_상태를_검증한다()`: 계정 활성화 상태 검증
-   `사용자의_토큰을_제공한다()`: JWT 토큰 생성

### JwtStrategy

**역할**: Passport JWT 전략 구현

-   JWT 토큰에서 사용자 정보 추출
-   토큰 유효성 검증
-   사용자 존재 여부 확인

## API 응답 구조

### 로그인 응답

```typescript
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "userId": "uuid-string",
    "username": "사용자명",
    "email": "user@example.com",
    "roles": ["SYSTEM_USER"],
    "isActive": true,
    "isIntegrated": false
  }
}
```

## 보안 고려사항

### 1. 패스워드 보안

-   **해싱**: bcrypt를 사용한 패스워드 해싱
-   **검증**: 평문 패스워드와 해시된 패스워드 비교

### 2. JWT 토큰 보안

-   **만료 시간**: 토큰 만료 시간 설정 (기본 7일)
-   **서명**: 강력한 비밀키로 토큰 서명
-   **검증**: 모든 요청에서 토큰 유효성 검증

### 3. 로깅 및 모니터링

-   **성공 로그**: 로그인 성공 이벤트 기록
-   **실패 로그**: 로그인 실패 이벤트 기록
-   **보안 로그**: 의심스러운 활동 감지 및 기록

## 의존성

### 내부 의존성

-   `UserDomainService`: 사용자 도메인 로직
-   `AuthContextService`: 인증 컨텍스트 서비스
-   `JwtService`: JWT 토큰 관리

### 외부 의존성

-   `@nestjs/common`: NestJS 공통 기능
-   `@nestjs/jwt`: JWT 토큰 관리
-   `@nestjs/passport`: Passport 인증 전략
-   `passport-jwt`: JWT 전략 구현
-   `bcrypt`: 패스워드 해싱
