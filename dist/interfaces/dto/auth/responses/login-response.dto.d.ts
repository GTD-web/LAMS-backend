import { UserResponseDto } from '../../organization/responses/user-response.dto';
export declare class LoginResponseDto {
    token: string;
    user: UserResponseDto;
    constructor(token: string, user: UserResponseDto);
}
