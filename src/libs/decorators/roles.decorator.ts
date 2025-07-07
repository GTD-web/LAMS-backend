import { SetMetadata } from '@nestjs/common';
import { UserRole } from '@src/domain/user/entities/user.entity';

export const Roles = (...roles: UserRole[]) => SetMetadata('roles', roles);
