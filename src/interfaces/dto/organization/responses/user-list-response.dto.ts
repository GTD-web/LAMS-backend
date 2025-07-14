import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';
import { UserResponseDto } from './user-response.dto';

/**
 * 사용자 목록 조회 응답 DTO
 */
@Exclude()
export class UserListResponseDto {
    @ApiProperty({
        description: '사용자 목록',
        type: [UserResponseDto],
    })
    @Expose()
    @Type(() => UserResponseDto)
    readonly users: UserResponseDto[];

    @ApiProperty({
        description: '전체 사용자 수',
        example: 150,
    })
    @Expose()
    readonly total: number;

    constructor(partial: Partial<UserListResponseDto>) {
        Object.assign(this, partial);
    }
}
