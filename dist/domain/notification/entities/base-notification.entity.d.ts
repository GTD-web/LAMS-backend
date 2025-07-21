import { UserEntity } from '@src/domain/user/entities/user.entity';
export declare class BaseNotificationEntity {
    notificationId: string;
    title: string;
    content: string;
    createdAt: Date;
    isRead: boolean;
    recipient: UserEntity;
    read(): void;
}
