# Organization Business Layer

## 개요

Organization Business Layer는 LAMS 백엔드 시스템에서 조직(Organization) 도메인의 비즈니스 로직을 담당하는 계층입니다. 사용자(User), 부서(Department), 직원(Employee), 그리고 MMS(외부 시스템) 동기화 기능을 통합 관리합니다.

## 폴더 구조

```
src/business/organization/
├── controllers/
│   ├── users.controller.ts           # 사용자 권한 관리 컨트롤러
│   ├── departments.controller.ts     # 부서 관리 컨트롤러
│   ├── employees.controller.ts       # 직원 관리 컨트롤러
│   └── organization.controller.ts    # 조직도 전체 관리 및 MMS 동기화 컨트롤러
├── services/
│   ├── organization-management.service.ts  # 조직 관리 서비스
│   ├── organization-query.service.ts       # 조직 조회 서비스
│   └── organization-sync.service.ts        # MMS 동기화 서비스
├── organization-business.module.ts    # 비즈니스 모듈 정의
└── README.md                         # 이 문서
```

## 주요 기능

### 1. 사용자 관리 (Users)

-   **조회**: 사용자 목록 조회, 개별 사용자 조회
-   **수정**: 사용자 정보 수정, 권한 변경
-   **특이사항**: 사용자 생성/삭제는 지원하지 않음 (기존 시스템에서 관리)

### 2. 부서 관리 (Departments)

-   **조회**: 부서 목록 조회, 개별 부서 조회, 부서 계층 구조 조회
-   **상태 관리**: 부서 제외 상태(isExclude) 토글
-   **특이사항**: 부서 생성/삭제는 MMS 동기화를 통해서만 가능

### 3. 직원 관리 (Employees)

-   **조회**: 직원 목록 조회, 개별 직원 조회
-   **상태 관리**: 직원 계산 제외 상태(isExcludedFromCalculation) 토글
-   **특이사항**: 직원 생성/삭제는 MMS 동기화를 통해서만 가능

### 4. 조직도 관리 (Organization)

-   **전체 조회**: 조직도 전체 구조 조회
-   **MMS 동기화**: 외부 시스템(MMS)과의 부서/직원 데이터 동기화

## 서비스 계층 구조

### OrganizationManagementService

-   **역할**: 조직 관리 관련 비즈니스 로직 처리
-   **주요 메서드**:
    -   `toggleDepartmentExclude()`: 부서 제외 상태 토글
    -   `toggleEmployeeExclude()`: 직원 계산 제외 상태 토글

### OrganizationQueryService

-   **역할**: 조직 조회 관련 비즈니스 로직 처리
-   **주요 메서드**:
    -   `getUsers()`: 사용자 목록 조회
    -   `getDepartments()`: 부서 목록 조회
    -   `getEmployees()`: 직원 목록 조회
    -   `getOrganizationChart()`: 조직도 전체 조회

### OrganizationSyncService

-   **역할**: MMS 외부 시스템과의 동기화 처리
-   **주요 메서드**:
    -   `syncWithMMS()`: MMS 시스템과 전체 동기화
    -   `getDepartmentImportData()`: 부서 가져오기 데이터 조회
    -   `getEmployeeImportData()`: 직원 가져오기 데이터 조회

## API 응답 구조

### 표준 응답 형식

```typescript
{
  "success": boolean,
  "data": any,
  "message": string,
  "timestamp": string
}
```

### 페이지네이션 응답 형식

```typescript
{
  "success": true,
  "data": {
    "items": [...],
    "total": number,
    "page": number,
    "limit": number,
    "totalPages": number
  },
  "message": "success",
  "timestamp": "2025-01-XX..."
}
```

### 에러 응답 형식

```typescript
{
  "success": false,
  "data": null,
  "message": "에러 메시지",
  "timestamp": "2025-01-XX...",
  "error": {
    "code": "ERROR_CODE",
    "details": "상세 에러 정보"
  }
}
```

## 사용 방법

### 1. 모듈 임포트

```typescript
import { OrganizationBusinessModule } from './business/organization/organization-business.module';

@Module({
    imports: [
        OrganizationBusinessModule,
        // 기타 모듈들...
    ],
})
export class AppModule {}
```

### 2. 서비스 주입

```typescript
import { OrganizationQueryService } from './services/organization-query.service';

@Controller('example')
export class ExampleController {
    constructor(private readonly organizationQueryService: OrganizationQueryService) {}
}
```

### 3. API 호출 예시

```typescript
// 사용자 목록 조회
const users = await this.organizationQueryService.getUsers({
    page: 1,
    limit: 10,
});

// 부서 제외 상태 토글
await this.organizationManagementService.toggleDepartmentExclude(departmentId);

// MMS 동기화
await this.organizationSyncService.syncWithMMS();
```

## 특이사항 및 주의사항

### 1. 데이터 생성/삭제 제한

-   **부서**: MMS 동기화를 통해서만 생성/삭제 가능
-   **직원**: MMS 동기화를 통해서만 생성/삭제 가능
-   **사용자**: 기존 시스템에서 관리, 정보 수정만 가능

### 2. 상태 관리

-   **부서**: `isExclude` 필드로 제외 상태 관리
-   **직원**: `isExcludedFromCalculation` 필드로 계산 제외 상태 관리
-   **사용자**: `isActive` 필드로 활성화 상태 관리

### 3. 권한 관리

-   각 컨트롤러에는 적절한 권한 검증 가드가 적용되어 있음
-   사용자 권한 변경은 관리자 권한이 필요

### 4. 외부 시스템 연동

-   MMS 시스템과의 동기화는 전체 동기화만 지원
-   부분 동기화는 지원하지 않음
-   동기화 실패 시 롤백 처리

### 5. 에러 처리

-   모든 외부 시스템 연동에는 try-catch 적용
-   단순 DB 조회/저장에는 try-catch 생략
-   의미 있는 에러 메시지 제공

### 6. 성능 최적화

-   페이지네이션 지원으로 대용량 데이터 처리
-   필요한 경우에만 관계 데이터 로드
-   캐싱 적용 고려사항 포함

## 의존성

### 내부 의존성

-   `OrganizationContextService`: 도메인 로직 처리
-   `UserDomainService`: 사용자 도메인 로직
-   `DepartmentDomainService`: 부서 도메인 로직
-   `EmployeeDomainService`: 직원 도메인 로직

### 외부 의존성

-   `@nestjs/common`: NestJS 공통 기능
-   `@nestjs/swagger`: API 문서화
-   `class-validator`: 데이터 검증
-   `class-transformer`: 데이터 변환

## 버전 정보

-   **작성일**: 2025-01-XX
-   **버전**: 1.0.0
-   **작성자**: LAMS 개발팀
-   **최종 수정일**: 2025-01-XX
