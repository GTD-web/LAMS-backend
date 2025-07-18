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

**역할**: 인증 관련 비즈니스 로직 처리

**주요 메서드**:

#### 인증 관련

-   `login(loginId: string, password: string)`: 사용자 로그인 처리
-   `verifyToken(token: string)`: JWT 토큰 검증
-   `validateUser(email: string, password: string)`: 사용자 검증 (기존 호환성)

#### 프로필 관리

-   `getProfile(token: string, userId: string)`: 사용자 프로필 조회
-   `비밀번호를_변경한다(userId: string, currentPassword: string, newPassword: string)`: 비밀번호 변경

#### 내부 메서드 (한글 네이밍)

-   `사용자는_아이디와_패스워드를_검증한다()`: 로그인 정보 검증
-   `사용자의_활성화_상태를_검증한다()`: 계정 활성화 상태 검증
-   `사용자의_토큰을_제공한다()`: JWT 토큰 생성
-   `사용자의_프로필을_조회한다()`: 프로필 정보 조회

### JwtStrategy

**역할**: Passport JWT 전략 구현

**주요 기능**:

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
    "isIntegrated": false,
    "createdAt": "2025-01-01T00:00:00.000Z",
    "updatedAt": "2025-01-01T00:00:00.000Z"
  }
}
```

### 프로필 응답

```typescript
{
  "userId": "uuid-string",
  "username": "사용자명",
  "email": "user@example.com",
  "roles": ["SYSTEM_USER"],
  "isActive": true,
  "isIntegrated": false,
  "createdAt": "2025-01-01T00:00:00.000Z",
  "updatedAt": "2025-01-01T00:00:00.000Z"
}
```

### 토큰 검증 응답

```typescript
{
  "valid": true,
  "message": "토큰이 유효합니다."
}
```

## 사용 방법

### 1. 모듈 임포트

```typescript
import { AuthBusinessModule } from './business/auth/auth-business.module';

@Module({
    imports: [
        AuthBusinessModule,
        // 기타 모듈들...
    ],
})
export class AppModule {}
```

### 2. 서비스 주입

```typescript
import { AuthBusinessService } from './auth.business';

@Controller('auth')
export class AuthController {
    constructor(private readonly authBusinessService: AuthBusinessService) {}
}
```

### 3. API 호출 예시

```typescript
// 로그인
const loginResult = await this.authBusinessService.login('user@example.com', 'password123');

// 프로필 조회
const profile = await this.authBusinessService.getProfile('Bearer jwt-token', 'user-id');

// 비밀번호 변경
const updatedUser = await this.authBusinessService.비밀번호를_변경한다('user-id', 'current-password', 'new-password');

// 토큰 검증
const isValid = this.authBusinessService.verifyToken('jwt-token');
```

## 보안 고려사항

### 1. 패스워드 보안

-   **해싱**: bcrypt를 사용한 패스워드 해싱
-   **검증**: 평문 패스워드와 해시된 패스워드 비교
-   **정책**: 강력한 패스워드 정책 적용

### 2. JWT 토큰 보안

-   **만료 시간**: 토큰 만료 시간 설정 (기본 7일)
-   **서명**: 강력한 비밀키로 토큰 서명
-   **검증**: 모든 요청에서 토큰 유효성 검증

### 3. 로깅 및 모니터링

-   **성공 로그**: 로그인 성공 이벤트 기록
-   **실패 로그**: 로그인 실패 이벤트 기록
-   **보안 로그**: 의심스러운 활동 감지 및 기록

### 4. 계정 보안

-   **활성화 상태**: 비활성화된 계정 로그인 차단
-   **권한 검증**: 사용자 권한 및 역할 확인
-   **세션 관리**: 토큰 기반 세션 관리

## 에러 처리

### 1. 인증 실패

```typescript
// 잘못된 로그인 정보
throw new UnauthorizedException('잘못된 사용자명 또는 비밀번호입니다.');

// 비활성화된 계정
throw new UnauthorizedException('비활성화된 사용자입니다.');

// 사용자 없음
throw new UnauthorizedException('사용자를 찾을 수 없습니다.');
```

### 2. 토큰 관련 오류

```typescript
// 유효하지 않은 토큰
throw new UnauthorizedException('유효하지 않은 토큰입니다.');

// 만료된 토큰
throw new UnauthorizedException('만료된 토큰입니다.');
```

### 3. 비밀번호 변경 오류

```typescript
// 현재 비밀번호 불일치
throw new BadRequestException('현재 비밀번호가 일치하지 않습니다.');

// 유효하지 않은 새 비밀번호
throw new BadRequestException('유효하지 않은 새 비밀번호입니다.');
```

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

## 설정

### JWT 설정

```typescript
// .env 파일
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRES_IN=7d
```

### 모듈 설정

```typescript
@Module({
    imports: [
        JwtModule.registerAsync({
            useFactory: (configService: ConfigService) => ({
                secret: configService.get('JWT_SECRET'),
                signOptions: { expiresIn: configService.get('JWT_EXPIRES_IN') },
            }),
            inject: [ConfigService],
        }),
    ],
})
export class AuthBusinessModule {}
```

## 테스트

### 단위 테스트

```typescript
describe('AuthBusinessService', () => {
    it('should login successfully with valid credentials', async () => {
        const result = await authService.login('user@example.com', 'password');
        expect(result).toHaveProperty('token');
        expect(result).toHaveProperty('user');
    });

    it('should throw UnauthorizedException for invalid credentials', async () => {
        await expect(authService.login('user@example.com', 'wrong-password')).rejects.toThrow(UnauthorizedException);
    });
});
```

### 통합 테스트

```typescript
describe('Auth Integration', () => {
    it('should complete full authentication flow', async () => {
        // 1. 로그인
        const loginResult = await request(app)
            .post('/auth/login')
            .send({ email: 'user@example.com', password: 'password' });

        // 2. 토큰으로 프로필 조회
        const profileResult = await request(app)
            .get('/auth/profile')
            .set('Authorization', `Bearer ${loginResult.body.token}`);

        expect(profileResult.status).toBe(200);
    });
});
```

## 버전 정보

-   **작성일**: 2025-01-XX
-   **버전**: 1.0.0
-   **작성자**: LAMS 개발팀
-   **최종 수정일**: 2025-01-XX

## 관련 문서

-   [User Business Layer](../user/README.md)
-   [Organization Business Layer](../organization/README.md)
-   [API 문서](../../interfaces/controllers/auth.controller.ts)
-   [보안 가이드라인](../../docs/security-guidelines.md)
