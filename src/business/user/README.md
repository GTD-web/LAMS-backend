# User Business Layer

## 개요

User Business Layer는 LAMS 백엔드 시스템에서 사용자(User) 도메인의 비즈니스 로직을 담당하는 계층입니다. 사용자 관리, 검색, 부서 권한 관리 등의 기능을 제공합니다.

## 폴더 구조

```
src/business/user/
├── user.business.ts                 # 사용자 비즈니스 서비스
├── user-business.module.ts          # 사용자 비즈니스 모듈
└── README.md                        # 이 문서
```

## 주요 기능

### 1. 사용자 조회 (User Query)

-   **목록 조회**: 페이지네이션된 사용자 목록 조회
-   **검색**: 다양한 조건으로 사용자 검색
-   **프로필 조회**: 개별 사용자 프로필 정보 조회

### 2. 사용자 검색 (User Search)

-   **통합 검색**: 이름, 이메일, 로그인 ID 통합 검색
-   **조건 검색**: 사용자 ID, 이메일, 이름, 로그인 ID별 개별 검색
-   **키워드 검색**: 키워드를 통한 전체 필드 검색

### 3. 부서 권한 관리 (Department Authority)

-   **접근 권한**: 부서 접근 권한 추가/삭제
-   **검토 권한**: 부서 검토 권한 추가/삭제
-   **권한 통합 관리**: 복합적인 권한 관리 로직

## 서비스 계층 구조

### UserBusinessService

**역할**: 사용자 관련 비즈니스 로직 처리

**주요 메서드**:

#### 사용자 조회

-   `getUserList(paginationQuery: PaginationQueryDto)`: 사용자 목록 조회
-   `searchUsers(searchDto: SearchUserDto, paginationQuery: PaginationQueryDto)`: 사용자 검색
-   `getUserProfile(userId: string)`: 사용자 프로필 조회
-   `getProfile(userId: string)`: 프로필 조회 (내부용)

#### 부서 권한 관리

-   `addUserReviewPermission(departmentId: string, userId: string)`: 검토 권한 추가
-   `removeUserReviewPermission(departmentId: string, userId: string)`: 검토 권한 삭제
-   `addUserApprovalPermission(departmentId: string, userId: string)`: 접근 권한 추가
-   `removeUserApprovalPermission(departmentId: string, userId: string)`: 접근 권한 삭제
-   `manageDepartmentAuthority()`: 부서 권한 통합 관리

## API 응답 구조

### 사용자 목록 응답

```typescript
{
  "success": true,
  "data": {
    "items": [
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
    ],
    "total": 100,
    "page": 1,
    "limit": 10,
    "totalPages": 10
  },
  "message": "사용자 목록이 성공적으로 조회되었습니다.",
  "timestamp": "2025-01-XX..."
}
```

### 사용자 검색 응답

```typescript
{
  "success": true,
  "data": {
    "items": [...],
    "total": 5,
    "page": 1,
    "limit": 10,
    "totalPages": 1
  },
  "message": "사용자 검색이 완료되었습니다.",
  "timestamp": "2025-01-XX..."
}
```

### 권한 관리 응답

```typescript
{
  "success": true,
  "data": {
    "userId": "uuid-string",
    "username": "사용자명",
    "accessableDepartments": [...],
    "reviewableDepartments": [...]
  },
  "message": "부서 권한이 성공적으로 업데이트되었습니다.",
  "timestamp": "2025-01-XX..."
}
```

## 검색 기능 상세

### 1. 검색 조건

-   **userId**: 사용자 ID로 검색
-   **email**: 이메일로 부분 검색
-   **name**: 사용자명으로 부분 검색
-   **loginId**: 로그인 ID로 부분 검색
-   **keyword**: 통합 검색 (이름, 이메일, 로그인 ID)

### 2. 검색 예시

```typescript
// 이메일로 검색
const result = await userBusinessService.searchUsers({ email: 'john' }, { page: 1, limit: 10 });

// 키워드로 통합 검색
const result = await userBusinessService.searchUsers({ keyword: 'john' }, { page: 1, limit: 10 });

// 사용자명으로 검색
const result = await userBusinessService.searchUsers({ name: '홍길동' }, { page: 1, limit: 10 });
```

## 권한 관리 상세

### 1. 권한 타입

-   **access**: 접근 권한 (부서 데이터 접근)
-   **review**: 검토 권한 (부서 데이터 검토)

### 2. 권한 작업

-   **add**: 권한 추가
-   **delete**: 권한 삭제

### 3. 권한 관리 예시

```typescript
// 접근 권한 추가
await userBusinessService.manageDepartmentAuthority('department-id', 'user-id', 'access', 'add');

// 검토 권한 삭제
await userBusinessService.manageDepartmentAuthority('department-id', 'user-id', 'review', 'delete');

// 개별 권한 관리
await userBusinessService.addUserReviewPermission('department-id', 'user-id');
await userBusinessService.removeUserApprovalPermission('department-id', 'user-id');
```

## 사용 방법

### 1. 모듈 임포트

```typescript
import { UserBusinessModule } from './business/user/user-business.module';

@Module({
    imports: [
        UserBusinessModule,
        // 기타 모듈들...
    ],
})
export class AppModule {}
```

### 2. 서비스 주입

```typescript
import { UserBusinessService } from './user.business';

@Controller('users')
export class UsersController {
    constructor(private readonly userBusinessService: UserBusinessService) {}
}
```

### 3. API 호출 예시

```typescript
// 사용자 목록 조회
const users = await this.userBusinessService.getUserList({
    page: 1,
    limit: 10,
});

// 사용자 검색
const searchResult = await this.userBusinessService.searchUsers({ keyword: 'john' }, { page: 1, limit: 10 });

// 사용자 프로필 조회
const profile = await this.userBusinessService.getUserProfile('user-id');

// 부서 권한 관리
const result = await this.userBusinessService.manageDepartmentAuthority('department-id', 'user-id', 'access', 'add');
```

## 에러 처리

### 1. 입력 검증 오류

```typescript
// 필수 값 누락
throw new Error('사용자 ID가 필요합니다.');
throw new Error('부서 ID와 사용자 ID가 필요합니다.');

// 페이지네이션 오류
throw new Error('페이지 정보가 필요합니다.');
```

### 2. 권한 관리 오류

```typescript
// 권한 관리 실패
throw new Error('부서 권한 관리 중 오류가 발생했습니다.');
```

### 3. 검색 관련 오류

```typescript
// 검색 조건 오류
throw new BadRequestException('유효하지 않은 검색 조건입니다.');

// 검색 결과 없음
throw new NotFoundException('검색 결과가 없습니다.');
```

## 특이사항 및 주의사항

### 1. 권한 관리 복잡성

-   부서 권한 관리는 복잡한 비즈니스 로직이므로 try-catch 적용
-   권한 변경 시 관련 데이터 일관성 유지 필요
-   권한 추가/삭제 시 중복 검사 필요

### 2. 검색 성능

-   대용량 데이터에서의 검색 성능 최적화
-   적절한 인덱스 사용 권장
-   키워드 검색 시 LIKE 쿼리 성능 고려

### 3. 페이지네이션

-   모든 목록 조회에서 페이지네이션 필수
-   적절한 페이지 크기 설정 필요 (기본 10개)
-   대용량 데이터 처리 시 성능 고려

### 4. 데이터 무결성

-   사용자 권한 변경 시 관련 부서 데이터 일관성 유지
-   권한 삭제 시 해당 사용자의 기존 작업 영향 고려
-   트랜잭션 처리로 데이터 일관성 보장

## 성능 최적화

### 1. 데이터베이스 최적화

-   검색 필드에 적절한 인덱스 설정
-   페이지네이션 쿼리 최적화
-   N+1 문제 방지를 위한 관계 데이터 로딩 최적화

### 2. 캐싱 전략

-   자주 조회되는 사용자 정보 캐싱
-   권한 정보 캐싱으로 성능 향상
-   캐시 무효화 전략 수립

### 3. 검색 최적화

-   전문 검색 엔진 사용 고려 (Elasticsearch 등)
-   검색 인덱스 최적화
-   검색 결과 캐싱

## 의존성

### 내부 의존성

-   `UserContextService`: 사용자 컨텍스트 서비스
-   `AuthContextService`: 인증 컨텍스트 서비스
-   `SuccessMessageHelper`: 성공 메시지 헬퍼
-   `UserDomainService`: 사용자 도메인 서비스

### 외부 의존성

-   `@nestjs/common`: NestJS 공통 기능
-   `@nestjs/typeorm`: TypeORM 통합
-   `class-transformer`: 데이터 변환
-   `class-validator`: 데이터 검증

## 테스트

### 단위 테스트

```typescript
describe('UserBusinessService', () => {
    it('should get user list with pagination', async () => {
        const result = await userService.getUserList({ page: 1, limit: 10 });
        expect(result.success).toBe(true);
        expect(result.data.items).toBeDefined();
        expect(result.data.meta).toBeDefined();
    });

    it('should search users by keyword', async () => {
        const result = await userService.searchUsers({ keyword: 'john' }, { page: 1, limit: 10 });
        expect(result.success).toBe(true);
        expect(result.data.items.length).toBeGreaterThan(0);
    });

    it('should manage department authority', async () => {
        const result = await userService.manageDepartmentAuthority('dept-id', 'user-id', 'access', 'add');
        expect(result.success).toBe(true);
    });
});
```

### 통합 테스트

```typescript
describe('User Integration', () => {
    it('should complete user search and profile retrieval flow', async () => {
        // 1. 사용자 검색
        const searchResult = await request(app).get('/users/search').query({ keyword: 'john', page: 1, limit: 10 });

        // 2. 검색된 사용자의 프로필 조회
        const userId = searchResult.body.data.items[0].userId;
        const profileResult = await request(app).get(`/users/${userId}`);

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

-   [Auth Business Layer](../auth/README.md)
-   [Organization Business Layer](../organization/README.md)
-   [API 문서](../../interfaces/controllers/users.controller.ts)
-   [사용자 도메인 문서](../../domain/user/README.md)
