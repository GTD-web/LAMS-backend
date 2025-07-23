import { DepartmentInfoEntity } from '../../department/entities/department-info.entity';

export class ReviewableDepartmentDto {
    reviewableDepartments: DepartmentInfoEntity[];
}

export class AccessableDepartmentDto {
    accessableDepartments: DepartmentInfoEntity[];
}

export class UserDepartmentAuthorityDto {
    accessableDepartments: DepartmentInfoEntity[];
    reviewableDepartments: DepartmentInfoEntity[];

    constructor(accessableDepartments: DepartmentInfoEntity[], reviewableDepartments: DepartmentInfoEntity[]) {
        this.accessableDepartments = accessableDepartments;
        this.reviewableDepartments = reviewableDepartments;
    }
}
