import { ApiProperty } from '@nestjs/swagger';

/**
 * 커스텀 응답 DTO
 * - 일관된 API 응답 형태를 제공
 */
export class CustomResponse<T = any> {
    @ApiProperty({
        description: '성공 여부',
        example: true,
    })
    result: boolean;

    @ApiProperty({
        description: '응답 데이터',
    })
    data: T;

    @ApiProperty({
        description: '메시지',
        example: '성공적으로 처리되었습니다.',
    })
    message: string;

    @ApiProperty({
        description: '타임스탬프',
        example: '2023-12-01T10:00:00Z',
    })
    timestamp: string;

    constructor(data: T, message: string = '성공적으로 처리되었습니다.', result: boolean = true) {
        this.result = result;
        this.data = data;
        this.message = message;
        this.timestamp = new Date().toISOString();
    }

    /**
     * 성공 응답 생성
     */
    static success<T>(data: T, message: string = '성공적으로 처리되었습니다.'): CustomResponse<T> {
        return new CustomResponse(data, message, true);
    }

    /**
     * 실패 응답 생성
     */
    static error<T>(data: T, message: string = '처리 중 오류가 발생했습니다.'): CustomResponse<T> {
        return new CustomResponse(data, message, false);
    }
}
