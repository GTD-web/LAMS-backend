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
exports.FileEntity = exports.FileStatus = void 0;
const typeorm_1 = require("typeorm");
const date_helper_1 = require("../../../common/utils/helpers/date.helper");
var FileStatus;
(function (FileStatus) {
    FileStatus["UNREAD"] = "unread";
    FileStatus["READ"] = "read";
    FileStatus["ERROR"] = "error";
})(FileStatus || (exports.FileStatus = FileStatus = {}));
let FileEntity = class FileEntity {
    readFile() {
        this.readAt = date_helper_1.DateHelper.now();
        this.status = FileStatus.READ;
    }
    errorFile(e) {
        this.readAt = date_helper_1.DateHelper.now();
        this.status = FileStatus.ERROR;
        this.error = e;
    }
    setYearAndMonth(year, month) {
        this.year = year;
        this.month = month.padStart(2, '0');
    }
};
exports.FileEntity = FileEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], FileEntity.prototype, "fileId", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], FileEntity.prototype, "fileName", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], FileEntity.prototype, "fileOriginalName", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], FileEntity.prototype, "filePath", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], FileEntity.prototype, "year", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], FileEntity.prototype, "month", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], FileEntity.prototype, "readAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: FileStatus.UNREAD }),
    __metadata("design:type", String)
], FileEntity.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], FileEntity.prototype, "error", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], FileEntity.prototype, "uploadBy", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", String)
], FileEntity.prototype, "uploadedAt", void 0);
exports.FileEntity = FileEntity = __decorate([
    (0, typeorm_1.Entity)()
], FileEntity);
//# sourceMappingURL=file.entity.js.map