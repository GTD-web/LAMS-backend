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
var EventInfoEntity_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventInfoEntity = void 0;
const swagger_1 = require("@nestjs/swagger");
const typeorm_1 = require("typeorm");
const uuid_1 = require("uuid");
let EventInfoEntity = EventInfoEntity_1 = class EventInfoEntity {
    static fromEventInfo(eventInfo) {
        const entity = new EventInfoEntity_1();
        entity.eventId = (0, uuid_1.v4)();
        for (const key in eventInfo) {
            if (eventInfo[key]) {
                entity[key] = eventInfo[key];
            }
        }
        return entity;
    }
    static fromEventInfoArray(eventInfoArray) {
        return eventInfoArray.map((eventInfo) => {
            const partialEntity = {
                eventId: (0, uuid_1.v4)(),
            };
            for (const key in eventInfo) {
                if (eventInfo[key]) {
                    partialEntity[key] = eventInfo[key];
                }
            }
            return partialEntity;
        });
    }
};
exports.EventInfoEntity = EventInfoEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    (0, swagger_1.ApiProperty)({
        description: '이벤트 아이디',
        example: 'exEventId',
    }),
    __metadata("design:type", String)
], EventInfoEntity.prototype, "eventId", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], EventInfoEntity.prototype, "employeeName", void 0);
__decorate([
    (0, typeorm_1.Column)({
        nullable: true,
    }),
    (0, typeorm_1.Index)(),
    __metadata("design:type", String)
], EventInfoEntity.prototype, "employeeNumber", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    (0, typeorm_1.Index)(),
    __metadata("design:type", String)
], EventInfoEntity.prototype, "eventTime", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], EventInfoEntity.prototype, "yyyymmdd", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], EventInfoEntity.prototype, "hhmmss", void 0);
exports.EventInfoEntity = EventInfoEntity = EventInfoEntity_1 = __decorate([
    (0, typeorm_1.Entity)('event_info_entity'),
    (0, typeorm_1.Index)(['employeeNumber', 'yyyymmdd'])
], EventInfoEntity);
//# sourceMappingURL=event-info.entity.js.map