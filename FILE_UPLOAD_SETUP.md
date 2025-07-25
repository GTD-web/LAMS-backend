# 파일 업로드 (Supabase Storage) 설정 가이드

## 1. 환경 변수 설정

`.env` 파일에 다음 Supabase 관련 환경 변수를 추가하세요:

```env
# Supabase Configuration
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
S3_BUCKET_NAME=your-bucket-name
S3_ENDPOINT=https://your-project.supabase.co/storage/v1
```

## 2. Supabase Storage 설정

### 2.1 Supabase 프로젝트 생성

1. [Supabase](https://supabase.com) 콘솔에 접속
2. 새 프로젝트 생성
3. 프로젝트 URL과 API 키 확인

### 2.2 Storage 버킷 생성

1. Supabase 대시보드에서 Storage 메뉴로 이동
2. 새 버킷 생성 (예: `lams-bucket`)
3. 버킷 설정:
    - Public bucket: true (공개 접근 허용)
    - File size limit: 10MB
    - Allowed MIME types: 필요에 따라 설정

### 2.3 RLS (Row Level Security) 정책 설정

Storage 버킷에 대한 접근 정책을 설정합니다:

```sql
-- 인증된 사용자만 업로드 허용
CREATE POLICY "Allow authenticated uploads" ON storage.objects
FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- 모든 사용자가 파일 읽기 허용 (public bucket인 경우)
CREATE POLICY "Allow public downloads" ON storage.objects
FOR SELECT USING (bucket_id = 'lams-bucket');

-- 인증된 사용자만 파일 삭제 허용
CREATE POLICY "Allow authenticated deletes" ON storage.objects
FOR DELETE USING (auth.role() = 'authenticated');
```

### 2.4 API 키 확인

1. Settings > API 메뉴로 이동
2. 다음 키들을 `.env`에 추가:
    - `anon key`: 클라이언트용 (현재 미사용)
    - `service_role key`: 서버용 (중요: 비밀 유지 필요)

## 3. API 엔드포인트

### 3.1 단일 파일 업로드

```http
POST /api/v1/files/upload
Content-Type: multipart/form-data
Authorization: Bearer {jwt-token}

Body:
- file: (binary)
- folder: (optional) 저장할 폴더명
```

### 3.2 다중 파일 업로드

```http
POST /api/v1/files/upload/multiple
Content-Type: multipart/form-data
Authorization: Bearer {jwt-token}

Body:
- files: (binary array, 최대 10개)
- folder: (optional) 저장할 폴더명
```

### 3.3 엑셀 파일 업로드

```http
POST /api/v1/files/upload/excel
Content-Type: multipart/form-data
Authorization: Bearer {jwt-token}

Body:
- file: (binary, .xlsx/.xls/.csv만 허용)
```

### 3.4 이미지 파일 업로드

```http
POST /api/v1/files/upload/image
Content-Type: multipart/form-data
Authorization: Bearer {jwt-token}

Body:
- file: (binary, 이미지 파일만 허용)
```

### 3.5 문서 파일 업로드

```http
POST /api/v1/files/upload/document
Content-Type: multipart/form-data
Authorization: Bearer {jwt-token}

Body:
- file: (binary, PDF/텍스트 파일)
```

### 3.6 파일 URL 생성

```http
GET /api/v1/files/url/{fileName}?folder=excel
Authorization: Bearer {jwt-token}
```

## 4. 파일 저장 구조

```
Supabase Storage Bucket/
├── excel/          # 엑셀 파일 (.xlsx, .xls, .csv)
├── images/         # 이미지 파일 (.jpg, .png, .gif)
├── documents/      # 문서 파일 (.pdf, .txt)
└── uploads/        # 기타 파일
```

## 5. 파일 제한사항

-   **최대 파일 크기**: 10MB
-   **다중 업로드 제한**: 최대 10개 파일
-   **허용 파일 타입**:
    -   Excel: `.xlsx`, `.xls`, `.csv`
    -   이미지: `.jpg`, `.jpeg`, `.png`, `.gif`
    -   문서: `.pdf`, `.txt`

## 6. 응답 형식

### 성공 응답 예시

```json
{
    "fileId": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
    "originalName": "attendance_report.xlsx",
    "fileName": "f47ac10b-58cc-4372-a567-0e02b2c3d479.xlsx",
    "fileUrl": "https://your-project.supabase.co/storage/v1/object/public/lams-bucket/excel/f47ac10b-58cc-4372-a567-0e02b2c3d479.xlsx",
    "fileSize": 1024000,
    "mimeType": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "uploadedAt": "2024-01-01T00:00:00Z",
    "message": "파일 업로드가 성공적으로 완료되었습니다."
}
```

### 에러 응답 예시

```json
{
    "statusCode": 400,
    "message": "파일 크기는 10MB를 초과할 수 없습니다.",
    "timestamp": "2024-01-01T00:00:00Z",
    "path": "/api/v1/files/upload"
}
```

## 7. 테스트 방법

### cURL 예시

```bash
# 단일 파일 업로드
curl -X POST \
  http://localhost:3000/api/v1/files/upload \
  -H 'Authorization: Bearer YOUR_JWT_TOKEN' \
  -F 'file=@/path/to/your/file.xlsx' \
  -F 'folder=excel'

# 다중 파일 업로드
curl -X POST \
  http://localhost:3000/api/v1/files/upload/multiple \
  -H 'Authorization: Bearer YOUR_JWT_TOKEN' \
  -F 'files=@/path/to/file1.xlsx' \
  -F 'files=@/path/to/file2.pdf' \
  -F 'folder=documents'
```

## 8. Swagger 문서

서버 실행 후 `http://localhost:3000/api/docs`에서 상세한 API 문서를 확인할 수 있습니다.

## 9. 보안 주의사항

1. **환경 변수 보안**: `.env` 파일을 절대 git에 커밋하지 마세요
2. **Service Role Key 보안**: Service Role Key는 서버에서만 사용하고 클라이언트에 노출하지 마세요
3. **JWT 토큰**: 모든 파일 업로드 API는 인증이 필요합니다
4. **RLS 정책**: Supabase Storage에 적절한 Row Level Security 정책을 설정하세요
5. **파일 검증**: 업로드되는 파일의 타입과 크기가 자동으로 검증됩니다

## 10. Supabase Storage 장점

-   **무료 티어**: 1GB 스토리지 무료 제공
-   **CDN**: 전 세계 CDN을 통한 빠른 파일 서빙
-   **자동 최적화**: 이미지 자동 최적화 및 변환
-   **실시간 업데이트**: 파일 변경 시 실시간 알림
-   **통합 관리**: 데이터베이스와 함께 통합 관리

## 11. 문제 해결

### 일반적인 오류

-   **403 Forbidden**: RLS 정책 또는 API 키 확인
-   **404 Not Found**: 버킷명 또는 파일 경로 확인
-   **413 Payload Too Large**: 파일 크기 제한 확인
-   **415 Unsupported Media Type**: 허용되지 않는 파일 타입
-   **Storage quota exceeded**: Supabase 스토리지 용량 확인

### 로그 확인

파일 업로드 과정의 상세 로그는 콘솔에서 확인할 수 있습니다.

### Supabase 대시보드

Supabase 대시보드에서 실시간으로 파일 업로드 상태와 스토리지 사용량을 모니터링할 수 있습니다.
