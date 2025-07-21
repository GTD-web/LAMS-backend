"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthPayloadDto = void 0;
class AuthPayloadDto {
    constructor(sub, roles, exp) {
        this.sub = sub;
        this.roles = roles;
        this.exp = exp;
    }
    isExpired() {
        return this.exp < Date.now() / 1000;
    }
}
exports.AuthPayloadDto = AuthPayloadDto;
//# sourceMappingURL=auth-payload.dto.js.map