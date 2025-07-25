import { ApiProperty } from '@nestjs/swagger';
import { DepartmentInfoEntity } from '../entities/department-info.entity';

/**
 * 부서 권한 응답 DTO
 */
export class DepartmentAuthorityResponseDto {
    @ApiProperty({
        description: '접근 가능한 부서 목록',
        type: [DepartmentInfoEntity],
    })
    readonly accessableDepartments: DepartmentInfoEntity[];

    @ApiProperty({
        description: '검토 가능한 부서 목록',
        type: [DepartmentInfoEntity],
    })
    readonly reviewableDepartments: DepartmentInfoEntity[];

    constructor(accessableDepartments: DepartmentInfoEntity[], reviewableDepartments: DepartmentInfoEntity[]) {
        this.accessableDepartments = accessableDepartments;
        this.reviewableDepartments = reviewableDepartments;
    }
}
