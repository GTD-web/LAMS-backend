import { ApiProperty } from '@nestjs/swagger';

/**
 * 로그인 응답 DTO
 * - 로그인 성공 시 반환되는 토큰 정보
 */
export class LoginResponseDto {
    @ApiProperty({
        description: 'JWT 인증 토큰',
        example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    })
    token: string;
}
