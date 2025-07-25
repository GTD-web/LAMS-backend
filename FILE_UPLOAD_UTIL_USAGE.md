# FileUploadUtil 사용 가이드

## 개요

`FileUploadUtil`은 Supabase Storage를 사용한 파일 업로드 기능을 재사용 가능한 유틸리티로 제공합니다. 이를 통해 프로젝트 전반에서 일관된 파일 업로드 로직을 사용할 수 있습니다.

## 초기화

FileUploadUtil을 사용하기 전에 반드시 초기화해야 합니다:

```typescript
import { FileUploadUtil } from '../common/utils/file-upload.util';
import { ConfigService } from '@nestjs/config';

// 서비스 클래스에서 초기화
@Injectable()
export class YourService implements OnModuleInit {
    constructor(private readonly configService: ConfigService) {}

    onModuleInit() {
        FileUploadUtil.initialize(this.configService);
    }
}
```

## 기본 사용법

### 1. 단일 파일 업로드

```typescript
import { FileUploadUtil } from '../common/utils/file-upload.util';

// 기본 업로드
const result = await FileUploadUtil.uploadSingleFile(file, 'uploads');

// 옵션과 함께 업로드
const result = await FileUploadUtil.uploadSingleFile(file, 'documents', {
    validateFile: true,
    generateUniqueFileName: true,
    metadata: {
        uploadedBy: 'user123',
        category: 'reports',
    },
});

console.log(result);
// {
//     fileId: 'uuid-v4-string',
//     originalName: 'document.pdf',
//     fileName: 'uuid.pdf',
//     fileUrl: 'https://your-project.supabase.co/storage/v1/object/public/bucket/documents/uuid.pdf',
//     fileSize: 1024000,
//     mimeType: 'application/pdf',
//     uploadedAt: Date
// }
```

### 2. 여러 파일 업로드

```typescript
const results = await FileUploadUtil.uploadMultipleFiles(files, 'uploads', {
    validateFiles: true,
    generateUniqueFileNames: true,
    metadata: {
        uploadedBy: 'user123',
        batch: 'batch-001',
    },
});
```

### 3. Excel 파일 전용 업로드

```typescript
// Excel 파일 검증과 함께 업로드
const result = await FileUploadUtil.uploadExcelFile(file, {
    uploadedBy: 'user123',
    processType: 'import',
    year: '2024',
    month: '01',
});
```

### 4. 이미지 파일 전용 업로드

```typescript
// 이미지 파일 검증과 함께 업로드
const result = await FileUploadUtil.uploadImageFile(file, {
    uploadedBy: 'user123',
    category: 'profile-pictures',
    tags: ['avatar', 'user'],
});
```

## 헬퍼 유틸리티 사용법

`FileUploadHelper`를 사용하면 더 편리하게 파일을 업로드할 수 있습니다:

### 1. 파일 타입 자동 감지 업로드

```typescript
import { FileUploadHelper } from '../common/utils/file-upload-helper.util';

// 파일 타입에 따라 자동으로 적절한 메서드 선택
const result = await FileUploadHelper.uploadFileByType(file, {
    uploadedBy: 'user123',
    context: 'document-upload',
});
```

### 2. 여러 파일을 타입별로 분류하여 업로드

```typescript
const results = await FileUploadHelper.uploadFilesByType(files, {
    uploadedBy: 'user123',
    batchId: 'batch-001',
});

// 결과에는 fileType 정보가 포함됩니다
results.forEach((result) => {
    console.log(`${result.originalName}: ${result.fileType}`);
    // document.pdf: document
    // spreadsheet.xlsx: excel
    // photo.jpg: image
});
```

### 3. Excel 파일 일괄 업로드

```typescript
const results = await FileUploadHelper.uploadExcelFiles(excelFiles, {
    uploadedBy: 'user123',
    year: '2024',
    month: '01',
    processType: 'monthly-import',
});
```

## 실제 사용 예제

### Excel Import Process에서 사용

```typescript
@Injectable()
export class ExcelBusinessService implements OnModuleInit {
    constructor(private readonly configService: ConfigService) {}

    onModuleInit() {
        FileUploadUtil.initialize(this.configService);
    }

    async createExcelImportProcess(
        userId: string,
        year: string,
        month: string,
        eventInfoFile?: Express.Multer.File,
        usedAttendanceFile?: Express.Multer.File,
    ) {
        const uploadResults = [];

        if (eventInfoFile) {
            const result = await FileUploadUtil.uploadExcelFile(eventInfoFile, {
                uploadedBy: userId,
                processType: 'event-info',
                year,
                month,
            });
            uploadResults.push(result);
        }

        if (usedAttendanceFile) {
            const result = await FileUploadUtil.uploadExcelFile(usedAttendanceFile, {
                uploadedBy: userId,
                processType: 'used-attendance',
                year,
                month,
            });
            uploadResults.push(result);
        }

        return uploadResults;
    }
}
```

### 컨트롤러에서 사용

```typescript
@Controller('files')
export class FileController implements OnModuleInit {
    constructor(private readonly configService: ConfigService) {}

    onModuleInit() {
        FileUploadUtil.initialize(this.configService);
    }

    @Post('upload')
    @UseInterceptors(FileInterceptor('file'))
    async uploadFile(@UploadedFile() file: Express.Multer.File) {
        // 파일 타입에 따라 자동 업로드
        const result = await FileUploadHelper.uploadFileByType(file, {
            uploadedBy: 'system',
            timestamp: new Date().toISOString(),
        });

        return {
            success: true,
            data: result,
        };
    }

    @Post('upload/multiple')
    @UseInterceptors(FilesInterceptor('files', 10))
    async uploadMultipleFiles(@UploadedFiles() files: Express.Multer.File[]) {
        // 여러 파일을 타입별로 분류하여 업로드
        const results = await FileUploadHelper.uploadFilesByType(files, {
            uploadedBy: 'system',
            batchId: `batch-${Date.now()}`,
        });

        return {
            success: true,
            data: results,
            summary: {
                total: results.length,
                byType: results.reduce((acc, result) => {
                    acc[result.fileType] = (acc[result.fileType] || 0) + 1;
                    return acc;
                }, {} as Record<string, number>),
            },
        };
    }
}
```

## 유틸리티 메서드

### 1. 파일 URL 생성

```typescript
const url = FileUploadUtil.generatePublicUrl('filename.pdf', 'documents');
console.log(url); // https://your-project.supabase.co/storage/v1/object/public/bucket/documents/filename.pdf
```

### 2. 파일 삭제

```typescript
const success = await FileUploadUtil.deleteFile('filename.pdf', 'documents');
console.log(success); // true or false
```

### 3. 파일 존재 확인

```typescript
const exists = await FileUploadUtil.fileExists('filename.pdf', 'documents');
console.log(exists); // true or false
```

### 4. 파일 타입별 폴더 결정

```typescript
const folder = FileUploadUtil.determineFolderByFileType(file);
console.log(folder); // 'excel', 'images', 'documents', 'uploads'
```

## 헬퍼 유틸리티 메서드

### 1. 파일 일괄 삭제

```typescript
const results = await FileUploadHelper.deleteFiles([
    { fileName: 'file1.pdf', folder: 'documents' },
    { fileName: 'file2.xlsx', folder: 'excel' },
    { fileName: 'file3.jpg', folder: 'images' },
]);

results.forEach((result) => {
    console.log(`${result.fileName}: ${result.success ? 'Deleted' : 'Failed'}`);
});
```

### 2. 파일 존재 여부 일괄 확인

```typescript
const results = await FileUploadHelper.checkFilesExist([
    { fileName: 'file1.pdf', folder: 'documents' },
    { fileName: 'file2.xlsx', folder: 'excel' },
]);

results.forEach((result) => {
    console.log(`${result.fileName}: ${result.exists ? 'Exists' : 'Not found'}`);
});
```

### 3. 파일 URL 일괄 생성

```typescript
const urls = FileUploadHelper.generateFileUrls([
    { fileName: 'file1.pdf', folder: 'documents' },
    { fileName: 'file2.xlsx', folder: 'excel' },
]);

urls.forEach(({ fileName, url }) => {
    console.log(`${fileName}: ${url}`);
});
```

## 에러 처리

FileUploadUtil은 적절한 NestJS 예외를 발생시킵니다:

```typescript
try {
    const result = await FileUploadUtil.uploadSingleFile(file, 'uploads');
    return result;
} catch (error) {
    if (error instanceof BadRequestException) {
        // 파일 검증 실패, 업로드 오류 등
        console.error('업로드 실패:', error.message);
    }
    throw error;
}
```

## 설정 옵션

### uploadSingleFile 옵션

```typescript
interface UploadOptions {
    validateFile?: boolean; // 파일 검증 여부 (기본: true)
    generateUniqueFileName?: boolean; // 고유 파일명 생성 여부 (기본: true)
    metadata?: Record<string, any>; // 추가 메타데이터
}
```

### 파일 검증 규칙

-   **최대 파일 크기**: 10MB
-   **허용 파일 타입**:
    -   Excel: `.xlsx`, `.xls`, `.csv`
    -   이미지: `.jpg`, `.jpeg`, `.png`, `.gif`
    -   문서: `.pdf`, `.txt`

## 모범 사례

1. **초기화**: 각 서비스에서 `OnModuleInit`을 구현하여 초기화
2. **메타데이터**: 업로드 시 의미 있는 메타데이터 추가
3. **에러 처리**: 적절한 try-catch 블록으로 에러 처리
4. **파일 타입**: 특정 파일 타입이 필요한 경우 전용 메서드 사용
5. **일괄 처리**: 여러 파일 처리 시 헬퍼 유틸리티 활용

## 주의사항

1. FileUploadUtil은 정적 클래스이므로 초기화 후 전역에서 사용 가능
2. Supabase 설정이 올바르지 않으면 초기화 시 오류 발생
3. 대용량 파일 업로드 시 타임아웃 고려 필요
4. 파일 삭제는 되돌릴 수 없으므로 신중하게 사용
