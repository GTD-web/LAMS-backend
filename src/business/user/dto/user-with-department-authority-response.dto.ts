import { DepartmentInfoEntity } from '../../../domain/department/entities/department-info.entity';
import { UserResponseDto } from './user-response.dto';

export class UserWithDepartmentAuthorityResponseDto extends UserResponseDto {
    accessableDepartments: DepartmentInfoEntity[];
    reviewableDepartments: DepartmentInfoEntity[];

    constructor(partial: Partial<UserWithDepartmentAuthorityResponseDto>) {
        super(partial);
        Object.assign(this, partial);
    }
}
