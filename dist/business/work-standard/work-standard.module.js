"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkStandardModule = void 0;
const common_1 = require("@nestjs/common");
const work_standard_controller_1 = require("../../interfaces/controllers/work-standard.controller");
const work_standard_business_1 = require("./work-standard.business");
const work_standard_context_module_1 = require("../../contexts/work-standard/work-standard-context.module");
let WorkStandardModule = class WorkStandardModule {
};
exports.WorkStandardModule = WorkStandardModule;
exports.WorkStandardModule = WorkStandardModule = __decorate([
    (0, common_1.Module)({
        imports: [work_standard_context_module_1.WorkStandardContextModule],
        controllers: [work_standard_controller_1.WorkStandardController],
        providers: [work_standard_business_1.WorkStandardBusinessService],
        exports: [work_standard_business_1.WorkStandardBusinessService],
    })
], WorkStandardModule);
//# sourceMappingURL=work-standard.module.js.map