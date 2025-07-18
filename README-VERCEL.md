# Vercel 배포 가이드

## 배포 전 준비사항

### 1. 환경 변수 설정

Vercel 대시보드에서 다음 환경 변수들을 설정해야 합니다:

```bash
# Database Configuration
DATABASE_HOST=your-database-host
DATABASE_PORT=5432
DATABASE_USERNAME=your-db-username
DATABASE_PASSWORD=your-db-password
DATABASE_NAME=your-db-name

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRES_IN=7d

# Application Configuration
NODE_ENV=production

# CORS Configuration
ALLOWED_ORIGINS=https://your-frontend-domain.vercel.app

# Vercel Environment
VERCEL=1
```

### 2. 데이터베이스 설정

-   PostgreSQL 데이터베이스가 필요합니다
-   추천: Supabase, Railway, PlanetScale 등의 서비스 사용

### 3. 파일 구조

```
├── api/
│   └── index.js          # Vercel serverless function
├── dist/                 # 빌드된 파일들
├── src/                  # 소스 코드
├── vercel.json           # Vercel 설정
├── .vercelignore         # 배포 제외 파일
└── package.json
```

## 배포 단계

### 1. Vercel CLI 설치

```bash
npm install -g vercel
```

### 2. 프로젝트 빌드

```bash
npm run build
```

### 3. Vercel 로그인

```bash
vercel login
```

### 4. 배포

```bash
vercel --prod
```

## 주의사항

1. **Serverless 제한사항**:

    - 함수 실행 시간 제한: 30초
    - 메모리 제한: 1GB
    - 파일 크기 제한: 50MB

2. **데이터베이스 연결**:

    - Connection pooling 사용 권장
    - 연결 수 제한 고려

3. **파일 업로드**:

    - 파일 업로드 기능이 있다면 별도 스토리지 서비스 사용 (AWS S3, Cloudinary 등)

4. **로그**:
    - Vercel 함수 로그는 대시보드에서 확인 가능

## 트러블슈팅

### 빌드 실패 시

```bash
# 로컬에서 빌드 테스트
npm run build

# 의존성 확인
npm install
```

### 환경 변수 문제

-   Vercel 대시보드에서 환경 변수 재확인
-   재배포 필요할 수 있음

### 데이터베이스 연결 실패

-   데이터베이스 호스트 주소 확인
-   방화벽 설정 확인
-   SSL 연결 설정 확인

## 추가 최적화

### 1. 캐싱 설정

```json
{
    "headers": [
        {
            "source": "/api/(.*)",
            "headers": [
                {
                    "key": "Cache-Control",
                    "value": "s-maxage=1, stale-while-revalidate"
                }
            ]
        }
    ]
}
```

### 2. 지역 설정

```json
{
    "regions": ["icn1", "sin1"]
}
```

### 3. 함수 설정

```json
{
    "functions": {
        "api/index.js": {
            "maxDuration": 30,
            "memory": 1024
        }
    }
}
```
