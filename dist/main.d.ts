import { NestExpressApplication } from '@nestjs/platform-express';
declare function bootstrap(): Promise<NestExpressApplication<import("http").Server<typeof import("http").IncomingMessage, typeof import("http").ServerResponse>>>;
export default bootstrap;
