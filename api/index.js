const { NestFactory } = require('@nestjs/core');
const { ValidationPipe } = require('@nestjs/common');
const { Reflector } = require('@nestjs/core');
const path = require('path');
const fs = require('fs');

// 전역 변수로 모듈들 저장
let AppModule;
let GlobalExceptionFilter;
let JwtAuthGuard;
let RolesGuard;
let ResponseInterceptor;
let settingSwagger;

// 디버깅을 위한 로깅 함수
function debugLog(message, data = null) {
    console.log(`🐛 [DEBUG] ${message}`, data ? JSON.stringify(data, null, 2) : '');
}

// 파일 존재 확인 함수
function checkFileExists(filePath) {
    try {
        return fs.existsSync(filePath);
    } catch (error) {
        debugLog(`Error checking file existence: ${filePath}`, error.message);
        return false;
    }
}

// 디렉토리 내용 확인 함수
function listDirectory(dirPath) {
    try {
        if (fs.existsSync(dirPath)) {
            const files = fs.readdirSync(dirPath);
            debugLog(`Directory contents of ${dirPath}:`, files);
            return files;
        } else {
            debugLog(`Directory does not exist: ${dirPath}`);
            return [];
        }
    } catch (error) {
        debugLog(`Error reading directory ${dirPath}:`, error.message);
        return [];
    }
}

// 모듈 로딩 함수
async function loadModules() {
    debugLog('Starting module loading process...');

    // 환경 정보 출력
    debugLog('Environment info:', {
        NODE_ENV: process.env.NODE_ENV,
        VERCEL: process.env.VERCEL,
        PWD: process.env.PWD,
        cwd: process.cwd(),
        __dirname: __dirname,
        'process.argv': process.argv,
    });

    // 가능한 기본 경로들
    const possibleBasePaths = [
        process.cwd(),
        path.join(process.cwd(), '..'),
        '/var/task',
        __dirname,
        path.join(__dirname, '..'),
    ];

    debugLog('Checking possible base paths:', possibleBasePaths);

    let distPath = null;
    let basePath = null;

    // dist 폴더를 찾기
    for (const testPath of possibleBasePaths) {
        const testDistPath = path.join(testPath, 'dist');
        debugLog(`Checking dist path: ${testDistPath}`);

        if (checkFileExists(testDistPath)) {
            debugLog(`Found dist directory at: ${testDistPath}`);
            listDirectory(testDistPath);

            // app.module.js 파일 확인
            const appModulePath = path.join(testDistPath, 'app.module.js');
            if (checkFileExists(appModulePath)) {
                debugLog(`Found app.module.js at: ${appModulePath}`);
                distPath = testDistPath;
                basePath = testPath;
                break;
            }
        }
    }

    if (!distPath) {
        debugLog('❌ Could not find dist directory with app.module.js');

        // 루트 디렉토리 내용 확인
        debugLog('Root directory contents:');
        listDirectory(process.cwd());

        throw new Error('Could not locate dist directory with compiled NestJS application');
    }

    debugLog(`✅ Using dist path: ${distPath}`);

    // 모듈 로딩 시도
    const modulesToLoad = [
        { name: 'AppModule', path: path.join(distPath, 'app.module.js'), property: 'AppModule' },
        {
            name: 'GlobalExceptionFilter',
            path: path.join(distPath, 'common/filters/global-exception.filter.js'),
            property: 'GlobalExceptionFilter',
        },
        {
            name: 'JwtAuthGuard',
            path: path.join(distPath, 'common/guards/jwt-auth.guard.js'),
            property: 'JwtAuthGuard',
        },
        { name: 'RolesGuard', path: path.join(distPath, 'common/guards/roles.guard.js'), property: 'RolesGuard' },
        {
            name: 'ResponseInterceptor',
            path: path.join(distPath, 'common/interceptors/response.interceptor.js'),
            property: 'ResponseInterceptor',
        },
        {
            name: 'settingSwagger',
            path: path.join(distPath, 'common/utils/swagger/swagger.util.js'),
            property: 'settingSwagger',
        },
    ];

    const loadedModules = {};

    for (const moduleInfo of modulesToLoad) {
        try {
            debugLog(`Loading module: ${moduleInfo.name} from ${moduleInfo.path}`);

            if (!checkFileExists(moduleInfo.path)) {
                debugLog(`❌ Module file not found: ${moduleInfo.path}`);
                // 디렉토리 내용 확인
                const dir = path.dirname(moduleInfo.path);
                listDirectory(dir);
                throw new Error(`Module file not found: ${moduleInfo.path}`);
            }

            const moduleExports = require(moduleInfo.path);
            debugLog(`Module exports for ${moduleInfo.name}:`, Object.keys(moduleExports));

            if (moduleInfo.property && moduleExports[moduleInfo.property]) {
                loadedModules[moduleInfo.name] = moduleExports[moduleInfo.property];
                debugLog(`✅ Successfully loaded ${moduleInfo.name}.${moduleInfo.property}`);
            } else if (moduleExports.default) {
                loadedModules[moduleInfo.name] = moduleExports.default;
                debugLog(`✅ Successfully loaded ${moduleInfo.name} (default export)`);
            } else {
                // 첫 번째 export 사용
                const firstKey = Object.keys(moduleExports)[0];
                if (firstKey) {
                    loadedModules[moduleInfo.name] = moduleExports[firstKey];
                    debugLog(`✅ Successfully loaded ${moduleInfo.name} (first export: ${firstKey})`);
                } else {
                    throw new Error(`No valid exports found in ${moduleInfo.name}`);
                }
            }
        } catch (error) {
            debugLog(`❌ Failed to load ${moduleInfo.name}:`, error.message);

            // 필수 모듈인 경우 에러 throw
            if (moduleInfo.name === 'AppModule') {
                throw error;
            }

            // 선택적 모듈인 경우 null로 설정
            loadedModules[moduleInfo.name] = null;
        }
    }

    // 전역 변수에 할당
    AppModule = loadedModules.AppModule;
    GlobalExceptionFilter = loadedModules.GlobalExceptionFilter;
    JwtAuthGuard = loadedModules.JwtAuthGuard;
    RolesGuard = loadedModules.RolesGuard;
    ResponseInterceptor = loadedModules.ResponseInterceptor;
    settingSwagger = loadedModules.settingSwagger;

    debugLog('✅ Module loading completed');
}

let app;

async function bootstrap() {
    if (!app) {
        try {
            debugLog('Starting NestJS application bootstrap...');

            await loadModules();

            if (!AppModule) {
                throw new Error('AppModule could not be loaded');
            }

            debugLog('Creating NestJS application...');
            app = await NestFactory.create(AppModule);

            // Global interceptors and filters (선택적 적용)
            if (ResponseInterceptor) {
                app.useGlobalInterceptors(new ResponseInterceptor());
                debugLog('✅ ResponseInterceptor applied');
            }

            if (GlobalExceptionFilter) {
                app.useGlobalFilters(new GlobalExceptionFilter());
                debugLog('✅ GlobalExceptionFilter applied');
            }

            if (JwtAuthGuard && RolesGuard) {
                const reflector = app.get(Reflector);
                app.useGlobalGuards(new JwtAuthGuard(reflector), new RolesGuard(reflector));
                debugLog('✅ Guards applied');
            }

            // Global prefix and validation
            app.setGlobalPrefix('api');
            app.useGlobalPipes(
                new ValidationPipe({
                    whitelist: true,
                    forbidNonWhitelisted: true,
                    transform: true,
                }),
            );

            // CORS configuration
            app.enableCors({
                origin: process.env.ALLOWED_ORIGINS?.split(',') || ['*'],
                credentials: true,
            });

            // Swagger setup (only in development)
            if (process.env.NODE_ENV !== 'production' && settingSwagger) {
                try {
                    await settingSwagger(app);
                    debugLog('✅ Swagger configured');
                } catch (swaggerError) {
                    debugLog('⚠️ Swagger setup failed:', swaggerError.message);
                }
            }

            await app.init();
            debugLog('✅ NestJS application initialized successfully');
        } catch (error) {
            debugLog('❌ Failed to initialize NestJS app:', error.message);
            debugLog('Stack trace:', error.stack);
            throw error;
        }
    }
    return app;
}

module.exports = async (req, res) => {
    try {
        debugLog(`📨 Incoming request: ${req.method} ${req.url}`);

        const server = await bootstrap();
        const httpAdapter = server.getHttpAdapter();
        const instance = httpAdapter.getInstance();

        return instance(req, res);
    } catch (error) {
        debugLog('❌ Error in serverless function:', error.message);
        debugLog('Stack trace:', error.stack);

        // 응답 헤더가 이미 전송되었는지 확인
        if (!res.headersSent) {
            res.status(500).json({
                error: 'Internal Server Error',
                message: error.message,
                timestamp: new Date().toISOString(),
                stack: process.env.NODE_ENV !== 'production' ? error.stack : undefined,
            });
        }
    }
};
