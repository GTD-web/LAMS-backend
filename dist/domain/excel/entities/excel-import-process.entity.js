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
exports.ExcelImportProcessEntity = void 0;
const typeorm_1 = require("typeorm");
const swagger_1 = require("@nestjs/swagger");
const user_entity_1 = require("../../user/entities/user.entity");
let ExcelImportProcessEntity = class ExcelImportProcessEntity {
};
exports.ExcelImportProcessEntity = ExcelImportProcessEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], ExcelImportProcessEntity.prototype, "excelImportProcessId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'json' }),
    (0, swagger_1.ApiProperty)({
        description: '프로세스 필요 부서 정보 json',
        example: '{"extractedDepartments": [], "undefinedDepartments": [], "departments": [], "newDepartments": []}',
    }),
    __metadata("design:type", String)
], ExcelImportProcessEntity.prototype, "departmentInfoJson", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'json' }),
    (0, swagger_1.ApiProperty)({
        description: '프로세스 필요 직원 정보 json',
        example: '{"tempEnteredEmployeeInfoList": [], "tempExitedEmployeeInfoList": [], "enteredEmployeeInfoList": [], "ExitedEmployeeInfoList": []}',
    }),
    __metadata("design:type", String)
], ExcelImportProcessEntity.prototype, "employeeInfoJson", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'json' }),
    (0, swagger_1.ApiProperty)({
        description: '프로세스 선택 데이터 json',
        example: '{"extractedExcelDataList": [], "selectedDataList": []}',
    }),
    __metadata("design:type", String)
], ExcelImportProcessEntity.prototype, "dataJson", void 0);
__decorate([
    (0, typeorm_1.Column)('simple-json', {
        nullable: true,
    }),
    (0, swagger_1.ApiProperty)({
        description: '추출된 엑셀 데이터 목록',
        example: [
            {
                employeeNumber: '1234567890',
                name: 'John Doe',
                department: 'Sales',
                events: [],
                attendanceRecords: [],
            },
        ],
    }),
    __metadata("design:type", Array)
], ExcelImportProcessEntity.prototype, "extractedExcelDataList", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], ExcelImportProcessEntity.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], ExcelImportProcessEntity.prototype, "year", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], ExcelImportProcessEntity.prototype, "month", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], ExcelImportProcessEntity.prototype, "eventInfoFileId", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], ExcelImportProcessEntity.prototype, "usedAttendanceFileId", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], ExcelImportProcessEntity.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.UserEntity),
    (0, typeorm_1.JoinColumn)({ name: 'userId' }),
    __metadata("design:type", user_entity_1.UserEntity)
], ExcelImportProcessEntity.prototype, "user", void 0);
exports.ExcelImportProcessEntity = ExcelImportProcessEntity = __decorate([
    (0, typeorm_1.Entity)()
], ExcelImportProcessEntity);
//# sourceMappingURL=excel-import-process.entity.js.map