"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserDepartmentAuthorityEntity = void 0;
const typeorm_1 = require("typeorm");
const department_info_entity_1 = require("../../department/entities/department-info.entity");
const user_entity_1 = require("../../user/entities/user.entity");
const authority_type_enum_1 = require("../enum/authority-type.enum");
let UserDepartmentAuthorityEntity = class UserDepartmentAuthorityEntity {
};
exports.UserDepartmentAuthorityEntity = UserDepartmentAuthorityEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], UserDepartmentAuthorityEntity.prototype, "authorityId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid' }),
    __metadata("design:type", String)
], UserDepartmentAuthorityEntity.prototype, "departmentId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid' }),
    __metadata("design:type", String)
], UserDepartmentAuthorityEntity.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: authority_type_enum_1.AuthorityType,
        comment: 'access: 접근 권한, review: 검토 권한',
    }),
    __metadata("design:type", String)
], UserDepartmentAuthorityEntity.prototype, "authorityType", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], UserDepartmentAuthorityEntity.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], UserDepartmentAuthorityEntity.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => department_info_entity_1.DepartmentInfoEntity, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'departmentId' }),
    __metadata("design:type", department_info_entity_1.DepartmentInfoEntity)
], UserDepartmentAuthorityEntity.prototype, "department", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.UserEntity, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'userId' }),
    __metadata("design:type", user_entity_1.UserEntity)
], UserDepartmentAuthorityEntity.prototype, "user", void 0);
exports.UserDepartmentAuthorityEntity = UserDepartmentAuthorityEntity = __decorate([
    (0, typeorm_1.Entity)('user_department_authorities')
], UserDepartmentAuthorityEntity);
//# sourceMappingURL=user-department-authority.entity.js.map